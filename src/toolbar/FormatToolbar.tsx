import { useStore } from '../core/store';
import { newMathBlock, newGraphBlock, newTextBlock } from '../core/operations';
import type { Align } from '../core/types';

export function FormatToolbar() {
  const { state, dispatch } = useStore();
  const activeBlock = state.doc.blocks.find(b => b.id === state.activeid);
  const isText = activeBlock && activeBlock.type !== 'math' && activeBlock.type !== 'graph';

  function execCmd(cmd: string) {
    document.execCommand(cmd);
  }

  function setType(type: 'paragraph' | 'h1' | 'h2' | 'h3') {
    if (activeBlock && isText) {
      dispatch({ type: 'UPDATE_BLOCK', id: activeBlock.id, patch: { type } });
    }
  }

  function setAlign(align: Align) {
    if (activeBlock && isText) {
      dispatch({ type: 'UPDATE_BLOCK', id: activeBlock.id, patch: { align } });
    }
  }

  function insertMath() {
    const block = newMathBlock();
    dispatch({ type: 'INSERT_BLOCK', afterId: state.activeid, block });
  }

  function insertGraph() {
    const block = newGraphBlock();
    dispatch({ type: 'INSERT_BLOCK', afterId: state.activeid, block });
  }

  function insertText() {
    const block = newTextBlock();
    dispatch({ type: 'INSERT_BLOCK', afterId: state.activeid, block });
  }

  const btnStyle = (active = false): React.CSSProperties => ({
    padding: '4px 8px',
    fontSize: 12,
    border: active ? '1px solid #3a8ef6' : '1px solid #ddd',
    borderRadius: 4,
    background: active ? '#e8f1ff' : '#fff',
    color: active ? '#3a8ef6' : '#333',
    cursor: 'pointer',
    fontWeight: active ? 600 : 400,
    userSelect: 'none',
  });

  const sep = (
    <div style={{ width: 1, height: 20, background: '#e0e0e0', margin: '0 4px', alignSelf: 'center' }} />
  );

  const blockType = isText ? (activeBlock as any).type : 'paragraph';

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 4,
      padding: '6px 16px',
      borderBottom: '1px solid #e8e8e8',
      background: '#fff',
      flexWrap: 'wrap',
    }}>
      {/* Block type */}
      <select
        value={blockType}
        onChange={e => setType(e.target.value as any)}
        disabled={!isText}
        style={{
          fontSize: 12,
          padding: '3px 6px',
          border: '1px solid #ddd',
          borderRadius: 4,
          cursor: 'pointer',
          background: '#fff',
        }}
      >
        <option value="paragraph">Paragraph</option>
        <option value="h1">Heading 1</option>
        <option value="h2">Heading 2</option>
        <option value="h3">Heading 3</option>
      </select>

      {sep}

      {/* Text format */}
      <button
        title="Bold (Ctrl+B)"
        onMouseDown={e => { e.preventDefault(); execCmd('bold'); }}
        style={{ ...btnStyle(), fontWeight: 700 }}
      >
        B
      </button>
      <button
        title="Italic (Ctrl+I)"
        onMouseDown={e => { e.preventDefault(); execCmd('italic'); }}
        style={{ ...btnStyle(), fontStyle: 'italic' }}
      >
        I
      </button>
      <button
        title="Underline (Ctrl+U)"
        onMouseDown={e => { e.preventDefault(); execCmd('underline'); }}
        style={{ ...btnStyle(), textDecoration: 'underline' }}
      >
        U
      </button>

      {sep}

      {/* Alignment */}
      {(['left', 'center', 'right'] as Align[]).map(a => (
        <button
          key={a}
          title={`Align ${a}`}
          onMouseDown={e => { e.preventDefault(); setAlign(a); }}
          style={btnStyle(isText && (activeBlock as any).align === a)}
        >
          {a === 'left' ? '⬛⬛⬛' : a === 'center' ? '⬛⬛⬛' :  '⬛⬛⬛'}
          {/* Simple text labels */}
          {a === 'left' ? 'L' : a === 'center' ? 'C' : 'R'}
        </button>
      ))}

      {sep}

      {/* Insert blocks */}
      <button
        title="Insert math block"
        onMouseDown={e => { e.preventDefault(); insertMath(); }}
        style={btnStyle()}
      >
        ∑ Math
      </button>
      <button
        title="Insert graph"
        onMouseDown={e => { e.preventDefault(); insertGraph(); }}
        style={btnStyle()}
      >
        📈 Graph
      </button>
      <button
        title="Insert text block"
        onMouseDown={e => { e.preventDefault(); insertText(); }}
        style={btnStyle()}
      >
        + Text
      </button>

      {sep}

      {/* Symbol panel toggle */}
      <button
        title="Toggle symbol panel"
        onMouseDown={e => { e.preventDefault(); dispatch({ type: 'TOGGLE_SYMBOL_PANEL' }); }}
        style={btnStyle(state.symbolPanelOpen)}
      >
        α Symbols
      </button>
    </div>
  );
}
