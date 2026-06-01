import { useState, useEffect } from 'react';
import { MathRenderer } from '../math/MathRenderer';

interface Props {
  value: string;
  onChange: (v: string) => void;
  display?: boolean;
  placeholder?: string;
  autoFocus?: boolean;
}

export function LatexInput({ value, onChange, display = false, placeholder, autoFocus }: Props) {
  const [draft, setDraft] = useState(value);

  useEffect(() => { setDraft(value); }, [value]);

  const handleChange = (v: string) => {
    setDraft(v);
    onChange(v);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <textarea
        value={draft}
        onChange={e => handleChange(e.target.value)}
        placeholder={placeholder || 'Enter LaTeX...'}
        autoFocus={autoFocus}
        rows={3}
        spellCheck={false}
        style={{
          width: '100%', background: '#1e1e1e', color: '#e0e0e0',
          border: '1px solid #444', borderRadius: 4,
          padding: '7px 10px', fontFamily: 'monospace', fontSize: 13,
          resize: 'vertical', outline: 'none', boxSizing: 'border-box',
          minHeight: 60,
        }}
        onFocus={e => (e.currentTarget.style.borderColor = '#3a8ef6')}
        onBlur={e => (e.currentTarget.style.borderColor = '#444')}
      />
      <div style={{
        minHeight: 44, display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: '#f8f8f8', borderRadius: 4, padding: '8px 12px',
        border: '1px solid #e0e0e0', color: '#1a1a1a',
      }}>
        {draft
          ? <MathRenderer latex={draft} display={display} />
          : <span style={{ color: '#aaa', fontSize: 12, fontStyle: 'italic' }}>Preview</span>
        }
      </div>
    </div>
  );
}
