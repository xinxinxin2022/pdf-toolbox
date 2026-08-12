import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { blogPosts } from '../src/blog/posts';
import { blogContentEn, blogContentZh } from '../src/blog';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.resolve(__dirname, '../public');
const outDir = path.resolve(publicDir, 'pages');

// Ensure output directory exists
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const BASE_URL = 'https://pdf-toolbox.asia';
const ADSENSE_ID = 'ca-pub-1812733940760212';

// Tool data - mirrors src/i18n/en.ts
const tools = [
  {
    slug: 'edit-pdf',
    name: 'Edit PDF',
    icon: '✏️',
    category: 'Edit',
    shortDesc: 'Add text, drawings, and images to your PDF',
    description: 'Edit your PDF directly in the browser. Add text annotations, freehand drawings, and images to your PDF pages. All processing happens locally — your documents never leave your device. Perfect for annotating documents, marking up forms, or adding visual notes without any server uploads.',
    seoTitle: 'Edit PDF Online Free - Add Text, Drawings & Images | PDFToolBox',
    seoDesc: 'Edit PDF files online for free. Add text, draw annotations, and insert images directly in your browser — no upload, 100% private.',
    features: ['Add text annotations', 'Freehand drawing tools', 'Insert images (PNG/JPG)', 'Multi-page support', 'Undo/redo history', '100% client-side processing'],
    howToUse: ['Upload your PDF file', 'Use toolbar to add text, drawings, or images', 'Navigate pages and place annotations', 'Click "Export PDF" to download your edited file'],
    whyUse: 'PDFToolBox Editor lets you annotate PDFs directly in your browser. Add text, drawings, and images without uploading to any server. Perfect for marking up documents, adding notes, or making visual edits. All processing stays on your device for complete privacy.',
    faq: [
      { q: 'What can I add to my PDF?', a: 'You can add text annotations, freehand drawings, and images (PNG/JPG) to any page of your PDF.' },
      { q: 'Is my PDF uploaded anywhere?', a: 'No. All editing happens directly in your browser. Your files never leave your device.' },
      { q: 'Can I edit existing text in the PDF?', a: 'This tool adds new content (text, drawings, images) on top of your PDF. It does not modify existing text — that requires more advanced PDF editing software.' },
      { q: 'Can I undo my changes?', a: 'Yes! Use the Undo/Redo buttons in the toolbar to step through your edit history.' },
    ],
    keywords: ['edit pdf', 'pdf editor', 'annotate pdf', 'add text to pdf', 'draw on pdf', 'edit pdf online free'],
  },
  {
    slug: 'sign-pdf',
    name: 'Sign PDF',
    icon: '✍️',
    category: 'Edit',
    shortDesc: 'Add your electronic signature to PDF documents',
    description: 'Sign PDF documents electronically right in your browser. Draw your signature on the built-in pad and place it on your PDF pages. No need to print, sign, and scan again. Everything happens locally on your device — your signed documents never leave your browser, ensuring maximum privacy and security.',
    seoTitle: 'Sign PDF Online Free - Add Electronic Signature | PDFToolBox',
    seoDesc: 'Sign PDF documents online for free. Draw your signature and add it to PDFs directly in your browser — no upload, 100% private and secure.',
    features: ['Draw your signature', 'Place on every page', 'Professional appearance', 'No upload required', 'Fast processing', 'Maximum privacy'],
    howToUse: ['Upload your PDF file', 'Draw your signature on the signature pad', 'Click "Sign PDF" to apply signature', 'Download your signed PDF'],
    whyUse: 'PDFToolBox Sign lets you add electronic signatures to PDFs without printing and scanning. Draw your signature on the built-in pad and apply it to your documents instantly. Everything happens locally — your signed documents never leave your browser, ensuring maximum security and privacy.',
    faq: [
      { q: 'Is an electronic signature legally binding?', a: 'In most countries, electronic signatures are legally binding for most document types. Check your local regulations for specific requirements.' },
      { q: 'Is my signature uploaded to a server?', a: 'No. Your signature is drawn and applied entirely in your browser. Nothing is uploaded anywhere.' },
      { q: 'Can I sign multiple pages?', a: 'Yes, your signature will be placed on every page of the PDF automatically.' },
    ],
    keywords: ['sign pdf', 'pdf signature', 'electronic signature', 'esign pdf', 'sign pdf online free'],
  },
  {
    slug: 'merge-pdf',
    name: 'Merge PDF',
    icon: '📎',
    category: 'Edit',
    shortDesc: 'Combine multiple PDF files into one document',
    description: 'Merge multiple PDF files into a single document instantly. Drag and drop your files, rearrange the order, and combine them into one seamless PDF — all without uploading anything to a server. Our merge tool supports unlimited files and maintains the quality of your original documents. Whether you need to combine invoices, reports, or any other PDF documents, PDFToolBox makes it simple and secure. All processing happens directly in your browser using industry-standard libraries, ensuring your files never leave your device.',
    seoTitle: 'Free Online PDF Merger - Combine PDF Files in Browser | PDFToolBox',
    seoDesc: 'Merge PDF files online for free. Combine multiple PDFs into one document in your browser — no upload, no registration, 100% private and secure.',
    features: ['Combine unlimited PDF files', 'Drag & drop to reorder files', 'Preview before merging', '100% client-side processing', 'No file size limit', 'Maintain original quality'],
    howToUse: ['Upload your PDF files using drag & drop or file browser', 'Rearrange the file order by dragging the cards', 'Click "Merge PDF" to combine all files', 'Download your merged PDF file'],
    whyUse: 'PDFToolBox Merge PDF is the fastest way to combine PDF files online. Unlike other tools, we process everything in your browser — your files never leave your device. No registration, no watermarks, no file size limits. Just drag, drop, and merge. Perfect for combining reports, invoices, presentations, or any documents you need in a single file.',
    faq: [
      { q: 'Is it safe to merge PDF files online?', a: 'Yes! PDFToolBox processes everything in your browser. Your files never leave your device, making it 100% safe and private.' },
      { q: 'How many PDF files can I merge at once?', a: 'There is no limit. You can merge as many PDF files as you need. However, very large files may be slow depending on your device.' },
      { q: 'Can I reorder pages after merging?', a: 'You can rearrange the file order before merging by dragging the file cards. Each file\'s pages will be added in the order you specify.' },
      { q: 'Is this service free?', a: 'Yes, PDFToolBox is completely free. No registration, no watermarks, no hidden charges.' },
    ],
    keywords: ['merge pdf', 'combine pdf', 'join pdf files', 'merge pdf online free', 'combine pdf files browser'],
  },
  {
    slug: 'split-pdf',
    name: 'Split PDF',
    icon: '✂️',
    category: 'Edit',
    shortDesc: 'Extract pages from PDF into separate files',
    description: 'Split your PDF into multiple files or extract specific pages with ease. Choose page ranges, extract individual pages, or separate your document by sections. Our split tool gives you full control over how your PDF is divided, all processed locally in your browser for maximum privacy. Whether you need to extract a single page from a large document or split a multi-chapter report into separate files, PDFToolBox handles it efficiently.',
    seoTitle: 'Split PDF Online Free - Extract Pages from PDF | PDFToolBox',
    seoDesc: 'Split PDF files online for free. Extract pages, separate PDF into parts, or divide documents — no upload, no registration, 100% private.',
    features: ['Extract specific page ranges', 'Split into individual pages', 'Batch page extraction', 'Preview pages before splitting', 'No file size limit', '100% private processing'],
    howToUse: ['Upload your PDF file', 'Select page ranges or individual pages to extract', 'Click "Split PDF" to process', 'Download the split PDF files'],
    whyUse: 'Need to extract specific pages from a PDF? PDFToolBox Split gives you precise control over page extraction. Process pages locally in your browser with zero upload. Split by ranges, extract individual pages, or separate sections — all for free. Ideal for extracting chapters from ebooks, removing unnecessary pages, or organizing large documents.',
    faq: [
      { q: 'Can I extract just one page from a PDF?', a: 'Yes! You can select individual pages or page ranges to extract from your PDF document.' },
      { q: 'Will the split files maintain quality?', a: 'Absolutely. Since we process everything locally, there is zero quality loss during splitting.' },
      { q: 'Can I split a password-protected PDF?', a: 'You may need to unlock the PDF first using our Unlock PDF tool before splitting.' },
    ],
    keywords: ['split pdf', 'extract pdf pages', 'separate pdf', 'split pdf online free', 'extract pages from pdf'],
  },
  {
    slug: 'compress-pdf',
    name: 'Compress PDF',
    icon: '️',
    category: 'Edit',
    shortDesc: 'Reduce PDF file size without quality loss',
    description: 'Compress your PDF files to reduce their size while maintaining acceptable quality. Perfect for email attachments, web uploads, or saving storage space. Our compression tool optimizes your PDF internally without uploading to any server. The compression works by optimizing the internal structure of the PDF, removing unnecessary data, and applying efficient encoding. Your documents remain completely private throughout the process.',
    seoTitle: 'Compress PDF Online Free - Reduce File Size | PDFToolBox',
    seoDesc: 'Compress PDF files online for free. Reduce PDF file size without losing quality — no upload required, 100% private and secure.',
    features: ['Reduce file size significantly', 'Maintain acceptable quality', 'Fast processing speed', 'No upload required', 'Works offline after loading', 'Batch compression support'],
    howToUse: ['Upload your PDF file', 'Click "Compress PDF" to start processing', 'Wait for optimization to complete', 'Download your compressed PDF'],
    whyUse: 'PDFToolBox Compress reduces your PDF file size without requiring server uploads. Perfect for email attachments and web forms with size limits. Our client-side optimization ensures your documents stay private while becoming easier to share. Results typically range from 10-50% size reduction depending on the PDF content.',
    faq: [
      { q: 'How much can I reduce the file size?', a: 'Compression results vary depending on the PDF content. PDFs with many images typically see more reduction. Results typically range from 10-50% size reduction.' },
      { q: 'Will compression reduce quality?', a: 'Our compression focuses on internal optimization with minimal quality impact. The output should look nearly identical to the original.' },
      { q: 'Is there a file size limit?', a: 'There is no hard limit, but very large files (over 100MB) may be slow to process in the browser.' },
    ],
    keywords: ['compress pdf', 'reduce pdf size', 'shrink pdf', 'compress pdf online free', 'pdf compression'],
  },
  {
    slug: 'pdf-to-jpg',
    name: 'PDF to JPG',
    icon: '🖼️',
    category: 'Convert',
    shortDesc: 'Convert PDF pages to high-quality JPG images',
    description: 'Convert each page of your PDF into high-quality JPG images. Perfect for presentations, social media, or when you need individual page images. Our tool renders each PDF page using your browser\'s PDF rendering engine and exports them as crisp JPG files. You can download images individually or get them all bundled in a convenient ZIP archive. The conversion runs entirely in your browser, so your documents never leave your device.',
    seoTitle: 'Convert PDF to JPG Online Free - PDF to Image | PDFToolBox',
    seoDesc: 'Convert PDF to JPG images online for free. Export PDF pages as high-quality images — no upload, batch download as ZIP, 100% private.',
    features: ['High-quality image export at 150 DPI', 'Convert all pages at once', 'Individual or batch download', 'Adjustable image quality', 'ZIP download for multiple pages', 'No upload required'],
    howToUse: ['Upload your PDF file', 'Click "Convert to JPG" to start', 'Each page will be rendered as a high-quality image', 'Download images individually or as a ZIP archive'],
    whyUse: 'PDFToolBox PDF to JPG renders each page as a high-quality image using your browser\'s rendering engine. Export individual pages or download all as a ZIP archive. No upload, no quality compromise, complete privacy. Ideal for sharing PDF content on social media, creating thumbnails, or archiving documents as images.',
    faq: [
      { q: 'What image quality will I get?', a: 'Images are rendered at high resolution (150 DPI by default). You can adjust the quality before conversion.' },
      { q: 'Can I convert specific pages only?', a: 'Currently, all pages are converted. You can delete unwanted images after download.' },
      { q: 'How are multiple pages downloaded?', a: 'You can download images individually or get them all in a convenient ZIP file.' },
    ],
    keywords: ['pdf to jpg', 'pdf to image', 'convert pdf to jpg', 'pdf to jpg online free', 'pdf page to image'],
  },
  {
    slug: 'jpg-to-pdf',
    name: 'JPG to PDF',
    icon: '📄',
    category: 'Convert',
    shortDesc: 'Convert images to professional PDF document',
    description: 'Convert your JPG, PNG, or other image files into a professional PDF document. Upload one or multiple images, arrange them in your desired order, and create a beautifully formatted PDF. Perfect for combining photos into albums, converting screenshots to documents, or creating presentations. The tool supports various image formats and lets you customize page size and margins. Everything happens in your browser — no uploads, complete privacy.',
    seoTitle: 'JPG to PDF Converter Free Online - Image to PDF | PDFToolBox',
    seoDesc: 'Convert JPG images to PDF online for free. Combine multiple images into one PDF document — no upload required, 100% private.',
    features: ['Support JPG, PNG, and other image formats', 'Arrange images in any order', 'Custom page size and margins', 'High-quality output', 'Batch image processing', 'No file size limit'],
    howToUse: ['Upload your JPG/PNG image files', 'Arrange images in your desired order', 'Click "Convert to PDF" to create your document', 'Download your new PDF file'],
    whyUse: 'PDFToolBox JPG to PDF combines your images into professional PDF documents. Arrange photos, screenshots, or graphics in any order, customize layout, and create polished PDFs — all without uploading a single file. Great for creating photo albums, documentation, or converting screenshots into shareable PDFs.',
    faq: [
      { q: 'What image formats are supported?', a: 'We support JPG, JPEG, PNG, and other common image formats that browsers can render.' },
      { q: 'Can I adjust the page size?', a: 'Yes, you can choose from standard page sizes (A4, Letter, etc.) or fit to image.' },
      { q: 'Will image quality be maintained?', a: 'Yes, images are embedded at their original quality in the PDF document.' },
    ],
    keywords: ['jpg to pdf', 'image to pdf', 'convert jpg to pdf', 'jpg to pdf online free', 'photos to pdf'],
  },
  {
    slug: 'rotate-pdf',
    name: 'Rotate PDF',
    icon: '🔄',
    category: 'Edit',
    shortDesc: 'Rotate PDF pages to correct orientation',
    description: 'Rotate PDF pages to fix orientation issues instantly. Rotate individual pages or the entire document by 90°, 180°, or 270°. Perfect for fixing scanned documents that are sideways or upside down, correcting photos scanned in the wrong orientation, or adjusting documents for proper viewing. The rotation is a metadata operation with zero quality loss, and everything happens in your browser for complete privacy.',
    seoTitle: 'Rotate PDF Online Free - Fix Page Orientation | PDFToolBox',
    seoDesc: 'Rotate PDF pages online for free. Fix page orientation, rotate individual pages or entire documents — no upload, 100% private.',
    features: ['Rotate by 90°, 180°, or 270°', 'Rotate individual pages or all pages', 'Preview rotation before applying', 'Zero quality loss', 'Instant processing', 'No upload required'],
    howToUse: ['Upload your PDF file', 'Select rotation angle (90°, 180°, or 270°)', 'Choose to rotate all pages or specific pages', 'Click "Rotate" and download the result'],
    whyUse: 'PDFToolBox Rotate PDF fixes orientation issues instantly. Whether you scanned documents sideways or need to reorient specific pages, our tool handles it all locally. No upload means your documents stay completely private. The rotation is a metadata change with zero impact on quality.',
    faq: [
      { q: 'Can I rotate individual pages differently?', a: 'Yes! You can select specific pages and apply different rotation angles to each.' },
      { q: 'Will rotation affect quality?', a: 'No. PDF page rotation is a metadata operation with zero quality loss.' },
      { q: 'What angles are supported?', a: 'You can rotate by 90°, 180°, or 270° (clockwise).' },
    ],
    keywords: ['rotate pdf', 'turn pdf pages', 'fix pdf orientation', 'rotate pdf online free', 'rotate pdf pages'],
  },
  {
    slug: 'add-page-numbers',
    name: 'Add Page Numbers',
    icon: '🔢',
    category: 'Edit',
    shortDesc: 'Add professional page numbers to PDF',
    description: 'Add professional page numbers to your PDF documents with full customization. Choose from multiple positions (top, bottom, left, center, right) and formats (simple numbers or "Page X of Y"). Perfect for reports, essays, business documents, theses, and any multi-page PDF that needs proper pagination. The page numbers are rendered directly into the PDF with professional typography, and the entire process runs in your browser.',
    seoTitle: 'Add Page Numbers to PDF Online Free | PDFToolBox',
    seoDesc: 'Add page numbers to PDF online for free. Number PDF pages with custom position and format — no upload, no registration, 100% private.',
    features: ['Multiple position options (6 locations)', 'Custom number formats', 'Page X of Y style support', 'Adjustable font size', 'Works on all or selected pages', 'Professional typography'],
    howToUse: ['Upload your PDF file', 'Choose position (top/bottom, left/center/right)', 'Select format style and starting number', 'Click "Add Page Numbers" and download'],
    whyUse: 'PDFToolBox Add Page Numbers gives your PDFs a professional touch. Choose from multiple positions and formats to number your pages perfectly. Ideal for reports, theses, and business documents — all processed privately in your browser. No need for expensive PDF editing software.',
    faq: [
      { q: 'Can I customize the number format?', a: 'Yes, you can choose simple numbers (1, 2, 3) or "Page X of Y" format.' },
      { q: 'Where will page numbers appear?', a: 'You can place them at the top or bottom of the page, aligned left, center, or right.' },
      { q: 'Can I skip the first page?', a: 'Yes, you can choose to add numbers starting from any page.' },
    ],
    keywords: ['add page numbers to pdf', 'number pdf pages', 'pdf page numbers', 'add page numbers online free', 'paginate pdf'],
  },
  {
    slug: 'watermark-pdf',
    name: 'Watermark PDF',
    icon: '',
    category: 'Edit',
    shortDesc: 'Add text or image watermark to PDF',
    description: 'Protect your documents by adding custom watermarks to your PDF files. Add text watermarks with customizable font size, opacity, rotation angle, and color, or overlay image watermarks for branding. Perfect for marking drafts as confidential, protecting intellectual property, adding company branding, or marking documents as copies. The watermark is rendered directly into each page of your PDF with professional quality.',
    seoTitle: 'Watermark PDF Online Free - Add Text/Image Watermark | PDFToolBox',
    seoDesc: 'Add watermark to PDF online for free. Text and image watermarks with custom position and opacity — no upload, 100% private.',
    features: ['Text and image watermark support', 'Customizable opacity and rotation', 'Adjustable font size and color', 'Position control (centered on each page)', 'Works on all or selected pages', 'Professional appearance'],
    howToUse: ['Upload your PDF file', 'Enter watermark text or upload watermark image', 'Adjust opacity, size, rotation, and color', 'Click "Add Watermark" and download'],
    whyUse: 'PDFToolBox Watermark PDF lets you protect and brand your documents with custom watermarks. Add text or image watermarks with full control over position, opacity, and size. Everything happens locally — your documents remain private. Essential for businesses that need to protect drafts, mark confidential documents, or add branding.',
    faq: [
      { q: 'Can I use an image as a watermark?', a: 'Yes, you can upload an image (PNG with transparency works best) or use text as a watermark.' },
      { q: 'Will the watermark be on every page?', a: 'You can choose to apply the watermark to all pages or select specific pages.' },
      { q: 'Can I adjust the watermark transparency?', a: 'Yes, you can control opacity to make the watermark more or less visible.' },
    ],
    keywords: ['watermark pdf', 'add watermark to pdf', 'pdf watermark online', 'watermark pdf online free', 'pdf stamp'],
  },
  {
    slug: 'unlock-pdf',
    name: 'Unlock PDF',
    icon: '🔓',
    category: 'Security',
    shortDesc: 'Remove PDF password and restrictions',
    description: 'Remove password restrictions from your PDF files. If you have a PDF with editing, printing, or copying restrictions, our tool can help remove those limitations. The tool works by re-encoding the PDF without the restriction metadata. Note: This tool removes owner password restrictions (printing, editing, copying limits) but cannot decrypt files with user-level encryption passwords that require a password to open the file.',
    seoTitle: 'Unlock PDF Online Free - Remove PDF Password | PDFToolBox',
    seoDesc: 'Unlock PDF files online for free. Remove PDF password restrictions and permissions — no upload, no registration, 100% private.',
    features: ['Remove editing restrictions', 'Remove printing restrictions', 'Remove copying restrictions', 'Fast processing', 'No upload required', 'Support most PDF formats'],
    howToUse: ['Upload your restricted PDF file', 'Click "Unlock PDF" to remove restrictions', 'Wait for processing', 'Download your unlocked PDF'],
    whyUse: 'PDFToolBox Unlock PDF removes editing, printing, and copying restrictions from your documents. If you have a PDF that limits what you can do with it, our tool can help — processed entirely in your browser for maximum privacy. Useful for PDFs where you\'ve lost the owner password or need to enable printing/editing.',
    faq: [
      { q: 'Can I unlock any password-protected PDF?', a: 'This tool removes owner password restrictions (printing, editing, copying limits). It cannot remove user-level encryption passwords that require a password to open the file.' },
      { q: 'Is this legal?', a: 'Yes, removing restrictions from PDFs you own is legal. Please ensure you have the right to modify the document.' },
      { q: 'Will the content be affected?', a: 'No, unlocking only removes restrictions. The document content remains exactly the same.' },
    ],
    keywords: ['unlock pdf', 'remove pdf password', 'pdf unlock online', 'unlock pdf online free', 'remove pdf restrictions'],
  },
  {
    slug: 'pdf-to-excel',
    name: 'PDF to Excel',
    icon: '📊',
    category: 'Convert',
    shortDesc: 'Extract tables from PDF to Excel-compatible format',
    description: 'Extract tabular data from your PDF files into Excel-compatible CSV format. Our tool analyzes the PDF content, identifies text positions, and reconstructs table rows and columns. Best suited for text-based PDFs with clearly structured data like reports, invoices, and data exports. The CSV output can be opened directly in Microsoft Excel, Google Sheets, or any spreadsheet application. All processing happens in your browser — your documents never leave your device.',
    seoTitle: 'Convert PDF to Excel Online Free - Extract Tables | PDFToolBox',
    seoDesc: 'Convert PDF to Excel online for free. Extract tables and data from PDFs into spreadsheet format — no upload, 100% private.',
    features: ['Extract table data from PDF', 'CSV output (Excel compatible)', 'Process multi-page tables', 'No upload required', 'Preserve data structure', 'Fast extraction speed'],
    howToUse: ['Upload your PDF file', 'Click "Extract to Excel" to start', 'Table data will be extracted from the PDF', 'Download the CSV file (openable in Excel)'],
    whyUse: 'PDFToolBox PDF to Excel extracts structured data from your PDFs into spreadsheet-compatible format. Perfect for text-based PDFs with tables and structured content. All processing happens locally, ensuring complete data privacy. Ideal for converting invoices, reports, and data exports back into editable spreadsheets without any server upload.',
    faq: [
      { q: 'How accurate is the data extraction?', a: 'Extraction works best with text-based PDFs that have clear table structures. Scanned PDFs or complex layouts may require manual cleanup.' },
      { q: 'What format is the output?', a: 'The output is a CSV file that can be opened directly in Microsoft Excel, Google Sheets, or any spreadsheet application.' },
      { q: 'Can images in the PDF be extracted?', a: 'This tool focuses on text and table data extraction. Images are not included in the output.' },
    ],
    keywords: ['pdf to excel', 'pdf to csv', 'extract table from pdf', 'pdf to spreadsheet online free', 'pdf data extraction'],
  },
  {
    slug: 'word-to-pdf',
    name: 'Word to PDF',
    icon: '',
    category: 'Convert',
    shortDesc: 'Convert Word documents to PDF format',
    description: 'Convert your Word documents (DOCX) to professional PDF files. Our tool parses the DOCX file structure, extracts text content with formatting, and renders it as a high-quality PDF. The conversion preserves document layout, text styles, and paragraph structure. Perfect for creating universally readable documents that look the same on any device. Everything runs in your browser — no uploads, complete privacy.',
    seoTitle: 'Free Word to PDF Converter Online - DOCX to PDF | PDFToolBox',
    seoDesc: 'Convert Word to PDF online for free. DOCX to PDF conversion in your browser — no upload, no registration, 100% private.',
    features: ['Convert DOCX to PDF', 'Preserve document formatting', 'Professional output quality', 'No upload required', 'Fast conversion', 'Universal compatibility'],
    howToUse: ['Upload your Word (DOCX) file', 'Click "Convert to PDF" to start', 'Wait for the document to convert', 'Download your PDF file'],
    whyUse: 'PDFToolBox Word to PDF converts DOCX files to universally readable PDF format while preserving formatting. Create documents that anyone can open, regardless of whether they have Word installed. All conversion happens in your browser — no server, no upload, complete privacy. Ideal for sharing contracts, reports, and documents that need to look the same everywhere.',
    faq: [
      { q: 'What Word formats are supported?', a: 'We support DOCX files (Word 2007 and later). Older DOC format files should be saved as DOCX first.' },
      { q: 'Will formatting be preserved?', a: 'Basic formatting including text styles, fonts, and layout is preserved. Very complex formatting may have minor differences.' },
      { q: 'Is there a file size limit?', a: 'There is no hard limit, but very large documents may be slow to process in the browser.' },
    ],
    keywords: ['word to pdf', 'docx to pdf', 'convert word to pdf', 'word to pdf online free', 'docx converter'],
  },
  {
    slug: 'pdf-to-word',
    name: 'PDF Text Extraction',
    icon: '📝',
    category: 'Convert',
    shortDesc: 'Extract text content from PDF files',
    description: 'Extract text content from your PDF files for use in Word or other editors. This tool works best with text-based PDFs (created from Word, Google Docs, etc.) — it extracts the text layer directly from the PDF. Organized by page with clean formatting, the output is a Word-compatible document containing all extracted text. Note: scanned/image-based PDFs are not supported as they require OCR technology. Formatting, images, and complex layouts are not preserved.',
    seoTitle: 'Extract Text from PDF Online Free - PDF Text Extractor | PDFToolBox',
    seoDesc: 'Extract text from PDF files online for free. Works with text-based PDFs — no upload, no registration, 100% private. Scanned PDFs not supported.',
    features: ['Extract text content from PDFs', 'Text-based PDF support', 'No upload required', 'Multi-page extraction', 'Word-compatible output format', 'Fast processing speed'],
    howToUse: ['Upload your text-based PDF file', 'Click "Extract Text" to start', 'Text content is extracted from each page', 'Download the Word-compatible document'],
    whyUse: 'PDFToolBox Text Extraction pulls text from your PDFs for use in other applications. It works best with text-based PDFs created from documents. Scanned PDFs and image-based PDFs are not supported — those require server-side OCR tools. All processing happens locally in your browser for complete privacy. Great for repurposing content from PDF documents.',
    faq: [
      { q: 'What type of PDFs does this support?', a: 'This tool works with text-based PDFs — PDFs created from Word, Google Docs, or similar applications that have an embedded text layer. Scanned PDFs and image-based PDFs are not supported.' },
      { q: 'Why does my PDF show no text?', a: 'If your PDF is a scanned document or image-based, it doesn\'t contain a text layer. This tool cannot extract text from such PDFs. You would need OCR software for scanned documents.' },
      { q: 'Is formatting preserved?', a: 'No. This tool extracts raw text only. Images, tables, fonts, colors, and layout are not preserved. The output is plain text in a Word-compatible format.' },
      { q: 'What format is the output?', a: 'The output is an HTML file saved as .doc, which can be opened in Microsoft Word. It contains the extracted text organized by page.' },
    ],
    keywords: ['pdf to word', 'extract text from pdf', 'pdf text extraction', 'pdf to word online free', 'pdf to doc'],
  },
];

