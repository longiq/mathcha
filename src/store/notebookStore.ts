import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CellType, Notebook } from '../types/notebook';

const newId = () => Math.random().toString(36).slice(2);

const defaultNotebook = (): Notebook => ({
  id: newId(),
  title: 'Untitled Notebook',
  cells: [
    { id: newId(), type: 'text', content: '' },
  ],
  createdAt: Date.now(),
  updatedAt: Date.now(),
});

interface NotebookStore {
  notebook: Notebook;
  setTitle: (title: string) => void;
  addCell: (type: CellType, afterId?: string) => string;
  removeCell: (id: string) => void;
  updateCell: (id: string, content: string) => void;
  reorderCells: (from: number, to: number) => void;
  newNotebook: () => void;
}

export const useNotebookStore = create<NotebookStore>()(
  persist(
    (set) => ({
      notebook: defaultNotebook(),

      setTitle: (title) => set(s => ({
        notebook: { ...s.notebook, title, updatedAt: Date.now() },
      })),

      addCell: (type, afterId) => {
        const id = newId();
        set(s => {
          const cells = [...s.notebook.cells];
          const idx = afterId ? cells.findIndex(c => c.id === afterId) : cells.length - 1;
          cells.splice(idx + 1, 0, { id, type, content: '' });
          return { notebook: { ...s.notebook, cells, updatedAt: Date.now() } };
        });
        return id;
      },

      removeCell: (id) => set(s => {
        const cells = s.notebook.cells.filter(c => c.id !== id);
        if (cells.length === 0) cells.push({ id: newId(), type: 'text', content: '' });
        return { notebook: { ...s.notebook, cells, updatedAt: Date.now() } };
      }),

      updateCell: (id, content) => set(s => ({
        notebook: {
          ...s.notebook,
          cells: s.notebook.cells.map(c => c.id === id ? { ...c, content } : c),
          updatedAt: Date.now(),
        },
      })),

      reorderCells: (from, to) => set(s => {
        const cells = [...s.notebook.cells];
        const [moved] = cells.splice(from, 1);
        cells.splice(to, 0, moved);
        return { notebook: { ...s.notebook, cells, updatedAt: Date.now() } };
      }),

      newNotebook: () => set({ notebook: defaultNotebook() }),
    }),
    {
      name: 'mathcha-notebook',
    }
  )
);
