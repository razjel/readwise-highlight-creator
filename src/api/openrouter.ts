const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;

const SYSTEM_PROMPT = `You are an insight extraction specialist. Your task is to identify and distill the most valuable, thought-provoking ideas from a transcript.

Input: A full transcript of educational content (video, podcast, lecture, interview, etc.)

Your Task:
Extract 1-3 key insights that are:
- Genuinely valuable and thought-provoking
- Worth revisiting and contemplating over time
- Actionable or perspective-shifting

Output Format:
Return each insight as a standalone note (1-2 sentences max). Each note should:
- Capture ONE core concept completely
- Be self-contained and understandable without context
- Be written in a clear, memorable way suitable for daily reflection

Rules:
- Quality over quantity — only extract truly valuable insights
- If the material contains only 1-2 strong ideas, return only those
- Skip generic advice or commonly known information
- Focus on unique perspectives, counterintuitive wisdom, or powerful reframes
- Write in the same language as the transcript
- Format output as bullet points (•), not a numbered list

Output only the bullet-pointed insights, nothing else.`;

export async function generateInsights(transcript: string): Promise<string[]> {
  const response = await fetch('/api/openrouter/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
      'HTTP-Referer': window.location.origin,
      'X-Title': 'Readwise Highlight Creator'
    },
    body: JSON.stringify({
      model: 'anthropic/claude-sonnet-4.5',
      messages: [
        {
          role: 'system',
          content: SYSTEM_PROMPT
        },
        {
          role: 'user',
          content: `<transcript>\n\n${transcript}\n\n</transcript>`
        }
      ],
      max_tokens: 1024
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenRouter API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  const content = data.choices[0].message.content;

  // Parse bullet points from the response
  const insights = content
    .split('\n')
    .map((line: string) => line.trim())
    .filter((line: string) => line.startsWith('•'))
    .map((line: string) => line.replace(/^•\s*/, '').trim());

  return insights;
}
