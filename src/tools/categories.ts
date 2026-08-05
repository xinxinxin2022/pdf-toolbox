import { ToolCategory } from './types';
import i18n from '@/i18n';

export interface CategoryInfo {
  id: ToolCategory | 'all';
  nameKey: string;
  color: string;
}

export const categories: CategoryInfo[] = [
  { id: 'all', nameKey: 'categories.all', color: 'gray' },
  { id: 'convert', nameKey: 'categories.convert', color: 'blue' },
  { id: 'edit', nameKey: 'categories.edit', color: 'green' },
  { id: 'security', nameKey: 'categories.security', color: 'purple' },
];

export function getCategoryName(id: ToolCategory | 'all'): string {
  const cat = categories.find(c => c.id === id);
  return cat ? i18n.t(cat.nameKey) : id;
}
