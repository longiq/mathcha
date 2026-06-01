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
      className={`relative px-2 py-1 rounded transition-colors ${isActive ? 'bg-gray-800/50' : 'hover:bg-gray-800/20'}`}
      onClick={focus}
    >
      <div
        ref={containerRef}
        className="min-h-[1.8em] text-gray-100 leading-relaxed"
      />
      {isActive && mathEdit && mathEdit.cellId === cellId && (
        <MathInlineEditor updateMathAt={updateMathAt} />
      )}
    </div>
  );
}
