import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown } from 'lucide-react';

interface FAQItem {
  qKey: string;
  aKey: string;
}

interface FAQProps {
  items: FAQItem[];
}

export default function FAQ({ items }: FAQProps) {
  const { t } = useTranslation();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="border border-neutral-100 dark:border-neutral-800 rounded-xl overflow-hidden">
          <button
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            className="w-full flex items-center justify-between px-5 py-4 text-left bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition"
          >
            <span className="text-[15px] font-medium text-neutral-900 dark:text-white pr-4">{t(item.qKey)}</span>
            <ChevronDown
              size={18}
              className={`text-neutral-400 dark:text-neutral-500 transition-transform duration-200 shrink-0 ${openIndex === i ? 'rotate-180' : ''}`}
            />
          </button>
          {openIndex === i && (
            <div className="px-5 pb-4 bg-white dark:bg-neutral-900">
              <p className="text-[14px] text-neutral-500 dark:text-neutral-400 leading-relaxed">{t(item.aKey)}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
