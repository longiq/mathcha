import { Plugin } from 'prosemirror-state';
import { Decoration, DecorationSet } from 'prosemirror-view';
import { history } from 'prosemirror-history';
import { keymap } from 'prosemirror-keymap';
import { baseKeymap } from 'prosemirror-commands';
import { insertMathInline, toggleMark } from './commands';

export const placeholderPlugin = new Plugin({
  props: {
    decorations(state) {
      const isEmptyDoc =
        state.doc.childCount === 1 &&
        state.doc.firstChild?.childCount === 0;

      if (!isEmptyDoc) return null;

      return DecorationSet.create(state.doc, [
        Decoration.node(0, state.doc.content.size, {
          class: 'pm-placeholder',
          'data-placeholder': 'Type here or press $ to insert math...',
        }),
      ]);
    },
  },
});

export function buildPlugins() {
  return [
    history(),
    placeholderPlugin,
    keymap({
      ...baseKeymap,
      'Mod-b': toggleMark('strong'),
      'Mod-i': toggleMark('em'),
      'Mod-u': toggleMark('underline'),
      '$': (state, dispatch, view) => {
        insertMathInline()(state, dispatch, view);
        return true;
      },
    }),
  ];
}
