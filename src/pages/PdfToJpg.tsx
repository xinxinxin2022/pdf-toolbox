import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import FileUpload from '@/components/FileUpload';
import { Download, Loader2 } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';
import PdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import JSZip from 'jszip';

pdfjsLib.GlobalWorkerOptions.workerSrc = PdfWorker;

export default function PdfToJpg() {
  const { t } = useTranslation();
  const [files, setFiles] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);
  const [images, setImages] = useState<{ blob: Blob; url: string; name: string }[]>([]);

  const handleProcess = useCallback(async () => {
    if (files.length === 0) return;
    setProcessing(true);
    setImages([]);
    try {
      const bytes = await files[0].arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: bytes }).promise;
      const results: { blob: Blob; url: string; name: string }[] = [];
      const scale = 2; // 150 DPI (72 * 2 ≈ 144)

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale });
        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext('2d')!;
        await page.render({ canvasContext: ctx, viewport }).promise;
        const blob = await new Promise<Blob>(resolve => canvas.toBlob(resolve as any, 'image/jpeg', 0.92));
        const url = URL.createObjectURL(blob);
        results.push({ blob, url, name: `page-${i}.jpg` });
      }
      setImages(results);
    } catch (err) {
      console.error(err);
      alert('Error converting PDF to images.');
    } finally {
      setProcessing(false);
    }
  }, [files]);

  const handleDownloadAll = async () => {
    const zip = new JSZip();
    for (const img of images) {
      zip.file(img.name, img.blob);
    }
    const blob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pdf-images.zip';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <FileUpload accept={['.pdf', 'application/pdf']} files={files} onFiles={setFiles} />
      <div className="mt-6 flex flex-wrap gap-3">
        <button onClick={handleProcess} disabled={files.length === 0 || processing}
          className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 text-white rounded-lg font-medium transition flex items-center gap-2">
          {processing ? <><Loader2 className="animate-spin" size={18} /> {t('common.processing')}</> : 'Convert to JPG'}
        </button>
        {images.length > 0 && (
          <button onClick={handleDownloadAll} className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition flex items-center gap-2">
            <Download size={18} /> Download ZIP ({images.length} images)
          </button>
        )}
      </div>
      {images.length > 0 && (
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
          {images.map((img, i) => (
            <div key={i} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
              <img src={img.url} alt={img.name} className="w-full h-auto" />
              <div className="p-2 text-xs text-gray-500 text-center">{img.name}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
