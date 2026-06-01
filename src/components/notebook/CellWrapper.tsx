import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2, Plus, Type, Sigma } from 'lucide-react';
import { useNotebookStore } from '../../store/notebookStore';
import { TextCell } from './TextCell';
import { MathCell } from './MathCell';
import type { Cell, CellType } from '../../types/notebook';

interface Props { cell: Cell }

export function CellWrapper({ cell }: Props) {
  const { removeCell, addCell } = useNotebookStore();
  const [hover, setHover] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: cell.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  const addBelow = (type: CellType) => {
    addCell(type, cell.id);
    setShowMenu(false);
  };

  return (
    <div
      ref={setNodeRef}
      style={{ ...style, position: 'relative', display: 'flex', alignItems: 'flex-start', gap: 4, marginBottom: 2 }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => { setHover(false); setShowMenu(false); }}
    >
      {/* Drag handle */}
      <div
        {...attributes}
        {...listeners}
        style={{
          width: 16, flexShrink: 0, marginTop: 8,
          opacity: hover ? 1 : 0, cursor: 'grab',
          color: '#bbb', transition: 'opacity 0.15s',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        <GripVertical size={14} />
      </div>

      {/* Cell */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {cell.type === 'text'
          ? <TextCell cellId={cell.id} initialContent={cell.content} />
          : <MathCell cellId={cell.id} initialContent={cell.content} />
        }
      </div>

      {/* Right action buttons */}
      <div style={{
        display: 'flex', flexDirection: 'column', gap: 2,
        marginTop: 6, opacity: hover ? 1 : 0, transition: 'opacity 0.15s', flexShrink: 0,
      }}>
        <IconBtn title="Delete" onClick={() => removeCell(cell.id)} danger>
          <Trash2 size={12} />
        </IconBtn>
        <div style={{ position: 'relative' }}>
          <IconBtn title="Add cell below" onClick={() => setShowMenu(v => !v)}>
            <Plus size={12} />
          </IconBtn>
          {showMenu && (
            <div style={{
              position: 'absolute', right: 0, top: '100%', marginTop: 2,
              background: '#2c2c2c', border: '1px solid #444', borderRadius: 4,
              boxShadow: '0 4px 12px rgba(0,0,0,0.4)', zIndex: 100, minWidth: 130,
            }}>
              <MenuItem icon={<Type size={12} />} label="Text" onClick={() => addBelow('text')} />
              <MenuItem icon={<Sigma size={12} />} label="Math Block" onClick={() => addBelow('math')} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function IconBtn({ children, onClick, title, danger }: {
  children: React.ReactNode; onClick: () => void; title?: string; danger?: boolean;
}) {
  return (
    <button
      onClick={onClick} title={title}
      style={{
        width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'none', border: '1px solid #ddd', borderRadius: 3, cursor: 'pointer',
        color: '#999', transition: 'all 0.1s',
      }}
      onMouseEnter={e => { e.currentTarget.style.color = danger ? '#e53e3e' : '#3a8ef6'; e.currentTarget.style.borderColor = danger ? '#e53e3e' : '#3a8ef6'; }}
      onMouseLeave={e => { e.currentTarget.style.color = '#999'; e.currentTarget.style.borderColor = '#ddd'; }}
    >
      {children}
    </button>
  );
}

function MenuItem({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 6,
        width: '100%', background: 'none', border: 'none',
        color: '#ccc', fontSize: 12, padding: '7px 10px', cursor: 'pointer', textAlign: 'left',
      }}
      onMouseEnter={e => e.currentTarget.style.background = '#3a3a3a'}
      onMouseLeave={e => e.currentTarget.style.background = 'none'}
    >
      {icon}{label}
    </button>
  );
}
