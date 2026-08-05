# PDFToolBox - Design Specification

**Date**: 2026-08-05
**Project**: pdf-toolbox
**Status**: Approved for implementation

## 1. Overview

PDFToolBox is a free, privacy-focused online PDF tools website. All PDF processing happens entirely in the user's browser — no server uploads, no data collection. The site targets global English-speaking users with Chinese bilingual support, monetized through Google AdSense auto ads, and deployed as a static site on GitHub Pages.

**Domain**: pdf-toolbox.asia (example)
**Brand**: PDFToolBox
**Tagline**: "Free PDF Tools — 100% Private, No Upload Required"

## 2. Core Value Proposition

1. **Privacy-first**: All PDF processing runs client-side using pdf-lib.js, PDF.js, and Canvas API. No files ever leave the user's device.
2. **Free**: All 12 tools are free to use.
3. **No installation**: Works in any modern browser.
4. **Fast**: Static site on GitHub Pages with CDN delivery.

## 3. Technology Stack

| Layer | Technology | Notes |
|-------|-----------|-------|
| Framework | React 18 + TypeScript | Component-based architecture |
| Build tool | Vite 5 | Fast HMR, optimized builds |
| Styling | Tailwind CSS 3 | Utility-first, responsive |
| Routing | react-router-dom v6 | Hash router (createHashRouter) for GitHub Pages compatibility |
| i18n | react-i18next | English (default) + Chinese |
| PDF processing | pdf-lib.js | Merge, split, rotate, watermark, page numbers, unlock |
| PDF rendering | PDF.js (pdfjs-dist) | Preview, PDF to image conversion |
| Image conversion | Canvas API | JPG ↔ PDF |
| Batch download | JSZip | Multi-file downloads |
| Icons | lucide-react | Lightweight SVG icons |
| 3D animation | Pure CSS 3D transforms | Lightweight, no Three.js dependency |
| Deployment | GitHub Actions → GitHub Pages | Static site, auto-deploy on push to main |

## 4. Project Structure

