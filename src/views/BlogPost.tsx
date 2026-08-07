import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Calendar, Clock, ArrowLeft, Tag, ArrowRight } from 'lucide-react';
import SEOHead from '@/components/SEOHead';
import { blogPosts } from '@/blog/posts';

export default function BlogPost() {
  const { slug } = useParams();
  const { t } = useTranslation();

  const postIndex = blogPosts.findIndex(p => p.slug === slug);
  const post = blogPosts[postIndex];
  const prevPost = postIndex < blogPosts.length - 1 ? blogPosts[postIndex + 1] : null;
  const nextPost = postIndex > 0 ? blogPosts[postIndex - 1] : null;

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 text-center">
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">Article not found</h1>
        <Link to="/blog" className="text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition">
          ← Back to Blog
        </Link>
      </div>
    );
  }

  const title = t(post.titleKey);
  const description = t(post.descKey);
  const content = t(post.contentKey);

  // Render markdown-like content as HTML
  const renderContent = (text: string) => {
    return text
      .split('\n\n')
      .map((block, i) => {
        block = block.trim();
        if (!block) return null;
        if (block.startsWith('### ')) {
          return <h3 key={i} className="text-xl font-bold text-neutral-900 dark:text-white mt-8 mb-3">{block.slice(4)}</h3>;
        }
        if (block.startsWith('## ')) {
          return <h2 key={i} className="text-2xl font-bold text-neutral-900 dark:text-white mt-10 mb-4">{block.slice(3)}</h2>;
        }
        if (block.startsWith('# ')) {
          return <h1 key={i} className="text-3xl font-bold text-neutral-900 dark:text-white mt-10 mb-4">{block.slice(2)}</h1>;
        }
        if (block.startsWith('- ') || block.startsWith('* ')) {
          const items = block.split('\n').map(line => line.replace(/^[-*] /, ''));
          return (
            <ul key={i} className="list-disc list-inside space-y-2 text-[16px] text-neutral-600 dark:text-neutral-400 my-4">
              {items.map((item, j) => <li key={j}>{renderInline(item)}</li>)}
            </ul>
          );
        }
        if (/^\d+\.\s/.test(block)) {
          const items = block.split('\n').map(line => line.replace(/^\d+\.\s/, ''));
          return (
            <ol key={i} className="list-decimal list-inside space-y-2 text-[16px] text-neutral-600 dark:text-neutral-400 my-4">
              {items.map((item, j) => <li key={j}>{renderInline(item)}</li>)}
            </ol>
          );
        }
        if (block.startsWith('> ')) {
          return (
            <blockquote key={i} className="border-l-4 border-primary-500 pl-4 my-6 italic text-neutral-600 dark:text-neutral-400">
              {renderInline(block.slice(2))}
            </blockquote>
          );
        }
        return <p key={i} className="text-[16px] text-neutral-600 dark:text-neutral-400 leading-[1.8] my-4">{renderInline(block)}</p>;
      })
      .filter(Boolean);
  };

  const renderInline = (text: string) => {
    // Handle **bold** and *italic*
    const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-semibold text-neutral-900 dark:text-white">{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('*') && part.endsWith('*')) {
        return <em key={i}>{part.slice(1, -1)}</em>;
      }
      return part;
    });
  };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description,
    datePublished: post.date,
    url: `https://pdf-toolbox.asia/blog/${post.slug}`,
    publisher: {
      '@type': 'Organization',
      name: 'PDFToolBox',
      url: 'https://pdf-toolbox.asia',
    },
  };

  return (
    <div>
      <SEOHead
        title={`${title} | PDFToolBox Blog`}
        description={description}
        canonical={`https://pdf-toolbox.asia/blog/${post.slug}`}
        ogType="article"
        jsonLd={jsonLd}
      />
      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back link */}
        <Link
          to="/blog"
          className="inline-flex items-center gap-1.5 text-[14px] text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition mb-8"
        >
          <ArrowLeft size={14} /> Back to Blog
        </Link>

        {/* Header */}
        <header className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-[12px] font-medium text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30 px-2.5 py-1 rounded-full">
              {post.category}
            </span>
            <span className="flex items-center gap-1 text-[13px] text-neutral-400">
              <Calendar size={13} />
              {new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </span>
            <span className="flex items-center gap-1 text-[13px] text-neutral-400">
              <Clock size={13} />
              {post.readTime} min read
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white leading-tight mb-4">
            {title}
          </h1>
          <p className="text-[17px] text-neutral-500 dark:text-neutral-400 leading-relaxed">
            {description}
          </p>
          <div className="flex gap-2 flex-wrap mt-4">
            {post.tags.map(tag => (
              <span key={tag} className="flex items-center gap-1 text-[12px] text-neutral-400 bg-neutral-100 dark:bg-neutral-800 px-2.5 py-1 rounded-full">
                <Tag size={10} />
                {tag}
              </span>
            ))}
          </div>
        </header>

        {/* Content */}
        <div className="prose-custom">
          {renderContent(content)}
        </div>

        {/* Divider */}
        <div className="border-t border-neutral-100 dark:border-neutral-800 my-12" />

        {/* Prev / Next navigation */}
        <nav className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {prevPost ? (
            <Link
              to={`/blog/${prevPost.slug}`}
              className="group p-4 rounded-xl border border-neutral-100 dark:border-neutral-800 hover:border-neutral-200 dark:hover:border-neutral-700 transition"
            >
              <span className="text-[12px] text-neutral-400 flex items-center gap-1 mb-1">
                <ArrowLeft size={12} /> Previous
              </span>
              <span className="text-[14px] font-medium text-neutral-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition line-clamp-1">
                {t(prevPost.titleKey)}
              </span>
            </Link>
          ) : <div />}
          {nextPost ? (
            <Link
              to={`/blog/${nextPost.slug}`}
              className="group p-4 rounded-xl border border-neutral-100 dark:border-neutral-800 hover:border-neutral-200 dark:hover:border-neutral-700 transition text-right"
            >
              <span className="text-[12px] text-neutral-400 flex items-center gap-1 justify-end mb-1">
                Next <ArrowRight size={12} />
              </span>
              <span className="text-[14px] font-medium text-neutral-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition line-clamp-1">
                {t(nextPost.titleKey)}
              </span>
            </Link>
          ) : <div />}
        </nav>
      </article>
    </div>
  );
}
