import { Node as ProseMirrorNode } from 'prosemirror-model';
import type { NodeView } from 'prosemirror-view';
import { EditorView } from 'prosemirror-view';
import { renderMath } from '../katex/render';

export class MathNodeView implements NodeView {
  dom: HTMLElement;
  private node: ProseMirrorNode;
  private onEdit: (latex: string, pos: number) => void;

  constructor(
    node: ProseMirrorNode,
    _view: EditorView,
    getPos: () => number | undefined,
    onEdit: (latex: string, pos: number) => void
  ) {
    this.node = node;
    this.onEdit = onEdit;

    this.dom = document.createElement('span');
    this.dom.className = 'math-node';
    this.dom.contentEditable = 'false';
    this.render();

    this.dom.addEventListener('click', (e) => {
      e.preventDefault();
      const pos = getPos();
      if (pos !== undefined) {
        this.onEdit(this.node.attrs.latex, pos);
      }
    });
  }

  private render() {
    const latex = this.node.attrs.latex || '';
    if (!latex) {
      this.dom.innerHTML = '<span style="color:#6c7086;font-style:italic;font-size:12px">click to edit</span>';
    } else {
      this.dom.innerHTML = renderMath(latex, false);
    }
  }

  update(node: ProseMirrorNode): boolean {
    if (node.type !== this.node.type) return false;
    this.node = node;
    this.render();
    return true;
  }

  stopEvent() { return true; }
  ignoreMutation() { return true; }
}

export class MathBlockNodeView implements NodeView {
  dom: HTMLElement;
  private node: ProseMirrorNode;
  private onEdit: (latex: string, pos: number) => void;

  constructor(
    node: ProseMirrorNode,
    _view: EditorView,
    getPos: () => number | undefined,
    onEdit: (latex: string, pos: number) => void
  ) {
    this.node = node;
    this.onEdit = onEdit;

    this.dom = document.createElement('div');
    this.dom.className = 'math-block-node';
    this.dom.contentEditable = 'false';
    this.render(node.attrs.latex);

    this.dom.addEventListener('click', () => {
      const pos = getPos();
      if (pos !== undefined) {
        this.onEdit(this.node.attrs.latex, pos);
      }
    });
  }

  private render(latex: string) {
    if (!latex) {
      this.dom.innerHTML = '<span style="color:#aaa;font-style:italic;font-size:13px">Click to edit math block</span>';
    } else {
      this.dom.innerHTML = renderMath(latex, true);
    }
  }

  update(node: ProseMirrorNode): boolean {
    if (node.type !== this.node.type) return false;
    this.node = node;
    this.render(node.attrs.latex);
    return true;
  }

  stopEvent() { return true; }
  ignoreMutation() { return true; }
}
