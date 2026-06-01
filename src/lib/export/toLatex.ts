import { Node } from 'prosemirror-model';
import { mathSchema } from '../prosemirror/schema';
import type { Cell } from '../../types/notebook';

function nodeToLatex(node: Node): string {
  if (node.type === mathSchema.nodes.text) {
    let text = node.text || '';
    if (node.marks.find(m => m.type === mathSchema.marks.strong)) text = `\\textbf{${text}}`;
    if (node.marks.find(m => m.type === mathSchema.marks.em)) text = `\\textit{${text}}`;
    return text;
  }
  if (node.type === mathSchema.nodes.math_inline) {
    return `$${node.attrs.latex}$`;
  }
  if (node.type === mathSchema.nodes.paragraph) {
    let content = '';
    node.forEach(child => { content += nodeToLatex(child); });
    return content + '\n\n';
  }
  if (node.type === mathSchema.nodes.doc) {
    let content = '';
    node.forEach(child => { content += nodeToLatex(child); });
    return content;
  }
  return '';
}

export function exportToLatex(title: string, cells: Cell[]): string {
  let body = '';

  for (const cell of cells) {
    if (cell.type === 'math') {
      body += `\\[\n${cell.content}\n\\]\n\n`;
    } else if (cell.type === 'text') {
      try {
        const docJson = JSON.parse(cell.content);
        const doc = Node.fromJSON(mathSchema, docJson);
        body += nodeToLatex(doc);
      } catch {
        body += cell.content + '\n\n';
      }
    }
  }

  return `\\documentclass{article}
\\usepackage{amsmath}
\\usepackage{amssymb}
\\usepackage{amsfonts}
\\title{${title}}
\\begin{document}
\\maketitle

${body}
\\end{document}`;
}
