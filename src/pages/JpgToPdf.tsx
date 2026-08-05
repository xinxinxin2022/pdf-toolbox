import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import FileUpload from '@/components/FileUpload';
import { Download, Loader2, X } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';

export default function JpgToPdf() {
  const { t } = useTranslation();
  const [files, setFiles] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);

  const handleRemoveFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleProcess = async () => {
    if (files.length === 0) return;
    setProcessing(true);
    setPdfUrl(null);
    setPdfBlob(null);

    try {
      const pdfDoc = await PDFDocument.create();

      for (const file of files) {
        const imageBytes = await file.arrayBuffer();
        const isPng = file.type === 'image/png';

        const image = isPng
          ? await pdfDoc.embedPng(imageBytes)
          : await pdfDoc.embedJpg(imageBytes);

        // Get image dimensions
        const { width, height } = image.scale(1);

        // Create page matching image aspect ratio
        // Use A4 as reference (595.2 x 841.8 points)
        const pageWidth = width;
        const pageHeight = height;

        const page = pdfDoc.addPage([pageWidth, pageHeight]);
        page.drawImage(image, {
          x: 0,
          y: 0,
          width: pageWidth,
          height: pageHeight,
        });
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      setPdfUrl(url);
      setPdfBlob(blob);
    } catch (err) {
      console.error(err);
      alert('Error converting images to PDF.');
    } finally {
      setProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!pdfBlob) return;
    const url = URL.createObjectURL(pdfBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'images-to-pdf.pdf';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <FileUpload accept={['.jpg', '.jpeg', '.png', 'image/jpeg', 'image/png']} files={files} onFiles={setFiles} multiple />

      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          {files.map((file, index) => (
            <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <img
                src={URL.createObjectURL(file)}
                alt={file.name}
                className="w-12 h-12 object-cover rounded"
              />
              <div className="flex-1 text-sm">
                <div className="font-medium">{file.name}</div>
                <div className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</div>
              </div>
              <button
                onClick={() => handleRemoveFile(index)}
                className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          onClick={handleProcess}
          disabled={files.length === 0 || processing}
          className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 text-white rounded-lg font-medium transition flex items-center gap-2"
        >
          {processing ? (
            <><Loader2 className="animate-spin" size={18} /> {t('common.processing')}</>
          ) : (
            'Convert to PDF'
          )}
        </button>
        {pdfBlob && (
          <button
            onClick={handleDownload}
            className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition flex items-center gap-2"
          >
            <Download size={18} /> Download PDF
          </button>
        )}
      </div>

      {pdfUrl && (
        <div className="mt-6">
          <iframe src={pdfUrl} className="w-full h-96 border border-gray-200 dark:border-gray-700 rounded-lg" />
        </div>
      )}
    </div>
  );
}
