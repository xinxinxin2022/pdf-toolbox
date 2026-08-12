import { useState, useRef, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import FileUpload from '@/components/FileUpload';
import { Download, Loader2, Pen } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';

export default function PdfSign() {
  const { t } = useTranslation();
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<Blob | null>(null);

  // Signature pad state
  const sigCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  const lastPos = useRef<{ x: number; y: number } | null>(null);

  const getSigPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = sigCanvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    if ('touches' in e) {
      const touch = e.touches[0] || e.changedTouches[0];
      return { x: touch.clientX - rect.left, y: touch.clientY - rect.top };
    }
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const startDraw = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const pos = getSigPos(e);
    lastPos.current = pos;
    setIsDrawing(true);
    const ctx = sigCanvasRef.current?.getContext('2d');
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
    }
  }, []);

  const moveDraw = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    e.preventDefault();
    const pos = getSigPos(e);
    const ctx = sigCanvasRef.current?.getContext('2d');
    if (ctx && lastPos.current) {
      ctx.strokeStyle = '#1a1a1a';
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.moveTo(lastPos.current.x, lastPos.current.y);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
      setHasSignature(true);
    }
    lastPos.current = pos;
  }, [isDrawing]);

  const endDraw = useCallback(() => {
    setIsDrawing(false);
    lastPos.current = null;
  }, []);

  const clearSignature = useCallback(() => {
    const canvas = sigCanvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
    }
    setHasSignature(false);
  }, []);

  const handleProcess = useCallback(async () => {
    if (!file || !hasSignature) return;
    setProcessing(true);
    setResult(null);
    try {
      const fileBytes = await file.arrayBuffer();
      const pdf = await PDFDocument.load(fileBytes);

      // Get signature as PNG
      const sigCanvas = sigCanvasRef.current;
      if (!sigCanvas) throw new Error('No signature canvas');
      const sigDataUrl = sigCanvas.toDataURL('image/png');
      const sigBase64 = sigDataUrl.split(',')[1];
      const sigBytes = Uint8Array.from(atob(sigBase64), c => c.charCodeAt(0));
      const sigImage = await pdf.embedPng(sigBytes);

      // Place signature on each page
      const pages = pdf.getPages();
      const sigW = 150;
      const sigH = 60;
      for (const pg of pages) {
        const { width, height } = pg.getSize();
        pg.drawImage(sigImage, {
          x: width / 2 - sigW / 2,
          y: 40,
          width: sigW,
          height: sigH,
        });
      }

      const pdfBytes = await pdf.save();
      setResult(new Blob([pdfBytes], { type: 'application/pdf' }));
    } catch (err) {
      console.error(err);
      alert('Error signing PDF. Please check your file.');
    } finally {
      setProcessing(false);
    }
  }, [file, hasSignature]);

  const handleDownload = () => {
    if (!result) return;
    const url = URL.createObjectURL(result);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'signed.pdf';
    a.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    const canvas = sigCanvasRef.current;
    if (canvas) {
      canvas.width = 300;
      canvas.height = 120;
    }
  }, []);

  return (
    <div>
      <FileUpload
        accept={['.pdf', 'application/pdf']}
        files={file ? [file] : []}
        onFiles={(f) => { setFile(f[0]); setResult(null); }}
        onRemove={() => { setFile(null); setResult(null); }}
      />

      {/* Signature Pad */}
      <div className="mt-6">
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
            style={{ touchAction: 'none' }}
            onMouseDown={startDraw}
            onMouseMove={moveDraw}
            onMouseUp={endDraw}
            onMouseLeave={endDraw}
            onTouchStart={startDraw}
            onTouchMove={moveDraw}
            onTouchEnd={endDraw}
          />
        </div>
        <div className="mt-2 flex justify-end">
          <button
            onClick={clearSignature}
            disabled={!hasSignature}
            className="text-sm text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 disabled:opacity-30 transition"
          >
            {t('common.remove')}
          </button>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-6 flex flex-wrap gap-3">
        <button
          onClick={handleProcess}
          disabled={!file || processing || !hasSignature}
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
  );
}
