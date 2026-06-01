import React, { createContext, useContext, useReducer } from 'react';
import type { Doc, Block, Inline } from './types';
import * as ops from './operations';

// State
interface State {
  doc: Doc;
  activeid: string | null;
  symbolPanelOpen: boolean;
  mathEdit: { id: string; field: 'latex'; value: string } | null;
  graphEdit: { id: string } | null;
  pendingSymbol: string | null;
  splitNewId: string | null; // id of the block just created by a split (so Editor can focus it)
}

// Actions
type Action =
  | { type: 'SET_TITLE'; title: string }
  | { type: 'INSERT_BLOCK'; afterId: string | null; block: Block }
  | { type: 'DELETE_BLOCK'; id: string }
  | { type: 'UPDATE_BLOCK'; id: string; patch: Partial<Block> }
  | { type: 'MOVE_BLOCK'; fromIdx: number; toIdx: number }
  | { type: 'SPLIT_BLOCK'; id: string; before: Inline[]; after: Inline[] }
  | { type: 'MERGE_BLOCK'; id: string }
  | { type: 'SET_ACTIVE'; id: string | null }
  | { type: 'TOGGLE_SYMBOL_PANEL' }
  | { type: 'INSERT_SYMBOL'; latex: string }
  | { type: 'CLEAR_PENDING_SYMBOL' }
  | { type: 'OPEN_MATH_EDIT'; id: string; value: string }
  | { type: 'CLOSE_MATH_EDIT' }
  | { type: 'OPEN_GRAPH_EDIT'; id: string }
  | { type: 'CLOSE_GRAPH_EDIT' }
  | { type: 'LOAD_DOC'; doc: Doc }
  | { type: 'NEW_DOC' }
  | { type: 'CLEAR_SPLIT_NEW_ID' };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_TITLE':
      return { ...state, doc: { ...state.doc, title: action.title } };

    case 'INSERT_BLOCK':
      return {
        ...state,
        doc: ops.insertBlock(state.doc, action.afterId, action.block),
        activeid: action.block.id,
        splitNewId: null,
      };

    case 'DELETE_BLOCK': {
      const idx = state.doc.blocks.findIndex(b => b.id === action.id);
      const newDoc = ops.deleteBlock(state.doc, action.id);
      // Focus previous block (or first)
      const newActiveid = newDoc.blocks[Math.max(0, idx - 1)]?.id ?? null;
      return { ...state, doc: newDoc, activeid: newActiveid, splitNewId: null };
    }

    case 'UPDATE_BLOCK':
      return { ...state, doc: ops.updateBlock(state.doc, action.id, action.patch) };

    case 'MOVE_BLOCK':
      return { ...state, doc: ops.moveBlock(state.doc, action.fromIdx, action.toIdx) };

    case 'SPLIT_BLOCK': {
      const result = ops.splitBlock(state.doc, action.id, action.before, action.after);
      // splitBlock embeds newBlock id as _splitNewId side-channel
      const newId = (result as any)._splitNewId as string | undefined;
      const cleanDoc = { ...result, _splitNewId: undefined } as Doc;
      return { ...state, doc: cleanDoc, activeid: newId ?? state.activeid, splitNewId: newId ?? null };
    }

    case 'MERGE_BLOCK': {
      const result = ops.mergeBlockIntoPrev(state.doc, action.id);
      if (!result) return state;
      return { ...state, doc: result.doc, activeid: result.prevId, splitNewId: null };
    }

    case 'SET_ACTIVE':
      return { ...state, activeid: action.id, splitNewId: null };

    case 'TOGGLE_SYMBOL_PANEL':
      return { ...state, symbolPanelOpen: !state.symbolPanelOpen };

    case 'INSERT_SYMBOL':
      return { ...state, pendingSymbol: action.latex };

    case 'CLEAR_PENDING_SYMBOL':
      return { ...state, pendingSymbol: null };

    case 'OPEN_MATH_EDIT':
      return { ...state, mathEdit: { id: action.id, field: 'latex', value: action.value } };

    case 'CLOSE_MATH_EDIT':
      return { ...state, mathEdit: null };

    case 'OPEN_GRAPH_EDIT':
      return { ...state, graphEdit: { id: action.id } };

    case 'CLOSE_GRAPH_EDIT':
      return { ...state, graphEdit: null };

    case 'LOAD_DOC':
      return { ...state, doc: action.doc, activeid: null, splitNewId: null };

    case 'NEW_DOC':
      return {
        ...state,
        doc: ops.createDoc(),
        activeid: null,
        mathEdit: null,
        graphEdit: null,
        splitNewId: null,
      };

    case 'CLEAR_SPLIT_NEW_ID':
      return { ...state, splitNewId: null };

    default:
      return state;
  }
}

// Context
const StoreCtx = createContext<{ state: State; dispatch: React.Dispatch<Action> } | null>(null);

function initState(): State {
  try {
    const saved = localStorage.getItem('mathcha-doc');
    if (saved) {
      const doc = JSON.parse(saved);
      return {
        doc,
        activeid: null,
        symbolPanelOpen: false,
        mathEdit: null,
        graphEdit: null,
        pendingSymbol: null,
        splitNewId: null,
      };
    }
  } catch {
    // ignore parse errors
  }
  return {
    doc: ops.createDoc(),
    activeid: null,
    symbolPanelOpen: false,
    mathEdit: null,
    graphEdit: null,
    pendingSymbol: null,
    splitNewId: null,
  };
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, initState);

  React.useEffect(() => {
    localStorage.setItem('mathcha-doc', JSON.stringify(state.doc));
  }, [state.doc]);

  return <StoreCtx.Provider value={{ state, dispatch }}>{children}</StoreCtx.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreCtx);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}
