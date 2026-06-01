import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface DocumentStore {
  title: string;
  docJson: object | null;
  setTitle: (title: string) => void;
  setDocJson: (json: object) => void;
}

export const useDocumentStore = create<DocumentStore>()(
  persist(
    (set) => ({
      title: 'Untitled Document',
      docJson: null,
      setTitle: (title) => set({ title }),
      setDocJson: (docJson) => set({ docJson }),
    }),
    { name: 'mathcha-document' }
  )
);
