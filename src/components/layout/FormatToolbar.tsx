import { useEditorStore } from '../../store/editorStore';

export function FormatToolbar() {
  const { editorApi } = useEditorStore();

  const btn = (
    label: string,
    title: string,
    onClick: () => void,
    mono = false,
  ) => (
    <button
      key={label + title}
      title={title}
      onMouseDown={e => {
        e.preventDefault(); // prevent blur of editor
        onClick();
      }}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'none', border: 'none', borderRadius: 3,
        cursor: 'pointer', color: '#bbb',
        height: 26, minWidth: 26, padding: '0 5px',
        fontSize: mono ? 12 : 13,
        fontFamily: mono ? 'monospace' : 'inherit',
        fontWeight: 600,
        transition: 'background 0.1s, color 0.1s',
        whiteSpace: 'nowrap',
        flexShrink: 0,
      }}
      onMouseEnter={e => { e.currentTarget.style.background = '#4a4a4a'; e.currentTarget.style.color = '#fff'; }}
      onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#bbb'; }}
    >
      {label}
    </button>
  );

  const sep = () => (
    <div key={Math.random()} style={{ width: 1, height: 20, background: '#555', margin: '0 3px', flexShrink: 0 }} />
  );

  return (
    <div style={{
      height: 36,
      background: '#3d3d3d',
      borderBottom: '1px solid #2a2a2a',
      display: 'flex',
      alignItems: 'center',
      padding: '0 8px',
      gap: 1,
      flexShrink: 0,
      overflowX: 'auto',
    }}>
      {/* Heading selector */}
      <select
        title="Paragraph style"
        onMouseDown={e => e.stopPropagation()}
        onChange={e => {
          const val = parseInt(e.target.value) as 0 | 1 | 2 | 3;
          editorApi?.setHeadingLevel(val);
        }}
        defaultValue={0}
        style={{
          background: '#2e2e2e',
          color: '#ccc',
          border: '1px solid #555',
          borderRadius: 3,
          fontSize: 12,
          height: 24,
          padding: '0 4px',
          cursor: 'pointer',
          flexShrink: 0,
          outline: 'none',
        }}
      >
        <option value={0}>Normal</option>
        <option value={1}>H1</option>
        <option value={2}>H2</option>
        <option value={3}>H3</option>
      </select>

      {sep()}

      {/* Font size */}
      {btn('A−', 'Small text', () => editorApi?.setFontSize('small'), true)}
      {btn('A', 'Normal text', () => editorApi?.setFontSize('normal'), true)}
      {btn('A+', 'Large text', () => editorApi?.setFontSize('large'), true)}

      {sep()}

      {/* Text formatting */}
      {btn('B', 'Bold (Ctrl+B)', () => editorApi?.execFormat('bold'))}
      {btn('I', 'Italic (Ctrl+I)', () => editorApi?.execFormat('italic'))}
      {btn('U', 'Underline (Ctrl+U)', () => editorApi?.execFormat('underline'))}
      {btn('S', 'Strikethrough (Ctrl+Shift+S)', () => editorApi?.execFormat('strike'))}

      {sep()}

      {/* Alignment */}
      {btn('≡L', 'Align left', () => editorApi?.setAlignmentCmd('left'))}
      {btn('≡C', 'Align center', () => editorApi?.setAlignmentCmd('center'))}
      {btn('≡R', 'Align right', () => editorApi?.setAlignmentCmd('right'))}

      {sep()}

      {/* Lists */}
      {btn('• ≡', 'Bullet list', () => editorApi?.toggleListCmd('bullet'))}
      {btn('1. ≡', 'Numbered list', () => editorApi?.toggleListCmd('ordered'))}

      {sep()}

      {/* Math */}
      {btn('∫', 'Insert inline math ($)', () => editorApi?.insertMathInlineCmd())}
      {btn('∫□', 'Insert math block', () => editorApi?.insertMathBlockCmd())}
    </div>
  );
}
