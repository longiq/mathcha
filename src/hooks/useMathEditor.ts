import { useEffect, useRef, useCallback } from 'react';
import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { Node } from 'prosemirror-model';
import { mathSchema, emptyDoc } from '../lib/prosemirror/schema';
import { MathNodeView } from '../lib/prosemirror/mathNodeView';
import { buildPlugins } from '../lib/prosemirror/plugins';
import { insertMathInline, updateMathNode } from '../lib/prosemirror/commands';
import { useNotebookStore } from '../store/notebookStore';
import { useEditorStore } from '../store/editorStore';

export function useMathEditor(cellId: string, initialContent: string) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const updateCell = useNotebookStore(s => s.updateCell);
  const { openMathEdit, setActiveCell, pendingSymbol, clearPendingSymbol } = useEditorStore();

  useEffect(() => {
    if (!containerRef.current) return;

    let doc = emptyDoc;
    if (initialContent) {
      try {
        doc = Node.fromJSON(mathSchema, JSON.parse(initialContent));
      } catch {
        // keep empty doc
      }
    }

    const state = EditorState.create({
      doc,
      plugins: buildPlugins(),
    });

    const view = new EditorView(containerRef.current, {
      state,
      nodeViews: {
        math_inline: (node, view, getPos) =>
          new MathNodeView(node, view, getPos, (latex, pos) => {
            openMathEdit({ cellId, latex, pos });
          }),
      },
      dispatchTransaction(tr) {
        const newState = view.state.apply(tr);
        view.updateState(newState);
        if (tr.docChanged) {
          updateCell(cellId, JSON.stringify(newState.doc.toJSON()));
        }
      },
    });

    viewRef.current = view;

    return () => {
      view.destroy();
      viewRef.current = null;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cellId]);

  useEffect(() => {
    const view = viewRef.current;
    if (!view || !pendingSymbol) return;
    if (useEditorStore.getState().activeCellId !== cellId) return;

    insertMathInline(pendingSymbol)(view.state, view.dispatch, view);
    clearPendingSymbol();
    view.focus();
  }, [pendingSymbol, cellId, clearPendingSymbol]);

  const updateMathAt = useCallback((pos: number, latex: string) => {
    const view = viewRef.current;
    if (!view) return;
    updateMathNode(pos, latex)(view.state, view.dispatch);
  }, []);

  const focus = useCallback(() => {
    setActiveCell(cellId);
    viewRef.current?.focus();
  }, [cellId, setActiveCell]);

  return { containerRef, updateMathAt, focus, viewRef };
}
