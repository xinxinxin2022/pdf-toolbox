import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ToolDefinition } from '@/tools/types';

interface ToolCardProps {
  tool: ToolDefinition;
}

export default function ToolCard({ tool }: ToolCardProps) {
  const { t } = useTranslation();

  return (
    <Link
      to={`/tool/${tool.slug}`}
      className="group block rounded-2xl p-6 card-hover bg-white dark:bg-neutral-900"
    >
      {/* Icon */}
      <div className="text-3xl mb-5 transition-transform group-hover:scale-110 duration-200">
        {tool.icon}
      </div>

      {/* Name */}
      <h3 className="text-[17px] font-semibold text-neutral-900 dark:text-white mb-1.5 tracking-tight">
        {t(tool.nameKey)}
      </h3>

      {/* Description */}
      <p className="text-[15px] text-neutral-500 dark:text-neutral-400 leading-relaxed">
        {t(tool.shortDescKey)}
      </p>

      {/* Arrow indicator */}
      <div className="mt-4 flex items-center gap-1 text-[13px] font-medium text-neutral-400 dark:text-neutral-500 group-hover:text-neutral-900 dark:group-hover:text-white transition">
        <span>Open</span>
        <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  );
}
