// Combined blog content index — merges all article batches
import blogEn1 from './blogEn';
import blogEn2 from './blogEn6to10';
import blogEn3 from './blogEn11to15';
import blogEn4 from './blogEn16';
import blogEn5 from './blogEn17';
import blogZh1 from './blogZh1to5';
import blogZh2 from './blogZh6to10';
import blogZh3 from './blogZh11to15';
import blogZh4 from './blogZh16';
import blogZh5 from './blogZh17';

// Merge all blog posts into a single object keyed by slug
const allEnPosts = {
  ...blogEn1.posts,
  ...blogEn2.posts,
  ...blogEn3.posts,
  ...blogEn4.posts,
  ...blogEn5.posts,
};

const allZhPosts = {
  ...blogZh1.posts,
  ...blogZh2.posts,
  ...blogZh3.posts,
  ...blogZh4.posts,
  ...blogZh5.posts,
};

export const blogContentEn = {
  title: blogEn1.title,
  subtitle: blogEn1.subtitle,
  posts: allEnPosts,
};

export const blogContentZh = {
  title: '博客',
  subtitle: '专业指南、技巧和教程，帮助您更高效地处理 PDF 文档。',
  posts: allZhPosts,
};
