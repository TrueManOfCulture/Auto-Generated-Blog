import { useEffect, useState } from 'react';
import './App.css';
import { fetchArticles, fetchArticle } from './api/client';

function App() {
  const [articles, setArticles] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loadingList, setLoadingList] = useState(true);
  const [loadingArticle, setLoadingArticle] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      setLoadingList(true);
      try {
        const data = await fetchArticles();
        setArticles(data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoadingList(false);
      }
    })();
  }, []);

  const loadArticle = async (id) => {
    setError(null);
    setLoadingArticle(true);
    try {
      const a = await fetchArticle(id);
      setSelected(a);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoadingArticle(false);
    }
  };

  return (
    <div className="container">
      <h1>Auto-Generated Blog</h1>
      {error && <div className="error">{error}</div>}

      <div className="layout">
        <div className="sidebar">
          <h2>Articles</h2>
          {loadingList ? (
            <p className="loading">Loading articles…</p>
          ) : (
            <ul className="article-list">
              {articles.map((a) => (
                <li className="article-item" key={a.id}>
                  <button className="article-button" onClick={() => loadArticle(a.id)}>
                    {a.title}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="content">
          {loadingArticle && <p className="loading">Loading article…</p>}
          {!loadingArticle && selected ? (
            <article>
              <h2>{selected.title}</h2>
              <div className="article-body">{selected.content}</div>
            </article>
          ) : !loadingArticle ? (
            <p>Select an article to view its content.</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default App;
