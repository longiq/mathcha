import type { NodeView, EditorView } from 'prosemirror-view';
import type { Node as ProseMirrorNode } from 'prosemirror-model';
import { plotToCanvas } from '../graph/plotter';

export class GraphNodeView implements NodeView {
  dom: HTMLElement;
  private canvas: HTMLCanvasElement;
  private node: ProseMirrorNode;
  private onEdit: (attrs: Record<string, unknown>, pos: number) => void;

  constructor(
    node: ProseMirrorNode,
    _view: EditorView,
    getPos: () => number | undefined,
    onEdit: (attrs: Record<string, unknown>, pos: number) => void
  ) {
    this.node = node;
    this.onEdit = onEdit;

    this.dom = document.createElement('div');
    this.dom.className = 'graph-block-node';
    this.dom.style.cssText = 'text-align:center; padding:12px 0; cursor:pointer; user-select:none;';
    this.dom.contentEditable = 'false';

    this.canvas = document.createElement('canvas');
    this.canvas.style.cssText = 'border:1px solid #e0e0e0; border-radius:4px; display:inline-block;';
    this.dom.appendChild(this.canvas);

    this.render();

    this.dom.addEventListener('click', () => {
      const pos = getPos();
      if (pos !== undefined) this.onEdit(this.node.attrs, pos);
    });
  }

  render() {
    const attrs = this.node.attrs;
    const w = attrs.width || 480;
    const h = attrs.height || 300;
    this.canvas.width = w;
    this.canvas.height = h;

    const expressions = attrs.expressions ? JSON.parse(attrs.expressions) : [];
    if (expressions.length === 0) {
      const ctx = this.canvas.getContext('2d')!;
      ctx.fillStyle = '#fafafa';
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = '#ddd';
      ctx.strokeRect(0.5, 0.5, w - 1, h - 1);
      ctx.fillStyle = '#bbb';
      ctx.font = '14px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Click to add a graph', w / 2, h / 2);
      return;
    }

    plotToCanvas(this.canvas, {
      expressions,
      xMin: attrs.xMin ?? -6,
      xMax: attrs.xMax ?? 6,
      yMin: attrs.yMin ?? -4,
      yMax: attrs.yMax ?? 4,
      width: w,
      height: h,
    });
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
