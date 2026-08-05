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
      className="group block bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
    >
      <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${tool.gradient} flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform`}>
        {tool.icon}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition">
        {t(tool.nameKey)}
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        {t(tool.shortDescKey)}
      </p>
    </Link>
  );
}