const staticPages = [
  {
    slug: 'privacy-policy',
    title: 'Privacy Policy - PDFToolBox',
    description: 'PDFToolBox Privacy Policy. All PDF processing happens in your browser. Your files never leave your device. Zero data collection.',
    content: `
<h1>Privacy Policy</h1>
<p><em>Last updated: August 2024</em></p>

<p>At PDFToolBox, we take your privacy extremely seriously. This Privacy Policy explains how we handle your data when you use our website.</p>

<h2>1. No File Uploads</h2>
<p><strong>This is the most important thing you need to know:</strong> PDFToolBox processes all PDF files entirely in your web browser. Your files are never uploaded to any server. When you use our tools to merge, split, compress, or convert PDF files, all processing happens locally on your device. We have zero access to your documents.</p>

<h2>2. Data We Collect</h2>
<p>We collect minimal data necessary to operate the website:</p>
<ul>
  <li><strong>Cookies:</strong> We use essential cookies for language preference and theme settings. These are stored locally in your browser.</li>
  <li><strong>Analytics:</strong> We may use privacy-friendly analytics to understand how visitors use our site. This data is anonymous and does not include any personal information or file content.</li>
  <li><strong>Advertising:</strong> We use Google AdSense, which may use cookies to serve relevant ads. You can learn about Google's advertising policies at <a href="https://policies.google.com/technologies/ads">google.com/policies/technologies/ads/</a>.</li>
</ul>

<h2>3. What We Don't Collect</h2>
<ul>
  <li>We do NOT collect your PDF files</li>
  <li>We do NOT collect personal information (name, email, etc.) unless you contact us</li>
  <li>We do NOT track which tools you use with which files</li>
  <li>We do NOT sell any data to third parties</li>
  <li>We do NOT require registration or accounts</li>
</ul>

<h2>4. Third-Party Services</h2>
<ul>
  <li><strong>Google AdSense:</strong> May use cookies for ad targeting. See Google's privacy policy for details.</li>
  <li><strong>GitHub Pages:</strong> Our site is hosted on GitHub Pages. GitHub may collect access logs. See GitHub's privacy policy.</li>
</ul>

<h2>5. Your Rights</h2>
<p>You have the right to:</p>
<ul>
  <li>Access any data we may hold about you</li>
  <li>Request deletion of your data</li>
  <li>Opt out of analytics tracking</li>
  <li>Disable cookies in your browser settings</li>
</ul>

<h2>6. Children's Privacy</h2>
<p>PDFToolBox is not directed at children under 13. We do not knowingly collect data from children.</p>

<h2>7. Changes to This Policy</h2>
<p>We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated revision date.</p>

<h2>8. Contact Us</h2>
<p>If you have questions about this Privacy Policy, please contact us at ben357753@163.com.</p>

<h2>9. Summary</h2>
<p><strong>PDFToolBox is designed with privacy at its core.</strong> Your files never leave your browser. We collect minimal data. We don't require accounts. We believe privacy is a fundamental right, and our tools are built to respect that.</p>
    `,
  },
  {
    slug: 'terms-of-service',
    title: 'Terms of Service - PDFToolBox',
    description: 'PDFToolBox Terms of Service. Free online PDF tools with 100% privacy. Read our terms and conditions.',
    content: `
<h1>Terms of Service</h1>
<p><em>Last updated: August 2024</em></p>

<p>By accessing and using PDFToolBox, you agree to these Terms of Service. Please read them carefully.</p>

<h2>1. Acceptance of Terms</h2>
<p>By using PDFToolBox ("the Service"), you agree to be bound by these Terms of Service. If you do not agree, please do not use the Service.</p>

<h2>2. Description of Service</h2>
<p>PDFToolBox provides free online PDF tools that run entirely in your web browser. These tools include but are not limited to: PDF merging, splitting, compression, format conversion, rotation, watermarking, and page numbering.</p>

<h2>3. Privacy and Data</h2>
<p>As detailed in our Privacy Policy, all PDF processing occurs locally in your browser. Your files are never uploaded to our servers. We do not store, access, or transmit your documents.</p>

<h2>4. Acceptable Use</h2>
<p>You agree to use PDFToolBox only for lawful purposes. You must not:</p>
<ul>
  <li>Use the Service to process illegal or infringing content</li>
  <li>Attempt to circumvent any security measures</li>
  <li>Interfere with the proper working of the Service</li>
  <li>Use the Service for any purpose that violates applicable laws</li>
</ul>

<h2>5. Intellectual Property</h2>
<p>PDFToolBox and its original content, features, and functionality are owned by PDFToolBox and are protected by international copyright, trademark, and other intellectual property laws.</p>

<h2>6. Disclaimer of Warranties</h2>
<p>THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.</p>
<p>We do not guarantee that:</p>
<ul>
  <li>The Service will be uninterrupted or error-free</li>
  <li>The results of using the Service will be accurate or reliable</li>
  <li>The quality of any tools or information obtained will meet your expectations</li>
</ul>

<h2>7. Limitation of Liability</h2>
<p>IN NO EVENT SHALL PDFToolBox BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF DATA, LOSS OF PROFITS, OR LOSS OF GOODWILL.</p>

<h2>8. PDF Processing Limitations</h2>
<p>PDFToolBox's tools run entirely in your browser. As such:</p>
<ul>
  <li>Conversion quality may vary depending on file complexity</li>
  <li>Very large files may cause browser performance issues</li>
  <li>Some advanced PDF features may not be fully supported</li>
  <li>Password removal only works for owner restrictions, not user-level encryption</li>
</ul>

<h2>9. Third-Party Links and Services</h2>
<p>Our Service may contain links to third-party websites or services (such as advertising). We are not responsible for the content or practices of any third-party sites.</p>

<h2>10. Modifications to Service</h2>
<p>We reserve the right to modify or discontinue the Service (or any part of it) at any time, with or without notice.</p>

<h2>11. Changes to Terms</h2>
<p>We may revise these Terms of Service from time to time. The most current version will always be posted on this page. Continued use of the Service after changes constitutes acceptance of the new terms.</p>

<h2>12. Governing Law</h2>
<p>These Terms shall be governed by and construed in accordance with applicable laws, without regard to conflict of law provisions.</p>

<h2>13. Contact</h2>
<p>For questions about these Terms, please contact us at ben357753@163.com.</p>

<p>By using PDFToolBox, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.</p>
    `,
  },
  {
    slug: 'about',
    title: 'About Us - PDFToolBox',
    description: 'Learn about PDFToolBox — free online PDF tools with 100% privacy. All processing happens in your browser. No uploads, no tracking.',
    content: `
<h1>About PDFToolBox</h1>

<h2>Our Mission</h2>
<p>PDFToolBox was created with a simple but powerful mission: <strong>to provide everyone with free, private, and professional PDF tools that work entirely in the browser.</strong></p>

<p>In a world where most online PDF tools require you to upload your documents to unknown servers, we decided to build something different. We believe that privacy shouldn't be a premium feature. Whether you're a student working on a thesis, a professional handling confidential business documents, or someone who just needs to quickly merge a few PDFs — you deserve tools that respect your privacy.</p>

<h2>Why We Built PDFToolBox</h2>
<p>We were frustrated with existing PDF tools that:</p>
<ul>
  <li>Required uploading sensitive documents to servers</li>
  <li>Added watermarks unless you paid for premium</li>
  <li>Had confusing interfaces full of ads and pop-ups</li>
  <li>Required creating accounts for simple tasks</li>
  <li>Collected and stored your files</li>
</ul>

<p>So we built PDFToolBox to be different:</p>

<p><strong>100% Client-Side Processing:</strong> Every PDF operation — merge, split, compress, convert — happens right in your browser using cutting-edge web technologies like pdf-lib.js and PDF.js. Your files never leave your device. Ever.</p>

<p><strong>Completely Free:</strong> All tools are free. No premium tier, no watermarks, no feature locks. We sustain the site through unobtrusive advertising.</p>

<p><strong>No Registration Required:</strong> Start using any tool immediately. No email, no account, no hassle.</p>

<p><strong>Professional Quality:</strong> We use industry-standard libraries and techniques to ensure your PDFs are processed with the highest quality.</p>

<p><strong>Beautiful and Simple:</strong> Clean, modern interface that's easy to use. No clutter, no confusion.</p>

<h2>Our Technology</h2>
<p>PDFToolBox is built with modern web technologies:</p>
<ul>
  <li><strong>React</strong> for a fast, responsive user interface</li>
  <li><strong>pdf-lib.js</strong> for PDF creation and modification</li>
  <li><strong>PDF.js</strong> for PDF rendering and text extraction</li>
  <li><strong>Canvas API</strong> for image processing and conversion</li>
  <li><strong>Tailwind CSS</strong> for beautiful, responsive design</li>
</ul>

<p>All of this runs entirely in your browser. We don't have backend servers processing your files because we don't need to — your device is powerful enough to handle PDF processing, and keeping everything local means complete privacy.</p>

<h2>Our Commitment to Privacy</h2>
<p>Privacy isn't just a feature — it's our core principle. We will never:</p>
<ul>
  <li>Upload your files to servers</li>
  <li>Require accounts or personal information</li>
  <li>Track which documents you process</li>
  <li>Sell your data to third parties</li>
  <li>Compromise on your privacy for profit</li>
</ul>

<h2>The Team</h2>
<p>PDFToolBox is built by a small team of privacy-conscious developers and designers who believe that essential tools should be free, private, and accessible to everyone. We're based around the world, united by the belief that the web should empower users, not exploit them.</p>

<h2>Open to Feedback</h2>
<p>We're constantly working to improve PDFToolBox. If you have suggestions, found a bug, or want to request a new tool, we'd love to hear from you. Visit our Contact page to get in touch.</p>

<h2>Thank You</h2>
<p>Thank you for choosing PDFToolBox. We're honored to be your go-to tool for PDF processing, and we promise to always keep your privacy and experience at the forefront of everything we do.</p>

<p><strong>Happy PDF-ing!</strong> 📄</p>
    `,
  },
  {
    slug: 'contact',
    title: 'Contact Us - PDFToolBox',
    description: 'Contact the PDFToolBox team. We\'re here to help with questions, feedback, bug reports, and feature requests.',
    content: `
<h1>Contact Us</h1>

<p>We'd love to hear from you! Whether you have a question, feedback, bug report, or feature request, we're here to help.</p>

<h2>Get in Touch</h2>
<ul>
  <li><strong>General Inquiries:</strong> <a href="mailto:ben357753@163.com">ben357753@163.com</a></li>
  <li><strong>Privacy Concerns:</strong> <a href="mailto:ben357753@163.com">ben357753@163.com</a></li>
  <li><strong>Legal Matters:</strong> <a href="mailto:ben357753@163.com">ben357753@163.com</a></li>
  <li><strong>Bug Reports:</strong> <a href="mailto:ben357753@163.com">ben357753@163.com</a></li>
  <li><strong>Business Inquiries:</strong> <a href="mailto:ben357753@163.com">ben357753@163.com</a></li>
</ul>

<h2>Response Time</h2>
<p>We strive to respond to all inquiries within 48 hours. For urgent matters, please include "URGENT" in your email subject line.</p>

<h2>Before You Contact Us</h2>
<p>For the quickest resolution, please check the following before reaching out:</p>

<h3>Common Questions</h3>

<p><strong>Is this really free?</strong><br>
Yes! All PDFToolBox tools are completely free. We sustain the site through non-intrusive advertising.</p>

<p><strong>Are my files safe?</strong><br>
Absolutely. All processing happens in your browser. Your files are never uploaded to any server. We literally cannot see your documents.</p>

<p><strong>Why isn't my conversion perfect?</strong><br>
Since all processing runs client-side in your browser, some complex conversions (especially PDF to Word/Excel) may have limitations. For best results, use text-based PDFs rather than scanned documents.</p>

<p><strong>What browsers are supported?</strong><br>
PDFToolBox works on all modern browsers including Chrome, Firefox, Safari, and Edge. We recommend keeping your browser updated for the best experience.</p>

<p><strong>Is there a file size limit?</strong><br>
There's no hard limit, but very large files (over 100MB) may be slow depending on your device's capabilities.</p>

<p><strong>Can I use PDFToolBox offline?</strong><br>
Once loaded, most tools can work without an internet connection since processing happens locally. However, you need internet to initially load the site.</p>

<h2>Feature Requests</h2>
<p>We're always looking to add new tools and improve existing ones. If you have a PDF tool you'd like to see, let us know! Some features we're considering:</p>
<ul>
  <li>PDF editing (add/remove text and images)</li>
  <li>Electronic signatures</li>
  <li>OCR (Optical Character Recognition)</li>
  <li>PDF comparison</li>
  <li>More format conversions</li>
</ul>

<h2>Report a Bug</h2>
<p>Found something that doesn't work? Please include:</p>
<ul>
  <li>The tool you were using</li>
  <li>Your browser and version</li>
  <li>What you were trying to do</li>
  <li>What happened instead</li>
  <li>The PDF file characteristics (number of pages, approximate file size)</li>
</ul>

<h2>Follow Us</h2>
<p>Stay updated on new tools and features by following us on social media (links coming soon!).</p>

<h2>We Read Every Message</h2>
<p>Every email sent to PDFToolBox is read by a real person on our team. We value your feedback and use it to make PDFToolBox better for everyone.</p>

<p>Thank you for being part of the PDFToolBox community!</p>
    `,
  },
];

