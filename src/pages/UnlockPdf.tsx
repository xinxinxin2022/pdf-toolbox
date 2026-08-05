import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import FileUpload from '@/components/FileUpload';
import { Download, Loader2, AlertCircle } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';

export default function UnlockPdf() {
  const { t } = useTranslation();
  const [files, setFiles] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<Blob | null>(null);

  const handleProcess = useCallback(async () => {
    if (files.length === 0) return;
    setProcessing(true);
    setResult(null);
    try {
      const bytes = await files[0].arrayBuffer();
      const pdf = await PDFDocument.load(bytes, { ignoreEncryption: true });
      const pdfBytes = await pdf.save();
      setResult(new Blob([pdfBytes], { type: 'application/pdf' }));
    } catch (err) {
      console.error(err);
      alert('Error unlocking PDF. The file may be password-protected with a user password, which cannot be removed.');
    } finally {
      setProcessing(false);
    }
  }, [files]);

  const handleDownload = () => {
    if (!result) return;
    const url = URL.createObjectURL(result);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'unlocked.pdf';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <FileUpload accept={['.pdf', 'application/pdf']} files={files} onFiles={setFiles} />

      <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg flex gap-3">
        <AlertCircle className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" size={20} />
        <div className="text-sm text-amber-800 dark:text-amber-300 space-y-2">
          <p className="font-medium">Important limitations</p>
          <ul className="list-disc list-inside space-y-1 text-xs">
            <li>This tool can only remove <strong>owner password</strong> restrictions (printing, copying, editing limits).</li>
            <li>It <strong>cannot</strong> remove a <strong>user password</strong> — if the PDF asks for a password to open, this tool won't work.</li>
            <li>The original PDF is re-saved without encryption metadata, producing a clean copy.</li>
          </ul>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          onClick={handleProcess}
          disabled={files.length === 0 || processing}
          className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 text-white rounded-lg font-medium transition flex items-center gap-2"
        >
          {processing ? (
            <><Loader2 className="animate-spin" size={18} /> {t('common.processing')}</>
          ) : (
            'Unlock PDF'
          )}
        </button>
        {result && (
          <button
            onClick={handleDownload}
            className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition flex items-center gap-2"
          >
            <Download size={18} /> {t('common.download')}
          </button>
        )}
      </div>
    </div>
  );
}
