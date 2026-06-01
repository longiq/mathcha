import { useState, useRef, useEffect } from 'react';
import { plotToCanvas } from '../graph/plotter';
import { useStore } from '../core/store';
import type { GraphBlock } from '../core/types';

export function GraphBlockComp({ block, isActive }: { block: GraphBlock; isActive: boolean }) {
  const { dispatch } = useStore();
  const [editing, setEditing] = useState(block.expressions.length === 0);
  const [exprText, setExprText] = useState(block.expressions.join('\n'));
  const [xMin, setXMin] = useState(block.xMin);
  const [xMax, setXMax] = useState(block.xMax);
  const [yMin, setYMin] = useState(block.yMin);
  const [yMax, setYMax] = useState(block.yMax);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const previewRef = useRef<HTMLCanvasElement>(null);

  // Render main canvas
  useEffect(() => {
    if (!canvasRef.current || editing) return;
    plotToCanvas(canvasRef.current, {
      expressions: block.expressions,
      xMin: block.xMin,
      xMax: block.xMax,
      yMin: block.yMin,
      yMax: block.yMax,
      width: block.width,
      height: block.height,
    });
  }, [block, editing]);

  // Render preview in editor
  useEffect(() => {
    if (!previewRef.current || !editing) return;
    const exprs = exprText.split('\n').map(s => s.trim()).filter(Boolean);
    plotToCanvas(previewRef.current, {
      expressions: exprs,
      xMin,
      xMax,
      yMin,
      yMax,
      width: 280,
      height: 180,
    });
  }, [exprText, xMin, xMax, yMin, yMax, editing]);

  const commit = () => {
    const exprs = exprText.split('\n').map(s => s.trim()).filter(Boolean);
    dispatch({
      type: 'UPDATE_BLOCK',
      id: block.id,
      patch: { expressions: exprs, xMin, xMax, yMin, yMax },
    });
    setEditing(false);
  };

  return (
    <div
      style={{
        padding: '8px 4px',
        borderLeft: isActive ? '2px solid #3a8ef6' : '2px solid transparent',
        borderRadius: 2,
        transition: 'border-color 0.1s',
      }}
      onClick={() => dispatch({ type: 'SET_ACTIVE', id: block.id })}
    >
      {editing ? (
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 220px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            <label style={{ color: '#555', fontSize: 12, fontWeight: 600 }}>
              Functions (one per line)
            </label>
            <textarea
              autoFocus
              value={exprText}
              onChange={e => setExprText(e.target.value)}
              rows={5}
              placeholder={'sin(x)\ncos(x)\nx^2/4'}
              spellCheck={false}
              style={{
                width: '100%',
                background: '#1e1e1e',
                color: '#e0e0e0',
                border: '1px solid #444',
                borderRadius: 4,
                padding: '7px 10px',
                fontFamily: 'monospace',
                fontSize: 13,
                resize: 'vertical',
                outline: 'none',
                boxSizing: 'border-box',
              }}
              onFocus={e => (e.currentTarget.style.borderColor = '#3a8ef6')}
              onBlur={e => (e.currentTarget.style.borderColor = '#444')}
            />
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', fontSize: 12 }}>
              {(
                [
                  ['xMin', xMin, setXMin],
                  ['xMax', xMax, setXMax],
                  ['yMin', yMin, setYMin],
                  ['yMax', yMax, setYMax],
                ] as [string, number, (v: number) => void][]
              ).map(([lbl, val, setVal]) => (
                <label
                  key={lbl}
                  style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#555' }}
                >
                  {lbl}:{' '}
                  <input
                    type="number"
                    value={val}
                    onChange={e => setVal(Number(e.target.value))}
                    style={{
                      width: 52,
                      padding: '2px 4px',
                      border: '1px solid #ccc',
                      borderRadius: 3,
                      fontSize: 12,
                      textAlign: 'center',
                    }}
                  />
                </label>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={commit}
                style={{
                  background: '#3a8ef6',
                  border: 'none',
                  borderRadius: 3,
                  color: '#fff',
                  fontSize: 12,
                  padding: '4px 14px',
                  cursor: 'pointer',
                }}
              >
                Done
              </button>
            </div>
          </div>
          <div>
            <label
              style={{
                color: '#555',
                fontSize: 12,
                fontWeight: 600,
                display: 'block',
                marginBottom: 4,
              }}
            >
              Preview
            </label>
            <canvas
              ref={previewRef}
              width={280}
              height={180}
              style={{ border: '1px solid #ddd', borderRadius: 4, display: 'block' }}
            />
          </div>
        </div>
      ) : (
        <div
          onDoubleClick={() => setEditing(true)}
          style={{
            display: 'flex',
            justifyContent: 'center',
            padding: '6px 0',
            cursor: 'default',
            position: 'relative',
          }}
        >
          {block.expressions.length > 0 ? (
            <canvas
              ref={canvasRef}
              width={block.width}
              height={block.height}
              style={{ border: '1px solid #e0e0e0', borderRadius: 4 }}
            />
          ) : (
            <div
              style={{
                width: 480,
                height: 300,
                border: '1px dashed #ccc',
                borderRadius: 4,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#aaa',
                fontSize: 13,
                cursor: 'pointer',
              }}
              onDoubleClick={() => setEditing(true)}
            >
              Double-click to add a graph
            </div>
          )}
          {isActive && block.expressions.length > 0 && (
            <span
              style={{
                position: 'absolute',
                right: 4,
                top: 2,
                fontSize: 11,
                color: '#aaa',
                background: '#f0f0f0',
                padding: '1px 5px',
                borderRadius: 2,
              }}
            >
              double-click to edit
            </span>
          )}
        </div>
      )}
    </div>
  );
}
