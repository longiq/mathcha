import { Schema } from 'prosemirror-model';

export const mathSchema = new Schema({
  nodes: {
    doc: { content: 'block+' },
    paragraph: {
      content: 'inline*',
      group: 'block',
      parseDOM: [{ tag: 'p' }],
      toDOM() { return ['p', 0] as const; },
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
  },
});

export const emptyDoc = mathSchema.node('doc', null, [
  mathSchema.node('paragraph', null, []),
]);
