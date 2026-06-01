import { useState } from 'react';
import { useStore } from '../core/store';

export function TopBar() {
  const { state, dispatch } = useStore();
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState(state.doc.title);

  function commitTitle() {
    dispatch({ type: 'SET_TITLE', title: titleDraft.trim() || 'Untitled' });
    setEditingTitle(false);
  }

  function exportLatex() {
    const lines: string[] = [
      '\\documentclass{article}',
      '\\usepackage{amsmath}',
      '\\usepackage{amssymb}',
      '\\begin{document}',
      '',
    ];

    for (const block of state.doc.blocks) {
      if (block.type === 'math') {
        lines.push('\\[');
        lines.push(block.latex || '');
        lines.push('\\]');
        lines.push('');
      } else if (block.type === 'graph') {
        lines.push('% [Graph block]');
        lines.push('');
      } else {
        const text = block.content
          .map(n => n.kind === 'math' ? `$${n.latex}$` : n.text)
          .join('');
        if (block.type === 'h1') lines.push(`\\section{${text}}`);
        else if (block.type === 'h2') lines.push(`\\subsection{${text}}`);
        else if (block.type === 'h3') lines.push(`\\subsubsection{${text}}`);
        else lines.push(text);
        lines.push('');
      }
    }

    lines.push('\\end{document}');

    const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${state.doc.title || 'document'}.tex`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '8px 16px',
      borderBottom: '1px solid #e8e8e8',
      background: '#fff',
      height: 48,
      boxSizing: 'border-box',
    }}>
      <span style={{ fontWeight: 700, fontSize: 16, color: '#3a8ef6', letterSpacing: -0.5 }}>
        Mathcha
      </span>

      <div style={{ width: 1, height: 20, background: '#e8e8e8' }} />

      {editingTitle ? (
        <input
          autoFocus
          value={titleDraft}
          onChange={e => setTitleDraft(e.target.value)}
          onBlur={commitTitle}
          onKeyDown={e => { if (e.key === 'Enter') commitTitle(); if (e.key === 'Escape') setEditingTitle(false); }}
          style={{
            fontSize: 14,
            fontWeight: 500,
            border: 'none',
            borderBottom: '1px solid #3a8ef6',
            outline: 'none',
            padding: '2px 4px',
            color: '#333',
            background: 'transparent',
            minWidth: 200,
          }}
        />
      ) : (
        <span
          onClick={() => { setTitleDraft(state.doc.title); setEditingTitle(true); }}
          title="Click to rename"
          style={{ fontSize: 14, fontWeight: 500, color: '#333', cursor: 'text' }}
        >
          {state.doc.title}
        </span>
      )}

      <div style={{ flex: 1 }} />

      <button
        onClick={exportLatex}
        style={{
          padding: '5px 14px',
          fontSize: 12,
          border: '1px solid #ddd',
          borderRadius: 4,
          background: '#fff',
          cursor: 'pointer',
          color: '#555',
        }}
        onMouseEnter={e => (e.currentTarget.style.background = '#f5f5f5')}
        onMouseLeave={e => (e.currentTarget.style.background = '#fff')}
      >
        Export LaTeX
      </button>

      <button
        onClick={() => { if (confirm('Start a new document? Unsaved changes will be lost.')) dispatch({ type: 'NEW_DOC' }); }}
        style={{
          padding: '5px 14px',
          fontSize: 12,
          border: '1px solid #ddd',
          borderRadius: 4,
          background: '#fff',
          cursor: 'pointer',
          color: '#555',
        }}
        onMouseEnter={e => (e.currentTarget.style.background = '#f5f5f5')}
        onMouseLeave={e => (e.currentTarget.style.background = '#fff')}
      >
        New Doc
      </button>
    </div>
  );
}
