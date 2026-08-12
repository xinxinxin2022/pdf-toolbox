import { useState, useRef, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FileText, Info } from 'lucide-react';

export default function PdfSign() {
  const { t } = useTranslation();
  const [file, setFile] = useState<File | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const buf = await f.arrayBuffer();
    setFile(f);
    const url = URL.createObjectURL(new Blob([buf], { type: 'application/pdf' }));
    setPdfUrl(url);
    setShowHint(true);
    // Auto-hide hint after 8 seconds
    setTimeout(() => setShowHint(false), 8000);
  }, []);

  useEffect(() => {
    return () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    };
  }, [pdfUrl]);

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
          {/* Instructions */}
          <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
            <div className="flex items-start gap-3">
              <Info className="text-blue-500 shrink-0 mt-0.5" size={20} />
              <div className="text-[14px] text-blue-700 dark:text-blue-300 space-y-2">
                <p className="font-semibold">How to Sign Your PDF</p>
                <ol className="list-decimal list-inside space-y-1 ml-1">
                  <li>Click the <strong>✏️ Pen icon</strong> in the toolbar above to draw your signature</li>
                  <li>Click the <strong> Download icon</strong> to save your signed PDF</li>
                </ol>
                <p className="text-blue-600 dark:text-blue-400 text-[13px] mt-2">
                  Your browser's built-in PDF viewer handles everything — no upload needed, 100% private.
                </p>
              </div>
            </div>
          </div>

          {/* PDF Preview with highlight hints */}
          <div className="relative border border-neutral-200 dark:border-neutral-700 rounded-xl overflow-hidden bg-white" style={{ height: '600px' }}>
            {pdfUrl && (
              <iframe
                src={pdfUrl}
                className="w-full h-full"
                style={{ border: 'none' }}
                title="PDF Preview"
              />
            )}

            {/* Highlight overlay pointing to Pen and Download buttons */}
            {showHint && (
              <div className="absolute top-0 left-0 right-0 z-20 pointer-events-none" style={{ height: '48px' }}>
                {/* Pen button highlight (~55% from left) */}
                <div className="absolute animate-pulse" style={{ left: '55%', top: '4px', transform: 'translateX(-50%)' }}>
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full border-2 border-yellow-400 bg-yellow-400/20 animate-ping absolute -inset-1" />
                    <div className="w-10 h-10 rounded-full border-2 border-yellow-400 bg-yellow-400/30 relative flex items-center justify-center">
                      <span className="text-lg">✏️</span>
                    </div>
                    <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-[11px] font-bold text-yellow-500 bg-white dark:bg-neutral-800 px-2 py-0.5 rounded shadow">
                      Draw here
                    </div>
                  </div>
                </div>

                {/* Download button highlight (~72% from left) */}
                <div className="absolute animate-pulse" style={{ left: '72%', top: '4px', transform: 'translateX(-50%)', animationDelay: '0.5s' }}>
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full border-2 border-green-400 bg-green-400/20 animate-ping absolute -inset-1" style={{ animationDelay: '0.5s' }} />
                    <div className="w-10 h-10 rounded-full border-2 border-green-400 bg-green-400/30 relative flex items-center justify-center">
                      <span className="text-lg">📥</span>
                    </div>
                    <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-[11px] font-bold text-green-500 bg-white dark:bg-neutral-800 px-2 py-0.5 rounded shadow">
                      Save PDF
                    </div>
                  </div>
                </div>

                {/* Dismiss button */}
                <button
                  className="absolute top-1 right-2 pointer-events-auto text-neutral-400 hover:text-neutral-600 text-xs bg-white/80 dark:bg-neutral-800/80 px-2 py-1 rounded"
                  onClick={() => setShowHint(false)}
                >
                  ✕
                </button>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={() => {
                setFile(null);
                setPdfUrl(null);
                setShowHint(true);
                if (fileInputRef.current) fileInputRef.current.value = '';
              }}
              className="px-6 py-2.5 bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 text-neutral-700 dark:text-neutral-200 rounded-lg font-medium transition flex items-center gap-2"
            >
              <FileText size={18} /> Upload New PDF
            </button>
            <div className="flex-1" />
            <p className="text-[13px] text-neutral-400 dark:text-neutral-500 self-center">
              Use the toolbar inside the PDF viewer above to sign and download
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
