import type { Article } from '../types';

const READWISE_TOKEN = import.meta.env.VITE_READWISE_TOKEN;

export async function fetchArticlesWithTag(tag: string): Promise<Article[]> {
  const allResults: any[] = [];
  let nextPageCursor: string | null = null;

  do {
    const params = new URLSearchParams({ withHtmlContent: 'false', tag });
    if (nextPageCursor) params.set('pageCursor', nextPageCursor);

    const response = await fetch(`/api/readwise/list?${params}`, {
      headers: {
        'Authorization': `Token ${READWISE_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Readwise API error: ${response.status}`);
    }

    const data = await response.json();
    allResults.push(...data.results);
    nextPageCursor = data.nextPageCursor ?? null;
  } while (nextPageCursor);

  return allResults.map((doc: any) => ({
    id: doc.id,
    title: doc.title || 'Untitled',
    author: doc.author || '',
    imageUrl: doc.image_url || '',
    url: doc.source_url || doc.url,
    readerUrl: doc.url,
    tags: doc.tags ? Object.keys(doc.tags) : []
  }));
}

export async function createHighlight(text: string, sourceUrl: string, title: string, author: string, imageUrl: string): Promise<void> {
  const response = await fetch('/api/readwise-v2/highlights/', {
    method: 'POST',
    headers: {
      'Authorization': `Token ${READWISE_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      highlights: [{
        text,
        title,
        author,
        image_url: imageUrl,
        source_url: sourceUrl
      }]
    })
  });

  if (!response.ok) {
    throw new Error(`Failed to create highlight: ${response.status}`);
  }
}

export async function removeTagFromDocument(docId: string, tag: string, currentTags: string[]): Promise<void> {
  const updatedTags = currentTags.filter(t => t !== tag);

  const response = await fetch(`/api/readwise/update/${docId}/`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Token ${READWISE_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      tags: updatedTags
    })
  });

  if (!response.ok) {
    throw new Error(`Failed to remove tag: ${response.status}`);
  }
}
