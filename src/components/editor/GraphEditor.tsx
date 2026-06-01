import { useEffect, useRef, useState, useCallback } from 'react';
import { useEditorStore } from '../../store/editorStore';
import { plotToCanvas } from '../../lib/graph/plotter';

interface Props {
  updateGraphAt: (pos: number, attrs: Record<string, unknown>) => void;
}

export function GraphEditor({ updateGraphAt }: Props) {
  const { graphEdit, closeGraphEdit } = useEditorStore();
  const panelRef = useRef<HTMLDivElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);

  const [expressionsText, setExpressionsText] = useState('');
  const [xMin, setXMin] = useState(-6);
  const [xMax, setXMax] = useState(6);
  const [yMin, setYMin] = useState(-4);
  const [yMax, setYMax] = useState(4);

  // Sync local state when graphEdit opens
  useEffect(() => {
    if (graphEdit) {
      const attrs = graphEdit.attrs;
      const exprs: string[] = attrs.expressions
        ? JSON.parse(attrs.expressions as string)
        : [];
      setExpressionsText(exprs.join('\n'));
      setXMin((attrs.xMin as number) ?? -6);
      setXMax((attrs.xMax as number) ?? 6);
      setYMin((attrs.yMin as number) ?? -4);
      setYMax((attrs.yMax as number) ?? 4);
    }
  }, [graphEdit?.pos]); // re-init when a different node is opened

  // Render preview
  const renderPreview = useCallback(() => {
    const canvas = previewCanvasRef.current;
    if (!canvas) return;
    const exprs = expressionsText.split('\n').map(s => s.trim()).filter(Boolean);
    if (exprs.length === 0) {
      const ctx = canvas.getContext('2d')!;
      ctx.fillStyle = '#fafafa';
      ctx.fillRect(0, 0, 240, 150);
      ctx.fillStyle = '#bbb';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('No expressions', 120, 75);
      return;
    }
    plotToCanvas(canvas, {
      expressions: exprs,
      xMin, xMax, yMin, yMax,
      width: 240,
      height: 150,
    });
  }, [expressionsText, xMin, xMax, yMin, yMax]);

  useEffect(() => {
    if (graphEdit) renderPreview();
  }, [graphEdit, renderPreview]);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        closeGraphEdit();
      }
    };
    if (graphEdit) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [graphEdit, closeGraphEdit]);

  if (!graphEdit) return null;

  const handleDone = () => {
    const exprs = expressionsText.split('\n').map(s => s.trim()).filter(Boolean);
    updateGraphAt(graphEdit.pos, {
      expressions: JSON.stringify(exprs),
      xMin, xMax, yMin, yMax,
    });
    closeGraphEdit();
  };

  const numInput = (
    label: string,
    value: number,
    onChange: (v: number) => void,
  ) => (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 2, fontSize: 11, color: '#aaa' }}>
      {label}
      <input
        type="number"
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        style={{
          width: 52, background: '#333', border: '1px solid #555', borderRadius: 3,
          color: '#eee', fontSize: 12, padding: '2px 4px', outline: 'none',
        }}
      />
    </label>
  );

  return (
    <div
      ref={panelRef}
      style={{
        position: 'fixed', bottom: 16, right: 16, zIndex: 50,
        width: 296, background: '#2a2a2a', border: '1px solid #555',
        borderRadius: 8, boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
        padding: 16, display: 'flex', flexDirection: 'column', gap: 10,
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: '#aaa', letterSpacing: '0.1em' }}>
          EDIT GRAPH
        </span>
        <button
          onClick={closeGraphEdit}
          style={{ background: 'none', border: 'none', color: '#666', fontSize: 18, cursor: 'pointer', lineHeight: 1 }}
        >×</button>
      </div>

      {/* Expressions textarea */}
      <div>
        <div style={{ fontSize: 11, color: '#aaa', marginBottom: 4 }}>Expressions (one per line)</div>
        <textarea
          value={expressionsText}
          onChange={e => setExpressionsText(e.target.value)}
          placeholder={'sin(x)\ncos(x)\nx^2/4'}
          rows={4}
          style={{
            width: '100%', background: '#1a1a1a', border: '1px solid #555', borderRadius: 4,
            color: '#eee', fontSize: 13, padding: '6px 8px', outline: 'none',
            resize: 'vertical', fontFamily: 'monospace', boxSizing: 'border-box',
          }}
        />
      </div>

      {/* Range inputs */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {numInput('xMin', xMin, setXMin)}
        {numInput('xMax', xMax, setXMax)}
        {numInput('yMin', yMin, setYMin)}
        {numInput('yMax', yMax, setYMax)}
      </div>

      {/* Live preview */}
      <div>
        <div style={{ fontSize: 11, color: '#aaa', marginBottom: 4 }}>Preview</div>
        <canvas
          ref={previewCanvasRef}
          width={240}
          height={150}
          style={{ borderRadius: 4, border: '1px solid #444', display: 'block' }}
        />
      </div>

      {/* Done button */}
      <button
        onClick={handleDone}
        style={{
          background: '#3a8ef6', color: '#fff', border: 'none', borderRadius: 5,
          padding: '7px 0', fontSize: 13, fontWeight: 600, cursor: 'pointer',
        }}
      >
        Done
      </button>
    </div>
  );
}
