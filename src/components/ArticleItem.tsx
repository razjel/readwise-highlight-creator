import type { ArticleState } from '../types';
import { InsightItem } from './InsightItem';

interface ArticleItemProps {
  articleState: ArticleState;
  onTranscriptChange: (transcript: string) => void;
  onGenerate: () => void;
  onSaveInsight: (insightId: string) => void;
  onToggleDeleteInsight: (insightId: string) => void;
  onEditInsight: (insightId: string) => void;
  onInsightTextChange: (insightId: string, text: string) => void;
  onMarkComplete: () => void;
}

export function ArticleItem({
  articleState,
  onTranscriptChange,
  onGenerate,
  onSaveInsight,
  onToggleDeleteInsight,
  onEditInsight,
  onInsightTextChange,
  onMarkComplete
}: ArticleItemProps) {
  const { article, transcript, insights, isProcessing, isComplete } = articleState;

  return (
    <div className={`article-item ${isComplete ? 'completed' : ''}`}>
      <div className="article-header">
        <h3 className="article-title">{article.title}</h3>
        <a
          href={article.readerUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="article-link"
        >
          Open in Reader →
        </a>
      </div>

      <div className="transcript-section">
        <textarea
          className="transcript-textarea"
          placeholder="Paste transcript here..."
          value={transcript}
          onChange={(e) => onTranscriptChange(e.target.value)}
          rows={6}
        />
        <button
          onClick={onGenerate}
          disabled={isProcessing || !transcript.trim()}
          className="btn btn-generate"
        >
          {isProcessing ? 'Generating...' : 'Generate Insights'}
        </button>
      </div>

      {insights.length > 0 && (
        <div className="insights-section">
          <h4>Insights</h4>
          {insights.map((insight) => (
            <InsightItem
              key={insight.id}
              insight={insight}
              onSave={() => onSaveInsight(insight.id)}
              onToggleDelete={() => onToggleDeleteInsight(insight.id)}
              onEdit={() => onEditInsight(insight.id)}
              onTextChange={(text) => onInsightTextChange(insight.id, text)}
            />
          ))}
        </div>
      )}

      {!isComplete && (
        <button
          onClick={onMarkComplete}
          className="btn btn-complete"
        >
          Mark as Complete
        </button>
      )}
    </div>
  );
}
