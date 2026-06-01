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
    <div className="flex flex-col gap-2">
      <textarea
        className="w-full bg-gray-800 text-gray-100 border border-gray-600 rounded p-2 font-mono text-sm resize-none focus:outline-none focus:border-sky-500 min-h-[60px]"
        value={draft}
        onChange={e => handleChange(e.target.value)}
        placeholder={placeholder || 'Enter LaTeX...'}
        autoFocus={autoFocus}
        onKeyDown={e => { if (e.key === 'Escape') e.currentTarget.blur(); }}
        rows={3}
        spellCheck={false}
      />
      <div className="min-h-[40px] flex items-center justify-center bg-gray-900 rounded p-2 border border-gray-700">
        {draft ? (
          <MathRenderer latex={draft} display={display} />
        ) : (
          <span className="text-gray-500 text-sm">Preview appears here</span>
        )}
      </div>
    </div>
  );
}
