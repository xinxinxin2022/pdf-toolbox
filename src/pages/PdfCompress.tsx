import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import FileUpload from '@/components/FileUpload';
import { Download, Loader2 } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';

export default function PdfCompress() {
  const { t } = useTranslation();
  const [file, setFile] = useState<File | null>(null);
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [compressedSize, setCompressedSize] = useState<number>(0);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<Blob | null>(null);

  const handleFileChange = useCallback(async (files: File[]) => {
    if (files.length === 0) return;
    const selectedFile = files[0];
    setFile(selectedFile);
    setOriginalSize(selectedFile.size);
    setResult(null);
    setCompressedSize(0);
  }, []);

  const formatSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const handleProcess = useCallback(async () => {
    if (!file) return;
    setProcessing(true);
    setResult(null);
    try {
      const bytes = await file.arrayBuffer();
      const pdf = await PDFDocument.load(bytes);
      const pdfBytes = await pdf.save({ useObjectStreams: true });
      const compressedBlob = new Blob([pdfBytes], { type: 'application/pdf' });
      setCompressedSize(compressedBlob.size);
      setResult(compressedBlob);
    } catch (err) {
      console.error(err);
      alert('Error compressing PDF. Please check your file.');
    } finally {
      setProcessing(false);
    }
  }, [file]);

  const handleDownload = () => {
    if (!result) return;
    const url = URL.createObjectURL(result);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'compressed.pdf';
    a.click();
    URL.revokeObjectURL(url);
  };

  const reductionPercentage = originalSize > 0 && compressedSize > 0
    ? ((1 - compressedSize / originalSize) * 100).toFixed(1)
    : '0';

  return (
    <div>
      <FileUpload
        accept={['.pdf', 'application/pdf']}
        multiple={false}
        files={file ? [file] : []}
        onFiles={handleFileChange}
        onRemove={() => {
          setFile(null);
          setOriginalSize(0);
          setCompressedSize(0);
          setResult(null);
        }}
      />

      {originalSize > 0 && (
        <div className="mt-4 space-y-2">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Original size: <span className="font-medium">{formatSize(originalSize)}</span>
          </p>
          {compressedSize > 0 && (
            <>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Compressed size: <span className="font-medium">{formatSize(compressedSize)}</span>
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Reduction: <span className="font-medium text-green-600 dark:text-green-400">{reductionPercentage}%</span>
              </p>
            </>
          )}
        </div>
      )}

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          onClick={handleProcess}
          disabled={!file || processing}
          className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 text-white rounded-lg font-medium transition flex items-center gap-2"
        >
          {processing ? <><Loader2 className="animate-spin" size={18} /> {t('common.processing')}</> : 'Compress PDF'}
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
