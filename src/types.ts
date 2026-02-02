export interface Article {
  id: string;
  title: string;
  author: string;
  imageUrl: string;
  url: string;
  readerUrl: string;
  tags: string[];
}

export interface Insight {
  id: string;
  text: string;
  status: 'pending' | 'saved' | 'deleted';
  isEditing: boolean;
}

export interface ArticleState {
  article: Article;
  transcript: string;
  insights: Insight[];
  isProcessing: boolean;
  isComplete: boolean;
}
