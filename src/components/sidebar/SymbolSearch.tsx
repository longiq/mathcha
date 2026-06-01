interface Props {
  value: string;
  onChange: (v: string) => void;
}

export function SymbolSearch({ value, onChange }: Props) {
  return (
    <div style={{ padding: '5px 6px', flexShrink: 0, borderBottom: '1px solid #333' }}>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="Search..."
        style={{
          width: '100%', background: '#1e1e1e',
          border: '1px solid #444', borderRadius: 3,
          color: '#ccc', fontSize: 12, padding: '4px 7px',
          outline: 'none', boxSizing: 'border-box',
        }}
        onFocus={e => (e.currentTarget.style.borderColor = '#3a8ef6')}
        onBlur={e => (e.currentTarget.style.borderColor = '#444')}
      />
    </div>
  );
}
