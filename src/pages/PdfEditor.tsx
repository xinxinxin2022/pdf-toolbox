import { useState, useRef, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Download, Loader2, Type, Pencil, ImagePlus, Undo2, Redo2 } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import PdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

pdfjsLib.GlobalWorkerOptions.workerSrc = PdfWorker;

interface TextAnnotation {
  type: 'text';
  text: string;
  x: number;
  y: number;
  fontSize: number;
  color: string;
  page: number;
}

interface DrawAnnotation {
  type: 'draw';
  points: { x: number; y: number }[];
  color: string;
  width: number;
  page: number;
}

interface ImageAnnotation {
  type: 'image';
  data: string;
  x: number;
  y: number;
  width: number;
  height: number;
  page: number;
}

type Annotation = TextAnnotation | DrawAnnotation | ImageAnnotation;

export default function PdfEditor() {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLCanvasElement>(null);
  const pdfDocRef = useRef<pdfjsLib.PDFDocumentProxy | null>(null);
  const overlayContainerRef = useRef<HTMLDivElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [pdfBytes, setPdfBytes] = useState<ArrayBuffer | null>(null);
  const [page, setPage] = useState(1);
  const [numPages, setNumPages] = useState(0);
  const [rendering, setRendering] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [tool, setTool] = useState<'select' | 'text' | 'draw' | 'image'>('select');
  const [drawColor, setDrawColor] = useState('#000000');
  const [drawWidth, setDrawWidth] = useState(2);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [history, setHistory] = useState<Annotation[][]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);

  const pushHistory = useCallback((next: Annotation[]) => {
    setHistory(prev => {
      const trimmed = prev.slice(0, historyIdx + 1);
      trimmed.push(next);
      if (trimmed.length > 50) trimmed.shift();
      return trimmed;
    });
    setHistoryIdx(prev => Math.min(prev + 1, 49));
  }, [historyIdx]);

  const undo = useCallback(() => {
    if (historyIdx <= 0) return;
    const idx = historyIdx - 1;
    setAnnotations(history[idx]);
    setHistoryIdx(idx);
    renderPage(page, history[idx]);
  }, [historyIdx, history, page]);

  const redo = useCallback(() => {
    if (historyIdx >= history.length - 1) return;
    const idx = historyIdx + 1;
    setAnnotations(history[idx]);
    setHistoryIdx(idx);
    renderPage(page, history[idx]);
  }, [historyIdx, history, page]);

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const buf = await f.arrayBuffer();
    setFile(f);
    setPdfBytes(buf);
    setPage(1);
    setAnnotations([]);
    setHistory([[]]);
    setHistoryIdx(0);
    const pdf = await pdfjsLib.getDocument({ data: buf.slice(0) }).promise;
    pdfDocRef.current = pdf;
    setNumPages(pdf.numPages);
  }, []);

  const renderPage = useCallback(async (pageNum: number, anns?: Annotation[]) => {
    if (!pdfDocRef.current || !canvasRef.current) return;
    setRendering(true);
    try {
      const pdf = pdfDocRef.current;
      const pdfPage = await pdf.getPage(pageNum);
      const vp0 = pdfPage.getViewport({ scale: 1 });
      const scale = 800 / vp0.width;
      const viewport = pdfPage.getViewport({ scale });

      const canvas = canvasRef.current;
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const ctx = canvas.getContext('2d')!;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      await pdfPage.render({ canvasContext: ctx, viewport }).promise;

      const overlay = overlayRef.current;
      if (overlay) {
        overlay.width = canvas.width;
        overlay.height = canvas.height;
      }

      const items = anns || annotations;
      for (const ann of items) {
        if (ann.page !== pageNum) continue;
        if (ann.type === 'draw') {
          const octx = overlay?.getContext('2d');
          if (!octx || ann.points.length < 2) continue;
          octx.strokeStyle = ann.color;
          octx.lineWidth = ann.width;
          octx.lineCap = 'round';
          octx.lineJoin = 'round';
          octx.beginPath();
          octx.moveTo(ann.points[0].x, ann.points[0].y);
          for (let i = 1; i < ann.points.length; i++) {
            octx.lineTo(ann.points[i].x, ann.points[i].y);
          }
          octx.stroke();
        }
      }
    } finally {
      setRendering(false);
    }
  }, [annotations]);

  useEffect(() => {
    if (file) renderPage(page);
  }, [page, file, renderPage]);

  useEffect(() => {
    if (tool !== 'draw' && overlayRef.current) {
      overlayRef.current.style.pointerEvents = 'none';
    } else if (tool === 'draw' && overlayRef.current) {
      overlayRef.current.style.pointerEvents = 'auto';
    }
  }, [tool]);

  const getCanvasPos = (e: React.MouseEvent): { x: number; y: number } => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) * (canvas.width / rect.width),
      y: (e.clientY - rect.top) * (canvas.height / rect.height),
    };
  };

  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    if (tool !== 'text' || !canvasRef.current || !overlayContainerRef.current) return;
    const pos = getCanvasPos(e);
    const input = document.createElement('input');
    input.type = 'text';
    input.style.cssText = `position:absolute;left:${(pos.x / canvasRef.current.width) * 100}%;top:${(pos.y / canvasRef.current.height) * 100}%;transform:translateY(-50%);border:2px solid #2563eb;background:white;color:#000;padding:4px 8px;font-size:16px;font-family:sans-serif;outline:none;z-index:50;min-width:120px;`;
    input.placeholder = 'Type text...';
    overlayContainerRef.current.appendChild(input);
    input.focus();
    const commit = () => {
      const text = input.value.trim();
      if (text) {
        const scale = 800 / (pdfDocRef.current ? 1 : 1);
        const vp0 = pdfDocRef.current ? pdfDocRef.current.getPage(1).then(p => p.getViewport({ scale: 1 })) : Promise.resolve({ width: 800, height: 1131 });
        vp0.then((v: any) => {
          const s = 800 / v.width;
          const next: Annotation[] = [...annotations, {
            type: 'text',
            text,
            x: pos.x / s,
            y: pos.y / s,
            fontSize: 16 / s,
            color: '#000000',
            page,
          }];
          setAnnotations(next);
          pushHistory(next);
        });
      }
      input.remove();
    };
    input.addEventListener('blur', commit);
    input.addEventListener('keydown', (ev) => { if (ev.key === 'Enter') input.blur(); if (ev.key === 'Escape') { input.value = ''; input.blur(); } });
  }, [tool, annotations, page, pushHistory]);

  const drawRef = useRef<{ drawing: boolean; points: { x: number; y: number }[] }>({ drawing: false, points: [] });

  const handleDrawStart = useCallback((e: React.MouseEvent) => {
    if (tool !== 'draw') return;
    const pos = getCanvasPos(e);
    drawRef.current = { drawing: true, points: [pos] };
    const ctx = overlayRef.current?.getContext('2d');
    if (ctx) {
      ctx.strokeStyle = drawColor;
      ctx.lineWidth = drawWidth;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
    }
  }, [tool, drawColor, drawWidth]);

  const handleDrawMove = useCallback((e: React.MouseEvent) => {
    if (!drawRef.current.drawing || tool !== 'draw') return;
    const pos = getCanvasPos(e);
    drawRef.current.points.push(pos);
    const ctx = overlayRef.current?.getContext('2d');
    if (ctx) {
      const pts = drawRef.current.points;
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(pts[pts.length - 1].x, pts[pts.length - 1].y);
    }
  }, [tool]);

  const handleDrawEnd = useCallback(() => {
    if (!drawRef.current.drawing) return;
    drawRef.current.drawing = false;
    const pts = drawRef.current.points;
    if (pts.length >= 2) {
      const next: Annotation[] = [...annotations, { type: 'draw', points: pts, color: drawColor, width: drawWidth, page }];
      setAnnotations(next);
      pushHistory(next);
    }
  }, [annotations, drawColor, drawWidth, page, pushHistory]);

  const handleImageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      const data = reader.result as string;
      const img = new window.Image();
      img.onload = () => {
        let w = img.width;
        let h = img.height;
        if (w > 200) { h = (200 / w) * h; w = 200; }
        if (pdfDocRef.current) {
          pdfDocRef.current.getPage(1).then((p: any) => {
            const v = p.getViewport({ scale: 1 });
            const s = 800 / v.width;
            const ann: ImageAnnotation = { type: 'image', data, x: 50 / s, y: 50 / s, width: w / s, height: h / s, page };
            const nextAnns = [...annotations, ann];
            setAnnotations(nextAnns);
            pushHistory(nextAnns);
          });
        } else {
          const nextAnns: Annotation[] = [...annotations, { type: 'image', data, x: 50, y: 50, width: w, height: h, page }];
          setAnnotations(nextAnns);
          pushHistory(nextAnns);
        }
      };
      img.src = data;
    };
    reader.readAsDataURL(f);
    e.target.value = '';
  }, [annotations, page, pushHistory]);

  const handleExport = useCallback(async () => {
    if (!pdfBytes) return;
    setProcessing(true);
    try {
      const pdfDoc = await PDFDocument.load(pdfBytes);
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const pages = pdfDoc.getPages();

      for (const ann of annotations) {
        const pdfPage = pages[ann.page - 1];
        if (!pdfPage) continue;
        const { width: pw, height: ph } = pdfPage.getSize();
        const vp0 = await pdfDocRef.current!.getPage(ann.page).then(p => p.getViewport({ scale: 1 }));
        const s = pw / vp0.width;

        if (ann.type === 'text') {
          const hex = ann.color.replace('#', '');
          const r = parseInt(hex.substr(0, 2), 16) / 255;
          const g = parseInt(hex.substr(2, 2), 16) / 255;
          const b = parseInt(hex.substr(4, 2), 16) / 255;
          pdfPage.drawText(ann.text, {
            x: ann.x * s,
            y: ph - ann.y * s,
            size: ann.fontSize * s,
            font,
            color: rgb(r, g, b),
          });
        } else if (ann.type === 'draw') {
          if (ann.points.length < 2) continue;
          const hex = ann.color.replace('#', '');
          const r = parseInt(hex.substr(0, 2), 16) / 255;
          const g = parseInt(hex.substr(2, 2), 16) / 255;
          const b = parseInt(hex.substr(4, 2), 16) / 255;
          const pts = ann.points.map(p => ({ x: p.x * s, y: ph - p.y * s }));
          pdfPage.drawLines([{
            points: pts,
            thickness: ann.width * s,
            color: rgb(r, g, b),
            opacity: 0.8,
            lineCap: 'round' as any,
            lineJoin: 'round' as any,
          }]);
        } else if (ann.type === 'image') {
          const base64 = ann.data.split(',')[1];
          const byteChars = atob(base64);
          const byteArray = new Uint8Array(byteChars.length);
          for (let i = 0; i < byteChars.length; i++) byteArray[i] = byteChars.charCodeAt(i);
          let img;
          if (ann.data.includes('image/png')) {
            img = await pdfDoc.embedPng(byteArray);
          } else {
            img = await pdfDoc.embedJpg(byteArray);
          }
          pdfPage.drawImage(img, {
            x: ann.x * s,
            y: ph - ann.y * s - ann.height * s,
            width: ann.width * s,
            height: ann.height * s,
          });
        }
      }

      const bytes = await pdfDoc.save();
      const blob = new Blob([bytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'edited.pdf';
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert('Error exporting PDF. Please check your file.');
    } finally {
      setProcessing(false);
    }
  }, [pdfBytes, annotations]);

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
          {/* Toolbar */}
          <div className="flex flex-wrap items-center gap-2 mb-4 p-3 bg-neutral-50 dark:bg-neutral-800 rounded-xl">
            <button onClick={undo} disabled={historyIdx <= 0} title="Undo" className="p-2 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 disabled:opacity-30 transition">
              <Undo2 size={18} />
            </button>
            <button onClick={redo} disabled={historyIdx >= history.length - 1} title="Redo" className="p-2 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 disabled:opacity-30 transition">
              <Redo2 size={18} />
            </button>
            <div className="w-px h-6 bg-neutral-300 dark:bg-neutral-600 mx-1" />
            <button onClick={() => setTool(tool === 'text' ? 'select' : 'text')} className={`p-2 rounded-lg transition ${tool === 'text' ? 'bg-primary-100 dark:bg-primary-900 text-primary-600' : 'hover:bg-neutral-200 dark:hover:bg-neutral-700'}`} title="Add Text">
              <Type size={18} />
            </button>
            <button onClick={() => setTool(tool === 'draw' ? 'select' : 'draw')} className={`p-2 rounded-lg transition ${tool === 'draw' ? 'bg-primary-100 dark:bg-primary-900 text-primary-600' : 'hover:bg-neutral-200 dark:hover:bg-neutral-700'}`} title="Draw">
              <Pencil size={18} />
            </button>
            <button onClick={() => setTool(tool === 'image' ? 'select' : 'image')} className={`p-2 rounded-lg transition ${tool === 'image' ? 'bg-primary-100 dark:bg-primary-900 text-primary-600' : 'hover:bg-neutral-200 dark:hover:bg-neutral-700'}`} title="Add Image">
              <ImagePlus size={18} />
            </button>
            {tool === 'image' && <input type="file" accept="image/png,image/jpeg,image/jpg" className="hidden" id="editor-img-input" onChange={handleImageChange} />}
            {tool === 'draw' && (
              <>
                <input type="color" value={drawColor} onChange={e => setDrawColor(e.target.value)} className="w-8 h-8 rounded border-0 cursor-pointer" />
                <input type="range" min="1" max="10" value={drawWidth} onChange={e => setDrawWidth(+e.target.value)} className="w-20" />
              </>
            )}
            <div className="flex-1" />
            {numPages > 1 && (
              <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1} className="px-2 py-1 rounded hover:bg-neutral-200 dark:hover:bg-neutral-700 disabled:opacity-30">←</button>
                <span>{page} / {numPages}</span>
                <button onClick={() => setPage(p => Math.min(numPages, p + 1))} disabled={page >= numPages} className="px-2 py-1 rounded hover:bg-neutral-200 dark:hover:bg-neutral-700 disabled:opacity-30">→</button>
              </div>
            )}
          </div>

          {/* Canvas Area */}
          <div className="relative border border-neutral-200 dark:border-neutral-700 rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-900" style={{ cursor: tool === 'text' ? 'text' : tool === 'draw' ? 'crosshair' : 'default' }} onClick={handleCanvasClick}>
            <canvas ref={canvasRef} className="block w-full" />
            <div ref={overlayContainerRef} className="absolute inset-0" style={{ pointerEvents: 'none' }}>
              <canvas ref={overlayRef} className="block w-full h-full" style={{ pointerEvents: tool === 'draw' ? 'auto' : 'none' }} onMouseDown={handleDrawStart} onMouseMove={handleDrawMove} onMouseUp={handleDrawEnd} onMouseLeave={handleDrawEnd} />
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 flex flex-wrap gap-3">
            <button onClick={() => { setFile(null); setPdfBytes(null); setAnnotations([]); setHistory([[]]); setHistoryIdx(0); if (fileInputRef.current) fileInputRef.current.value = ''; }} className="px-6 py-2.5 bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 text-neutral-700 dark:text-neutral-200 rounded-lg font-medium transition">
              {t('common.remove')}
            </button>
            <button onClick={handleExport} disabled={processing || annotations.length === 0} className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 text-white rounded-lg font-medium transition flex items-center gap-2">
              {processing ? <><Loader2 className="animate-spin" size={18} /> {t('common.processing')}</> : <><Download size={18} /> Export PDF</>}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
