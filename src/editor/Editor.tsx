import { useRef, useState, useEffect } from 'react';
import { useStore } from '../core/store';
import { TextBlockComp } from './TextBlock';
import { MathBlockComp } from './MathBlock';
import { GraphBlockComp } from './GraphBlock';
import { insertMathAtCursor } from './dom';

export function Editor() {
  const { state, dispatch } = useStore();
  const dragIdx = useRef<number | null>(null);
  const [dragOver, setDragOver] = useState<number | null>(null);
  const [focusNewId, setFocusNewId] = useState<string | null>(null);

  // When a split creates a new block, focus it at end
  useEffect(() => {
    if (state.splitNewId) {
      setFocusNewId(state.splitNewId);
      dispatch({ type: 'CLEAR_SPLIT_NEW_ID' });
    }
  }, [state.splitNewId, dispatch]);

  // Handle pending symbol insertion from SymbolPanel
  useEffect(() => {
    if (!state.pendingSymbol) return;
    const latex = state.pendingSymbol;
    dispatch({ type: 'CLEAR_PENDING_SYMBOL' });

    // Find active text block's DOM element and insert math
    if (state.activeid) {
      const el = document.querySelector<HTMLElement>(`[data-block-id="${state.activeid}"]`);
      if (el) {
        el.focus();
        insertMathAtCursor(el, latex);
      }
    }
  }, [state.pendingSymbol, state.activeid, dispatch]);

  return (
    <div
      style={{
        flex: 1,
        overflow: 'auto',
        padding: '40px 60px',
        background: '#fff',
      }}
      onClick={() => {
        if (state.activeid === null && state.doc.blocks.length > 0) {
          dispatch({ type: 'SET_ACTIVE', id: state.doc.blocks[state.doc.blocks.length - 1].id });
        }
      }}
    >
      <div style={{ maxWidth: 760, margin: '0 auto' }}>
        {state.doc.blocks.map((block, idx) => {
          const isActive = block.id === state.activeid;

          return (
            <div
              key={block.id}
              draggable
              onDragStart={() => { dragIdx.current = idx; }}
              onDragOver={e => { e.preventDefault(); setDragOver(idx); }}
              onDragLeave={() => setDragOver(null)}
              onDrop={e => {
                e.preventDefault();
                setDragOver(null);
                if (dragIdx.current !== null && dragIdx.current !== idx) {
                  dispatch({ type: 'MOVE_BLOCK', fromIdx: dragIdx.current, toIdx: idx });
                }
                dragIdx.current = null;
              }}
              onClick={e => {
                e.stopPropagation();
                dispatch({ type: 'SET_ACTIVE', id: block.id });
              }}
              style={{
                position: 'relative',
                outline: dragOver === idx ? '2px solid #3a8ef6' : 'none',
                borderRadius: 2,
              }}
            >
              {/* Drag handle */}
              <div
                title="Drag to reorder"
                style={{
                  position: 'absolute',
                  left: -24,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  opacity: isActive ? 0.5 : 0,
                  cursor: 'grab',
                  fontSize: 14,
                  color: '#aaa',
                  userSelect: 'none',
                  transition: 'opacity 0.1s',
                }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
                onMouseLeave={e => (e.currentTarget.style.opacity = isActive ? '0.5' : '0')}
              >
                ⠿
              </div>

              {block.type === 'math' ? (
                <MathBlockComp block={block} isActive={isActive} />
              ) : block.type === 'graph' ? (
                <GraphBlockComp block={block} isActive={isActive} />
              ) : (
                <TextBlockComp
                  block={block}
                  isActive={isActive}
                  onFocus={() => dispatch({ type: 'SET_ACTIVE', id: block.id })}
                  focusAtEndFlag={focusNewId === block.id}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
