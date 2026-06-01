import { useState } from 'react';
import { useDocumentStore } from '../../store/documentStore';

export function TopBar() {
  const { title, setTitle, docJson } = useDocumentStore();
  const [editing, setEditing] = useState(false);

  const handleExportLatex = () => {
    if (!docJson) return;
    // Simple extraction of text from doc JSON
    const extractText = (node: any): string => {
      if (node.type === 'text') return node.text || '';
      if (node.type === 'math_inline') return `$${node.attrs?.latex || ''}$`;
      if (node.type === 'math_block') return `\\[\n${node.attrs?.latex || ''}\n\\]`;
      if (node.type === 'hard_break') return '\n';
      if (!node.content) return '\n';
      const inner = node.content.map(extractText).join('');
      if (node.type === 'heading') {
        const hashes = '#'.repeat(node.attrs?.level || 1);
        return `${hashes} ${inner}\n\n`;
      }
      if (node.type === 'paragraph') return `${inner}\n\n`;
      if (node.type === 'list_item') return `- ${inner}`;
      return inner + '\n';
    };
    const text = (docJson as any).content?.map(extractText).join('') || '';
    const latex = `\\documentclass{article}\n\\usepackage{amsmath}\n\\begin{document}\n\\title{${title}}\n\\maketitle\n\n${text}\n\\end{document}`;
    const blob = new Blob([latex], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title}.tex`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleNew = () => {
    if (!confirm('Start a new document? Unsaved changes will be lost.')) return;
    useDocumentStore.setState({ title: 'Untitled Document', docJson: null });
    window.location.reload();
  };

  return (
    <div style={{
      height: 40,
      background: '#333',
      borderBottom: '1px solid #222',
      display: 'flex',
      alignItems: 'center',
      padding: '0 12px',
      gap: 10,
      flexShrink: 0,
      userSelect: 'none',
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
        <div style={{
          width: 24, height: 24, background: '#3a8ef6', borderRadius: 4,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontWeight: 800, fontSize: 13,
        }}>M</div>
        <span style={{ color: '#e0e0e0', fontWeight: 700, fontSize: 14 }}>Mathcha</span>
      </div>

      <div style={{ width: 1, height: 18, background: '#555', flexShrink: 0 }} />

      {/* Title */}
      {editing ? (
        <input
          style={{
            background: 'transparent',
            color: '#f0f0f0',
            fontSize: 13,
            fontWeight: 500,
            border: 'none',
            borderBottom: '1px solid #3a8ef6',
            outline: 'none',
            padding: '1px 4px',
            minWidth: 120,
          }}
          value={title}
          onChange={e => setTitle(e.target.value)}
          onBlur={() => setEditing(false)}
          onKeyDown={e => { if (e.key === 'Enter') setEditing(false); }}
          autoFocus
        />
      ) : (
        <button
          onClick={() => setEditing(true)}
          title="Click to rename"
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: '#d0d0d0', fontSize: 13, fontWeight: 500, padding: '1px 4px',
          }}
          onMouseEnter={e => { e.currentTarget.style.color = '#fff'; }}
          onMouseLeave={e => { e.currentTarget.style.color = '#d0d0d0'; }}
        >
          {title}
        </button>
      )}

      {/* Right buttons */}
      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
        <TopBarBtn onClick={handleNew} title="New document">New</TopBarBtn>
        <TopBarBtn onClick={handleExportLatex} title="Export as LaTeX">Export LaTeX</TopBarBtn>
      </div>
    </div>
  );
}

function TopBarBtn({ onClick, title, children }: {
  onClick: () => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      style={{
        background: 'none', border: '1px solid #555', borderRadius: 3,
        color: '#bbb', fontSize: 12, cursor: 'pointer',
        padding: '3px 10px', transition: 'all 0.1s',
      }}
      onMouseEnter={e => { e.currentTarget.style.background = '#444'; e.currentTarget.style.color = '#fff'; }}
      onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#bbb'; }}
    >
      {children}
    </button>
  );
}
