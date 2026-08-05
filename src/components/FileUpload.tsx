import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Upload, X, File } from 'lucide-react';

interface FileUploadProps {
  accept: string[];
  multiple?: boolean;
  onFiles: (files: File[]) => void;
  files?: File[];
  onRemove?: (index: number) => void;
}

export default function FileUpload({ accept, multiple = false, onFiles, files = [], onRemove }: FileUploadProps) {
  const { t } = useTranslation();
  const [dragging, setDragging] = useState(false);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    onFiles(droppedFiles);
  }, [onFiles]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      onFiles(Array.from(e.target.files));
    }
  }, [onFiles]);

  const acceptStr = accept.join(',');

  return (
    <div>
      <label
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={`relative flex flex-col items-center justify-center w-full min-h-[200px] border-2 border-dashed rounded-xl cursor-pointer transition-all ${
          dragging
            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
            : 'border-gray-300 dark:border-gray-600 hover:border-primary-400 bg-gray-50 dark:bg-gray-800'
        }`}
      >
        <input
          type="file"
          accept={acceptStr}
          multiple={multiple}
          onChange={handleChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <Upload className={`mb-3 ${dragging ? 'text-primary-500' : 'text-gray-400'}`} size={40} />
        <p className="text-sm text-gray-600 dark:text-gray-400 text-center px-4">
          {t('common.dragDrop')}
        </p>
        <p className="mt-2 text-xs text-gray-500">
          {multiple ? 'PDF files' : 'PDF file'}
        </p>
      </label>

      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          {files.map((file, i) => (
            <div key={i} className="flex items-center gap-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3">
              <File className="text-primary-500 shrink-0" size={20} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{file.name}</p>
                <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
              </div>
              {onRemove && (
                <button onClick={() => onRemove(i)} className="text-gray-400 hover:text-red-500">
                  <X size={18} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
