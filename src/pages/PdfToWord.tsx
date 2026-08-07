import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import FileUpload from '@/components/FileUpload';
import { Download, Loader2 } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';
import PdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

pdfjsLib.GlobalWorkerOptions.workerSrc = PdfWorker;

export default function PdfToWord() {
  const { t } = useTranslation();
  const [files, setFiles] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);
  const [docBlob, setDocBlob] = useState<Blob | null>(null);
  const [error, setError] = useState('');

  const handleProcess = useCallback(async () => {
    if (files.length === 0) return;
    setProcessing(true);
    setDocBlob(null);
    setError('');

    try {
      const bytes = await files[0].arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: bytes }).promise;

      let htmlContent = `<!DOCTYPE html>
<html><head><meta charset="UTF-8">
<style>
  body { font-family: Arial, sans-serif; font-size: 12pt; line-height: 1.6; margin: 40px; }
  .page { page-break-after: always; margin-bottom: 30px; }
  .page:last-child { page-break-after: auto; }
  .page-title { font-size: 14pt; color: #666; margin-bottom: 10px; }
  p { margin: 4px 0; }
</style></head><body>`;

      let totalPages = 0;
      let extractedPages = 0;

      for (let i = 1; i <= pdf.numPages; i++) {
        totalPages++;
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const items = textContent.items as any[];

        // Group text by Y coordinate
        const lines: string[] = [];
        let currentLine: string[] = [];
        let lastY: number | null = null;

        for (const item of items) {
          const y = Math.round(item.transform[5]);
          if (lastY !== null && Math.abs(y - lastY) > 3) {
            const lineText = currentLine.join(' ').trim();
            if (lineText) lines.push(lineText);
            currentLine = [];
          }
          if (item.str) currentLine.push(item.str);
          lastY = y;
        }
        const lastLine = currentLine.join(' ').trim();
        if (lastLine) lines.push(lastLine);

        if (lines.length > 0) {
          extractedPages++;
          htmlContent += `<div class="page">`;
          htmlContent += `<p class="page-title">— Page ${i} —</p>`;
          for (const line of lines) {
            htmlContent += `<p>${line.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>`;
          }
          htmlContent += `</div>`;
        }
      }

      htmlContent += `</body></html>`;

      if (extractedPages === 0) {
        setError('This PDF appears to be image-based (scanned). Client-side text extraction cannot process scanned PDFs. Please use an OCR tool first.');
      } else {
        const blob = new Blob([htmlContent], { type: 'application/msword' });
        setDocBlob(blob);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to process this PDF. It may be encrypted or corrupted.');
    } finally {
      setProcessing(false);
    }
  }, [files]);

  const handleDownload = () => {
    if (!docBlob) return;
    const url = URL.createObjectURL(docBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'converted.doc';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      {/* Limitation notice */}
      <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
        <p className="text-sm text-blue-800 dark:text-blue-300 font-medium mb-1">Text-Based PDFs Only</p>
        <p className="text-xs text-blue-700 dark:text-blue-400 leading-relaxed">
          This tool extracts text from PDFs that have a text layer (created from Word, Google Docs, etc.).
          <strong> Scanned/image-based PDFs are not supported</strong> — they require OCR technology.
          Formatting, images, and tables are not preserved. Output is plain text in Word-compatible format.
        </p>
      </div>

      <FileUpload accept={['.pdf', 'application/pdf']} files={files} onFiles={setFiles} />

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          onClick={handleProcess}
          disabled={files.length === 0}
          className={`px-6 py-2.5 rounded-lg font-medium transition flex items-center gap-2 text-white ${
            files.length === 0
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-primary-600 hover:bg-primary-700'
          }`}
        >
          {processing ? (
            <><Loader2 className="animate-spin" size={18} /> {t('common.processing')}</>
          ) : (
            'Extract Text'
          )}
        </button>
        {docBlob && (
          <button onClick={handleDownload}
            className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition flex items-center gap-2">
            <Download size={18} /> Download Word Document
          </button>
        )}
      </div>

      {error && (
        <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
          <p className="text-sm text-amber-800 dark:text-amber-300">{error}</p>
        </div>
      )}

      {docBlob && (
        <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <p className="text-sm text-green-800 dark:text-green-200">✓ Text extracted successfully!</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            The downloaded .doc file can be opened in Microsoft Word.
          </p>
        </div>
      )}
    </div>
  );
}
