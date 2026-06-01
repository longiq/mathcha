import { useState } from 'react';
import { MathRenderer } from '../math/MathRenderer';
import { useStore } from '../core/store';
import type { MathBlock } from '../core/types';

export function MathBlockComp({ block, isActive }: { block: MathBlock; isActive: boolean }) {
  const { dispatch } = useStore();
  const [editing, setEditing] = useState(!block.latex);
  const [draft, setDraft] = useState(block.latex);

  const commit = () => {
    dispatch({ type: 'UPDATE_BLOCK', id: block.id, patch: { latex: draft } });
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <textarea
            autoFocus
            value={draft}
            onChange={e => {
              setDraft(e.target.value);
              dispatch({ type: 'UPDATE_BLOCK', id: block.id, patch: { latex: e.target.value } });
            }}
            onKeyDown={e => {
              if (e.key === 'Escape') commit();
            }}
            placeholder="\int_0^\infty e^{-x^2}\,dx"
            rows={3}
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
          <div
            style={{
              minHeight: 44,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#f8f8f8',
              borderRadius: 4,
              padding: '8px 12px',
              border: '1px solid #e0e0e0',
            }}
          >
            {draft ? (
              <MathRenderer latex={draft} display />
            ) : (
              <span style={{ color: '#aaa', fontSize: 12, fontStyle: 'italic' }}>Preview</span>
            )}
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
                padding: '4px 12px',
                cursor: 'pointer',
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
            padding: '12px 0',
            display: 'flex',
            justifyContent: 'center',
            cursor: 'default',
            position: 'relative',
            minHeight: 40,
            alignItems: 'center',
          }}
        >
          {block.latex ? (
            <MathRenderer latex={block.latex} display />
          ) : (
            <span style={{ color: '#bbb', fontStyle: 'italic', fontSize: 13 }}>
              Double-click to edit math block
            </span>
          )}
          {isActive && (
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
