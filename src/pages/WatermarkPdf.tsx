import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import FileUpload from '@/components/FileUpload';
import { Download, Loader2 } from 'lucide-react';
import { PDFDocument, StandardFonts, rgb, degrees } from 'pdf-lib';

const PRESET_COLORS = [
  { label: 'Gray', value: '#4d4d4d', rgb: rgb(0.3, 0.3, 0.3) },
  { label: 'Black', value: '#000000', rgb: rgb(0, 0, 0) },
  { label: 'Red', value: '#cc0000', rgb: rgb(0.8, 0, 0) },
  { label: 'Blue', value: '#0055cc', rgb: rgb(0, 0.33, 0.8) },
  { label: 'Green', value: '#008800', rgb: rgb(0, 0.53, 0) },
];

function hexToRgb(hex: string) {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.substring(0, 2), 16) / 255;
  const g = parseInt(clean.substring(2, 4), 16) / 255;
  const b = parseInt(clean.substring(4, 6), 16) / 255;
  return rgb(r, g, b);
}

export default function WatermarkPdf() {
  const { t } = useTranslation();
  const [files, setFiles] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<Blob | null>(null);
  const [watermarkText, setWatermarkText] = useState('CONFIDENTIAL');
  const [fontSize, setFontSize] = useState(48);
  const [opacity, setOpacity] = useState(0.3);
  const [rotation, setRotation] = useState(45);
  const [color, setColor] = useState('#4d4d4d');

  const handleProcess = useCallback(async () => {
    if (files.length === 0 || !watermarkText.trim()) return;
    setProcessing(true);
    setResult(null);
    try {
      const bytes = await files[0].arrayBuffer();
      const pdf = await PDFDocument.load(bytes);
      const font = await pdf.embedFont(StandardFonts.Helvetica);
      const pages = pdf.getPages();
      const watermarkColor = hexToRgb(color);

      pages.forEach((page) => {
        const { width, height } = page.getSize();
        const textWidth = font.widthOfTextAtSize(watermarkText, fontSize);

        page.drawText(watermarkText, {
          x: (width - textWidth) / 2,
          y: height / 2,
          size: fontSize,
          font,
          color: watermarkColor,
          opacity,
          rotate: degrees(rotation),
        });
      });

      const pdfBytes = await pdf.save();
      setResult(new Blob([pdfBytes], { type: 'application/pdf' }));
    } catch (err) {
      console.error(err);
      alert('Error adding watermark. Please check your file.');
    } finally {
      setProcessing(false);
    }
  }, [files, watermarkText, fontSize, opacity, rotation, color]);

  const handleDownload = () => {
    if (!result) return;
    const url = URL.createObjectURL(result);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'watermarked.pdf';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <FileUpload accept={['.pdf', 'application/pdf']} files={files} onFiles={setFiles} />

      {files.length > 0 && (
        <div className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Watermark Text</label>
            <input
              type="text"
              value={watermarkText}
              onChange={e => setWatermarkText(e.target.value)}
              placeholder="Enter watermark text..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Font Size: {fontSize}
              </label>
              <input
                type="range"
                value={fontSize}
                onChange={e => setFontSize(+e.target.value)}
                min={12}
                max={120}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Opacity: {opacity.toFixed(2)}
              </label>
              <input
                type="range"
                value={opacity}
                onChange={e => setOpacity(+e.target.value)}
                min={0.1}
                max={1}
                step={0.05}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Rotation: {rotation}°
              </label>
              <input
                type="range"
                value={rotation}
                onChange={e => setRotation(+e.target.value)}
                min={-180}
                max={180}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Color</label>
              <div className="flex items-center gap-2 flex-wrap">
                {PRESET_COLORS.map((c) => (
                  <button
                    key={c.value}
                    onClick={() => setColor(c.value)}
                    title={c.label}
                    className={`w-8 h-8 rounded-full border-2 transition ${
                      color === c.value ? 'border-primary-500 scale-110' : 'border-gray-300 dark:border-gray-600'
                    }`}
                    style={{ backgroundColor: c.value }}
                  />
                ))}
                <label className="relative">
                  <input
                    type="color"
                    value={color}
                    onChange={e => setColor(e.target.value)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full border-2 border-dashed border-gray-400 dark:border-gray-500 text-xs text-gray-500">
                    +
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          onClick={handleProcess}
          disabled={files.length === 0 || processing || !watermarkText.trim()}
          className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 text-white rounded-lg font-medium transition flex items-center gap-2"
        >
          {processing ? (
            <><Loader2 className="animate-spin" size={18} /> {t('common.processing')}</>
          ) : (
            'Add Watermark'
          )}
        </button>
        {result && (
          <button
            onClick={handleDownload}
            className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition flex items-center gap-2"
          >
            <Download size={18} /> {t('common.download')}
          </button>
        )}
      </div>
    </div>
  );
}
