import { Bold, Italic, Underline } from 'lucide-react';
import { useEditorStore } from '../../store/editorStore';

const QUICK_MATH = [
  { label: 'x²', latex: 'x^{2}', title: 'Superscript' },
  { label: 'xₙ', latex: 'x_{n}', title: 'Subscript' },
  { label: '½', latex: '\\frac{a}{b}', title: 'Fraction' },
  { label: '√', latex: '\\sqrt{x}', title: 'Square root' },
  { label: '∑', latex: '\\sum_{i=1}^{n}', title: 'Sum' },
  { label: '∫', latex: '\\int_{a}^{b}', title: 'Integral' },
  { label: '∏', latex: '\\prod_{i=1}^{n}', title: 'Product' },
  { label: 'lim', latex: '\\lim_{x \\to 0}', title: 'Limit' },
  { label: '∂', latex: '\\frac{\\partial f}{\\partial x}', title: 'Partial derivative' },
  { label: '∞', latex: '\\infty', title: 'Infinity' },
  { label: '∇', latex: '\\nabla', title: 'Nabla' },
  { label: 'e^x', latex: 'e^{x}', title: 'Exponential' },
  { label: 'log', latex: '\\log_{b}(x)', title: 'Logarithm' },
  { label: 'sin', latex: '\\sin(x)', title: 'Sine' },
  { label: '[]', latex: '\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}', title: 'Matrix 2x2' },
];

export function FormatToolbar() {
  const { insertSymbol } = useEditorStore();

  return (
    <div style={{
      height: 36,
      background: '#2c2c2c',
      borderBottom: '1px solid #222',
      display: 'flex',
      alignItems: 'center',
      padding: '0 10px',
      gap: 2,
      flexShrink: 0,
      overflowX: 'auto',
    }}>
      <TBtn title="Bold (Ctrl+B)" onClick={() => document.execCommand('bold')}>
        <Bold size={13} />
      </TBtn>
      <TBtn title="Italic (Ctrl+I)" onClick={() => document.execCommand('italic')}>
        <Italic size={13} />
      </TBtn>
      <TBtn title="Underline (Ctrl+U)" onClick={() => document.execCommand('underline')}>
        <Underline size={13} />
      </TBtn>

      <Divider />

      {QUICK_MATH.map(m => (
        <TBtn key={m.latex} title={m.title} onClick={() => insertSymbol(m.latex)} mono>
          {m.label}
        </TBtn>
      ))}
    </div>
  );
}

function TBtn({ children, onClick, title, mono }: {
  children: React.ReactNode;
  onClick: () => void;
  title?: string;
  mono?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'none', border: 'none', borderRadius: 3,
        cursor: 'pointer', color: '#bbb',
        height: 26, minWidth: 28, padding: '0 5px',
        fontSize: mono ? 12 : 13,
        fontFamily: mono ? 'monospace' : 'inherit',
        fontWeight: 600,
        transition: 'background 0.1s, color 0.1s',
        whiteSpace: 'nowrap',
      }}
      onMouseEnter={e => { e.currentTarget.style.background = '#3a3a3a'; e.currentTarget.style.color = '#fff'; }}
      onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#bbb'; }}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <div style={{ width: 1, height: 20, background: '#444', margin: '0 4px' }} />;
}
