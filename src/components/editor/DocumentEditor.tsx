import { useMathEditor } from '../../hooks/useMathEditor';
import { useEditorStore } from '../../store/editorStore';
import { MathInlineEditor } from './MathInlineEditor';

export function DocumentEditor() {
  const { containerRef, updateMathAt } = useMathEditor();
  const { mathEdit } = useEditorStore();

  return (
    <div style={{
      background: '#fff',
      maxWidth: 820,
      margin: '32px auto 80px',
      minHeight: 'calc(100vh - 120px)',
      padding: '48px 56px',
      boxShadow: '0 2px 20px rgba(0,0,0,0.35)',
      borderRadius: 2,
      position: 'relative',
    }}>
      <div
        ref={containerRef}
        style={{ outline: 'none', color: '#1a1a1a', fontSize: 15, lineHeight: 1.8 }}
      />
      {mathEdit && <MathInlineEditor updateMathAt={updateMathAt} />}
    </div>
  );
}
