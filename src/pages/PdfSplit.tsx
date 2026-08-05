import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import FileUpload from '@/components/FileUpload';
import { Download, Loader2 } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';

export default function PdfSplit() {
  const { t } = useTranslation();
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);
  const [pageRanges, setPageRanges] = useState('');
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<Blob | null>(null);

  const handleFileChange = useCallback(async (files: File[]) => {
    if (files.length === 0) return;
    const selectedFile = files[0];
    setFile(selectedFile);
    setResult(null);
    try {
      const bytes = await selectedFile.arrayBuffer();
      const pdf = await PDFDocument.load(bytes);
      setPageCount(pdf.getPageCount());
    } catch (err) {
      console.error(err);
      setPageCount(0);
    }
  }, []);

  const parsePageRanges = (ranges: string, maxPages: number): number[] => {
    const pages: number[] = [];
    const parts = ranges.split(',').map(s => s.trim()).filter(s => s);

    for (const part of parts) {
      if (part.includes('-')) {
        const [startStr, endStr] = part.split('-').map(s => s.trim());
        const start = parseInt(startStr, 10);
        const end = parseInt(endStr, 10);
        if (isNaN(start) || isNaN(end) || start < 1 || end > maxPages || start > end) {
          throw new Error(`Invalid range: ${part}`);
        }
        for (let i = start; i <= end; i++) {
          pages.push(i - 1); // Convert to 0-indexed
        }
      } else {
        const page = parseInt(part, 10);
        if (isNaN(page) || page < 1 || page > maxPages) {
          throw new Error(`Invalid page: ${part}`);
        }
        pages.push(page - 1); // Convert to 0-indexed
      }
    }

    return pages;
  };

  const handleProcess = useCallback(async () => {
    if (!file || !pageRanges) return;
    setProcessing(true);
    setResult(null);
    try {
      const bytes = await file.arrayBuffer();
      const pdf = await PDFDocument.load(bytes);
      const selectedPages = parsePageRanges(pageRanges, pdf.getPageCount());

      if (selectedPages.length === 0) {
        throw new Error('No valid pages selected');
      }

      const newPdf = await PDFDocument.create();
      const pages = await newPdf.copyPages(pdf, selectedPages);
      pages.forEach(page => newPdf.addPage(page));

      const pdfBytes = await newPdf.save();
      setResult(new Blob([pdfBytes], { type: 'application/pdf' }));
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : 'Error splitting PDF');
    } finally {
      setProcessing(false);
    }
  }, [file, pageRanges]);

  const handleDownload = () => {
    if (!result) return;
    const url = URL.createObjectURL(result);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'split.pdf';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <FileUpload
        accept={['.pdf', 'application/pdf']}
        multiple={false}
        files={file ? [file] : []}
        onFiles={handleFileChange}
        onRemove={() => {
          setFile(null);
          setPageCount(0);
          setResult(null);
        }}
      />

      {pageCount > 0 && (
        <div className="mt-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            This PDF has {pageCount} {pageCount === 1 ? 'page' : 'pages'}
          </p>
        </div>
      )}

      {pageCount > 0 && (
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Page ranges (e.g., "1-3, 5, 7-10")
          </label>
          <input
            type="text"
            value={pageRanges}
            onChange={(e) => setPageRanges(e.target.value)}
            placeholder="1-3, 5, 7-10"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      )}

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          onClick={handleProcess}
          disabled={!file || !pageRanges || processing}
          className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 text-white rounded-lg font-medium transition flex items-center gap-2"
        >
          {processing ? <><Loader2 className="animate-spin" size={18} /> {t('common.processing')}</> : 'Split PDF'}
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
