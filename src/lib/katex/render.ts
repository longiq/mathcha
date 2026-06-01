import katex from 'katex';

const cache = new Map<string, string>();

export function renderMath(latex: string, displayMode = false): string {
  const key = latex + '|' + displayMode;
  if (cache.has(key)) return cache.get(key)!;

  try {
    const result = katex.renderToString(latex, {
      throwOnError: false,
      displayMode,
      errorColor: '#ef4444',
      trust: false,
    });
    cache.set(key, result);
    return result;
  } catch (e) {
    const errHtml = `<span style="color:#ef4444;font-size:0.85em">${String(e)}</span>`;
    return errHtml;
  }
}

export function isValidLatex(latex: string): boolean {
  try {
    katex.renderToString(latex, { throwOnError: true });
    return true;
  } catch {
    return false;
  }
}
