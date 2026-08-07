import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Calendar, Clock, ArrowRight, Search, Tag } from 'lucide-react';
import SEOHead from '@/components/SEOHead';
import { blogPosts } from '@/blog/posts';

export default function Blog() {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const categories = Array.from(new Set(blogPosts.map(p => p.category)));

  const filtered = blogPosts.filter(post => {
    const matchesSearch = !search.trim() ||
      t(post.titleKey).toLowerCase().includes(search.toLowerCase()) ||
      t(post.descKey).toLowerCase().includes(search.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory = !activeCategory || post.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div>
      <SEOHead
        title="Blog - PDF Tools Guides & Tips | PDFToolBox"
        description="Expert guides, tips, and tutorials about PDF tools. Learn how to merge, split, compress, convert, and secure your PDF documents."
        canonical="https://pdf-toolbox.asia/blog"
      />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
            {t('blog.title')}
          </h1>
          <p className="text-[17px] text-neutral-500 dark:text-neutral-400 max-w-2xl">
            {t('blog.subtitle')}
          </p>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search articles..."
              className="w-full pl-11 pr-4 py-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl text-[15px] text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setActiveCategory(null)}
              className={`px-4 py-2 rounded-lg text-[14px] font-medium transition ${
                !activeCategory
                  ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900'
                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700'
              }`}
            >
              All
            </button>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
                className={`px-4 py-2 rounded-lg text-[14px] font-medium transition ${
                  activeCategory === cat
                    ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Posts grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map(post => (
            <Link
              key={post.slug}
              to={`/blog/${post.slug}`}
              className="group p-6 rounded-2xl border border-neutral-100 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-neutral-200 dark:hover:border-neutral-700 hover:shadow-lg transition-all duration-200"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-[12px] font-medium text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30 px-2.5 py-1 rounded-full">
                  {post.category}
                </span>
                <span className="flex items-center gap-1 text-[12px] text-neutral-400">
                  <Calendar size={12} />
                  {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
                <span className="flex items-center gap-1 text-[12px] text-neutral-400">
                  <Clock size={12} />
                  {post.readTime} min read
                </span>
              </div>
              <h2 className="text-[18px] font-bold text-neutral-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition line-clamp-2">
                {t(post.titleKey)}
              </h2>
              <p className="text-[14px] text-neutral-500 dark:text-neutral-400 leading-relaxed mb-4 line-clamp-2">
                {t(post.descKey)}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex gap-2 flex-wrap">
                  {post.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="flex items-center gap-1 text-[11px] text-neutral-400 dark:text-neutral-500">
                      <Tag size={10} />
                      {tag}
                    </span>
                  ))}
                </div>
                <span className="flex items-center gap-1 text-[13px] font-medium text-primary-600 dark:text-primary-400 group-hover:gap-2 transition-all">
                  Read <ArrowRight size={14} />
                </span>
              </div>
            </Link>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-neutral-400">
            No articles found. Try a different search or category.
          </div>
        )}
      </div>
    </div>
  );
}
