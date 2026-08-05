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
        className={`relative flex flex-col items-center justify-center w-full min-h-[180px] border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-200 ${
          dragging
            ? 'border-neutral-900 dark:border-white bg-neutral-50 dark:bg-neutral-800'
            : 'border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600 bg-white dark:bg-neutral-900'
        }`}
      >
        <input
          type="file"
          accept={acceptStr}
          multiple={multiple}
          onChange={handleChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <Upload className={`mb-3 transition ${dragging ? 'text-neutral-900 dark:text-white' : 'text-neutral-300 dark:text-neutral-600'}`} size={32} strokeWidth={1.5} />
        <p className="text-[15px] text-neutral-500 dark:text-neutral-400 text-center px-4">
          {t('common.dragDrop')}
        </p>
        <p className="mt-1.5 text-[13px] text-neutral-400 dark:text-neutral-500">
          {multiple ? 'PDF files' : 'PDF file'}
        </p>
      </label>

      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          {files.map((file, i) => (
            <div key={i} className="flex items-center gap-3 bg-white dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 rounded-xl px-4 py-3">
              <File className="text-neutral-400 dark:text-neutral-500 shrink-0" size={18} strokeWidth={1.5} />
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-medium text-neutral-900 dark:text-white truncate">{file.name}</p>
                <p className="text-[12px] text-neutral-400 dark:text-neutral-500">{(file.size / 1024).toFixed(1)} KB</p>
              </div>
              {onRemove && (
                <button onClick={() => onRemove(i)} className="text-neutral-300 dark:text-neutral-600 hover:text-red-500 transition">
                  <X size={16} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
