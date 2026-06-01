export type CellType = 'text' | 'math';

export interface Cell {
  id: string;
  type: CellType;
  content: string; // for math cells: latex string; for text cells: JSON string of ProseMirror doc
}

export interface Notebook {
  id: string;
  title: string;
  cells: Cell[];
  createdAt: number;
  updatedAt: number;
}