```
pdf-toolbox/
├── public/
│   ├── ads.txt
│   ├── CNAME
│   ├── 404.html
│   ├── robots.txt
│   └── sitemap.xml (auto-generated)
├── src/
│   ├── components/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── ToolCard.tsx
│   │   ├── SearchBar.tsx
│   │   ├── LanguageSwitcher.tsx
│   │   ├── SEOHead.tsx
│   │   ├── Hero3D.tsx
│   │   ├── FileUpload.tsx
│   │   ├── ThemeToggle.tsx
│   │   └── FAQ.tsx
│   ├── views/
│   │   ├── Home.tsx
│   │   ├── ToolPage.tsx
│   │   ├── PrivacyPolicy.tsx
│   │   ├── TermsOfService.tsx
│   │   ├── About.tsx
│   │   └── Contact.tsx
│   ├── tools/
│   │   ├── registry.ts
│   │   ├── categories.ts
│   │   └── types.ts
│   ├── pages/ (12 tool implementations)
│   │   ├── PdfMerge.tsx
│   │   ├── PdfSplit.tsx
│   │   ├── PdfCompress.tsx
│   │   ├── PdfToWord.tsx
│   │   ├── PdfToJpg.tsx
│   │   ├── JpgToPdf.tsx
│   │   ├── PdfToExcel.tsx
│   │   ├── WordToPdf.tsx
│   │   ├── RotatePdf.tsx
│   │   ├── AddPageNumbers.tsx
│   │   ├── WatermarkPdf.tsx
│   │   └── UnlockPdf.tsx
│   ├── i18n/
│   │   ├── index.ts
│   │   ├── en.ts
│   │   └── zh.ts
│   ├── router/
│   │   └── index.ts
│   ├── hooks/
│   │   └── useFileUpload.ts
│   ├── utils/
│   │   ├── pdf-lib.ts
│   │   ├── pdfjs.ts
│   │   └── canvas.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── scripts/
│   └── generate-sitemap.ts
├── .github/
│   └── workflows/
│       └── deploy.yml
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

## 5. Tool Registry Architecture

The central design pattern is a **registry-based tool system**. Each tool is defined by metadata in a registry, rendered through a shared `ToolPage` component.

### ToolDefinition Interface

```typescript
interface ToolDefinition {
  slug: string;
  nameKey: string;          // i18n key
  descriptionKey: string;   // i18n key
  icon: string;             // emoji
  category: 'convert' | 'edit' | 'security';
  keywords: string[];
  seoTitleKey: string;
  seoDescriptionKey: string;
  component: React.LazyExoticComponent<React.ComponentType>;
  acceptTypes: string[];    // file input accept attribute
  multiple: boolean;        // allow multiple files
  features: string[];       // i18n keys for feature list
  howToUse: string[];       // i18n keys for steps
  faq: Array<{ qKey: string; aKey: string }>;
}
```

### Tool Categories

- **Convert**: PDF to Word, PDF to JPG, JPG to PDF, PDF to Excel, Word to PDF
- **Edit**: Merge PDF, Split PDF, Compress PDF, Rotate PDF, Add Page Numbers, Watermark PDF
- **Security**: Unlock PDF

## 6. The 12 PDF Tools

### 6.1 PDF Merge
- Accept multiple PDF files
- Drag to reorder
- Combine into single PDF
- Library: pdf-lib

### 6.2 PDF Split
- Upload single PDF
- Select page ranges (e.g., 1-3, 5, 7-10)
- Extract pages into separate PDFs or one PDF with selected pages
- Library: pdf-lib

### 6.3 PDF Compress
- Upload PDF
- Reduce file size by optimizing internal structures
- Note: Client-side compression is limited; reduce image quality within PDF
- Library: pdf-lib

### 6.4 PDF to Word
- Upload PDF
- Render pages using PDF.js
- Convert to downloadable format (Note: true PDF→DOCX conversion is very limited client-side; provide text extraction or image-based output)
- Library: PDF.js + Canvas API

### 6.5 PDF to JPG
- Upload PDF
- Render each page using PDF.js
- Convert to JPG images using Canvas API
- Download as ZIP (JSZip) or individual files
- Library: PDF.js + Canvas API + JSZip

### 6.6 JPG to PDF
- Upload one or more JPG/PNG images
- Arrange into PDF pages
- Options: page size, orientation, margins
- Library: pdf-lib + Canvas API

### 6.7 PDF to Excel
- Upload PDF
- Extract text content and attempt table detection
- Output as CSV (Excel-compatible) or XLSX
- Note: Client-side conversion is limited; provide best-effort text extraction
- Library: PDF.js

### 6.8 Word to PDF
- Upload DOCX file
- Parse DOCX (using mammoth.js for HTML conversion, then render to PDF)
- Note: Client-side DOCX parsing is complex; use mammoth.js → HTML → Canvas → PDF
- Library: mammoth.js + pdf-lib

### 6.9 Rotate PDF
- Upload PDF
- Select rotation angle (90°, 180°, 270°) per page or all pages
- Library: pdf-lib

### 6.10 Add Page Numbers
- Upload PDF
- Choose position (top/bottom, left/center/right)
- Choose format (1, 2, 3 or Page 1 of N)
- Library: pdf-lib

### 6.11 Watermark PDF
- Upload PDF
- Enter watermark text or upload image
- Adjust opacity, rotation, position, size
- Apply to all or selected pages
- Library: pdf-lib

### 6.12 Unlock PDF
- Upload password-protected PDF
- Attempt to remove restrictions (Note: can only remove owner password restrictions, not user/encryption passwords, due to PDF spec limitations)
- Library: pdf-lib

## 7. Page Designs

### 7.1 Home Page

**Hero Section**:
- Large headline + subtitle with i18n support
- Search bar to find tools quickly
- Trust badges: "Free", "100% Private", "No Installation"
- CSS 3D animation: multiple floating PDF document cards with perspective transforms, gentle rotation, and gradient backgrounds
- Gradient background (blue tones)

**Tool Grid Section**:
- Category filter tabs: All / Convert / Edit / Security
- Responsive grid of ToolCards (3 columns desktop, 2 tablet, 1 mobile)
- Each card: emoji icon + tool name + short description + hover effect

**SEO Section**:
- "Why Choose PDFToolBox" text block (300+ words)
- Feature highlights with icons
- Trust indicators

**Footer**:
- Navigation links (Privacy, Terms, About, Contact)
- Language switcher
- Copyright notice

### 7.2 Tool Page (Shared Layout)

**Left Column (main content)**:
- Tool operation area (FileUpload component + action buttons + download area)
- About This Tool section:
  - H1 with long-tail keyword
  - Description paragraph (100-200 words)
  - How to Use (3-5 steps with numbered icons)
  - Features list (with icons)
  - Why Use This Tool (100 words)
  - FAQ section (3-5 questions, collapsible)
  - Keyword tag cloud

**Right Sidebar**:
- Related tools (3-4 cards)
- Ad placeholder (for auto ads)

### 7.3 Static Pages (Privacy, Terms, About, Contact)

Each 300+ words with proper headings. Professional content suitable for AdSense approval.

### 7.4 404 Page

Meta refresh redirect to `/#/` with fallback link.

