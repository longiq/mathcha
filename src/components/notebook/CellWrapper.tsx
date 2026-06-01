import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Plus, Trash2, Type, Sigma } from 'lucide-react';
import { useNotebookStore } from '../../store/notebookStore';
import { TextCell } from './TextCell';
import { MathCell } from './MathCell';
import type { Cell, CellType } from '../../types/notebook';

interface Props {
  cell: Cell;
}

export function CellWrapper({ cell }: Props) {
  const { removeCell, addCell } = useNotebookStore();
  const [showTypeMenu, setShowTypeMenu] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: cell.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  const addCellOfType = (type: CellType) => {
    addCell(type, cell.id);
    setShowTypeMenu(false);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group relative flex gap-2 items-start py-1"
    >
      {/* Drag handle */}
      <div
        {...attributes}
        {...listeners}
        className="flex-shrink-0 w-6 mt-2 opacity-0 group-hover:opacity-100 cursor-grab active:cursor-grabbing text-gray-500 hover:text-gray-300 transition-opacity"
      >
        <GripVertical size={16} />
      </div>

      {/* Cell content */}
      <div className="flex-1 min-w-0">
        {cell.type === 'text' ? (
          <TextCell cellId={cell.id} initialContent={cell.content} />
        ) : (
          <MathCell cellId={cell.id} initialContent={cell.content} />
        )}
      </div>

      {/* Right actions */}
      <div className="flex-shrink-0 flex flex-col gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => removeCell(cell.id)}
          className="text-gray-500 hover:text-red-400 transition-colors"
          title="Delete cell"
        >
          <Trash2 size={14} />
        </button>

        <div className="relative">
          <button
            onClick={() => setShowTypeMenu(v => !v)}
            className="text-gray-500 hover:text-sky-400 transition-colors"
            title="Add cell below"
          >
            <Plus size={14} />
          </button>
          {showTypeMenu && (
            <div className="absolute right-0 mt-1 bg-gray-700 border border-gray-600 rounded shadow-lg z-10 min-w-[140px]">
              <button
                onClick={() => addCellOfType('text')}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-200 hover:bg-gray-600"
              >
                <Type size={14} /> Text Cell
              </button>
              <button
                onClick={() => addCellOfType('math')}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-200 hover:bg-gray-600"
              >
                <Sigma size={14} /> Math Block
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
