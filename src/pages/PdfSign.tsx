import { useState, useRef, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Download, Loader2, Pen, RotateCcw, GripVertical } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';
import PdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

pdfjsLib.GlobalWorkerOptions.workerSrc = PdfWorker;

export default function PdfSign() {
  const { t } = useTranslation();

  // File state
  const [file, setFile] = useState<File | null>(null);
  const [pdfBytes, setPdfBytes] = useState<ArrayBuffer | null>(null);

  // PDF rendering
  const pdfRef = useRef<pdfjsLib.PDFDocumentProxy | null>(null);
  const pdfCanvasRef = useRef<HTMLCanvasElement>(null);
  const [page, setPage] = useState(1);
  const [numPages, setNumPages] = useState(0);
  const [pdfScale, setPdfScale] = useState(1);

  // Signature pad
  const sigCanvasRef = useRef<HTMLCanvasElement>(null);
  const sigDrawing = useRef(false);
  const sigLastPos = useRef<{ x: number; y: number } | null>(null);
  const [sigDataURL, setSigDataURL] = useState<string | null>(null);
  const [sigDrawingActive, setSigDrawingActive] = useState(false);

  // Signature placement on PDF
  const [sigPos, setSigPos] = useState({ x: 0.5, y: 0.85 }); // relative position (0-1)
  const [sigSize] = useState({ w: 150, h: 60 });
  const dragState = useRef<{ dragging: boolean; startX: number; startY: number; startSigX: number; startSigY: number } | null>(null);
  const [dragging, setDragging] = useState(false);
  const [showHint, setShowHint] = useState(true);

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
    setSigPos({ x: 0.5, y: 0.85 });
    setShowHint(true);

    const pdf = await pdfjsLib.getDocument({ data: buf.slice(0) }).promise;
    pdfRef.current = pdf;
    setNumPages(pdf.numPages);
    setPage(1);
  }, []);

  // ---- Render PDF page ----
  const renderPDFPage = useCallback(async (pageNum: number) => {
    if (!pdfRef.current || !pdfCanvasRef.current) return;
    const pdf = pdfRef.current;
    const pdfPage = await pdf.getPage(pageNum);
    const vp0 = pdfPage.getViewport({ scale: 1 });

    const container = pdfCanvasRef.current.parentElement!;
    const maxWidth = container.clientWidth;
    const scale = maxWidth / vp0.width;
    setPdfScale(scale);

    const viewport = pdfPage.getViewport({ scale });
    const canvas = pdfCanvasRef.current;
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext('2d')!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    await pdfPage.render({ canvasContext: ctx, viewport }).promise;
  }, []);

  useEffect(() => {
    if (file) renderPDFPage(page);
  }, [file, page, renderPDFPage]);

  // ---- Signature drawing ----
  const getSigPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = sigCanvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    if ('touches' in e) {
      const touch = e.touches[0] || e.changedTouches[0];
      return {
        x: (touch.clientX - rect.left) * (canvas.width / rect.width),
        y: (touch.clientY - rect.top) * (canvas.height / rect.height),
      };
    }
    return {
      x: (e.clientX - rect.left) * (canvas.width / rect.width),
      y: (e.clientY - rect.top) * (canvas.height / rect.height),
    };
  };

  const sigStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const pos = getSigPos(e);
    sigLastPos.current = pos;
    sigDrawing.current = true;
    setSigDrawingActive(true);
    setShowHint(false);
    const ctx = sigCanvasRef.current?.getContext('2d');
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
    }
  }, []);

  const sigMove = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!sigDrawing.current) return;
    e.preventDefault();
    const pos = getSigPos(e);
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
    setShowHint(true);
  }, []);

  useEffect(() => {
    const canvas = sigCanvasRef.current;
    if (canvas) {
      canvas.width = 320;
      canvas.height = 130;
    }
  }, []);

  // ---- Drag signature on PDF ----
  const getPDFCanvasPos = (e: React.MouseEvent) => {
    const canvas = pdfCanvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) * (canvas.width / rect.width),
      y: (e.clientY - rect.top) * (canvas.height / rect.height),
    };
  };

  const onSigMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    const canvas = pdfCanvasRef.current!;
    const pos = getPDFCanvasPos(e);
    const sigPxW = sigSize.w * pdfScale;
    const sigPxH = sigSize.h * pdfScale;
    dragState.current = {
      dragging: true,
      startX: pos.x,
      startY: pos.y,
      startSigX: sigPos.x * canvas.width - sigPxW / 2,
      startSigY: sigPos.y * canvas.height - sigPxH / 2,
    };
    setDragging(true);
  }, [sigPos, sigSize, pdfScale]);

  const onSigMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragState.current?.dragging) return;
    const canvas = pdfCanvasRef.current!;
    const pos = getPDFCanvasPos(e);
    const dx = pos.x - dragState.current.startX;
    const dy = pos.y - dragState.current.startY;
    const newPxX = dragState.current.startSigX + dx;
    const newPxY = dragState.current.startSigY + dy;
    setSigPos({
      x: Math.max(0, Math.min(1, newPxX / canvas.width)),
      y: Math.max(0, Math.min(1, newPxY / canvas.height)),
    });
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
      const sigW = 150;
      const sigH = 60;

      for (const pg of pages) {
        const { width, height } = pg.getSize();
        pg.drawImage(sigImage, {
          x: sigPos.x * width - sigW / 2,
          y: height - sigPos.y * height - sigH / 2,
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
  }, [pdfBytes, sigDataURL, sigPos]);

  const handleDownload = () => {
    if (!result) return;
    const url = URL.createObjectURL(result);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'signed.pdf';
    a.click();
    URL.revokeObjectURL(url);
  };

  // ---- Compute signature pixel position on canvas ----
  const sigPxX = pdfCanvasRef.current ? sigPos.x * pdfCanvasRef.current.width : 0;
  const sigPxY = pdfCanvasRef.current ? sigPos.y * pdfCanvasRef.current.height : 0;
  const sigPxW = sigSize.w * pdfScale;
  const sigPxH = sigSize.h * pdfScale;

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
          {/* Step 1: Signature Pad */}
          <div className="mb-6">
            <h3 className="text-[15px] font-semibold text-neutral-900 dark:text-white mb-2 flex items-center gap-2">
              <Pen size={16} /> {t('pdfSign.signaturePad')}
            </h3>
            <p className="text-[13px] text-neutral-500 dark:text-neutral-400 mb-3">
              {t('pdfSign.signatureHint')}
            </p>
            <div className="border-2 border-dashed border-neutral-300 dark:border-neutral-600 rounded-xl overflow-hidden bg-white dark:bg-neutral-800">
              <canvas
                ref={sigCanvasRef}
                className="w-full cursor-crosshair"
                style={{ touchAction: 'none', height: '130px' }}
                onMouseDown={sigStart}
                onMouseMove={sigMove}
                onMouseUp={sigEnd}
                onMouseLeave={sigEnd}
                onTouchStart={sigStart}
                onTouchMove={sigMove}
                onTouchEnd={sigEnd}
              />
              {!sigDrawingActive && !sigDataURL && (
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-neutral-400 text-sm" style={{ marginTop: '-65px' }}>
                  {showHint ? t('pdfSign.drawHere') : ''}
                </div>
              )}
            </div>
            <div className="mt-2 flex justify-end gap-4">
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
              <h3 className="text-[15px] font-semibold text-neutral-900 dark:text-white mb-2 flex items-center gap-2">
                <GripVertical size={16} /> {t('pdfSign.placeSignature')}
              </h3>
              <p className="text-[13px] text-neutral-500 dark:text-neutral-400 mb-3">
                {t('pdfSign.dragHint')}
              </p>

              {/* PDF Preview with draggable signature */}
              <div className="relative border border-neutral-200 dark:border-neutral-700 rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-900" style={{ cursor: dragging ? 'grabbing' : 'default' }} onMouseMove={onSigMouseMove} onMouseUp={onSigMouseUp} onMouseLeave={onSigMouseUp}>
                <canvas ref={pdfCanvasRef} className="block w-full" />
                {/* Signature overlay */}
                <div
                  className="absolute"
                  style={{
                    left: `${sigPxX - sigPxW / 2}px`,
                    top: `${sigPxY - sigPxH / 2}px`,
                    width: `${sigPxW}px`,
                    height: `${sigPxH}px`,
                    cursor: dragging ? 'grabbing' : 'grab',
                    border: '2px dashed #2563eb',
                    borderRadius: '4px',
                    backgroundColor: 'rgba(37, 99, 235, 0.05)',
                    zIndex: 10,
                  }}
                  onMouseDown={onSigMouseDown}
                >
                  <img
                    src={sigDataURL}
                    alt="signature"
                    className="w-full h-full object-contain"
                    draggable={false}
                  />
                </div>
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
