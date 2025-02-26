import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter'; // You'll need to install gray-matter

export interface Article {
  title: string;
  subtitle: string;
  slug: string;
  content: string;
}

const articlesDirectory = path.join(process.cwd(), 'src', 'articles');

export async function getArticleSlugs(): Promise<string[]> {
  const filenames = await fs.readdir(articlesDirectory);
  return filenames
    .filter(filename => filename.endsWith('.md'))
    .map(filename => filename.replace('.md', ''));
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const fullPath = path.join(articlesDirectory, `${slug}.md`);
  try {
    const fileContents = await fs.readFile(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    if (!data.title || !data.subtitle) {
      console.error(`Missing title or subtitle in ${slug}.md`);
      return null; // Or handle error as you see fit
    }

    return {
      slug,
      title: data.title,
      subtitle: data.subtitle,
      content,
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