export const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8080/api';

export async function fetchArticles() {
  const res = await fetch(`${API_BASE}/articles`);
  if (!res.ok) throw new Error('Failed to fetch articles');
  return res.json();
}

export async function fetchArticle(id) {
  const res = await fetch(`${API_BASE}/articles/${id}`);
  if (!res.ok) throw new Error('Failed to fetch article');
  return res.json();
}
