import { useEffect, useRef } from 'react';
import { useEditorStore } from '../../store/editorStore';
import { LatexInput } from './LatexInput';

interface Props {
  updateMathAt: (pos: number, latex: string) => void;
}

export function MathInlineEditor({ updateMathAt }: Props) {
  const { mathEdit, closeMathEdit } = useEditorStore();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        closeMathEdit();
      }
    };
    if (mathEdit) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [mathEdit, closeMathEdit]);

  if (!mathEdit) return null;

  return (
    <div
      ref={panelRef}
      style={{
        position: 'fixed', bottom: 16, right: 16,
        width: 300, zIndex: 9999,
        background: '#252526',
        border: '1px solid #444',
        borderRadius: 6,
        boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
        padding: 14,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: '#ccc', letterSpacing: '0.04em' }}>
          EDIT MATH
        </span>
        <button
          onClick={closeMathEdit}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: '#777', fontSize: 18, lineHeight: 1, padding: 0,
          }}
          onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
          onMouseLeave={e => (e.currentTarget.style.color = '#777')}
        >
          ×
        </button>
      </div>
      <LatexInput
        value={mathEdit.latex}
        onChange={latex => updateMathAt(mathEdit.pos, latex)}
        autoFocus
      />
    </div>
  );
}
