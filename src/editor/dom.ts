import type { Inline, TextMark } from '../core/types';
import { renderMath } from '../math/adapter';

// Escape HTML special chars
function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// Convert InlineNode[] to an HTML string for innerHTML
export function inlinesToHtml(inlines: Inline[]): string {
  return inlines.map(n => {
    if (n.kind === 'math') {
      const rendered = renderMath(n.latex);
      const safe = n.latex.replace(/"/g, '&quot;');
      return `<span class="math-inline" contenteditable="false" data-latex="${safe}">${rendered}</span>`;
    }
    let html = esc(n.text);
    if (!html) return '';
    const m = n.marks;
    if (m.bold) html = `<strong>${html}</strong>`;
    if (m.italic) html = `<em>${html}</em>`;
    if (m.underline) html = `<u>${html}</u>`;
    if (m.strike) html = `<s>${html}</s>`;
    return html;
  }).join('');
}

// Convert a contenteditable div's innerHTML back to InlineNode[]
export function htmlToInlines(el: HTMLElement): Inline[] {
  const result: Inline[] = [];
  function walk(node: ChildNode, marks: TextMark) {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent || '';
      if (text) result.push({ kind: 'text', text, marks: { ...marks } });
      return;
    }
    if (!(node instanceof HTMLElement)) return;
    // Math node
    if (node.classList.contains('math-inline')) {
      result.push({ kind: 'math', latex: node.dataset.latex || '' });
      return;
    }
    // Mark nodes
    const tag = node.tagName.toLowerCase();
    const newMarks = { ...marks };
    if (tag === 'strong' || tag === 'b') newMarks.bold = true;
    if (tag === 'em' || tag === 'i') newMarks.italic = true;
    if (tag === 'u') newMarks.underline = true;
    if (tag === 's' || tag === 'strike') newMarks.strike = true;
    node.childNodes.forEach(child => walk(child, newMarks));
  }
  el.childNodes.forEach(child => walk(child, {}));
  return result;
}

// Get character offset of cursor from start of element
export function getCursorOffset(el: HTMLElement): number {
  const sel = window.getSelection();
  if (!sel || !sel.rangeCount) return 0;
  const range = sel.getRangeAt(0);
  let count = 0;
  const iter = document.createNodeIterator(el, NodeFilter.SHOW_ALL);
  let n: Node | null;
  while ((n = iter.nextNode())) {
    if (n === range.startContainer) {
      count += range.startOffset;
      break;
    }
    if (n.nodeType === Node.TEXT_NODE) count += (n.textContent || '').length;
    else if (n instanceof HTMLElement && n.classList.contains('math-inline')) count += 1;
  }
  return count;
}

// Is cursor at the very start of element?
export function isAtStart(el: HTMLElement): boolean {
  return getCursorOffset(el) === 0;
}

// Split inlines at given text-character offset (math nodes count as 1)
export function splitInlines(inlines: Inline[], offset: number): [Inline[], Inline[]] {
  const before: Inline[] = [];
  const after: Inline[] = [];
  let pos = 0;
  for (const node of inlines) {
    const len = node.kind === 'math' ? 1 : node.text.length;
    if (pos + len <= offset) {
      before.push(node);
    } else if (pos >= offset) {
      after.push(node);
    } else {
      // Split inside a text node
      if (node.kind === 'text') {
        const cut = offset - pos;
        if (cut > 0) before.push({ ...node, text: node.text.slice(0, cut) });
        if (cut < node.text.length) after.push({ ...node, text: node.text.slice(cut) });
      }
    }
    pos += len;
  }
  return [before, after];
}

// Focus element and place cursor at end
export function focusAtEnd(el: HTMLElement) {
  el.focus();
  const sel = window.getSelection();
  if (!sel) return;
  const range = document.createRange();
  range.selectNodeContents(el);
  range.collapse(false);
  sel.removeAllRanges();
  sel.addRange(range);
}

// Insert a math inline span at current cursor position in a contenteditable
export function insertMathAtCursor(el: HTMLElement, latex: string): void {
  const rendered = renderMath(latex);
  const span = document.createElement('span');
  span.className = 'math-inline';
  span.contentEditable = 'false';
  span.dataset.latex = latex;
  span.innerHTML = rendered;

  const sel = window.getSelection();
  if (sel && sel.rangeCount) {
    const range = sel.getRangeAt(0);
    range.deleteContents();
    range.insertNode(span);
    range.setStartAfter(span);
    range.setEndAfter(span);
    sel.removeAllRanges();
    sel.addRange(range);
  } else {
    el.appendChild(span);
  }
}
