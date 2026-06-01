import { create } from 'zustand';

interface MathEditState {
  cellId: string;
  latex: string;
  pos: number;
}

interface EditorStore {
  activeCellId: string | null;
  sidebarOpen: boolean;
  activeCategory: string;
  pendingSymbol: string | null;
  mathEdit: MathEditState | null;

  setActiveCell: (id: string | null) => void;
  toggleSidebar: () => void;
  setActiveCategory: (cat: string) => void;
  insertSymbol: (latex: string) => void;
  clearPendingSymbol: () => void;
  openMathEdit: (state: MathEditState) => void;
  closeMathEdit: () => void;
}

export const useEditorStore = create<EditorStore>((set) => ({
  activeCellId: null,
  sidebarOpen: true,
  activeCategory: 'greek',
  pendingSymbol: null,
  mathEdit: null,

  setActiveCell: (id) => set({ activeCellId: id }),
  toggleSidebar: () => set(s => ({ sidebarOpen: !s.sidebarOpen })),
  setActiveCategory: (cat) => set({ activeCategory: cat }),
  insertSymbol: (latex) => set({ pendingSymbol: latex }),
  clearPendingSymbol: () => set({ pendingSymbol: null }),
  openMathEdit: (state) => set({ mathEdit: state }),
  closeMathEdit: () => set({ mathEdit: null }),
}));
