import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, '../dist');
const pagesDir = path.resolve(distDir, 'pages');

if (!fs.existsSync(pagesDir)) {
  console.error('pages/ directory not found in dist/. Run generate-pages first.');
  process.exit(1);
}

const tools = [
  'merge-pdf', 'split-pdf', 'compress-pdf', 'pdf-to-word', 'pdf-to-jpg',
  'jpg-to-pdf', 'rotate-pdf',
  'add-page-numbers', 'watermark-pdf', 'unlock-pdf',
];

const staticPages = ['privacy-policy', 'terms-of-service', 'about', 'contact', 'faq', 'blog'];

// Copy tool pages to dist/tool/{slug}/index.html
for (const slug of tools) {
  const srcPath = path.join(pagesDir, `${slug}.html`);
  const destDir = path.join(distDir, 'tool', slug);
  if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
  fs.copyFileSync(srcPath, path.join(destDir, 'index.html'));
  console.log(`  ✓ /tool/${slug}/`);
}

// Copy static pages to dist/{slug}/index.html
for (const slug of staticPages) {
  const srcPath = path.join(pagesDir, `${slug}.html`);
  const destDir = path.join(distDir, slug);
  if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
  fs.copyFileSync(srcPath, path.join(destDir, 'index.html'));
  console.log(`  ✓ /${slug}/`);
}

// Copy index page to dist/index-crawler.html (dist/index.html is from Vite)
const indexPath = path.join(pagesDir, 'index.html');
const destIndex = path.join(distDir, 'index-crawler.html');
fs.copyFileSync(indexPath, destIndex);
console.log('  ✓ / (index-crawler.html)');

// Clean up pages dir
fs.rmSync(pagesDir, { recursive: true, force: true });

console.log('\nAll static pages deployed to clean URLs in dist/');
