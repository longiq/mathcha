import type { Command } from 'prosemirror-state';
import { mathSchema } from './schema';

export const insertMathInline = (latex = ''): Command => (state, dispatch) => {
  const mathNode = mathSchema.nodes.math_inline.create({ latex });
  if (dispatch) {
    dispatch(state.tr.replaceSelectionWith(mathNode));
  }
  return true;
};

export const updateMathNode = (pos: number, latex: string): Command => (state, dispatch) => {
  const node = state.doc.nodeAt(pos);
  if (!node || node.type !== mathSchema.nodes.math_inline) return false;
  if (dispatch) {
    dispatch(state.tr.setNodeMarkup(pos, undefined, { latex }));
  }
  return true;
};

export const toggleMark = (markType: 'strong' | 'em' | 'underline'): Command => (state, dispatch) => {
  const mark = mathSchema.marks[markType];
  const { from, to, empty } = state.selection;
  if (empty) return false;
  const hasMark = state.doc.rangeHasMark(from, to, mark);
  if (dispatch) {
    if (hasMark) {
      dispatch(state.tr.removeMark(from, to, mark));
    } else {
      dispatch(state.tr.addMark(from, to, mark.create()));
    }
  }
  return true;
};
