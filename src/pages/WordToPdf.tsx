import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import FileUpload from '@/components/FileUpload';
import { Download, Loader2 } from 'lucide-react';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import JSZip from 'jszip';

export default function WordToPdf() {
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
      const zip = await JSZip.loadAsync(bytes);
      const docXml = await zip.file('word/document.xml')?.async('string');
      if (!docXml) throw new Error('Invalid DOCX file');

      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(docXml, 'text/xml');
      const paragraphs = xmlDoc.getElementsByTagName('w:p');
      const textLines: string[] = [];
      for (let i = 0; i < paragraphs.length; i++) {
        const runs = paragraphs[i].getElementsByTagName('w:t');
        let line = '';
        for (let j = 0; j < runs.length; j++) {
          line += runs[j].textContent || '';
        }
        textLines.push(line);
      }

      const pdfDoc = await PDFDocument.create();
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const pageSize = { width: 595.28, height: 841.89 }; // A4
      let page = pdfDoc.addPage([pageSize.width, pageSize.height]);
      const fontSize = 12;
      const lineHeight = fontSize * 1.5;
      const margin = 50;
      let y = pageSize.height - margin;

      for (const line of textLines) {
        if (y < margin + lineHeight) {
          page = pdfDoc.addPage([pageSize.width, pageSize.height]);
          y = pageSize.height - margin;
        }
        const trimmed = line.trim();
        if (trimmed) {
          // Simple text wrapping
          const maxWidth = pageSize.width - 2 * margin;
          const words = trimmed.split(' ');
          let currentLine = '';
          for (const word of words) {
            const testLine = currentLine ? `${currentLine} ${word}` : word;
            const width = font.widthOfTextAtSize(testLine, fontSize);
            if (width > maxWidth && currentLine) {
              page.drawText(currentLine, { x: margin, y, size: fontSize, font });
              y -= lineHeight;
              if (y < margin + lineHeight) {
                page = pdfDoc.addPage([pageSize.width, pageSize.height]);
                y = pageSize.height - margin;
              }
              currentLine = word;
            } else {
              currentLine = testLine;
            }
          }
          if (currentLine) {
            page.drawText(currentLine, { x: margin, y, size: fontSize, font });
            y -= lineHeight;
          }
        } else {
          y -= lineHeight;
        }
      }

      const pdfBytes = await pdfDoc.save();
      setResult(new Blob([pdfBytes], { type: 'application/pdf' }));
    } catch (err) {
      console.error(err);
      alert('Error converting Word to PDF. Please ensure it is a valid DOCX file.');
    } finally {
      setProcessing(false);
    }
  }, [files]);

  const handleDownload = () => {
    if (!result) return;
    const url = URL.createObjectURL(result);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'converted.pdf';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <FileUpload accept={['.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']} files={files} onFiles={setFiles} />
      <div className="mt-6 flex flex-wrap gap-3">
        <button onClick={handleProcess} disabled={files.length === 0 || processing}
          className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 text-white rounded-lg font-medium transition flex items-center gap-2">
          {processing ? <><Loader2 className="animate-spin" size={18} /> {t('common.processing')}</> : 'Convert to PDF'}
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
