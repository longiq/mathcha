import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useNotebookStore } from '../../store/notebookStore';
import { CellWrapper } from './CellWrapper';
import { Type, Sigma } from 'lucide-react';

export function Notebook() {
  const { notebook, addCell, reorderCells } = useNotebookStore();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const fromIdx = notebook.cells.findIndex(c => c.id === active.id);
    const toIdx = notebook.cells.findIndex(c => c.id === over.id);
    if (fromIdx !== -1 && toIdx !== -1) {
      reorderCells(fromIdx, toIdx);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={notebook.cells.map(c => c.id)}
          strategy={verticalListSortingStrategy}
        >
          {notebook.cells.map(cell => (
            <CellWrapper key={cell.id} cell={cell} />
          ))}
        </SortableContext>
      </DndContext>

      {/* Add cell buttons at bottom */}
      <div className="flex gap-3 mt-6 pt-4 border-t border-gray-800">
        <button
          onClick={() => addCell('text')}
          className="flex items-center gap-2 px-3 py-2 text-sm text-gray-400 hover:text-gray-200 hover:bg-gray-800 rounded transition-colors"
        >
          <Type size={14} /> Add Text
        </button>
        <button
          onClick={() => addCell('math')}
          className="flex items-center gap-2 px-3 py-2 text-sm text-gray-400 hover:text-gray-200 hover:bg-gray-800 rounded transition-colors"
        >
          <Sigma size={14} /> Add Math Block
        </button>
      </div>
    </div>
  );
}
