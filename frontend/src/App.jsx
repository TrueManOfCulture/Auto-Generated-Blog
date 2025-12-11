import { useEffect, useState } from 'react';
import './App.css';
import { fetchArticles, fetchArticle } from './api/client';

function App() {
  const [articles, setArticles] = useState([]);
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchArticles();
        setArticles(data);
      } catch (e) {
        setError(e.message);
      }
    })();
  }, []);

  const loadArticle = async (id) => {
    setError(null);
    try {
      const a = await fetchArticle(id);
      setSelected(a);
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div className="container">
      <h1>Auto-Generated Blog</h1>
      {error && <div className="error">{error}</div>}

      <div className="layout">
        <div className="sidebar">
          <h2>Articles</h2>
          <ul>
            {articles.map((a) => (
              <li key={a.id}>
                <button onClick={() => loadArticle(a.id)}>{a.title}</button>
              </li>
            ))}
          </ul>
        </div>

        <div className="content">
          {selected ? (
            <article>
              <h2>{selected.title}</h2>
              {/* Render Markdown naively for now */}
              <pre style={{ whiteSpace: 'pre-wrap' }}>{selected.content}</pre>
            </article>
          ) : (
            <p>Select an article to view its content.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
