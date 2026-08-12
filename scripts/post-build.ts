import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { blogPosts } from '../src/blog/posts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, '../dist');
const pagesDir = path.resolve(distDir, 'pages');

if (!fs.existsSync(pagesDir)) {
  console.error('pages/ directory not found in dist/. Run generate-pages first.');
  process.exit(1);
}

const tools = [
  'sign-pdf', 'merge-pdf', 'split-pdf', 'compress-pdf', 'pdf-to-word', 'pdf-to-excel',
  'word-to-pdf', 'pdf-to-jpg', 'jpg-to-pdf', 'rotate-pdf',
  'add-page-numbers', 'watermark-pdf', 'unlock-pdf',
];

const staticPages = ['privacy-policy', 'terms-of-service', 'about', 'contact', 'faq', 'blog'];

// Copy tool pages to dist/seo/tool/{slug}/index.html (NOT to dist/tool/ to avoid SPA route conflict)
for (const slug of tools) {
  const srcPath = path.join(pagesDir, `${slug}.html`);
  const destDir = path.join(distDir, 'seo', 'tool', slug);
  if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
  fs.copyFileSync(srcPath, path.join(destDir, 'index.html'));
  console.log(`  ✓ /seo/tool/${slug}/`);
}

// Copy static pages to dist/seo/{slug}/index.html
for (const slug of staticPages) {
  const srcPath = path.join(pagesDir, `${slug}.html`);
  const destDir = path.join(distDir, 'seo', slug);
  if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
  fs.copyFileSync(srcPath, path.join(destDir, 'index.html'));
  console.log(`  ✓ /seo/${slug}/`);
}

// Copy blog posts to dist/seo/blog/{slug}/index.html
const blogDir = path.join(pagesDir, 'blog');
if (fs.existsSync(blogDir)) {
  for (const post of blogPosts) {
    const srcPath = path.join(blogDir, `${post.slug}.html`);
    const destDir = path.join(distDir, 'seo', 'blog', post.slug);
    if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
    if (fs.existsSync(srcPath)) {
      fs.copyFileSync(srcPath, path.join(destDir, 'index.html'));
      console.log(`  ✓ /seo/blog/${post.slug}/`);
    }
  }
  fs.rmSync(blogDir, { recursive: true, force: true });
}

// Copy index page to dist/index-crawler.html
const indexPath = path.join(pagesDir, 'index.html');
const destIndex = path.join(distDir, 'index-crawler.html');
fs.copyFileSync(indexPath, destIndex);
console.log('  ✓ / (index-crawler.html)');

// Clean up pages dir
fs.rmSync(pagesDir, { recursive: true, force: true });

console.log('\nAll static SEO pages deployed to /seo/ paths (no SPA route conflicts)');
