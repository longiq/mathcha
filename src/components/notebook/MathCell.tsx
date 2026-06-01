import { useState } from 'react';
import { useNotebookStore } from '../../store/notebookStore';
import { useEditorStore } from '../../store/editorStore';
import { LatexInput } from '../editor/LatexInput';
import { MathRenderer } from '../math/MathRenderer';

interface Props {
  cellId: string;
  initialContent: string;
}

export function MathCell({ cellId, initialContent }: Props) {
  const [editing, setEditing] = useState(!initialContent);
  const updateCell = useNotebookStore(s => s.updateCell);
  const { setActiveCell, activeCellId } = useEditorStore();
  const isActive = activeCellId === cellId;

  const handleChange = (latex: string) => {
    updateCell(cellId, latex);
  };

  return (
    <div
      className={`px-4 py-2 rounded transition-colors ${isActive ? 'bg-gray-800/50' : 'hover:bg-gray-800/20'}`}
      onClick={() => setActiveCell(cellId)}
    >
      {editing ? (
        <div className="py-2">
          <LatexInput
            value={initialContent}
            onChange={handleChange}
            display
            placeholder="Enter display math (e.g. \int_0^\infty e^{-x^2}\,dx)"
            autoFocus
          />
          <div className="flex justify-end mt-2">
            <button
              onClick={() => setEditing(false)}
              className="text-sm px-3 py-1 bg-sky-600 hover:bg-sky-500 text-white rounded"
            >
              Done
            </button>
          </div>
        </div>
      ) : (
        <div
          className="py-3 flex justify-center cursor-pointer group relative"
          onDoubleClick={() => setEditing(true)}
        >
          {initialContent ? (
            <MathRenderer latex={initialContent} display />
          ) : (
            <span className="text-gray-500 italic">Double-click to edit math block</span>
          )}
          <span className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 text-xs text-gray-500">
            double-click to edit
          </span>
        </div>
      )}
    </div>
  );
}
