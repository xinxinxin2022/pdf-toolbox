import { lazy } from 'react';
import { ToolDefinition } from './types';

export const tools: ToolDefinition[] = [
  {
    slug: 'merge-pdf',
    nameKey: 'tools.merge.name',
    shortDescKey: 'tools.merge.shortDesc',
    descriptionKey: 'tools.merge.description',
    icon: '📎',
    category: 'edit',
    keywords: ['merge pdf', 'combine pdf', 'join pdf files', 'merge pdf online free'],
    seoTitleKey: 'tools.merge.seoTitle',
    seoDescKey: 'tools.merge.seoDesc',
    component: lazy(() => import('@/pages/PdfMerge')),
    acceptTypes: ['.pdf', 'application/pdf'],
    multiple: true,
    featuresKey: 'features.merge',
    howToUseKey: 'howToUse.merge',
    whyUseKey: 'whyUse.merge',
    faqKey: 'faq.merge',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    slug: 'split-pdf',
    nameKey: 'tools.split.name',
    shortDescKey: 'tools.split.shortDesc',
    descriptionKey: 'tools.split.description',
    icon: '✂️',
    category: 'edit',
    keywords: ['split pdf', 'extract pdf pages', 'separate pdf', 'split pdf online free'],
    seoTitleKey: 'tools.split.seoTitle',
    seoDescKey: 'tools.split.seoDesc',
    component: lazy(() => import('@/pages/PdfSplit')),
    acceptTypes: ['.pdf', 'application/pdf'],
    multiple: false,
    featuresKey: 'features.split',
    howToUseKey: 'howToUse.split',
    whyUseKey: 'whyUse.split',
    faqKey: 'faq.split',
    gradient: 'from-emerald-500 to-teal-500',
  },
  {
    slug: 'compress-pdf',
    nameKey: 'tools.compress.name',
    shortDescKey: 'tools.compress.shortDesc',
    descriptionKey: 'tools.compress.description',
    icon: '🗜️',
    category: 'edit',
    keywords: ['compress pdf', 'reduce pdf size', 'shrink pdf', 'compress pdf online free'],
    seoTitleKey: 'tools.compress.seoTitle',
    seoDescKey: 'tools.compress.seoDesc',
    component: lazy(() => import('@/pages/PdfCompress')),
    acceptTypes: ['.pdf', 'application/pdf'],
    multiple: false,
    featuresKey: 'features.compress',
    howToUseKey: 'howToUse.compress',
    whyUseKey: 'whyUse.compress',
    faqKey: 'faq.compress',
    gradient: 'from-orange-500 to-amber-500',
  },
  {
    slug: 'pdf-to-word',
    nameKey: 'tools.pdf-to-word.name',
    shortDescKey: 'tools.pdf-to-word.shortDesc',
    descriptionKey: 'tools.pdf-to-word.description',
    icon: '📝',
    category: 'convert',
    keywords: ['pdf to word', 'convert pdf to docx', 'pdf to doc', 'pdf to word online free'],
    seoTitleKey: 'tools.pdf-to-word.seoTitle',
    seoDescKey: 'tools.pdf-to-word.seoDesc',
    component: lazy(() => import('@/pages/PdfToWord')),
    acceptTypes: ['.pdf', 'application/pdf'],
    multiple: false,
    featuresKey: 'features.pdf-to-word',
    howToUseKey: 'howToUse.pdf-to-word',
    whyUseKey: 'whyUse.pdf-to-word',
    faqKey: 'faq.pdf-to-word',
    gradient: 'from-blue-600 to-indigo-500',
  },
  {
    slug: 'pdf-to-jpg',
    nameKey: 'tools.pdf-to-jpg.name',
    shortDescKey: 'tools.pdf-to-jpg.shortDesc',
    descriptionKey: 'tools.pdf-to-jpg.description',
    icon: '🖼️',
    category: 'convert',
    keywords: ['pdf to jpg', 'pdf to image', 'convert pdf to jpg', 'pdf to jpg online free'],
    seoTitleKey: 'tools.pdf-to-jpg.seoTitle',
    seoDescKey: 'tools.pdf-to-jpg.seoDesc',
    component: lazy(() => import('@/pages/PdfToJpg')),
    acceptTypes: ['.pdf', 'application/pdf'],
    multiple: false,
    featuresKey: 'features.pdf-to-jpg',
    howToUseKey: 'howToUse.pdf-to-jpg',
    whyUseKey: 'whyUse.pdf-to-jpg',
    faqKey: 'faq.pdf-to-jpg',
    gradient: 'from-pink-500 to-rose-500',
  },
  {
    slug: 'jpg-to-pdf',
    nameKey: 'tools.jpg-to-pdf.name',
    shortDescKey: 'tools.jpg-to-pdf.shortDesc',
    descriptionKey: 'tools.jpg-to-pdf.description',
    icon: '📄',
    category: 'convert',
    keywords: ['jpg to pdf', 'image to pdf', 'convert jpg to pdf', 'jpg to pdf online free'],
    seoTitleKey: 'tools.jpg-to-pdf.seoTitle',
    seoDescKey: 'tools.jpg-to-pdf.seoDesc',
    component: lazy(() => import('@/pages/JpgToPdf')),
    acceptTypes: ['image/jpeg', 'image/png', 'image/jpg', '.jpg', '.jpeg', '.png'],
    multiple: true,
    featuresKey: 'features.jpg-to-pdf',
    howToUseKey: 'howToUse.jpg-to-pdf',
    whyUseKey: 'whyUse.jpg-to-pdf',
    faqKey: 'faq.jpg-to-pdf',
    gradient: 'from-green-500 to-emerald-500',
  },
  {
    slug: 'rotate-pdf',
    nameKey: 'tools.rotate.name',
    shortDescKey: 'tools.rotate.shortDesc',
    descriptionKey: 'tools.rotate.description',
    icon: '🔄',
    category: 'edit',
    keywords: ['rotate pdf', 'turn pdf pages', 'fix pdf orientation', 'rotate pdf online free'],
    seoTitleKey: 'tools.rotate.seoTitle',
    seoDescKey: 'tools.rotate.seoDesc',
    component: lazy(() => import('@/pages/RotatePdf')),
    acceptTypes: ['.pdf', 'application/pdf'],
    multiple: false,
    featuresKey: 'features.rotate',
    howToUseKey: 'howToUse.rotate',
    whyUseKey: 'whyUse.rotate',
    faqKey: 'faq.rotate',
    gradient: 'from-violet-500 to-purple-500',
  },
  {
    slug: 'add-page-numbers',
    nameKey: 'tools.page-numbers.name',
    shortDescKey: 'tools.page-numbers.shortDesc',
    descriptionKey: 'tools.page-numbers.description',
    icon: '🔢',
    category: 'edit',
    keywords: ['add page numbers to pdf', 'number pdf pages', 'pdf page numbers', 'add page numbers online free'],
    seoTitleKey: 'tools.page-numbers.seoTitle',
    seoDescKey: 'tools.page-numbers.seoDesc',
    component: lazy(() => import('@/pages/AddPageNumbers')),
    acceptTypes: ['.pdf', 'application/pdf'],
    multiple: false,
    featuresKey: 'features.page-numbers',
    howToUseKey: 'howToUse.page-numbers',
    whyUseKey: 'whyUse.page-numbers',
    faqKey: 'faq.page-numbers',
    gradient: 'from-sky-500 to-blue-500',
  },
  {
    slug: 'watermark-pdf',
    nameKey: 'tools.watermark.name',
    shortDescKey: 'tools.watermark.shortDesc',
    descriptionKey: 'tools.watermark.description',
    icon: '💧',
    category: 'edit',
    keywords: ['watermark pdf', 'add watermark to pdf', 'pdf watermark online', 'watermark pdf online free'],
    seoTitleKey: 'tools.watermark.seoTitle',
    seoDescKey: 'tools.watermark.seoDesc',
    component: lazy(() => import('@/pages/WatermarkPdf')),
    acceptTypes: ['.pdf', 'application/pdf'],
    multiple: false,
    featuresKey: 'features.watermark',
    howToUseKey: 'howToUse.watermark',
    whyUseKey: 'whyUse.watermark',
    faqKey: 'faq.watermark',
    gradient: 'from-cyan-500 to-teal-500',
  },
  {
    slug: 'unlock-pdf',
    nameKey: 'tools.unlock.name',
    shortDescKey: 'tools.unlock.shortDesc',
    descriptionKey: 'tools.unlock.description',
    icon: '🔓',
    category: 'security',
    keywords: ['unlock pdf', 'remove pdf password', 'pdf unlock online', 'unlock pdf online free'],
    seoTitleKey: 'tools.unlock.seoTitle',
    seoDescKey: 'tools.unlock.seoDesc',
    component: lazy(() => import('@/pages/UnlockPdf')),
    acceptTypes: ['.pdf', 'application/pdf'],
    multiple: false,
    featuresKey: 'features.unlock',
    howToUseKey: 'howToUse.unlock',
    whyUseKey: 'whyUse.unlock',
    faqKey: 'faq.unlock',
    gradient: 'from-red-500 to-pink-500',
  },
];

export function getToolBySlug(slug: string): ToolDefinition | undefined {
  return tools.find(t => t.slug === slug);
}

export function getToolsByCategory(category: string): ToolDefinition[] {
  if (category === 'all') return tools;
  return tools.filter(t => t.category === category);
}

export function getRelatedTools(slug: string, limit = 4): ToolDefinition[] {
  const tool = getToolBySlug(slug);
  if (!tool) return tools.slice(0, limit);
  return tools
    .filter(t => t.slug !== slug)
    .sort((a, b) => {
      if (a.category === tool.category && b.category !== tool.category) return -1;
      if (b.category === tool.category && a.category !== tool.category) return 1;
      return 0;
    })
    .slice(0, limit);
}

export function searchTools(query: string): ToolDefinition[] {
  const q = query.toLowerCase().trim();
  if (!q) return tools;
  return tools.filter(t => {
    const name = t.slug.replace(/-/g, ' ').toLowerCase();
    const keywords = t.keywords.join(' ').toLowerCase();
    return name.includes(q) || keywords.includes(q);
  });
}
