import { useState } from 'react';
import { Download, FilePlus, BookOpen, PanelLeft } from 'lucide-react';
import { useNotebookStore } from '../../store/notebookStore';
import { exportToLatex } from '../../lib/export/toLatex';
import { useEditorStore } from '../../store/editorStore';

export function TopBar() {
  const { notebook, setTitle, newNotebook } = useNotebookStore();
  const { toggleSidebar } = useEditorStore();
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
    <div className="flex items-center gap-3 px-4 h-12 bg-gray-900 border-b border-gray-700 flex-shrink-0">
      <button
        onClick={toggleSidebar}
        className="text-gray-400 hover:text-gray-200 transition-colors"
        title="Toggle sidebar"
      >
        <PanelLeft size={18} />
      </button>

      <div className="flex items-center gap-2">
        <BookOpen size={18} className="text-sky-400" />
        <span className="text-sky-400 font-bold text-sm">Mathcha</span>
      </div>

      <div className="w-px h-5 bg-gray-700" />

      {editing ? (
        <input
          className="bg-transparent text-gray-100 text-sm font-medium border-b border-sky-500 outline-none px-1"
          value={notebook.title}
          onChange={e => setTitle(e.target.value)}
          onBlur={() => setEditing(false)}
          onKeyDown={e => { if (e.key === 'Enter') setEditing(false); }}
          autoFocus
        />
      ) : (
        <button
          className="text-gray-200 text-sm font-medium hover:text-white transition-colors"
          onClick={() => setEditing(true)}
          title="Click to rename"
        >
          {notebook.title}
        </button>
      )}

      <div className="ml-auto flex items-center gap-2">
        <button
          onClick={newNotebook}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-400 hover:text-gray-200 hover:bg-gray-800 rounded transition-colors"
          title="New notebook"
        >
          <FilePlus size={14} /> New
        </button>
        <button
          onClick={handleExportLatex}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-400 hover:text-gray-200 hover:bg-gray-800 rounded transition-colors"
          title="Export as LaTeX"
        >
          <Download size={14} /> Export LaTeX
        </button>
      </div>
    </div>
  );
}
