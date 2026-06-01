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

  const handleChange = (latex: string) => updateCell(cellId, latex);

  return (
    <div
      onClick={() => setActiveCell(cellId)}
      style={{
        padding: '6px 8px',
        borderRadius: 3,
        background: isActive ? 'rgba(58,142,246,0.04)' : 'transparent',
        borderLeft: isActive ? '2px solid #3a8ef6' : '2px solid transparent',
        transition: 'all 0.1s',
      }}
    >
      {editing ? (
        <div style={{ padding: '6px 0' }}>
          <LatexInput
            value={initialContent}
            onChange={handleChange}
            display
            placeholder="\int_0^\infty e^{-x^2}\,dx"
            autoFocus
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 6 }}>
            <button
              onClick={e => { e.stopPropagation(); setEditing(false); }}
              style={{
                background: '#3a8ef6', border: 'none', borderRadius: 3,
                color: '#fff', fontSize: 12, padding: '4px 12px', cursor: 'pointer',
              }}
            >
              Done
            </button>
          </div>
        </div>
      ) : (
        <div
          onDoubleClick={() => setEditing(true)}
          style={{
            padding: '10px 0', display: 'flex', justifyContent: 'center',
            cursor: 'default', position: 'relative',
            minHeight: 40, alignItems: 'center',
          }}
        >
          {initialContent ? (
            <MathRenderer latex={initialContent} display />
          ) : (
            <span style={{ color: '#bbb', fontStyle: 'italic', fontSize: 13 }}>
              Double-click to edit math block
            </span>
          )}
          {isActive && (
            <span style={{
              position: 'absolute', right: 4, top: 4,
              fontSize: 11, color: '#aaa', background: '#f0f0f0',
              padding: '1px 5px', borderRadius: 2,
            }}>
              double-click to edit
            </span>
          )}
        </div>
      )}
    </div>
  );
}
