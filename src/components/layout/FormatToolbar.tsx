import { Bold, Italic, Underline, Strikethrough, AlignLeft, AlignCenter, AlignRight, List, ListOrdered } from 'lucide-react';
import { useEditorStore } from '../../store/editorStore';

export function FormatToolbar() {
  const api = useEditorStore(s => s.editorApi);

  const call = (fn: () => void) => (e: React.MouseEvent) => {
    e.preventDefault(); // don't blur editor
    fn();
  };

  return (
    <div style={{
      height: 36, background: '#3d3d3d', borderBottom: '1px solid #2a2a2a',
      display: 'flex', alignItems: 'center', padding: '0 8px', gap: 1,
      flexShrink: 0, overflowX: 'auto', userSelect: 'none',
    }}>
      {/* Heading dropdown */}
      <select
        defaultValue="0"
        onChange={e => { api?.setHeadingLevel(Number(e.target.value) as 0|1|2|3); }}
        onMouseDown={e => e.stopPropagation()}
        style={{
          background: '#505050', color: '#ddd', border: '1px solid #666',
          borderRadius: 3, fontSize: 12, padding: '2px 4px', height: 24,
          cursor: 'pointer', outline: 'none', marginRight: 2,
        }}
      >
        <option value="0">Normal</option>
        <option value="1">Heading 1</option>
        <option value="2">Heading 2</option>
        <option value="3">Heading 3</option>
      </select>

      <Sep />

      {/* Font size */}
      <TBtn title="Small text"    onMouseDown={call(() => api?.setFontSize('small'))}>A<sup style={{fontSize:8}}>−</sup></TBtn>
      <TBtn title="Normal text"   onMouseDown={call(() => api?.setFontSize('normal'))}>A</TBtn>
      <TBtn title="Large text"    onMouseDown={call(() => api?.setFontSize('large'))}>A<sup style={{fontSize:8}}>+</sup></TBtn>

      <Sep />

      {/* Text format */}
      <TBtn title="Bold (Ctrl+B)"        onMouseDown={call(() => api?.execFormat('bold'))}><Bold size={13}/></TBtn>
      <TBtn title="Italic (Ctrl+I)"      onMouseDown={call(() => api?.execFormat('italic'))}><Italic size={13}/></TBtn>
      <TBtn title="Underline (Ctrl+U)"   onMouseDown={call(() => api?.execFormat('underline'))}><Underline size={13}/></TBtn>
      <TBtn title="Strikethrough"        onMouseDown={call(() => api?.execFormat('strike'))}><Strikethrough size={13}/></TBtn>

      <Sep />

      {/* Alignment */}
      <TBtn title="Align left"    onMouseDown={call(() => api?.setAlignmentCmd('left'))}><AlignLeft size={13}/></TBtn>
      <TBtn title="Align center"  onMouseDown={call(() => api?.setAlignmentCmd('center'))}><AlignCenter size={13}/></TBtn>
      <TBtn title="Align right"   onMouseDown={call(() => api?.setAlignmentCmd('right'))}><AlignRight size={13}/></TBtn>

      <Sep />

      {/* Lists */}
      <TBtn title="Bullet list"   onMouseDown={call(() => api?.toggleListCmd('bullet'))}><List size={13}/></TBtn>
      <TBtn title="Ordered list"  onMouseDown={call(() => api?.toggleListCmd('ordered'))}><ListOrdered size={13}/></TBtn>

      <Sep />

      {/* Math insert */}
      <TBtn title="Insert inline math" onMouseDown={call(() => api?.insertMathInlineCmd())} mono>∫<sub style={{fontSize:8}}>x</sub></TBtn>
      <TBtn title="Insert math block"  onMouseDown={call(() => api?.insertMathBlockCmd())} mono>∫<sub style={{fontSize:8}}>□</sub></TBtn>
    </div>
  );
}

function TBtn({ children, onMouseDown, title, mono }: {
  children: React.ReactNode; onMouseDown: (e: React.MouseEvent) => void;
  title?: string; mono?: boolean;
}) {
  return (
    <button
      onMouseDown={onMouseDown} title={title}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'none', border: 'none', borderRadius: 3,
        cursor: 'pointer', color: '#ccc', height: 26, minWidth: 26, padding: '0 4px',
        fontSize: mono ? 13 : 13, fontFamily: mono ? 'serif' : 'inherit',
        fontWeight: 500, transition: 'background 0.1s, color 0.1s',
      }}
      onMouseEnter={e => { e.currentTarget.style.background = '#555'; e.currentTarget.style.color = '#fff'; }}
      onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#ccc'; }}
    >
      {children}
    </button>
  );
}

function Sep() {
  return <div style={{ width: 1, height: 18, background: '#555', margin: '0 3px', flexShrink: 0 }} />;
}
