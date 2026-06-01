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
      className="fixed z-50 bottom-4 right-4 w-80 bg-gray-800 border border-gray-600 rounded-lg shadow-2xl p-4"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-gray-300">Edit Math</span>
        <button
          onClick={closeMathEdit}
          className="text-gray-500 hover:text-gray-200 text-lg leading-none"
        >×</button>
      </div>
      <LatexInput
        value={mathEdit.latex}
        onChange={latex => updateMathAt(mathEdit.pos, latex)}
        autoFocus
      />
    </div>
  );
}
