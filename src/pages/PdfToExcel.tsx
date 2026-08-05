import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import FileUpload from '@/components/FileUpload';
import { Download, Loader2 } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export default function PdfToExcel() {
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
      const pdf = await pdfjsLib.getDocument({ data: bytes }).promise;

      const allLines: string[] = [];

      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const content = await page.getTextContent();

        // Group items by y-coordinate (within tolerance)
        const tolerance = 5;
        const rows: { y: number; items: { x: number; text: string }[] }[] = [];

        for (const item of content.items as any[]) {
          if (!item.str && !item.hasEOL) continue;
          const x = item.transform[4];
          const y = item.transform[5];

          let targetRow = rows.find((r) => Math.abs(r.y - y) < tolerance);
          if (!targetRow) {
            targetRow = { y, items: [] };
            rows.push(targetRow);
          }
          targetRow.items.push({ x, text: item.str });
        }

        // Sort rows by y descending (top to bottom)
        rows.sort((a, b) => b.y - a.y);

        for (const row of rows) {
          // Sort items by x ascending (left to right)
          row.items.sort((a, b) => a.x - b.x);
          const line = row.items.map((i) => i.text).join('\t');
          if (line.trim()) {
            allLines.push(line);
          }
        }

        // Add a blank line between pages
        if (pageNum < pdf.numPages) {
          allLines.push('');
        }
      }

      const csvContent = allLines.join('\n');
      // Add BOM for Excel Unicode support
      const BOM = '﻿';
      const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
      setResult(blob);
    } catch (err) {
      console.error(err);
      alert('Error extracting table data from PDF. Please ensure it is a valid PDF file.');
    } finally {
      setProcessing(false);
    }
  }, [files]);

  const handleDownload = () => {
    if (!result) return;
    const url = URL.createObjectURL(result);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'extracted-table.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <FileUpload accept={['.pdf', 'application/pdf']} files={files} onFiles={setFiles} />
      <div className="mt-6 flex flex-wrap gap-3">
        <button onClick={handleProcess} disabled={files.length === 0 || processing}
          className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 text-white rounded-lg font-medium transition flex items-center gap-2">
          {processing ? <><Loader2 className="animate-spin" size={18} /> {t('common.processing')}</> : t('Extract to CSV')}
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
