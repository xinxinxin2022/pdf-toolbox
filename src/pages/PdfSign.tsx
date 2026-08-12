import { useState, useRef, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Download, Loader2, Pen, RotateCcw } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';

// Use CDN worker for reliable PDF rendering
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

export default function PdfSign() {
  const { t } = useTranslation();

  // File state
  const [file, setFile] = useState<File | null>(null);
  const [pdfBytes, setPdfBytes] = useState<ArrayBuffer | null>(null);
  const [renderError, setRenderError] = useState('');
  const [rendering, setRendering] = useState(false);

  // PDF rendering
  const pdfRef = useRef<pdfjsLib.PDFDocumentProxy | null>(null);
  const pdfCanvasRef = useRef<HTMLCanvasElement>(null);
  const pdfWrapperRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(1);
  const [numPages, setNumPages] = useState(0);
  const [canvasDims, setCanvasDims] = useState({ w: 0, h: 0 });

  // Signature pad
  const sigCanvasRef = useRef<HTMLCanvasElement>(null);
  const sigDrawing = useRef(false);
  const sigLastPos = useRef<{ x: number; y: number } | null>(null);
  const [sigDataURL, setSigDataURL] = useState<string | null>(null);
  const [sigDrawingActive, setSigDrawingActive] = useState(false);

  // Signature placement — use ref for drag, state for render
  const sigPosRef = useRef({ x: 0.5, y: 0.85 });
  const [sigPos, setSigPos] = useState({ x: 0.5, y: 0.85 });
  const sigW = 150;
  const sigH = 60;
  const dragState = useRef<{ startX: number; startY: number; startSigPxX: number; startSigPxY: number } | null>(null);
  const [dragging, setDragging] = useState(false);

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
    setSigDataURL(null);
    sigPosRef.current = { x: 0.5, y: 0.85 };
    setSigPos({ x: 0.5, y: 0.85 });
    setRenderError('');

    try {
      const pdf = await pdfjsLib.getDocument({ data: buf.slice(0) }).promise;
      pdfRef.current = pdf;
      setNumPages(pdf.numPages);
      setPage(1);
    } catch (err) {
      console.error('PDF load error:', err);
      setRenderError('Failed to load PDF.');
    }
  }, []);

  // ---- Render PDF page to canvas ----
  useEffect(() => {
    if (!pdfRef.current || !pdfCanvasRef.current || !pdfWrapperRef.current) return;
    if (canvasDims.w === 0) return; // wait for container measurement

    let cancelled = false;

    (async () => {
      setRendering(true);
      try {
        const pdfPage = await pdfRef.current!.getPage(page);
        const vp1 = pdfPage.getViewport({ scale: 1 });

        // Use the wrapper width to determine scale
        const wrapperWidth = pdfWrapperRef.current!.clientWidth;
        const scale = wrapperWidth > 0 ? wrapperWidth / vp1.width : 1.2;

        if (cancelled) return;

        const viewport = pdfPage.getViewport({ scale });
        const canvas = pdfCanvasRef.current;

        // Set canvas to actual pixel dimensions
        canvas.width = Math.round(viewport.width);
        canvas.height = Math.round(viewport.height);
        // Set CSS display size to match
        canvas.style.width = `${viewport.width}px`;
        canvas.style.height = `${viewport.height}px`;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        await pdfPage.render({ canvasContext: ctx, viewport }).promise;

        if (!cancelled) {
          setCanvasDims({ w: canvas.width, h: canvas.height });
        }
      } catch (err) {
        console.error('PDF render error:', err);
        if (!cancelled) setRenderError('Failed to render PDF page.');
      } finally {
        if (!cancelled) setRendering(false);
      }
    })();

    return () => { cancelled = true; };
  }, [page, file]);

  // ---- Measure container on mount/resize ----
  useEffect(() => {
    if (!pdfWrapperRef.current || !file) return;
    const w = pdfWrapperRef.current.clientWidth;
    if (w > 0) {
      setCanvasDims(prev => prev.w === w ? prev : { ...prev, w });
    }
  }, [file, numPages]);

  // ---- Signature drawing ----
  const getSigCanvasPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = sigCanvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const cW = canvas.width / rect.width;
    const cH = canvas.height / rect.height;
    if ('touches' in e) {
      const touch = e.touches[0] || e.changedTouches[0];
      return { x: (touch.clientX - rect.left) * cW, y: (touch.clientY - rect.top) * cH };
    }
    return { x: (e.clientX - rect.left) * cW, y: (e.clientY - rect.top) * cH };
  };

  const sigStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const pos = getSigCanvasPos(e);
    sigLastPos.current = pos;
    sigDrawing.current = true;
    setSigDrawingActive(true);
    const ctx = sigCanvasRef.current?.getContext('2d');
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
    }
  }, []);

  const sigMove = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!sigDrawing.current) return;
    e.preventDefault();
    const pos = getSigCanvasPos(e);
    const ctx = sigCanvasRef.current?.getContext('2d');
    if (ctx && sigLastPos.current) {
      ctx.strokeStyle = '#1a1a1a';
      ctx.lineWidth = 2.5;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(sigLastPos.current.x, sigLastPos.current.y);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    }
    sigLastPos.current = pos;
  }, []);

  const sigEnd = useCallback(() => {
    if (sigDrawing.current && sigCanvasRef.current) {
      setSigDataURL(sigCanvasRef.current.toDataURL('image/png'));
    }
    sigDrawing.current = false;
    sigLastPos.current = null;
    setSigDrawingActive(false);
  }, []);

  const clearSignature = useCallback(() => {
    const canvas = sigCanvasRef.current;
    if (canvas) {
      canvas.width = 320;
      canvas.height = 130;
    }
    setSigDataURL(null);
  }, []);

  useEffect(() => {
    const canvas = sigCanvasRef.current;
    if (canvas) {
      canvas.width = 320;
      canvas.height = 130;
    }
  }, []);

  // ---- Drag signature on PDF ----
  const getPDFPos = (e: React.MouseEvent) => {
    const canvas = pdfCanvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    // Position relative to canvas pixel coordinates
    return {
      x: (e.clientX - rect.left) * (canvas.width / rect.width),
      y: (e.clientY - rect.top) * (canvas.height / rect.height),
    };
  };

  const onSigMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const canvas = pdfCanvasRef.current;
    if (!canvas) return;
    const pos = getPDFPos(e);
    // Current signature center in canvas pixels
    const cx = sigPosRef.current.x * canvas.width;
    const cy = sigPosRef.current.y * canvas.height;
    dragState.current = {
      startX: pos.x,
      startY: pos.y,
      startSigPxX: cx,
      startSigPxY: cy,
    };
    setDragging(true);
  }, []);

  const onSigMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragState.current) return;
    const canvas = pdfCanvasRef.current;
    if (!canvas) return;
    const pos = getPDFPos(e);
    const dx = pos.x - dragState.current.startX;
    const dy = pos.y - dragState.current.startY;
    const newCx = dragState.current.startSigPxX + dx;
    const newCy = dragState.current.startSigPxY + dy;
    const newPos = {
      x: Math.max(0, Math.min(1, newCx / canvas.width)),
      y: Math.max(0, Math.min(1, newCy / canvas.height)),
    };
    sigPosRef.current = newPos;
    setSigPos(newPos);
  }, []);

  const onSigMouseUp = useCallback(() => {
    dragState.current = null;
    setDragging(false);
  }, []);

  // ---- Export signed PDF ----
  const handleExport = useCallback(async () => {
    if (!pdfBytes || !sigDataURL) return;
    setProcessing(true);
    try {
      const pdfDoc = await PDFDocument.load(pdfBytes);
      const sigBase64 = sigDataURL.split(',')[1];
      const sigBytes = Uint8Array.from(atob(sigBase64), c => c.charCodeAt(0));
      const sigImage = await pdfDoc.embedPng(sigBytes);

      const pages = pdfDoc.getPages();
      const pos = sigPosRef.current;

      for (const pg of pages) {
        const { width, height } = pg.getSize();
        pg.drawImage(sigImage, {
          x: pos.x * width - sigW / 2,
          y: height - pos.y * height - sigH / 2,
          width: sigW,
          height: sigH,
        });
      }

      const bytes = await pdfDoc.save();
      setResult(new Blob([bytes], { type: 'application/pdf' }));
    } catch (err) {
      console.error(err);
      alert('Error signing PDF. Please check your file.');
    } finally {
      setProcessing(false);
    }
  }, [pdfBytes, sigDataURL]);

  const handleDownload = () => {
    if (!result) return;
    const url = URL.createObjectURL(result);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'signed.pdf';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Compute signature overlay position in CSS pixels
  const canvas = pdfCanvasRef.current;
  const cw = canvas ? canvas.width : canvasDims.w;
  const ch = canvas ? canvas.height : canvasDims.h;
  const sigCx = sigPos.x * cw;
  const sigCy = sigPos.y * ch;
  // Display scale: signature is 150x60 at 72 DPI, scale to match canvas
  const displayScale = cw > 0 ? cw / 595 : 1; // 595 = A4 width at 72 DPI
  const sigDW = sigW * displayScale;
  const sigDH = sigH * displayScale;

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

          {/* Step 1: Signature Pad */}
          <div className="mb-6">
            <h3 className="text-[15px] font-semibold text-neutral-900 dark:text-white mb-2 flex items-center gap-2">
              <Pen size={16} /> {t('pdfSign.signaturePad')}
            </h3>
            <p className="text-[13px] text-neutral-500 dark:text-neutral-400 mb-3">
              {t('pdfSign.signatureHint')}
            </p>
            <div className="relative border-2 border-dashed border-neutral-300 dark:border-neutral-600 rounded-xl overflow-hidden bg-white dark:bg-neutral-800" style={{ minHeight: '130px' }}>
              <canvas
                ref={sigCanvasRef}
                className="w-full cursor-crosshair block"
                style={{ touchAction: 'none', height: '130px' }}
                onMouseDown={sigStart}
                onMouseMove={sigMove}
                onMouseUp={sigEnd}
                onMouseLeave={sigEnd}
                onTouchStart={sigStart}
                onTouchMove={sigMove}
                onTouchEnd={sigEnd}
              />
            </div>
            <div className="mt-2 flex justify-end">
              {sigDataURL && (
                <button onClick={clearSignature} className="text-sm text-red-500 hover:text-red-700 transition flex items-center gap-1">
                  <RotateCcw size={14} /> {t('common.remove')}
                </button>
              )}
            </div>
          </div>

          {/* Step 2: Place signature on PDF */}
          {sigDataURL && (
            <div className="mb-6">
              <h3 className="text-[15px] font-semibold text-neutral-900 dark:text-white mb-2">
                {t('pdfSign.placeSignature')}
              </h3>
              <p className="text-[13px] text-neutral-500 dark:text-neutral-400 mb-3">
                {t('pdfSign.dragHint')}
              </p>

              {/* PDF Preview */}
              <div
                ref={pdfWrapperRef}
                className="relative border border-neutral-200 dark:border-neutral-700 rounded-xl overflow-hidden bg-white dark:bg-neutral-900"
                style={{
                  cursor: dragging ? 'grabbing' : 'default',
                  minHeight: '200px',
                }}
                onMouseMove={onSigMouseMove}
                onMouseUp={onSigMouseUp}
                onMouseLeave={onSigMouseUp}
              >
                {rendering && (
                  <div className="flex items-center justify-center py-12 text-neutral-400">
                    <Loader2 className="animate-spin mr-2" size={18} />
                    Rendering PDF...
                  </div>
                )}
                <canvas ref={pdfCanvasRef} className="block" />
                {/* Draggable signature overlay */}
                {cw > 0 && ch > 0 && (
                  <div
                    className="absolute"
                    style={{
                      left: `${sigCx - sigDW / 2}px`,
                      top: `${sigCy - sigDH / 2}px`,
                      width: `${sigDW}px`,
                      height: `${sigDH}px`,
                      cursor: dragging ? 'grabbing' : 'grab',
                      border: '2px dashed #2563eb',
                      borderRadius: '4px',
                      backgroundColor: 'rgba(37, 99, 235, 0.06)',
                      zIndex: 10,
                      touchAction: 'none',
                    }}
                    onMouseDown={onSigMouseDown}
                  >
                    <img
                      src={sigDataURL}
                      alt="signature"
                      className="w-full h-full object-contain pointer-events-none"
                      draggable={false}
                    />
                  </div>
                )}
              </div>

              {/* Page navigation */}
              {numPages > 1 && (
                <div className="mt-3 flex items-center justify-center gap-3 text-sm text-neutral-600 dark:text-neutral-400">
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1} className="px-3 py-1 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 disabled:opacity-30 transition">← Prev</button>
                  <span>{page} / {numPages}</span>
                  <button onClick={() => setPage(p => Math.min(numPages, p + 1))} disabled={page >= numPages} className="px-3 py-1 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 disabled:opacity-30 transition">Next →</button>
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="mt-6 flex flex-wrap gap-3">
            <button onClick={() => { setFile(null); setPdfBytes(null); setSigDataURL(null); setResult(null); if (fileInputRef.current) fileInputRef.current.value = ''; }} className="px-6 py-2.5 bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 text-neutral-700 dark:text-neutral-200 rounded-lg font-medium transition">
              {t('common.remove')}
            </button>
            <button
              onClick={handleExport}
              disabled={processing || !sigDataURL}
              className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 text-white rounded-lg font-medium transition flex items-center gap-2"
            >
              {processing ? <><Loader2 className="animate-spin" size={18} /> {t('common.processing')}</> : t('pdfSign.signPdf')}
            </button>
            {result && (
              <button onClick={handleDownload} className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition flex items-center gap-2">
                <Download size={18} /> {t('common.download')}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
