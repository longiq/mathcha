// Thin wrapper around KaTeX. To swap to MathJax or another renderer,
// only this file needs to change.
import katex from 'katex';

const cache = new Map<string, string>();

export function renderMath(latex: string, display = false): string {
  const key = latex + '|' + display;
  if (cache.has(key)) return cache.get(key)!;
  try {
    const html = katex.renderToString(latex || '\\square', {
      throwOnError: false,
      displayMode: display,
      errorColor: '#e53e3e',
    });
    cache.set(key, html);
    return html;
  } catch {
    return `<span style="color:#e53e3e;font-style:italic">${latex}</span>`;
  }
}
