import { useEditorStore } from '../../store/editorStore';

type Tool = 'select' | 'text' | 'math' | 'draw' | 'image' | 'table';

const TOOLS: { id: Tool; icon: string; label: string }[] = [
  { id: 'select', icon: '↖', label: 'Select' },
  { id: 'text', icon: 'T', label: 'Text' },
  { id: 'math', icon: '∑', label: 'Math (opens symbol panel)' },
  { id: 'draw', icon: '✏', label: 'Draw (coming soon)' },
  { id: 'table', icon: '⊞', label: 'Table' },
];

export function ToolSidebar() {
  const { activeTool, setActiveTool } = useEditorStore();

  const handleClick = (tool: Tool) => {
    if (tool === 'draw') return;
    setActiveTool(tool);
  };

  return (
    <div style={{
      width: 40,
      flexShrink: 0,
      background: '#2c2c2c',
      borderRight: '1px solid #1e1e1e',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      paddingTop: 8,
      gap: 2,
    }}>
      {TOOLS.map(tool => {
        const isActive = activeTool === tool.id;
        return (
          <button
            key={tool.id}
            title={tool.label}
            onClick={() => handleClick(tool.id)}
            style={{
              width: 32,
              height: 32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: isActive ? '#3a8ef6' : 'none',
              border: 'none',
              borderRadius: 4,
              cursor: tool.id === 'draw' ? 'not-allowed' : 'pointer',
              color: isActive ? '#fff' : '#999',
              fontSize: tool.id === 'text' ? 14 : 16,
              fontWeight: 700,
              transition: 'background 0.1s, color 0.1s',
              opacity: tool.id === 'draw' ? 0.4 : 1,
            }}
            onMouseEnter={e => {
              if (tool.id === 'draw' || isActive) return;
              e.currentTarget.style.background = '#3a3a3a';
              e.currentTarget.style.color = '#ddd';
            }}
            onMouseLeave={e => {
              if (tool.id === 'draw' || isActive) return;
              e.currentTarget.style.background = 'none';
              e.currentTarget.style.color = '#999';
            }}
          >
            {tool.icon}
          </button>
        );
      })}
    </div>
  );
}
