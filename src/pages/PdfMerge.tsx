import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import FileUpload from '@/components/FileUpload';
import { Download, Loader2 } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';

export default function PdfMerge() {
  const { t } = useTranslation();
  const [files, setFiles] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<Blob | null>(null);

  const handleProcess = useCallback(async () => {
    if (files.length === 0) return;
    setProcessing(true);
    setResult(null);
    try {
      const mergedPdf = await PDFDocument.create();
      for (const file of files) {
        const bytes = await file.arrayBuffer();
        const pdf = await PDFDocument.load(bytes);
        const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        pages.forEach(page => mergedPdf.addPage(page));
      }
      const pdfBytes = await mergedPdf.save();
      setResult(new Blob([pdfBytes], { type: 'application/pdf' }));
    } catch (err) {
      console.error(err);
      alert('Error merging PDFs. Please check your files.');
    } finally {
      setProcessing(false);
    }
  }, [files]);

  const handleDownload = () => {
    if (!result) return;
    const url = URL.createObjectURL(result);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'merged.pdf';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <FileUpload
        accept={['.pdf', 'application/pdf']}
        multiple={true}
        files={files}
        onFiles={(f) => setFiles(prev => [...prev, ...f])}
        onRemove={(i) => setFiles(prev => prev.filter((_, idx) => idx !== i))}
      />
      <div className="mt-6 flex flex-wrap gap-3">
        <button
          onClick={handleProcess}
          disabled={files.length === 0 || processing}
          className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 text-white rounded-lg font-medium transition flex items-center gap-2"
        >
          {processing ? <><Loader2 className="animate-spin" size={18} /> {t('common.processing')}</> : 'Merge PDF'}
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
