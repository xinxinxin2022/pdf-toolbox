import { useState, useRef, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Download, FileText, Info } from 'lucide-react';

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
          {/* Instructions */}
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
            <div className="flex items-start gap-3">
              <Info className="text-blue-500 shrink-0 mt-0.5" size={20} />
              <div className="text-[14px] text-blue-700 dark:text-blue-300 space-y-2">
                <p className="font-semibold">How to Sign Your PDF</p>
                <ol className="list-decimal list-inside space-y-1 ml-1">
                  <li>Click the <strong>pen icon</strong> (✏️) in the PDF viewer toolbar above</li>
                  <li>Draw your signature directly on the PDF where you want it</li>
                  <li>Click the <strong>download icon</strong> (️) in the toolbar to save your signed PDF</li>
                </ol>
                <p className="text-blue-600 dark:text-blue-400 text-[13px] mt-2">
                  💡 Your browser's built-in PDF viewer handles everything — no upload needed, 100% private.
                </p>
              </div>
            </div>
          </div>

          {/* PDF Preview */}
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
