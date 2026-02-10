import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter'; // You'll need to install gray-matter

export interface Article {
  title: string;
  subtitle?: string | null;
  slug: string;
  content: string;
  createdAt?: string | null;
  updatedAt?: string | null;
}

const articlesDirectory = path.join(process.cwd(), 'src', 'articles');

export async function getArticleSlugs(): Promise<string[]> {
  const filenames = await fs.readdir(articlesDirectory);
  return filenames
    .filter(filename => filename.endsWith('.md'))
    .map(filename => filename.replace('.md', ''))
    .filter(slug => slug !== 'Experience'); // Hide Experience article from website
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const fullPath = path.join(articlesDirectory, `${slug}.md`);
  try {
    const fileContents = await fs.readFile(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    if (!data.title) {
      console.error(`Missing title in ${slug}.md`);
      return null;
    }

    return {
      slug,
      title: data.title,
      subtitle: data.subtitle,
      content,
      createdAt: data.createdAt || null,
      updatedAt: data.updatedAt || null,
    };
  } catch (error) {
    console.error(`Error reading article ${slug}:`, error);
    return null;
  }
}

export async function getAllArticles(): Promise<Article[]> {
  const slugs = await getArticleSlugs();
  const articles = await Promise.all(
    slugs.map(slug => getArticleBySlug(slug))
  );
  return articles.filter(article => article !== null) as Article[];
}