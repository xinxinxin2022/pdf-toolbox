import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import FileUpload from '@/components/FileUpload';
import { Download, Loader2 } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export default function PdfToWord() {
  const { t } = useTranslation();
  const [files, setFiles] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);
  const [docBlob, setDocBlob] = useState<Blob | null>(null);

  const handleProcess = useCallback(async () => {
    if (files.length === 0) return;
    setProcessing(true);
    setDocBlob(null);

    try {
      const bytes = await files[0].arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: bytes }).promise;

      let htmlContent = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  body { font-family: Arial, sans-serif; font-size: 12pt; line-height: 1.6; }
  .page { page-break-after: always; margin: 20px; }
  .page:last-child { page-break-after: auto; }
  h1 { font-size: 16pt; margin: 10px 0; }
</style>
</head>
<body>
`;

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();

        htmlContent += `<div class="page">\n`;
        htmlContent += `<h1>Page ${i}</h1>\n`;

        // Group text items by Y coordinate to reconstruct lines
        const items = textContent.items as any[];
        let currentLine: any[] = [];
        let lastY: number | null = null;

        for (const item of items) {
          const y = Math.round(item.transform[5]);

          if (lastY !== null && Math.abs(y - lastY) > 5) {
            // New line detected, output previous line
            const lineText = currentLine.map(i => i.str).join(' ');
            if (lineText.trim()) {
              htmlContent += `<p>${lineText}</p>\n`;
            }
            currentLine = [];
          }

          currentLine.push(item);
          lastY = y;
        }

        // Output last line if any
        if (currentLine.length > 0) {
          const lineText = currentLine.map(i => i.str).join(' ');
          if (lineText.trim()) {
            htmlContent += `<p>${lineText}</p>\n`;
          }
        }

        htmlContent += `</div>\n`;
      }

      htmlContent += `
</body>
</html>`;

      const blob = new Blob([htmlContent], { type: 'application/msword' });
      setDocBlob(blob);
    } catch (err) {
      console.error(err);
      alert('Error extracting text from PDF.');
    } finally {
      setProcessing(false);
    }
  }, [files]);

  const handleDownload = () => {
    if (!docBlob) return;
    const url = URL.createObjectURL(docBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pdf-to-word.doc';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <FileUpload accept={['.pdf', 'application/pdf']} files={files} onFiles={setFiles} />

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          onClick={handleProcess}
          disabled={files.length === 0 || processing}
          className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 text-white rounded-lg font-medium transition flex items-center gap-2"
        >
          {processing ? (
            <><Loader2 className="animate-spin" size={18} /> {t('common.processing')}</>
          ) : (
            'Convert to Word'
          )}
        </button>
        {docBlob && (
          <button
            onClick={handleDownload}
            className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition flex items-center gap-2"
          >
            <Download size={18} /> Download Word Document
          </button>
        )}
      </div>

      {docBlob && (
        <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <p className="text-green-800 dark:text-green-200 text-sm">
            ✓ Text extracted successfully. Click "Download Word Document" to save the file.
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
            Note: The downloaded file is an HTML document formatted for Microsoft Word compatibility.
          </p>
        </div>
      )}
    </div>
  );
}
