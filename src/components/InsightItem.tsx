import type { Insight } from '../types';

interface InsightItemProps {
  insight: Insight;
  onSave: () => void;
  onToggleDelete: () => void;
  onEdit: () => void;
  onTextChange: (text: string) => void;
}

export function InsightItem({
  insight,
  onSave,
  onToggleDelete,
  onEdit,
  onTextChange
}: InsightItemProps) {
  const isDeleted = insight.status === 'deleted';
  const isSaved = insight.status === 'saved';

  return (
    <div className={`insight-item ${isDeleted ? 'deleted' : ''} ${isSaved ? 'saved' : ''}`}>
      <div className="insight-content">
        {insight.isEditing ? (
          <textarea
            className="insight-edit-textarea"
            value={insight.text}
            onChange={(e) => onTextChange(e.target.value)}
            rows={3}
          />
        ) : (
          <span className="insight-text">{insight.text}</span>
        )}
      </div>
      <div className="insight-actions">
        <button
          onClick={onSave}
          disabled={isDeleted || isSaved}
          className="btn btn-save"
        >
          {isSaved ? 'Saved' : 'Save'}
        </button>
        <button
          onClick={onToggleDelete}
          className={`btn ${isDeleted ? 'btn-restore' : 'btn-delete'}`}
        >
          {isDeleted ? 'Restore' : 'Delete'}
        </button>
        <button
          onClick={onEdit}
          disabled={isDeleted || isSaved}
          className="btn btn-edit"
        >
          {insight.isEditing ? 'Done' : 'Edit'}
        </button>
      </div>
    </div>
  );
}
