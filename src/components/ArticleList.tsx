import type { ArticleState } from '../types';
import { ArticleItem } from './ArticleItem';

interface ArticleListProps {
  articles: ArticleState[];
  onTranscriptChange: (articleId: string, transcript: string) => void;
  onGenerate: (articleId: string) => void;
  onSaveInsight: (articleId: string, insightId: string) => void;
  onToggleDeleteInsight: (articleId: string, insightId: string) => void;
  onEditInsight: (articleId: string, insightId: string) => void;
  onInsightTextChange: (articleId: string, insightId: string, text: string) => void;
  onMarkComplete: (articleId: string) => void;
}

export function ArticleList({
  articles,
  onTranscriptChange,
  onGenerate,
  onSaveInsight,
  onToggleDeleteInsight,
  onEditInsight,
  onInsightTextChange,
  onMarkComplete
}: ArticleListProps) {
  const activeArticles = articles.filter(a => !a.isComplete);

  if (activeArticles.length === 0) {
    return (
      <div className="empty-state">
        <p>No articles with tag "make-highlight" found.</p>
      </div>
    );
  }

  return (
    <div className="article-list">
      {articles.map((articleState) => (
        <ArticleItem
          key={articleState.article.id}
          articleState={articleState}
          onTranscriptChange={(transcript) =>
            onTranscriptChange(articleState.article.id, transcript)
          }
          onGenerate={() => onGenerate(articleState.article.id)}
          onSaveInsight={(insightId) =>
            onSaveInsight(articleState.article.id, insightId)
          }
          onToggleDeleteInsight={(insightId) =>
            onToggleDeleteInsight(articleState.article.id, insightId)
          }
          onEditInsight={(insightId) =>
            onEditInsight(articleState.article.id, insightId)
          }
          onInsightTextChange={(insightId, text) =>
            onInsightTextChange(articleState.article.id, insightId, text)
          }
          onMarkComplete={() => onMarkComplete(articleState.article.id)}
        />
      ))}
    </div>
  );
}
