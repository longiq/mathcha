import type { Command } from 'prosemirror-state';
import { NodeSelection, TextSelection } from 'prosemirror-state';
import { mathSchema } from './schema';
import { wrapInList, liftListItem } from 'prosemirror-schema-list';

export const insertMathInline = (latex = ''): Command => (state, dispatch) => {
  const mathNode = mathSchema.nodes.math_inline.create({ latex });
  if (dispatch) {
    dispatch(state.tr.replaceSelectionWith(mathNode));
  }
  return true;
};

export const insertMathBlock = (latex = ''): Command => (state, dispatch) => {
  const mathNode = mathSchema.nodes.math_block.create({ latex });
  if (dispatch) {
    const tr = state.tr.replaceSelectionWith(mathNode);
    dispatch(tr);
  }
  return true;
};

export const updateMathNode = (pos: number, latex: string): Command => (state, dispatch) => {
  const node = state.doc.nodeAt(pos);
  if (!node || (node.type !== mathSchema.nodes.math_inline && node.type !== mathSchema.nodes.math_block)) return false;
  if (dispatch) {
    dispatch(state.tr.setNodeMarkup(pos, undefined, { ...node.attrs, latex }));
  }
  return true;
};

export const toggleMark = (markType: 'strong' | 'em' | 'underline' | 'strike'): Command => (state, dispatch) => {
  const mark = mathSchema.marks[markType];
  const { from, to, empty } = state.selection;
  if (empty) {
    // Toggle stored mark for next input
    if (dispatch) {
      const hasMark = mark.isInSet(state.storedMarks || state.doc.resolve(from).marks());
      const tr = hasMark
        ? state.tr.removeStoredMark(mark)
        : state.tr.addStoredMark(mark.create());
      dispatch(tr);
    }
    return true;
  }
  const hasMark = state.doc.rangeHasMark(from, to, mark);
  if (dispatch) {
    const tr = state.tr;
    if (hasMark) {
      tr.removeMark(from, to, mark);
    } else {
      tr.addMark(from, to, mark.create());
    }
    dispatch(tr);
  }
  return true;
};

export const setHeading = (level: 0 | 1 | 2 | 3): Command => (state, dispatch) => {
  const { from, to } = state.selection;
  const nodeType = level === 0 ? mathSchema.nodes.paragraph : mathSchema.nodes.heading;
  const attrs = level === 0 ? { align: 'left' } : { level, align: 'left' };
  if (dispatch) {
    const tr = state.tr;
    state.doc.nodesBetween(from, to, (node, pos) => {
      if (node.type === mathSchema.nodes.paragraph || node.type === mathSchema.nodes.heading) {
        const existingAlign = node.attrs.align || 'left';
        tr.setNodeMarkup(pos, nodeType, { ...attrs, align: existingAlign });
      }
    });
    dispatch(tr);
  }
  return true;
};

export const setAlignment = (align: 'left' | 'center' | 'right'): Command => (state, dispatch) => {
  const { from, to } = state.selection;
  if (dispatch) {
    const tr = state.tr;
    state.doc.nodesBetween(from, to, (node, pos) => {
      if (node.type === mathSchema.nodes.paragraph || node.type === mathSchema.nodes.heading) {
        tr.setNodeMarkup(pos, undefined, { ...node.attrs, align });
      }
    });
    dispatch(tr);
  }
  return true;
};

export const toggleBulletList = (): Command => (state, dispatch, view) => {
  const { bullet_list, list_item } = mathSchema.nodes;
  const isList = isInList(state, 'bullet_list');
  if (isList) {
    return liftListItem(list_item)(state, dispatch, view);
  }
  return wrapInList(bullet_list)(state, dispatch, view);
};

export const toggleOrderedList = (): Command => (state, dispatch, view) => {
  const { ordered_list, list_item } = mathSchema.nodes;
  const isList = isInList(state, 'ordered_list');
  if (isList) {
    return liftListItem(list_item)(state, dispatch, view);
  }
  return wrapInList(ordered_list)(state, dispatch, view);
};

function isInList(state: Parameters<Command>[0], listType: string): boolean {
  const { from } = state.selection;
  const resolved = state.doc.resolve(from);
  for (let depth = resolved.depth; depth > 0; depth--) {
    if (resolved.node(depth).type.name === listType) return true;
  }
  return false;
}

export const setFontSize = (size: 'small' | 'normal' | 'large' | 'huge'): Command => (state, dispatch) => {
  const mark = mathSchema.marks.fontSize;
  const { from, to, empty } = state.selection;
  if (empty) return false;
  if (dispatch) {
    const tr = state.tr;
    tr.removeMark(from, to, mark);
    tr.addMark(from, to, mark.create({ size }));
    dispatch(tr);
  }
  return true;
};

<<<<<<< HEAD
export const insertGraph = (expressions: string[] = [], xMin = -6, xMax = 6, yMin = -4, yMax = 4): Command => (state, dispatch) => {
  const node = mathSchema.nodes.graph_block.create({
    expressions: JSON.stringify(expressions),
    xMin, xMax, yMin, yMax, width: 480, height: 300,
  });
  if (dispatch) dispatch(state.tr.replaceSelectionWith(node));
  return true;
};

export const updateGraphNode = (pos: number, attrs: Record<string, unknown>): Command => (state, dispatch) => {
  const node = state.doc.nodeAt(pos);
  if (!node || node.type !== mathSchema.nodes.graph_block) return false;
  if (dispatch) {
    dispatch(state.tr.setNodeMarkup(pos, undefined, { ...node.attrs, ...attrs }));
  }
  return true;
};

=======
>>>>>>> origin/main
// Re-export NodeSelection and TextSelection for use in other modules
export { NodeSelection, TextSelection };
