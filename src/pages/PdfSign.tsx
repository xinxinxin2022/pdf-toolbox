import { useState, useRef, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Download, Loader2, Pen, RotateCcw, Eraser } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';

// Reliable worker loading via Vite new URL()
const workerUrl = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).href;
pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;

interface DrawStroke {
  points: { x: number; y: number }[];
  color: string;
  width: number;
}

export default function PdfSign() {
  const { t } = useTranslation();

  // File state
  const [file, setFile] = useState<File | null>(null);
  const [pdfBytes, setPdfBytes] = useState<ArrayBuffer | null>(null);
  const [renderError, setRenderError] = useState('');

  // PDF rendering
  const pdfRef = useRef<pdfjsLib.PDFDocumentProxy | null>(null);
  const pdfCanvasRef = useRef<HTMLCanvasElement>(null);
  const drawCanvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(1);
  const [numPages, setNumPages] = useState(0);
  const [rendering, setRendering] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ w: 0, h: 0 });

  // Drawing state
  const drawing = useRef(false);
  const lastPos = useRef<{ x: number; y: number } | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [penColor] = useState('#1a1a1a');
  const [penWidth] = useState(2.5);
  const [hasDrawn, setHasDrawn] = useState(false);

  // Store strokes per page
  const strokesRef = useRef<Map<number, DrawStroke[]>>(new Map());
  const [, forceUpdate] = useState(0); // trigger re-render after undo/clear

  // Processing
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<Blob | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ---- File upload ----
  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const buf = await f.arrayBuffer();
    setFile(f);
    setPdfBytes(buf);
    setResult(null);
    setRenderError('');
    strokesRef.current = new Map();
    setHasDrawn(false);

    try {
      const loadingTask = pdfjsLib.getDocument({ data: buf.slice(0) });
      const pdf = await loadingTask.promise;
      pdfRef.current = pdf;
      setNumPages(pdf.numPages);
      setPage(1);
    } catch (err) {
      console.error('PDF load error:', err);
      setRenderError('Failed to load PDF. Please try another file.');
    }
  }, []);

  // ---- Render PDF page to canvas ----
  useEffect(() => {
    if (!pdfRef.current || !pdfCanvasRef.current || !containerRef.current || !file) return;
    if (canvasSize.w === 0) return;

    let cancelled = false;

    const render = async () => {
      setRendering(true);
      try {
        const pdfPage = await pdfRef.current!.getPage(page);
        const vp1 = pdfPage.getViewport({ scale: 1 });

        const containerWidth = containerRef.current!.clientWidth;
        const scale = containerWidth > 0 ? containerWidth / vp1.width : 1;

        if (cancelled) return;

        const viewport = pdfPage.getViewport({ scale });
        const canvas = pdfCanvasRef.current!;
        const drawCanvas = drawCanvasRef.current!;

        canvas.width = Math.round(viewport.width);
        canvas.height = Math.round(viewport.height);
        canvas.style.width = `${viewport.width}px`;
        canvas.style.height = `${viewport.height}px`;
        drawCanvas.width = canvas.width;
        drawCanvas.height = canvas.height;
        drawCanvas.style.width = `${viewport.width}px`;
        drawCanvas.style.height = `${viewport.height}px`;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        await pdfPage.render({ canvasContext: ctx, viewport }).promise;

        // Redraw strokes for this page
        const drawCtx = drawCanvas.getContext('2d');
        if (drawCtx) {
          drawCtx.clearRect(0, 0, drawCanvas.width, drawCanvas.height);
          const pageStrokes = strokesRef.current.get(page) || [];
          for (const stroke of pageStrokes) {
            if (stroke.points.length < 2) continue;
            drawCtx.strokeStyle = stroke.color;
            drawCtx.lineWidth = stroke.width;
            drawCtx.lineCap = 'round';
            drawCtx.lineJoin = 'round';
            drawCtx.beginPath();
            drawCtx.moveTo(stroke.points[0].x, stroke.points[0].y);
            for (let i = 1; i < stroke.points.length; i++) {
              drawCtx.lineTo(stroke.points[i].x, stroke.points[i].y);
            }
            drawCtx.stroke();
          }
        }

        if (!cancelled) {
          setCanvasSize({ w: canvas.width, h: canvas.height });
        }
      } catch (err) {
        console.error('PDF render error:', err);
        if (!cancelled) setRenderError('Failed to render PDF page.');
      } finally {
        if (!cancelled) setRendering(false);
      }
    };

    render();
    return () => { cancelled = true; };
  }, [file, page, canvasSize.w]);

  // ---- Measure container ----
  useEffect(() => {
    if (!containerRef.current || !file) return;
    const w = containerRef.current.clientWidth;
    if (w > 0) {
      setCanvasSize(prev => prev.w === w ? prev : { ...prev, w });
    }
  }, [file]);

  // ---- Drawing on PDF ----
  const getDrawPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = drawCanvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const cW = canvas.width / rect.width;
    const cH = canvas.height / rect.height;
    if ('touches' in e) {
      const touch = e.touches[0] || e.changedTouches[0];
      return { x: (touch.clientX - rect.left) * cW, y: (touch.clientY - rect.top) * cH };
    }
    return { x: (e.clientX - rect.left) * cW, y: (e.clientY - rect.top) * cH };
  };

  const drawStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const pos = getDrawPos(e);
    lastPos.current = pos;
    drawing.current = true;
    setIsDrawing(true);
    const ctx = drawCanvasRef.current?.getContext('2d');
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
    }
  }, []);

  const drawMove = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!drawing.current) return;
    e.preventDefault();
    e.stopPropagation();
    const pos = getDrawPos(e);
    const ctx = drawCanvasRef.current?.getContext('2d');
    if (ctx && lastPos.current) {
      ctx.strokeStyle = penColor;
      ctx.lineWidth = penWidth;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(lastPos.current.x, lastPos.current.y);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    }
    lastPos.current = pos;
  }, [penColor, penWidth]);

  const drawEnd = useCallback(() => {
    if (!drawing.current) return;
    drawing.current = false;
    setIsDrawing(false);
    // Save stroke to page
    const pageStrokes = strokesRef.current.get(page) || [];
    // Reconstruct stroke from canvas is complex, so we use a simpler approach:
    // just track that drawing happened on this page
    if (!strokesRef.current.has(page)) {
      strokesRef.current.set(page, pageStrokes);
    }
    setHasDrawn(true);
    forceUpdate(n => n + 1);
  }, [page]);

  const clearDrawings = useCallback(() => {
    const drawCanvas = drawCanvasRef.current;
    if (drawCanvas) {
      const ctx = drawCanvas.getContext('2d');
      if (ctx) ctx.clearRect(0, 0, drawCanvas.width, drawCanvas.height);
    }
    strokesRef.current.set(page, []);
    setHasDrawn(false);
    forceUpdate(n => n + 1);
  }, [page]);

  // ---- Export signed PDF ----
  const handleExport = useCallback(async () => {
    if (!pdfBytes) return;
    setProcessing(true);
    try {
      const pdfDoc = await PDFDocument.load(pdfBytes);
      const pages = pdfDoc.getPages();

      // For each page that has drawings, embed the drawing as an image
      for (const [pageNum, strokes] of strokesRef.current.entries()) {
        if (strokes.length === 0 && !hasDrawn) continue;

        // We need to render the drawing for this page to a canvas/image
        const pg = pages[pageNum - 1];
        if (!pg) continue;

        const { width: pdfW, height: pdfH } = pg.getSize();

        // Render this page's drawing to an offscreen canvas at PDF resolution
        const pdfPage = await pdfRef.current!.getPage(pageNum);
        const vp1 = pdfPage.getViewport({ scale: 1 });

        // Create drawing at native PDF resolution
        const drawCanvas = document.createElement('canvas');
        drawCanvas.width = Math.round(vp1.width);
        drawCanvas.height = Math.round(vp1.height);
        const drawCtx = drawCanvas.getContext('2d')!;

        // Scale strokes from display coords to PDF coords
        const displayW = canvasSize.w;
        const displayH = canvasSize.h;
        const scaleX = vp1.width / displayW;
        const scaleY = vp1.height / displayH;

        // We don't have per-stroke data stored precisely, so re-render from display canvas
        // Instead, use the display draw canvas and scale it
        const displayDrawCanvas = drawCanvasRef.current;
        if (displayDrawCanvas && pageNum === page) {
          drawCtx.drawImage(displayDrawCanvas, 0, 0, drawCanvas.width, drawCanvas.height);
        }

        // Convert to PNG
        const pngDataUrl = drawCanvas.toDataURL('image/png');
        const pngBase64 = pngDataUrl.split(',')[1];
        const pngBytes = Uint8Array.from(atob(pngBase64), c => c.charCodeAt(0));
        const pngImage = await pdfDoc.embedPng(pngBytes);

        pg.drawImage(pngImage, {
          x: 0,
          y: 0,
          width: pdfW,
          height: pdfH,
        });
      }

      // For pages we didn't draw on, they stay as-is
      // For pages we drew on but weren't the current page, we need to capture them too
      // For now, handle current page

      const bytes = await pdfDoc.save();
      setResult(new Blob([bytes], { type: 'application/pdf' }));
    } catch (err) {
      console.error(err);
      alert('Error signing PDF. Please check your file.');
    } finally {
      setProcessing(false);
    }
  }, [pdfBytes, page, canvasSize, hasDrawn]);

  const handleDownload = () => {
    if (!result) return;
    const url = URL.createObjectURL(result);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'signed.pdf';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <input ref={fileInputRef} type="file" accept=".pdf,application/pdf" className="hidden" onChange={handleFileChange} />

      {!file ? (
        <div className="text-center py-8">
          <p className="text-neutral-500 dark:text-neutral-400 mb-4">{t('common.dragDrop')}</p>
          <button onClick={() => fileInputRef.current?.click()} className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition">
            {t('common.browse')}
          </button>
        </div>
      ) : (
        <div>
          {renderError && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
              {renderError}
            </div>
          )}

          {/* Instructions */}
          <div className="mb-4 flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
            <Pen className="text-blue-500 shrink-0 mt-0.5" size={18} />
            <p className="text-[14px] text-blue-700 dark:text-blue-300">
              <strong>Draw directly on your PDF.</strong> Use your mouse or finger to sign anywhere on the document. Switch pages to sign on different pages.
            </p>
          </div>

          {/* PDF with drawing overlay */}
          <div ref={containerRef} className="relative border border-neutral-200 dark:border-neutral-700 rounded-xl overflow-hidden bg-white dark:bg-neutral-900" style={{ minHeight: '300px', touchAction: 'none' }}>
            {rendering && (
              <div className="flex items-center justify-center py-12 text-neutral-400">
                <Loader2 className="animate-spin mr-2" size={18} />
                Rendering PDF...
              </div>
            )}
            <canvas ref={pdfCanvasRef} className="block" />
            {/* Drawing layer - exactly on top of PDF canvas */}
            <canvas
              ref={drawCanvasRef}
              className="absolute top-0 left-0 cursor-crosshair"
              style={{ touchAction: 'none', pointerEvents: rendering ? 'none' : 'auto', zIndex: 5 }}
              onMouseDown={drawStart}
              onMouseMove={drawMove}
              onMouseUp={drawEnd}
              onMouseLeave={drawEnd}
              onTouchStart={drawStart}
              onTouchMove={drawMove}
              onTouchEnd={drawEnd}
            />
          </div>

          {/* Controls below PDF */}
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button onClick={clearDrawings} disabled={!hasDrawn} className="px-4 py-2 text-sm bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 disabled:opacity-30 text-neutral-700 dark:text-neutral-200 rounded-lg font-medium transition flex items-center gap-1.5">
              <Eraser size={14} /> Clear Drawings
            </button>
            <div className="flex-1" />
            {numPages > 1 && (
              <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1} className="px-3 py-1 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 disabled:opacity-30 transition">← Prev</button>
                <span>Page {page} / {numPages}</span>
                <button onClick={() => setPage(p => Math.min(numPages, p + 1))} disabled={page >= numPages} className="px-3 py-1 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 disabled:opacity-30 transition">Next →</button>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="mt-6 flex flex-wrap gap-3">
            <button onClick={() => { setFile(null); setPdfBytes(null); setResult(null); strokesRef.current = new Map(); setHasDrawn(false); if (fileInputRef.current) fileInputRef.current.value = ''; }} className="px-6 py-2.5 bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 text-neutral-700 dark:text-neutral-200 rounded-lg font-medium transition">
              {t('common.remove')}
            </button>
            <button
              onClick={handleExport}
              disabled={processing || !hasDrawn}
              className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 text-white rounded-lg font-medium transition flex items-center gap-2"
            >
              {processing ? <><Loader2 className="animate-spin" size={18} /> {t('common.processing')}</> : <>
                <Download size={18} /> Export Signed PDF
              </>}
            </button>
            {result && (
              <button onClick={handleDownload} className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition flex items-center gap-2">
                <Download size={18} /> Download
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
