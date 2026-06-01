import { Schema } from 'prosemirror-model';

export const mathSchema = new Schema({
  nodes: {
    doc: { content: 'block+' },

    paragraph: {
      attrs: { align: { default: 'left' } },
      content: 'inline*',
      group: 'block',
      parseDOM: [{ tag: 'p', getAttrs(dom) {
        const el = dom as HTMLElement;
        return { align: el.style.textAlign || 'left' };
      }}],
      toDOM(node) {
        return ['p', { style: `text-align:${node.attrs.align}` }, 0] as const;
      },
    },

    heading: {
      attrs: { level: { default: 1 }, align: { default: 'left' } },
      content: 'inline*',
      group: 'block',
      defining: true,
      parseDOM: [
        { tag: 'h1', getAttrs(dom) { return { level: 1, align: (dom as HTMLElement).style.textAlign || 'left' }; } },
        { tag: 'h2', getAttrs(dom) { return { level: 2, align: (dom as HTMLElement).style.textAlign || 'left' }; } },
        { tag: 'h3', getAttrs(dom) { return { level: 3, align: (dom as HTMLElement).style.textAlign || 'left' }; } },
      ],
      toDOM(node) {
        const sizes: Record<number, string> = { 1: '2em', 2: '1.5em', 3: '1.2em' };
        return [`h${node.attrs.level}`, {
          style: `font-size:${sizes[node.attrs.level]};font-weight:bold;text-align:${node.attrs.align}`
        }, 0] as const;
      },
    },

    math_block: {
      attrs: { latex: { default: '' } },
      group: 'block',
      atom: true,
      parseDOM: [{ tag: 'div[data-math-block]', getAttrs(dom) {
        return { latex: (dom as HTMLElement).getAttribute('data-math-block') || '' };
      }}],
      toDOM(node) {
        return ['div', { 'data-math-block': node.attrs.latex, class: 'math-block-node' }] as const;
      },
    },

<<<<<<< HEAD
    graph_block: {
      attrs: {
        expressions: { default: '[]' },
        xMin: { default: -6 },
        xMax: { default: 6 },
        yMin: { default: -4 },
        yMax: { default: 4 },
        width: { default: 480 },
        height: { default: 300 },
      },
      group: 'block',
      atom: true,
      parseDOM: [{ tag: 'div[data-graph]', getAttrs(dom) {
        const el = dom as HTMLElement;
        return {
          expressions: el.getAttribute('data-graph') || '[]',
          xMin: Number(el.getAttribute('data-xmin') ?? -6),
          xMax: Number(el.getAttribute('data-xmax') ?? 6),
          yMin: Number(el.getAttribute('data-ymin') ?? -4),
          yMax: Number(el.getAttribute('data-ymax') ?? 4),
          width: Number(el.getAttribute('data-w') ?? 480),
          height: Number(el.getAttribute('data-h') ?? 300),
        };
      }}],
      toDOM(node) {
        return ['div', {
          'data-graph': node.attrs.expressions,
          'data-xmin': node.attrs.xMin,
          'data-xmax': node.attrs.xMax,
          'data-ymin': node.attrs.yMin,
          'data-ymax': node.attrs.yMax,
          'data-w': node.attrs.width,
          'data-h': node.attrs.height,
          class: 'graph-block-node',
        }] as const;
      },
    },

=======
>>>>>>> origin/main
    bullet_list: {
      content: 'list_item+',
      group: 'block',
      parseDOM: [{ tag: 'ul' }],
      toDOM() { return ['ul', 0] as const; },
    },

    ordered_list: {
      content: 'list_item+',
      group: 'block',
      attrs: { order: { default: 1 } },
      parseDOM: [{ tag: 'ol', getAttrs(dom) {
        return { order: (dom as HTMLOListElement).start || 1 };
      }}],
      toDOM(node) {
        return ['ol', { start: node.attrs.order }, 0] as const;
      },
    },

    list_item: {
      content: 'paragraph block*',
      parseDOM: [{ tag: 'li' }],
      toDOM() { return ['li', 0] as const; },
      defining: true,
    },

    text: { group: 'inline' },

    math_inline: {
      attrs: { latex: { default: '' } },
      inline: true,
      atom: true,
      group: 'inline',
      parseDOM: [{ tag: 'span[data-math]', getAttrs(dom) {
        return { latex: (dom as HTMLElement).getAttribute('data-math') || '' };
      }}],
      toDOM(node) {
        return ['span', { 'data-math': node.attrs.latex, class: 'math-node' }, ''] as const;
      },
    },

    hard_break: {
      inline: true,
      group: 'inline',
      selectable: false,
      parseDOM: [{ tag: 'br' }],
      toDOM() { return ['br'] as const; },
    },
  },

  marks: {
    strong: {
      parseDOM: [{ tag: 'b' }, { tag: 'strong' }],
      toDOM() { return ['strong', 0] as const; },
    },
    em: {
      parseDOM: [{ tag: 'i' }, { tag: 'em' }],
      toDOM() { return ['em', 0] as const; },
    },
    underline: {
      parseDOM: [{ tag: 'u' }],
      toDOM() { return ['u', 0] as const; },
    },
    strike: {
      parseDOM: [{ tag: 's' }, { tag: 'strike' }, { tag: 'del' }],
      toDOM() { return ['s', 0] as const; },
    },
    textColor: {
      attrs: { color: {} },
      parseDOM: [{ tag: 'span[data-color]', getAttrs(dom) {
        return { color: (dom as HTMLElement).getAttribute('data-color') };
      }}],
      toDOM(mark) {
        return ['span', { 'data-color': mark.attrs.color, style: `color:${mark.attrs.color}` }, 0] as const;
      },
    },
    fontSize: {
      attrs: { size: { default: 'normal' } },
      parseDOM: [{ tag: 'span[data-font-size]', getAttrs(dom) {
        return { size: (dom as HTMLElement).getAttribute('data-font-size') };
      }}],
      toDOM(mark) {
        const sizes: Record<string, string> = { small: '0.8em', normal: '1em', large: '1.25em', huge: '1.6em' };
        return ['span', {
          'data-font-size': mark.attrs.size,
          style: `font-size:${sizes[mark.attrs.size] || '1em'}`
        }, 0] as const;
      },
    },
  },
});

export const emptyDoc = mathSchema.node('doc', null, [
  mathSchema.node('paragraph', null, []),
]);
