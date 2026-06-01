import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useNotebookStore } from '../../store/notebookStore';
import { CellWrapper } from './CellWrapper';

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
    if (fromIdx !== -1 && toIdx !== -1) reorderCells(fromIdx, toIdx);
  };

  return (
    <div style={{ padding: '32px 48px 60px', minHeight: 600, background: '#fff' }}>
      {/* Notebook title */}
      <NotebookTitle />

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={notebook.cells.map(c => c.id)} strategy={verticalListSortingStrategy}>
          {notebook.cells.map(cell => (
            <CellWrapper key={cell.id} cell={cell} />
          ))}
        </SortableContext>
      </DndContext>

      {/* Click-to-add at bottom */}
      <div
        style={{ marginTop: 16, paddingTop: 12, borderTop: '1px dashed #e0e0e0',
          display: 'flex', gap: 8 }}
      >
        <AddBtn label="+ Text" onClick={() => addCell('text')} />
        <AddBtn label="+ Math Block" onClick={() => addCell('math')} />
      </div>
    </div>
  );
}

function NotebookTitle() {
  const { notebook, setTitle } = useNotebookStore();
  return (
    <input
      value={notebook.title}
      onChange={e => setTitle(e.target.value)}
      placeholder="Notebook title..."
      style={{
        display: 'block',
        width: '100%',
        border: 'none',
        outline: 'none',
        fontSize: 26,
        fontWeight: 700,
        color: '#1a1a1a',
        marginBottom: 20,
        padding: 0,
        background: 'transparent',
        borderBottom: '2px solid transparent',
        transition: 'border-color 0.15s',
      }}
      onFocus={e => (e.currentTarget.style.borderBottomColor = '#3a8ef6')}
      onBlur={e => (e.currentTarget.style.borderBottomColor = 'transparent')}
    />
  );
}

function AddBtn({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: 'none', border: '1px dashed #ccc', borderRadius: 4,
        color: '#999', fontSize: 12, padding: '4px 12px', cursor: 'pointer',
        transition: 'all 0.1s',
      }}
      onMouseEnter={e => { e.currentTarget.style.color = '#3a8ef6'; e.currentTarget.style.borderColor = '#3a8ef6'; }}
      onMouseLeave={e => { e.currentTarget.style.color = '#999'; e.currentTarget.style.borderColor = '#ccc'; }}
    >
      {label}
    </button>
  );
}
