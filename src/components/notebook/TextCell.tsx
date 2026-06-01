import { useMathEditor } from '../../hooks/useMathEditor';
import { useEditorStore } from '../../store/editorStore';
import { MathInlineEditor } from '../editor/MathInlineEditor';

interface Props {
  cellId: string;
  initialContent: string;
}

export function TextCell({ cellId, initialContent }: Props) {
  const { containerRef, updateMathAt, focus } = useMathEditor(cellId, initialContent);
  const { activeCellId, mathEdit } = useEditorStore();
  const isActive = activeCellId === cellId;

  return (
    <div
      onClick={focus}
      style={{
        position: 'relative',
        padding: '4px 6px',
        borderRadius: 3,
        background: isActive ? 'rgba(58,142,246,0.04)' : 'transparent',
        borderLeft: isActive ? '2px solid #3a8ef6' : '2px solid transparent',
        cursor: 'text',
        transition: 'all 0.1s',
      }}
    >
      <div
        ref={containerRef}
        style={{ minHeight: '1.8em', lineHeight: 1.8, color: '#1a1a1a' }}
      />
      {isActive && mathEdit && mathEdit.cellId === cellId && (
        <MathInlineEditor updateMathAt={updateMathAt} />
      )}
    </div>
  );
}
