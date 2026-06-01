import { useMathEditor } from '../../hooks/useMathEditor';
import { useEditorStore } from '../../store/editorStore';
import { MathInlineEditor } from './MathInlineEditor';
<<<<<<< HEAD
import { GraphEditor } from './GraphEditor';

export function DocumentEditor() {
  const { containerRef, updateMathAt, updateGraphAt } = useMathEditor();
  const { mathEdit, graphEdit } = useEditorStore();
=======

export function DocumentEditor() {
  const { containerRef, updateMathAt } = useMathEditor();
  const { mathEdit } = useEditorStore();
>>>>>>> origin/main

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
<<<<<<< HEAD
      {graphEdit && <GraphEditor updateGraphAt={updateGraphAt} />}
=======
>>>>>>> origin/main
    </div>
  );
}