const toolTemplate = (tool) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${tool.seoTitle}</title>
  <meta name="description" content="${tool.seoDesc}">
  <link rel="canonical" href="${BASE_URL}/tool/${tool.slug}">
  <meta property="og:title" content="${tool.seoTitle}">
  <meta property="og:description" content="${tool.seoDesc}">
  <meta property="og:type" content="website">
  <meta property="og:url" content="${BASE_URL}/tool/${tool.slug}">
  <meta property="og:site_name" content="PDFToolBox">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${tool.seoTitle}">
  <meta name="twitter:description" content="${tool.seoDesc}">
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_ID}" crossorigin="anonymous"></script>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #111; max-width: 900px; margin: 0 auto; padding: 20px; }
    header { display: flex; justify-content: space-between; align-items: center; padding: 20px 0; border-bottom: 1px solid #eee; margin-bottom: 30px; }
    header a { text-decoration: none; color: #2563eb; font-weight: 600; }
    nav { display: flex; gap: 20px; }
    nav a { text-decoration: none; color: #555; font-size: 14px; }
    nav a:hover { color: #2563eb; }
    .breadcrumb { font-size: 13px; color: #888; margin-bottom: 20px; }
    .breadcrumb a { color: #888; text-decoration: none; }
    .breadcrumb a:hover { color: #2563eb; }
    h1 { font-size: 32px; margin-bottom: 10px; }
    .subtitle { color: #666; font-size: 16px; margin-bottom: 30px; }
    .category { display: inline-block; background: #eff6ff; color: #2563eb; padding: 4px 12px; border-radius: 20px; font-size: 13px; margin-bottom: 20px; }
    .description { font-size: 16px; line-height: 1.8; color: #444; margin-bottom: 30px; }
    h2 { font-size: 22px; margin: 30px 0 15px; color: #111; }
    h3 { font-size: 18px; margin: 20px 0 10px; color: #222; }
    ul { margin: 10px 0 20px 20px; }
    li { margin-bottom: 8px; color: #444; }
    .features-list { list-style: none; margin-left: 0; }
    .features-list li { padding: 8px 0; border-bottom: 1px solid #f0f0f0; }
    .features-list li:before { content: "✓ "; color: #22c55e; font-weight: bold; }
    .steps { counter-reset: step; list-style: none; margin-left: 0; }
    .steps li { counter-increment: step; padding: 12px 0 12px 50px; position: relative; border-bottom: 1px solid #f0f0f0; }
    .steps li:before { content: counter(step); position: absolute; left: 0; top: 12px; width: 32px; height: 32px; background: #eff6ff; color: #2563eb; border-radius: 50%; text-align: center; line-height: 32px; font-weight: bold; font-size: 14px; }
    .why-use { background: #f9fafb; padding: 20px; border-radius: 12px; margin: 20px 0; }
    .faq-item { margin-bottom: 15px; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; }
    .faq-item summary { padding: 15px; cursor: pointer; font-weight: 600; background: #fafafa; }
    .faq-item summary:hover { background: #f0f0f0; }
    .faq-item p { padding: 0 15px 15px; color: #555; }
    .tags { margin: 30px 0; }
    .tags span { display: inline-block; background: #f0f0f0; padding: 4px 12px; border-radius: 20px; font-size: 13px; margin: 4px; color: #666; }
    .cta { background: #2563eb; color: white; padding: 16px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px; display: inline-block; margin: 20px 0; }
    .cta:hover { background: #1d4ed8; }
    footer { border-top: 1px solid #eee; margin-top: 40px; padding-top: 20px; font-size: 13px; color: #888; }
    footer a { color: #888; text-decoration: none; margin-right: 15px; }
    footer a:hover { color: #2563eb; }
    @media (max-width: 600px) {
      h1 { font-size: 24px; }
      nav { flex-wrap: wrap; }
    }
  </style>
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "${tool.seoTitle}",
    "description": "${tool.seoDesc.replace(/"/g, '\\"')}",
    "url": "${BASE_URL}/tool/${tool.slug}",
    "isPartOf": { "@type": "WebSite", "name": "PDFToolBox", "url": "${BASE_URL}" }
  }
  </script>
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
  ${tool.faq.map(faq => `    {
      "@type": "Question",
      "name": "${faq.q.replace(/"/g, '\\"')}",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "${faq.a.replace(/"/g, '\\"')}"
      }
    }`).join(',\n')}
    ]
  }
  </script>
</head>
<body>
  <header>
    <a href="${BASE_URL}/" style="font-size:20px;text-decoration:none;color:#111;"> <strong>PDFToolBox</strong></a>
    <nav>
      <a href="${BASE_URL}/">Home</a>
      <a href="${BASE_URL}/about">About</a>
      <a href="${BASE_URL}/contact">Contact</a>
    </nav>
  </header>

  <div class="breadcrumb">
    <a href="${BASE_URL}/">Home</a> / <a href="${BASE_URL}/">${tool.category}</a> / ${tool.name}
  </div>

  <h1>${tool.icon} ${tool.name}</h1>
  <p class="subtitle">${tool.shortDesc}</p>
  <span class="category">${tool.category}</span>

  <a href="${BASE_URL}/tool/${tool.slug}" class="cta">Use ${tool.name} Tool →</a>

  <h2>About This Tool</h2>
  <p class="description">${tool.description}</p>

  <h2>How to Use</h2>
  <ol class="steps">
    ${tool.howToUse.map(step => `<li>${step}</li>`).join('\n    ')}
  </ol>

  <h2>Features</h2>
  <ul class="features-list">
    ${tool.features.map(f => `<li>${f}</li>`).join('\n    ')}
  </ul>

  <h2>Why Use ${tool.name}?</h2>
  <div class="why-use">
    <p>${tool.whyUse}</p>
  </div>

  <h2>Frequently Asked Questions</h2>
  ${tool.faq.map(faq => `
  <details class="faq-item">
    <summary>${faq.q}</summary>
    <p>${faq.a}</p>
  </details>`).join('\n  ')}

  <h2>Related Keywords</h2>
  <div class="tags">
    ${tool.keywords.map(kw => `<span>${kw}</span>`).join('\n    ')}
  </div>

  <footer>
    <p>© 2024–2026 PDFToolBox. All rights reserved.</p>
    <p style="margin-top:10px;">
      <a href="${BASE_URL}/privacy-policy">Privacy Policy</a>
      <a href="${BASE_URL}/terms-of-service">Terms of Service</a>
      <a href="${BASE_URL}/about">About Us</a>
      <a href="${BASE_URL}/contact">Contact</a>
    </p>
  </footer>
</body>
</html>`;

const staticTemplate = (page) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${page.title}</title>
  <meta name="description" content="${page.description}">
  <link rel="canonical" href="${BASE_URL}/${page.slug}">
  <meta property="og:title" content="${page.title}">
  <meta property="og:description" content="${page.description}">
  <meta property="og:type" content="website">
  <meta property="og:url" content="${BASE_URL}/${page.slug}">
  <meta property="og:site_name" content="PDFToolBox">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${page.title}">
  <meta name="twitter:description" content="${page.description}">
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_ID}" crossorigin="anonymous"></script>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.7; color: #111; max-width: 800px; margin: 0 auto; padding: 20px; }
    header { display: flex; justify-content: space-between; align-items: center; padding: 20px 0; border-bottom: 1px solid #eee; margin-bottom: 30px; }
    header a { text-decoration: none; color: #2563eb; font-weight: 600; }
    nav { display: flex; gap: 20px; }
    nav a { text-decoration: none; color: #555; font-size: 14px; }
    nav a:hover { color: #2563eb; }
    h1 { font-size: 32px; margin-bottom: 10px; }
    h2 { font-size: 22px; margin: 30px 0 15px; color: #111; }
    h3 { font-size: 18px; margin: 20px 0 10px; color: #222; }
    p { margin-bottom: 15px; color: #444; }
    ul { margin: 10px 0 20px 20px; }
    li { margin-bottom: 8px; color: #444; }
    a { color: #2563eb; }
    footer { border-top: 1px solid #eee; margin-top: 40px; padding-top: 20px; font-size: 13px; color: #888; }
    footer a { color: #888; text-decoration: none; margin-right: 15px; }
    footer a:hover { color: #2563eb; }
    @media (max-width: 600px) { h1 { font-size: 24px; } nav { flex-wrap: wrap; } }
  </style>
</head>
<body>
  <header>
    <a href="${BASE_URL}/" style="font-size:20px;text-decoration:none;color:#111;">📄 <strong>PDFToolBox</strong></a>
    <nav>
      <a href="${BASE_URL}/">Home</a>
      <a href="${BASE_URL}/about">About</a>
      <a href="${BASE_URL}/contact">Contact</a>
    </nav>
  </header>
  ${page.content}
  <footer>
    <p>© 2024–2026 PDFToolBox. All rights reserved.</p>
    <p style="margin-top:10px;">
      <a href="${BASE_URL}/privacy-policy">Privacy Policy</a>
      <a href="${BASE_URL}/terms-of-service">Terms of Service</a>
      <a href="${BASE_URL}/about">About Us</a>
      <a href="${BASE_URL}/contact">Contact</a>
    </p>
  </footer>
</body>
</html>`;

// Generate index page
const indexContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>PDFToolBox - Free Online PDF Tools | Merge, Split, Compress PDF</title>
  <meta name="description" content="Free online PDF tools. Merge, split, compress, convert PDF files in your browser. 100% private, no upload required. 12 professional tools available.">
  <link rel="canonical" href="${BASE_URL}/">
  <meta property="og:title" content="PDFToolBox - Free Online PDF Tools">
  <meta property="og:description" content="Merge, split, compress, convert PDF files online for free. 100% private, no upload required.">
  <meta property="og:type" content="website">
  <meta property="og:url" content="${BASE_URL}/">
  <meta property="og:site_name" content="PDFToolBox">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="PDFToolBox - Free Online PDF Tools">
  <meta name="twitter:description" content="Merge, split, compress, convert PDF files online for free. 100% private, no upload required.">
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_ID}" crossorigin="anonymous"></script>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #111; max-width: 1100px; margin: 0 auto; padding: 20px; }
    header { display: flex; justify-content: space-between; align-items: center; padding: 20px 0; border-bottom: 1px solid #eee; margin-bottom: 30px; }
    header a { text-decoration: none; color: #2563eb; font-weight: 600; }
    nav { display: flex; gap: 20px; }
    nav a { text-decoration: none; color: #555; font-size: 14px; }
    nav a:hover { color: #2563eb; }
    .hero { text-align: center; padding: 60px 20px; background: linear-gradient(135deg, #eff6ff, #dbeafe); border-radius: 16px; margin-bottom: 40px; }
    .hero h1 { font-size: 48px; margin-bottom: 15px; }
    .hero p { font-size: 18px; color: #555; max-width: 600px; margin: 0 auto 20px; }
    .hero-badges { display: flex; justify-content: center; gap: 20px; flex-wrap: wrap; margin-top: 20px; }
    .hero-badges span { background: white; padding: 8px 16px; border-radius: 20px; font-size: 14px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
    .tools-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; margin-bottom: 40px; }
    .tool-card { border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px; transition: box-shadow 0.2s, transform 0.2s; text-decoration: none; color: inherit; }
    .tool-card:hover { box-shadow: 0 8px 30px rgba(0,0,0,0.08); transform: translateY(-2px); }
    .tool-icon { font-size: 32px; margin-bottom: 12px; }
    .tool-card h3 { font-size: 18px; margin-bottom: 8px; }
    .tool-card p { font-size: 14px; color: #666; }
    .tool-category { display: inline-block; font-size: 12px; color: #2563eb; background: #eff6ff; padding: 2px 10px; border-radius: 10px; margin-bottom: 10px; }
    h2.section-title { font-size: 28px; text-align: center; margin: 40px 0 20px; }
    .why-section { background: #f9fafb; padding: 40px; border-radius: 16px; margin: 40px 0; }
    .why-section p { font-size: 16px; line-height: 1.8; color: #444; }
    .trust-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 30px 0; }
    .trust-item { text-align: center; padding: 20px; }
    .trust-item h4 { font-size: 16px; margin: 10px 0 5px; }
    .trust-item p { font-size: 14px; color: #666; }
    footer { border-top: 1px solid #eee; margin-top: 40px; padding-top: 20px; font-size: 13px; color: #888; text-align: center; }
    footer a { color: #888; text-decoration: none; margin: 0 10px; }
    footer a:hover { color: #2563eb; }
    @media (max-width: 600px) { .hero h1 { font-size: 32px; } .tools-grid { grid-template-columns: 1fr; } }
  </style>
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "PDFToolBox",
    "url": "${BASE_URL}/",
    "description": "Free online PDF tools. 100% private, no upload required.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "${BASE_URL}/tool/{search_term_string}",
      "query-input": "required name=search_term_string"
    }
  }
  </script>
</head>
<body>
  <header>
    <a href="${BASE_URL}/" style="font-size:20px;text-decoration:none;color:#111;"> <strong>PDFToolBox</strong></a>
    <nav>
      <a href="${BASE_URL}/about">About</a>
      <a href="${BASE_URL}/contact">Contact</a>
    </nav>
  </header>

  <div class="hero">
    <h1>All-in-One PDF Tools</h1>
    <p>Merge, split, compress, convert — all in your browser. 100% private, no upload required.</p>
    <div class="hero-badges">
      <span> 100% Private</span>
      <span>💎 Free Forever</span>
      <span>🌐 No Installation</span>
      <span>⚡ Lightning Fast</span>
    </div>
  </div>

  <h2 class="section-title">All Tools</h2>
  <div class="tools-grid">
    ${tools.map(tool => `
    <a href="${BASE_URL}/tool/${tool.slug}" class="tool-card">
      <div class="tool-category">${tool.category}</div>
      <div class="tool-icon">${tool.icon}</div>
      <h3>${tool.name}</h3>
      <p>${tool.shortDesc}</p>
    </a>`).join('\n    ')}
  </div>

  <div class="why-section">
    <h2 style="text-align:center;margin-bottom:20px;">Why Choose PDFToolBox?</h2>
    <p>PDFToolBox is your go-to solution for all PDF needs. Unlike other online PDF tools, we process everything directly in your browser — your files never leave your device. This means complete privacy, faster processing, and no server dependencies. Whether you need to merge multiple PDFs, split a large document, compress files for email, or convert between formats, PDFToolBox handles it all with enterprise-grade quality. Our tools are completely free, require no registration, and work on any modern browser. We believe everyone should have access to powerful PDF tools without compromising their privacy or paying expensive subscription fees. That's why we built PDFToolBox — professional PDF processing that respects your rights and keeps your data safe.</p>
  </div>

  <div class="trust-grid">
    <div class="trust-item">
      <h4>💎 Free Forever</h4>
      <p>All tools are completely free to use, no hidden charges.</p>
    </div>
    <div class="trust-item">
      <h4>🔒 100% Private</h4>
      <p>Files never leave your browser. Zero data collection.</p>
    </div>
    <div class="trust-item">
      <h4>🌐 No Installation</h4>
      <p>Works directly in your browser. No software needed.</p>
    </div>
    <div class="trust-item">
      <h4>⚡ Lightning Fast</h4>
      <p>Process files instantly with client-side technology.</p>
    </div>
  </div>

  <footer>
    <p>© 2024–2026 PDFToolBox. All rights reserved.</p>
    <p style="margin-top:10px;">
      <a href="${BASE_URL}/privacy-policy">Privacy Policy</a>
      <a href="${BASE_URL}/terms-of-service">Terms of Service</a>
      <a href="${BASE_URL}/about">About Us</a>
      <a href="${BASE_URL}/contact">Contact</a>
    </p>
  </footer>
</body>
</html>`;

// ===== Blog Post Template and Markdown Converter =====

/**
 * Simple markdown to HTML converter for blog content
 */
function markdownToHtml(md: string): string {
  return md
    .split('\n\n')
    .map(block => {
      block = block.trim();
      if (!block) return '';

      // Headers
      if (block.startsWith('### ')) return `<h3>${block.slice(4)}</h3>`;
      if (block.startsWith('## ')) return `<h2>${block.slice(3)}</h2>`;
      if (block.startsWith('# ')) return `<h1>${block.slice(2)}</h1>`;

      // Blockquote
      if (block.startsWith('> ')) return `<blockquote>${inlineFormat(block.slice(2))}</blockquote>`;

      // Tables (basic)
      if (block.includes('|') && block.split('\n').every(line => line.trim().startsWith('|'))) {
        const lines = block.split('\n').filter(l => l.trim());
        if (lines.length >= 2) {
          const headers = lines[0].split('|').filter(c => c.trim()).map(c => `<th>${c.trim()}</th>`).join('');
          const rows = lines.slice(2).map(line => {
            const cells = line.split('|').filter(c => c.trim()).map(c => `<td>${inlineFormat(c.trim())}</td>`).join('');
            return `<tr>${cells}</tr>`;
          }).join('');
          return `<table><thead><tr>${headers}</tr></thead><tbody>${rows}</tbody></table>`;
        }
      }

      // Unordered list
      if (block.startsWith('- ') || block.startsWith('* ')) {
        const items = block.split('\n').map(line => {
          const content = line.replace(/^[-*] /, '');
          return `<li>${inlineFormat(content)}</li>`;
        }).join('');
        return `<ul>${items}</ul>`;
      }

      // Ordered list
      if (/^\d+\.\s/.test(block)) {
        const items = block.split('\n').map(line => {
          const content = line.replace(/^\d+\.\s/, '');
          return `<li>${inlineFormat(content)}</li>`;
        }).join('');
        return `<ol>${items}</ol>`;
      }

      // Paragraph
      return `<p>${inlineFormat(block)}</p>`;
    })
    .filter(Boolean)
    .join('\n');
}

/**
 * Format inline markdown: **bold**, *italic*, `code`, [links](url)
 */
function inlineFormat(text: string): string {
  // Code blocks
  text = text.replace(/`([^`]+)`/g, '<code>$1</code>');
  // Bold
  text = text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  // Italic
  text = text.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  // Links
  text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  return text;
}

// Blog post data: combine metadata from posts.ts with content from blog index
const allBlogPosts = blogPosts.map(meta => {
  const enPost = blogContentEn.posts;
  const zhPost = blogContentZh.posts;

  // Find the content key by matching title/desc
  // The content key format is like "blog.posts.pdfWorkflow2026.content"
  // We need to extract the post key (e.g., "pdfWorkflow2026")
  const keyMatch = meta.contentKey.match(/blog\.posts\.(\w+)\.content/);
  if (!keyMatch) return null;
  const postKey = keyMatch[1];

  const enData = enPost[postKey];
  const zhData = zhPost[postKey];

  if (!enData) return null;

  return {
    ...meta,
    title: enData.title,
    desc: enData.desc,
    content: enData.content,
    titleZh: zhData?.title || enData.title,
    descZh: zhData?.desc || enData.desc,
    contentZh: zhData?.content || enData.content,
  };
}).filter(Boolean);

// Blog post HTML template
const blogPostTemplate = (post: any) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${post.title} | PDFToolBox Blog</title>
  <meta name="description" content="${post.desc}">
  <link rel="canonical" href="${BASE_URL}/blog/${post.slug}">
  <meta property="og:title" content="${post.title} | PDFToolBox Blog">
  <meta property="og:description" content="${post.desc}">
  <meta property="og:type" content="article">
  <meta property="og:url" content="${BASE_URL}/blog/${post.slug}">
  <meta property="og:site_name" content="PDFToolBox">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${post.title} | PDFToolBox Blog">
  <meta name="twitter:description" content="${post.desc}">
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_ID}" crossorigin="anonymous"></script>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.8; color: #111; max-width: 800px; margin: 0 auto; padding: 20px; }
    header { display: flex; justify-content: space-between; align-items: center; padding: 20px 0; border-bottom: 1px solid #eee; margin-bottom: 30px; }
    header a { text-decoration: none; color: #2563eb; font-weight: 600; }
    nav { display: flex; gap: 20px; }
    nav a { text-decoration: none; color: #555; font-size: 14px; }
    nav a:hover { color: #2563eb; }
    .breadcrumb { font-size: 13px; color: #888; margin-bottom: 20px; }
    .breadcrumb a { color: #888; text-decoration: none; }
    .breadcrumb a:hover { color: #2563eb; }
    .meta { display: flex; align-items: center; gap: 15px; margin-bottom: 15px; flex-wrap: wrap; }
    .category { display: inline-block; background: #eff6ff; color: #2563eb; padding: 4px 12px; border-radius: 20px; font-size: 13px; font-weight: 600; }
    .meta span { font-size: 13px; color: #999; }
    h1 { font-size: 32px; margin-bottom: 10px; line-height: 1.3; }
    .subtitle { font-size: 17px; color: #666; margin-bottom: 20px; line-height: 1.6; }
    .tags { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 30px; }
    .tags span { background: #f0f0f0; padding: 4px 12px; border-radius: 20px; font-size: 12px; color: #666; }
    article { font-size: 16px; color: #333; }
    article h2 { font-size: 22px; margin: 35px 0 15px; color: #111; border-bottom: 2px solid #f0f0f0; padding-bottom: 8px; }
    article h3 { font-size: 18px; margin: 25px 0 12px; color: #222; }
    article p { margin-bottom: 18px; line-height: 1.8; }
    article ul, article ol { margin: 15px 0 20px 25px; }
    article li { margin-bottom: 8px; }
    article strong { color: #111; }
    article code { background: #f5f5f5; padding: 2px 6px; border-radius: 4px; font-size: 14px; font-family: monospace; }
    article blockquote { border-left: 4px solid #2563eb; padding-left: 16px; margin: 20px 0; color: #666; font-style: italic; }
    article table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    article th, article td { border: 1px solid #e5e7eb; padding: 10px 12px; text-align: left; }
    article th { background: #f9fafb; font-weight: 600; }
    article a { color: #2563eb; }
    .cta-box { background: #f0f9ff; border: 1px solid #bae6fd; border-radius: 12px; padding: 25px; margin: 30px 0; text-align: center; }
    .cta-box p { margin-bottom: 15px; font-size: 15px; }
    .cta-box a { display: inline-block; background: #2563eb; color: white; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; }
    .cta-box a:hover { background: #1d4ed8; }
    .back-link { display: inline-block; margin-top: 40px; color: #2563eb; text-decoration: none; font-size: 14px; }
    .back-link:hover { text-decoration: underline; }
    footer { border-top: 1px solid #eee; margin-top: 50px; padding-top: 20px; font-size: 13px; color: #888; }
    footer a { color: #888; text-decoration: none; margin-right: 15px; }
    footer a:hover { color: #2563eb; }
    @media (max-width: 600px) { h1 { font-size: 24px; } nav { flex-wrap: wrap; } article { font-size: 15px; } }
  </style>
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": "${post.title.replace(/"/g, '\\"')}",
    "description": "${post.desc.replace(/"/g, '\\"')}",
    "datePublished": "${post.date}",
    "url": "${BASE_URL}/blog/${post.slug}",
    "publisher": { "@type": "Organization", "name": "PDFToolBox", "url": "${BASE_URL}" }
  }
  </script>
</head>
<body>
  <header>
    <a href="${BASE_URL}/" style="font-size:20px;text-decoration:none;color:#111;"> <strong>PDFToolBox</strong></a>
    <nav>
      <a href="${BASE_URL}/">Home</a>
      <a href="${BASE_URL}/about">About</a>
      <a href="${BASE_URL}/contact">Contact</a>
      <a href="${BASE_URL}/blog">Blog</a>
    </nav>
  </header>

  <div class="breadcrumb">
    <a href="${BASE_URL}/">Home</a> / <a href="${BASE_URL}/blog">Blog</a> / ${post.title}
  </div>

  <div class="meta">
    <span class="category">${post.category}</span>
    <span> Aug ${new Date(post.date).getDate()}, ${new Date(post.date).getFullYear()}</span>
    <span>⏱️ ${post.readTime} min read</span>
  </div>

  <h1>${post.title}</h1>
  <p class="subtitle">${post.desc}</p>

  <div class="tags">
    ${post.tags.map(tag => `<span>#${tag}</span>`).join('\n    ')}
  </div>

  <article>
    ${markdownToHtml(post.content)}
  </article>

  <div class="cta-box">
    <p>Need to work with PDF files? Try our free, browser-based PDF tools — no upload required, 100% private.</p>
    <a href="${BASE_URL}/">Explore PDF Tools →</a>
  </div>

  <a href="${BASE_URL}/blog" class="back-link">← Back to Blog</a>

  <footer>
    <p>© 2026 PDFToolBox. All rights reserved.</p>
    <p style="margin-top:10px;">
      <a href="${BASE_URL}/privacy-policy">Privacy Policy</a>
      <a href="${BASE_URL}/terms-of-service">Terms of Service</a>
      <a href="${BASE_URL}/about">About Us</a>
      <a href="${BASE_URL}/contact">Contact</a>
    </p>
  </footer>
</body>
</html>`;

// ===== END Blog Post Template =====

// Write all files
console.log('Generating static HTML pages for AdSense...');

// Index page
fs.writeFileSync(path.join(outDir, 'index.html'), indexContent, 'utf-8');
console.log('  ✓ index.html');

// Tool pages
for (const tool of tools) {
  const html = toolTemplate(tool);
  fs.writeFileSync(path.join(outDir, `${tool.slug}.html`), html, 'utf-8');
  console.log(`  ✓ ${tool.slug}.html`);
}

// Static pages
for (const page of staticPages) {
  const html = staticTemplate(page);
  fs.writeFileSync(path.join(outDir, `${page.slug}.html`), html, 'utf-8');
  console.log(`  ✓ ${page.slug}.html`);
}

// Blog posts
const blogOutDir = path.join(outDir, 'blog');
if (!fs.existsSync(blogOutDir)) {
  fs.mkdirSync(blogOutDir, { recursive: true });
}
for (const post of allBlogPosts) {
  const html = blogPostTemplate(post);
  fs.writeFileSync(path.join(blogOutDir, `${post.slug}.html`), html, 'utf-8');
  console.log(`  ✓ blog/${post.slug}.html`);
}

// Update sitemap.xml with clean URLs (no hash)
const today = new Date().toISOString().split('T')[0];
const allUrls = [
  { path: '/', priority: 1.0, changefreq: 'weekly' },
  ...tools.map(t => ({ path: `/tool/${t.slug}`, priority: 0.8, changefreq: 'monthly' })),
  ...staticPages.map(p => ({ path: `/${p.slug}`, priority: 0.5, changefreq: 'monthly' })),
  { path: '/blog', priority: 0.7, changefreq: 'weekly' },
  ...allBlogPosts.map(p => ({ path: `/blog/${p.slug}`, priority: 0.6, changefreq: 'monthly', date: p.date })),
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls.map(u => `  <url>
    <loc>${BASE_URL}${u.path}</loc>
    <lastmod>${u.date || today}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>
`;

fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap, 'utf-8');
console.log('  ✓ sitemap.xml (updated with clean URLs + blog posts)');

const totalPages = tools.length + staticPages.length + 1 + allBlogPosts.length;
console.log(`\nDone! Generated ${totalPages} HTML pages in ${outDir}`);
console.log('These pages are fully readable by AdSense crawlers.');
