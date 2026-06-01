import { useState } from 'react';
import { Download, FilePlus, PanelLeftClose, PanelLeft } from 'lucide-react';
import { useNotebookStore } from '../../store/notebookStore';
import { exportToLatex } from '../../lib/export/toLatex';
import { useEditorStore } from '../../store/editorStore';

export function TopBar() {
  const { notebook, setTitle, newNotebook } = useNotebookStore();
  const { toggleSidebar, sidebarOpen } = useEditorStore();
  const [editing, setEditing] = useState(false);

  const handleExportLatex = () => {
    const latex = exportToLatex(notebook.title, notebook.cells);
    const blob = new Blob([latex], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${notebook.title}.tex`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{
      height: 40,
      background: '#333',
      borderBottom: '1px solid #222',
      display: 'flex',
      alignItems: 'center',
      padding: '0 10px',
      gap: 8,
      flexShrink: 0,
      userSelect: 'none',
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginRight: 8 }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <rect x="2" y="2" width="20" height="20" rx="4" fill="#3a8ef6"/>
          <text x="5" y="17" fontSize="14" fontWeight="bold" fill="white" fontFamily="serif">M</text>
        </svg>
        <span style={{ color: '#fff', fontWeight: 700, fontSize: 14, letterSpacing: 0.3 }}>Mathcha</span>
      </div>

      <div style={{ width: 1, height: 18, background: '#555' }} />

      {/* Toggle sidebar */}
      <button
        onClick={toggleSidebar}
        title={sidebarOpen ? 'Hide sidebar' : 'Show sidebar'}
        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#aaa', padding: '2px 4px', display: 'flex', alignItems: 'center', borderRadius: 3 }}
        onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
        onMouseLeave={e => (e.currentTarget.style.color = '#aaa')}
      >
        {sidebarOpen ? <PanelLeftClose size={16} /> : <PanelLeft size={16} />}
      </button>

      <div style={{ width: 1, height: 18, background: '#555' }} />

      {/* Notebook title */}
      {editing ? (
        <input
          autoFocus
          value={notebook.title}
          onChange={e => setTitle(e.target.value)}
          onBlur={() => setEditing(false)}
          onKeyDown={e => { if (e.key === 'Enter' || e.key === 'Escape') setEditing(false); }}
          style={{
            background: '#444',
            border: '1px solid #3a8ef6',
            borderRadius: 3,
            color: '#fff',
            fontSize: 13,
            padding: '2px 6px',
            outline: 'none',
            width: 200,
          }}
        />
      ) : (
        <button
          onClick={() => setEditing(true)}
          title="Click to rename"
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: '#ddd', fontSize: 13, padding: '2px 4px',
            borderRadius: 3, maxWidth: 260, overflow: 'hidden',
            textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}
          onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
          onMouseLeave={e => (e.currentTarget.style.color = '#ddd')}
        >
          {notebook.title}
        </button>
      )}

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Actions */}
      <TopBarBtn icon={<FilePlus size={14} />} label="New" onClick={newNotebook} />
      <TopBarBtn icon={<Download size={14} />} label="Export LaTeX" onClick={handleExportLatex} />
    </div>
  );
}

function TopBarBtn({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 4,
        background: 'none', border: '1px solid #555', borderRadius: 3,
        color: '#ccc', fontSize: 12, padding: '3px 8px', cursor: 'pointer',
        transition: 'all 0.1s',
      }}
      onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = '#888'; }}
      onMouseLeave={e => { e.currentTarget.style.color = '#ccc'; e.currentTarget.style.borderColor = '#555'; }}
    >
      {icon}{label}
    </button>
  );
}
