import { Plugin } from 'prosemirror-state';
import { Decoration, DecorationSet } from 'prosemirror-view';
import { history, undo, redo } from 'prosemirror-history';
import { keymap } from 'prosemirror-keymap';
import { baseKeymap } from 'prosemirror-commands';
import { inputRules, textblockTypeInputRule, wrappingInputRule } from 'prosemirror-inputrules';
import {
  insertMathInline,
  toggleMark,
  setHeading,
  toggleBulletList,
  toggleOrderedList,
} from './commands';
import { mathSchema } from './schema';

export const placeholderPlugin = new Plugin({
  props: {
    decorations(state) {
      const isEmptyDoc =
        state.doc.childCount === 1 &&
        state.doc.firstChild?.childCount === 0 &&
        state.doc.firstChild?.type === mathSchema.nodes.paragraph;

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

function buildInputRules() {
  return inputRules({
    rules: [
      // ### → h3 (must come before ## and #)
      textblockTypeInputRule(/^###\s$/, mathSchema.nodes.heading, () => ({ level: 3 })),
      // ## → h2
      textblockTypeInputRule(/^##\s$/, mathSchema.nodes.heading, () => ({ level: 2 })),
      // # → h1
      textblockTypeInputRule(/^#\s$/, mathSchema.nodes.heading, () => ({ level: 1 })),
      // * → bullet list
      wrappingInputRule(/^\*\s$/, mathSchema.nodes.bullet_list),
      // 1. → ordered list
      wrappingInputRule(/^1\.\s$/, mathSchema.nodes.ordered_list),
    ],
  });
}

export function buildPlugins() {
  return [
    history(),
    buildInputRules(),
    placeholderPlugin,
    keymap({
      ...baseKeymap,
      'Mod-b': toggleMark('strong'),
      'Mod-i': toggleMark('em'),
      'Mod-u': toggleMark('underline'),
      'Mod-Shift-s': toggleMark('strike'),
      'Mod-Alt-1': setHeading(1),
      'Mod-Alt-2': setHeading(2),
      'Mod-Alt-3': setHeading(3),
      'Mod-Shift-0': setHeading(0),
      '$': (state, dispatch, view) => {
        insertMathInline()(state, dispatch, view);
        return true;
      },
      'Mod-z': undo,
      'Mod-y': redo,
      'Mod-Shift-z': redo,
      'Mod-Shift-l': toggleBulletList(),
      'Mod-Shift-o': toggleOrderedList(),
    }),
  ];
}
