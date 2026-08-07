/**
 * Takes generated notes text and returns a Mermaid code block.
 * Calls the backend /api/generate-diagram endpoint.
 */
export async function generateMermaidDiagram(notesText: string): Promise<string> {
  const response = await fetch('/api/generate-diagram', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ notesText }),
  });

  if (!response.ok) {
    let message = `Failed to generate diagram (HTTP ${response.status})`;
    try {
      const errorBody = await response.json();
      if (errorBody?.error) message = errorBody.error;
    } catch {
      // non-JSON error body
    }
    throw new Error(message);
  }

  const data = await response.json();
  if (!data.diagramCode) {
    throw new Error('Diagram generation returned no diagram code');
  }
  return data.diagramCode;
}
