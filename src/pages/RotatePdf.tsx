import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import FileUpload from '@/components/FileUpload';
import { Download, Loader2 } from 'lucide-react';
import { PDFDocument, degrees } from 'pdf-lib';

export default function RotatePdf() {
  const { t } = useTranslation();
  const [files, setFiles] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<Blob | null>(null);
  const [pageCount, setPageCount] = useState<number | null>(null);
  const [rotation, setRotation] = useState<number>(90);
  const [rotateOption, setRotateOption] = useState<'all' | 'specific'>('all');
  const [specificPages, setSpecificPages] = useState<string>('');

  const handleFileUpload = useCallback(async (uploadedFiles: File[]) => {
    setFiles(uploadedFiles);
    setResult(null);
    setPageCount(null);

    if (uploadedFiles.length > 0) {
      try {
        const bytes = await uploadedFiles[0].arrayBuffer();
        const pdfDoc = await PDFDocument.load(bytes);
        setPageCount(pdfDoc.getPageCount());
      } catch (err) {
        console.error(err);
        alert('Error loading PDF. Please ensure it is a valid PDF file.');
      }
    }
  }, []);

  const handleProcess = useCallback(async () => {
    if (files.length === 0) return;
    setProcessing(true);
    setResult(null);
    try {
      const bytes = await files[0].arrayBuffer();
      const pdfDoc = await PDFDocument.load(bytes);
      const pages = pdfDoc.getPages();

      let pagesToRotate: number[] = [];
      if (rotateOption === 'all') {
        pagesToRotate = pages.map((_, i) => i);
      } else {
        // Parse specific pages (1-indexed, comma or space separated)
        const pageNumbers = specificPages
          .split(/[,\s]+/)
          .map(s => parseInt(s.trim()))
          .filter(n => !isNaN(n) && n >= 1 && n <= pages.length);
        pagesToRotate = pageNumbers.map(n => n - 1); // Convert to 0-indexed
      }

      for (const pageIndex of pagesToRotate) {
        const page = pages[pageIndex];
        page.setRotation(degrees(rotation));
      }

      const pdfBytes = await pdfDoc.save();
      setResult(new Blob([pdfBytes], { type: 'application/pdf' }));
    } catch (err) {
      console.error(err);
      alert('Error rotating PDF pages.');
    } finally {
      setProcessing(false);
    }
  }, [files, rotation, rotateOption, specificPages]);

  const handleDownload = () => {
    if (!result) return;
    const url = URL.createObjectURL(result);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'rotated.pdf';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <FileUpload accept={['.pdf', 'application/pdf']} files={files} onFiles={handleFileUpload} />

      {pageCount !== null && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-700">
            {t('PDF loaded')}: <strong>{pageCount}</strong> {t('pages')}
          </p>
        </div>
      )}

      {files.length > 0 && (
        <div className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('Rotation angle')}
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="rotation"
                  value="90"
                  checked={rotation === 90}
                  onChange={(e) => setRotation(Number(e.target.value))}
                  className="w-4 h-4 text-primary-600"
                />
                <span>90°</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="rotation"
                  value="180"
                  checked={rotation === 180}
                  onChange={(e) => setRotation(Number(e.target.value))}
                  className="w-4 h-4 text-primary-600"
                />
                <span>180°</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="rotation"
                  value="270"
                  checked={rotation === 270}
                  onChange={(e) => setRotation(Number(e.target.value))}
                  className="w-4 h-4 text-primary-600"
                />
                <span>270°</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('Rotate pages')}
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="rotateOption"
                  value="all"
                  checked={rotateOption === 'all'}
                  onChange={(e) => setRotateOption(e.target.value as 'all' | 'specific')}
                  className="w-4 h-4 text-primary-600"
                />
                <span>{t('All pages')}</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="rotateOption"
                  value="specific"
                  checked={rotateOption === 'specific'}
                  onChange={(e) => setRotateOption(e.target.value as 'all' | 'specific')}
                  className="w-4 h-4 text-primary-600"
                />
                <span>{t('Specific pages')}</span>
              </label>
              {rotateOption === 'specific' && (
                <div className="ml-6 mt-2">
                  <input
                    type="text"
                    value={specificPages}
                    onChange={(e) => setSpecificPages(e.target.value)}
                    placeholder="e.g., 1, 3, 5"
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm w-48"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {t('Enter page numbers separated by commas or spaces')}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 flex flex-wrap gap-3">
        <button onClick={handleProcess} disabled={files.length === 0 || processing}
          className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 text-white rounded-lg font-medium transition flex items-center gap-2">
          {processing ? <><Loader2 className="animate-spin" size={18} /> {t('common.processing')}</> : t('Rotate PDF')}
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