## 8. Design System

### Color Palette
```javascript
// Primary: Blue system (PDF industry standard)
primary-50:  #eff6ff
primary-100: #dbeafe
primary-500: #3b82f6
primary-600: #2563eb
primary-700: #1d4ed8

// Neutral
gray-50:  #f9fafb
gray-100: #f3f4f6
gray-500: #6b7280
gray-700: #374151
gray-900: #111827

// Accent colors per tool category
convert: blue gradient
edit:    green gradient
security: purple gradient
```

### Typography
- Font: System font stack (sans-serif)
- Headings: Bold, tight tracking
- Body: 16px base, 1.6 line height

### Spacing
- 8px base unit
- Consistent padding/margins using Tailwind scale

### Dark Mode
- CSS custom properties
- Toggle in header
- Persisted in localStorage

### 3D Hero Animation (CSS only)
```css
/* Multiple floating PDF cards */
.pdf-card {
  transform-style: preserve-3d;
  perspective: 1000px;
  animation: float 6s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0) rotateY(0deg); }
  50% { transform: translateY(-20px) rotateY(5deg); }
}
```

## 9. SEO Strategy

### Technical SEO
- Hash routing for GitHub Pages compatibility
- Each page has unique title, description, canonical URL
- Open Graph and Twitter Card meta tags
- JSON-LD structured data (WebSite + WebPage schema)
- Auto-generated sitemap.xml
- Proper robots.txt
- Code splitting with React.lazy()
- Image optimization (lazy loading)

### Content SEO
- Each tool page: 300+ words of content
- Long-tail keywords in H1, title, description
- FAQ section per tool (targets "how to" queries)
- How-to steps (targets featured snippets)
- Internal linking between related tools

### Target Keywords (examples)
- "merge pdf online free"
- "compress pdf without losing quality"
- "convert pdf to word free no upload"
- "split pdf pages online"
- "add page numbers to pdf free"

## 10. AdSense Configuration

### Setup
- Publisher ID: ca-pub-1812733940760212
- Auto ads only (no manual ad units)
- ads.txt in public/
- AdSense script in index.html <head>

### Content Requirements for Approval
- All 4 static pages with 300+ words each
- No broken links
- No "under construction" pages
- Every tool page has substantial content
- Privacy policy explains local-only processing

## 11. i18n Strategy

- Default language: English
- Supported: English (en), Chinese (zh)
- Language switcher in header (right side)
- All user-facing text uses i18n keys
- URL does not change on language switch
- Language preference stored in localStorage

### Translation Structure
```typescript
// en.ts example
{
  "common": {
    "upload": "Upload",
    "download": "Download",
    "processing": "Processing...",
    "done": "Done!"
  },
  "tools": {
    "merge": {
      "name": "Merge PDF",
      "description": "Combine multiple PDF files into one...",
      "seoTitle": "Free Online PDF Merger - Combine PDF Files in Browser | PDFToolBox",
      "seoDescription": "Merge PDF files online for free. Combine PDFs in your browser — no upload, no registration, 100% private.",
      "features": ["feature1", "feature2"],
      "howToUse": ["step1", "step2"],
      "faq": [{ "q": "...", "a": "..." }]
    }
  }
}
```

## 12. Deployment

### GitHub Actions Workflow
- Trigger: push to main branch
- Steps: checkout → setup node → install → generate sitemap → build → deploy
- Output: dist/ directory
- GitHub Pages source: GitHub Actions

### Custom Domain
- CNAME file with domain
- DNS configured separately

### 404 Handling
- 404.html with meta refresh to /#/
- Ensures SPA routing works on GitHub Pages

## 13. Performance Targets

- First Contentful Paint: < 1.5s
- Time to Interactive: < 3s
- Lighthouse score: > 90
- Bundle size: < 200KB initial (code-split tools)
- All PDF libraries loaded on demand

## 14. Browser Support

- Chrome/Edge 90+
- Firefox 90+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Android)

## 15. Constraints & Limitations

- **Client-side only**: No server processing. PDF to Word/Excel conversions are limited to text extraction or image-based output.
- **File size limits**: Large files (>100MB) may be slow or crash the browser. Add warnings.
- **Password protection**: Can only remove owner password restrictions, not user passwords (PDF spec limitation).
- **Compression**: Client-side PDF compression is limited compared to server-side tools.

## 16. Future Enhancements (Out of Scope for V1)

- Additional PDF tools (edit text, sign, etc.)
- OCR support
- Batch processing
- Cloud sync (optional)
- More languages
- PWA support
