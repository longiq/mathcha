import { create } from 'zustand';

export interface EditorApi {
  execFormat: (cmd: 'bold' | 'italic' | 'underline' | 'strike') => void;
  setHeadingLevel: (level: 0 | 1 | 2 | 3) => void;
  setAlignmentCmd: (align: 'left' | 'center' | 'right') => void;
  insertMathInlineCmd: () => void;
  insertMathBlockCmd: () => void;
  toggleListCmd: (type: 'bullet' | 'ordered') => void;
  setFontSize: (size: 'small' | 'normal' | 'large' | 'huge') => void;
}

interface EditorStore {
  activeTool: 'select' | 'text' | 'math' | 'draw' | 'image' | 'table';
  symbolPanelOpen: boolean;
  activeCategory: string;
  pendingSymbol: string | null;
  mathEdit: { latex: string; pos: number } | null;
  editorApi: EditorApi | null;

  setActiveTool: (tool: 'select' | 'text' | 'math' | 'draw' | 'image' | 'table') => void;
  toggleSymbolPanel: () => void;
  setActiveCategory: (cat: string) => void;
  insertSymbol: (latex: string) => void;
  clearPendingSymbol: () => void;
  openMathEdit: (latex: string, pos: number) => void;
  closeMathEdit: () => void;
  setEditorApi: (api: EditorApi | null) => void;
}

export const useEditorStore = create<EditorStore>((set) => ({
  activeTool: 'text',
  symbolPanelOpen: false,
  activeCategory: 'greek',
  pendingSymbol: null,
  mathEdit: null,
  editorApi: null,

  setActiveTool: (tool) => set((s) => ({
    activeTool: tool,
    symbolPanelOpen: tool === 'math' ? !s.symbolPanelOpen : s.symbolPanelOpen,
  })),
  toggleSymbolPanel: () => set((s) => ({ symbolPanelOpen: !s.symbolPanelOpen })),
  setActiveCategory: (cat) => set({ activeCategory: cat }),
  insertSymbol: (latex) => set({ pendingSymbol: latex }),
  clearPendingSymbol: () => set({ pendingSymbol: null }),
  openMathEdit: (latex, pos) => set({ mathEdit: { latex, pos } }),
  closeMathEdit: () => set({ mathEdit: null }),
  setEditorApi: (api) => set({ editorApi: api }),
}));
