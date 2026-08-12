import { useState, useRef, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FileText, Pencil, Download } from 'lucide-react';

export default function PdfSign() {
  const { t } = useTranslation();
  const [file, setFile] = useState<File | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const buf = await f.arrayBuffer();
    setFile(f);
    const url = URL.createObjectURL(new Blob([buf], { type: 'application/pdf' }));
    setPdfUrl(url);
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
          {/* Step-by-step instructions showing the exact toolbar icons */}
          <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
            <p className="font-semibold text-blue-800 dark:text-blue-200 mb-4 text-[15px]">
              How to Sign Your PDF — 2 Steps
            </p>

            <div className="space-y-4">
              {/* Step 1 */}
              <div className="flex items-start gap-3">
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-blue-600 text-white text-xs font-bold shrink-0 mt-0.5">1</span>
                <div>
                  <p className="text-[14px] text-blue-800 dark:text-blue-200 mb-2">
                    In the PDF viewer toolbar above, look for the <strong>Draw icon</strong> and click it:
                  </p>
                  {/* Toolbar mockup showing the draw button */}
                  <div className="inline-flex items-center gap-1 bg-neutral-800 rounded-lg px-2 py-1.5">
                    <span className="text-neutral-400 text-xs px-1">≡</span>
                    <span className="text-white text-xs bg-neutral-700 rounded px-1.5 py-0.5">1</span>
                    <span className="text-neutral-400 text-xs px-1">/</span>
                    <span className="text-neutral-400 text-xs px-1">1</span>
                    <span className="text-neutral-600 px-1">|</span>
                    <span className="text-neutral-400 text-xs px-1">−</span>
                    <span className="text-neutral-300 text-xs bg-neutral-700 rounded px-1.5 py-0.5">100%</span>
                    <span className="text-neutral-400 text-xs px-1">+</span>
                    <span className="text-neutral-600 px-1">|</span>
                    <span className="text-neutral-400 text-xs px-1">⊡</span>
                    <span className="text-neutral-600 px-1">|</span>
                    {/* Highlighted draw button */}
                    <span className="inline-flex items-center gap-1 bg-yellow-400/30 border border-yellow-400 rounded px-2 py-1">
                      <Pencil size={14} className="text-yellow-300" />
                    </span>
                    <span className="text-neutral-600 px-1">|</span>
                    <span className="text-neutral-400 text-xs px-1">↶</span>
                    <span className="text-neutral-600 px-1">|</span>
                    {/* Highlighted download button */}
                    <span className="inline-flex items-center gap-1 bg-green-400/30 border border-green-400 rounded px-2 py-1">
                      <Download size={14} className="text-green-300" />
                    </span>
                    <span className="text-neutral-600 px-1">|</span>
                    <span className="text-neutral-400 text-xs px-1"></span>
                  </div>
                  <p className="text-[13px] text-blue-600 dark:text-blue-400 mt-2">
                    Then draw your signature directly on the PDF.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-start gap-3">
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-blue-600 text-white text-xs font-bold shrink-0 mt-0.5">2</span>
                <div>
                  <p className="text-[14px] text-blue-800 dark:text-blue-200 mb-2">
                    Click the <strong>Download icon</strong> to save your signed PDF:
                  </p>
                  <p className="text-[13px] text-blue-600 dark:text-blue-400">
                    Your signed PDF is saved to your device — no upload, 100% private.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* PDF Preview — no overlay, clean */}
          <div className="border border-neutral-200 dark:border-neutral-700 rounded-xl overflow-hidden bg-white" style={{ height: '600px' }}>
            {pdfUrl && (
              <iframe
                src={pdfUrl}
                className="w-full h-full"
                style={{ border: 'none' }}
                title="PDF Preview"
              />
            )}
          </div>

          {/* Actions */}
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={() => {
                setFile(null);
                setPdfUrl(null);
                if (fileInputRef.current) fileInputRef.current.value = '';
              }}
              className="px-6 py-2.5 bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 text-neutral-700 dark:text-neutral-200 rounded-lg font-medium transition flex items-center gap-2"
            >
              <FileText size={18} /> Upload New PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
