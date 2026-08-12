import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const baseUrl = 'https://pdf-toolbox.asia';

// Import tool slugs directly (matching src/tools/registry.ts)
const toolSlugs = [
  'sign-pdf',
  'merge-pdf',
  'split-pdf',
  'compress-pdf',
  'pdf-to-word',
  'pdf-to-excel',
  'word-to-pdf',
  'pdf-to-jpg',
  'jpg-to-pdf',
  'rotate-pdf',
  'add-page-numbers',
  'watermark-pdf',
  'unlock-pdf',
];

const staticPages = [
  { path: '/', priority: 1.0, changefreq: 'weekly' },
  { path: '/about', priority: 0.7, changefreq: 'monthly' },
  { path: '/contact', priority: 0.5, changefreq: 'monthly' },
  { path: '/faq', priority: 0.6, changefreq: 'monthly' },
  { path: '/privacy-policy', priority: 0.3, changefreq: 'yearly' },
  { path: '/terms-of-service', priority: 0.3, changefreq: 'yearly' },
];

const toolPages = toolSlugs.map(slug => ({
  path: `/tool/${slug}`,
  priority: 0.8,
  changefreq: 'monthly',
}));

// Blog URLs removed temporarily - blog pages are SPA routes without static HTML files
// Google will discover blog pages through internal links once main pages are indexed
// const blogSlugs = [...];
// const blogPages = blogSlugs.map(slug => ({ path: `/blog/${slug}`, ... }));

const allPages = [...staticPages, ...toolPages];

const today = new Date().toISOString().split('T')[0];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map(page => `  <url>
    <loc>${baseUrl}${page.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>
`;

const outPath = path.resolve(__dirname, '../public/sitemap.xml');
fs.writeFileSync(outPath, sitemap, 'utf-8');
console.log(`Sitemap generated: ${outPath} (${allPages.length} URLs)`);
