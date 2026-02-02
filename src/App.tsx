import { useState, useEffect } from 'react';
import type { ArticleState, Insight } from './types';
import { fetchArticlesWithTag, createHighlight, removeTagFromDocument } from './api/readwise';
import { generateInsights } from './api/openrouter';
import { ArticleList } from './components/ArticleList';

function App() {
  const [articles, setArticles] = useState<ArticleState[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadArticles();
  }, []);

  async function loadArticles() {
    try {
      setIsLoading(true);
      setError(null);
      const fetchedArticles = await fetchArticlesWithTag('make-highlight');
      setArticles(fetchedArticles.map(article => ({
        article,
        transcript: '',
        insights: [],
        isProcessing: false,
        isComplete: false
      })));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load articles');
    } finally {
      setIsLoading(false);
    }
  }

  function updateArticle(articleId: string, updates: Partial<ArticleState>) {
    setArticles(prev => prev.map(a =>
      a.article.id === articleId ? { ...a, ...updates } : a
    ));
  }

  function updateInsight(articleId: string, insightId: string, updates: Partial<Insight>) {
    setArticles(prev => prev.map(a => {
      if (a.article.id !== articleId) return a;
      return {
        ...a,
        insights: a.insights.map(i =>
          i.id === insightId ? { ...i, ...updates } : i
        )
      };
    }));
  }

  function handleTranscriptChange(articleId: string, transcript: string) {
    updateArticle(articleId, { transcript });
  }

  async function handleGenerate(articleId: string) {
    const articleState = articles.find(a => a.article.id === articleId);
    if (!articleState) return;

    try {
      updateArticle(articleId, { isProcessing: true });
      const insightTexts = await generateInsights(articleState.transcript);
      const insights: Insight[] = insightTexts.map((text, index) => ({
        id: `${articleId}-insight-${index}`,
        text,
        status: 'pending',
        isEditing: false
      }));
      updateArticle(articleId, { insights, isProcessing: false });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate insights');
      updateArticle(articleId, { isProcessing: false });
    }
  }

  async function handleSaveInsight(articleId: string, insightId: string) {
    const articleState = articles.find(a => a.article.id === articleId);
    if (!articleState) return;

    const insight = articleState.insights.find(i => i.id === insightId);
    if (!insight || insight.status !== 'pending') return;

    try {
      await createHighlight(insight.text, articleState.article.url, articleState.article.title, articleState.article.author, articleState.article.imageUrl);
      updateInsight(articleId, insightId, { status: 'saved' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save highlight');
    }
  }

  function handleToggleDeleteInsight(articleId: string, insightId: string) {
    const articleState = articles.find(a => a.article.id === articleId);
    if (!articleState) return;

    const insight = articleState.insights.find(i => i.id === insightId);
    if (!insight) return;

    const newStatus = insight.status === 'deleted' ? 'pending' : 'deleted';
    updateInsight(articleId, insightId, { status: newStatus });
  }

  function handleEditInsight(articleId: string, insightId: string) {
    const articleState = articles.find(a => a.article.id === articleId);
    if (!articleState) return;

    const insight = articleState.insights.find(i => i.id === insightId);
    if (!insight) return;

    updateInsight(articleId, insightId, { isEditing: !insight.isEditing });
  }

  function handleInsightTextChange(articleId: string, insightId: string, text: string) {
    updateInsight(articleId, insightId, { text });
  }

  async function handleMarkComplete(articleId: string) {
    const articleState = articles.find(a => a.article.id === articleId);
    if (!articleState) return;

    try {
      await removeTagFromDocument(articleId, 'make-highlight', articleState.article.tags);
      updateArticle(articleId, { isComplete: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to mark as complete');
    }
  }

  if (isLoading) {
    return (
      <div className="app">
        <header className="header">
          <h1>Readwise Highlight Creator</h1>
        </header>
        <main className="main">
          <div className="loading">Loading articles...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="header">
        <h1>Readwise Highlight Creator</h1>
        <button onClick={loadArticles} className="btn btn-refresh">
          Refresh
        </button>
      </header>

      {error && (
        <div className="error-banner">
          {error}
          <button onClick={() => setError(null)}>×</button>
        </div>
      )}

      <main className="main">
        <ArticleList
          articles={articles}
          onTranscriptChange={handleTranscriptChange}
          onGenerate={handleGenerate}
          onSaveInsight={handleSaveInsight}
          onToggleDeleteInsight={handleToggleDeleteInsight}
          onEditInsight={handleEditInsight}
          onInsightTextChange={handleInsightTextChange}
          onMarkComplete={handleMarkComplete}
        />
      </main>
    </div>
  );
}

export default App;
