import { useEffect, useRef, useCallback } from 'react';
import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { splitBlock } from 'prosemirror-commands';
import { Node } from 'prosemirror-model';
import { mathSchema, emptyDoc } from '../lib/prosemirror/schema';
import { MathNodeView, MathBlockNodeView } from '../lib/prosemirror/mathNodeView';
import { buildPlugins } from '../lib/prosemirror/plugins';
import {
  insertMathInline,
  insertMathBlock,
  updateMathNode,
  toggleMark,
  setHeading,
  setAlignment,
  toggleBulletList,
  toggleOrderedList,
  setFontSize,
} from '../lib/prosemirror/commands';
import { useDocumentStore } from '../store/documentStore';
import { useEditorStore } from '../store/editorStore';
import type { EditorApi } from '../store/editorStore';

export function useMathEditor() {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const { docJson, setDocJson } = useDocumentStore();
  const { openMathEdit, pendingSymbol, clearPendingSymbol, setEditorApi } = useEditorStore();

  useEffect(() => {
    if (!containerRef.current) return;

    let doc = emptyDoc;
    if (docJson) {
      try {
        doc = Node.fromJSON(mathSchema, docJson);
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
            openMathEdit(latex, pos);
          }),
        math_block: (node, view, getPos) =>
          new MathBlockNodeView(node, view, getPos, (latex, pos) => {
            openMathEdit(latex, pos);
          }),
      },
      dispatchTransaction(tr) {
        const newState = view.state.apply(tr);
        view.updateState(newState);
        if (tr.docChanged) {
          setDocJson(newState.doc.toJSON());
        }
      },
    });

    viewRef.current = view;

    // Build and register editor API
    const api: EditorApi = {
      execFormat: (cmd) => {
        const markMap = { bold: 'strong', italic: 'em', underline: 'underline', strike: 'strike' } as const;
        toggleMark(markMap[cmd])(view.state, view.dispatch, view);
        view.focus();
      },
      setHeadingLevel: (level) => {
        setHeading(level)(view.state, view.dispatch, view);
        view.focus();
      },
      setAlignmentCmd: (align) => {
        setAlignment(align as 'left' | 'center' | 'right')(view.state, view.dispatch, view);
        view.focus();
      },
      insertMathInlineCmd: () => {
        insertMathInline()(view.state, view.dispatch, view);
        view.focus();
      },
      insertMathBlockCmd: () => {
        insertMathBlock()(view.state, view.dispatch, view);
        view.focus();
      },
      toggleListCmd: (type) => {
        if (type === 'bullet') toggleBulletList()(view.state, view.dispatch, view);
        else toggleOrderedList()(view.state, view.dispatch, view);
        view.focus();
      },
      setFontSize: (size) => {
        setFontSize(size)(view.state, view.dispatch, view);
        view.focus();
      },
    };

    setEditorApi(api);

    // Expose automation API for testing
    (window as any).__mathcha = {
      insertInline: (latex: string) => { insertMathInline(latex)(view.state, view.dispatch, view); view.focus(); },
      insertBlock: (latex: string) => { insertMathBlock(latex)(view.state, view.dispatch, view); view.focus(); },
      setHeading: (level: number) => { setHeading(level as 0|1|2|3)(view.state, view.dispatch, view); view.focus(); },
      insertText: (text: string) => { view.dispatch(view.state.tr.insertText(text)); view.focus(); },
      pressEnter: () => { splitBlock(view.state, view.dispatch); view.focus(); },
    };

    return () => {
      view.destroy();
      viewRef.current = null;
      setEditorApi(null);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle pending symbol from symbol panel
  useEffect(() => {
    const view = viewRef.current;
    if (!view || !pendingSymbol) return;
    insertMathInline(pendingSymbol)(view.state, view.dispatch, view);
    clearPendingSymbol();
    view.focus();
  }, [pendingSymbol, clearPendingSymbol]);

  const updateMathAt = useCallback((pos: number, latex: string) => {
    const view = viewRef.current;
    if (!view) return;
    updateMathNode(pos, latex)(view.state, view.dispatch);
  }, []);

  return { containerRef, viewRef, updateMathAt };
}
