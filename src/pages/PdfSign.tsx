import { useState, useRef, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Download, Loader2, Pen, RotateCcw } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';

export default function PdfSign() {
  const { t } = useTranslation();

  // File state
  const [file, setFile] = useState<File | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [pdfBytes, setPdfBytes] = useState<ArrayBuffer | null>(null);

  // Signature pad
  const sigCanvasRef = useRef<HTMLCanvasElement>(null);
  const sigDrawing = useRef(false);
  const sigLastPos = useRef<{ x: number; y: number } | null>(null);
  const [sigDataURL, setSigDataURL] = useState<string | null>(null);

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

    // Create blob URL for iframe preview
    const url = URL.createObjectURL(new Blob([buf], { type: 'application/pdf' }));
    setPdfUrl(url);
  }, []);

  // Cleanup blob URL on unmount
  useEffect(() => {
    return () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    };
  }, [pdfUrl]);

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
        // Place signature at bottom-center of each page
        pg.drawImage(sigImage, {
          x: width / 2 - sigW / 2,
          y: 50,
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

          {/* Step 2: PDF Preview */}
          {pdfUrl && (
            <div className="mb-6">
              <h3 className="text-[15px] font-semibold text-neutral-900 dark:text-white mb-2">
                PDF Preview
              </h3>
              <p className="text-[13px] text-neutral-500 dark:text-neutral-400 mb-3">
                Review your document below. Your signature will be placed at the bottom-center of every page.
              </p>
              <div className="border border-neutral-200 dark:border-neutral-700 rounded-xl overflow-hidden bg-white" style={{ height: '500px' }}>
                <iframe
                  src={pdfUrl}
                  className="w-full h-full"
                  style={{ border: 'none' }}
                  title="PDF Preview"
                />
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="mt-6 flex flex-wrap gap-3">
            <button onClick={() => { setFile(null); setPdfBytes(null); setPdfUrl(null); setSigDataURL(null); setResult(null); if (fileInputRef.current) fileInputRef.current.value = ''; }} className="px-6 py-2.5 bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 text-neutral-700 dark:text-neutral-200 rounded-lg font-medium transition">
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
