import { useState, useMemo } from 'react';
import { useEditorStore } from '../../store/editorStore';
import { SYMBOLS } from '../../lib/symbols/data';
import { CATEGORIES } from '../../lib/symbols/categories';
import { SymbolButton } from './SymbolButton';

export function SymbolSidebar() {
  const { activeCategory, setActiveCategory, insertSymbol } = useEditorStore();
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (search.trim()) {
      const q = search.toLowerCase();
      return SYMBOLS.filter(s =>
        s.label.toLowerCase().includes(q) ||
        s.latex.toLowerCase().includes(q) ||
        s.keywords.some(k => k.includes(q))
      );
    }
    return SYMBOLS.filter(s => s.category === activeCategory);
  }, [search, activeCategory]);

  return (
    <div style={{
      width: 190,
      flexShrink: 0,
      background: '#252526',
      borderRight: '1px solid #1e1e1e',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      overflow: 'hidden',
    }}>
      {/* Category tabs - horizontal scrollable row */}
      {!search && (
        <div style={{
          display: 'flex',
          overflowX: 'auto',
          borderBottom: '1px solid #1e1e1e',
          flexShrink: 0,
          scrollbarWidth: 'none',
        }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              title={cat.label}
              style={{
                flexShrink: 0,
                padding: '6px 10px',
                background: activeCategory === cat.id ? '#37373d' : 'none',
                border: 'none',
                borderBottom: activeCategory === cat.id ? '2px solid #3a8ef6' : '2px solid transparent',
                color: activeCategory === cat.id ? '#e0e0e0' : '#888',
                fontSize: 14,
                cursor: 'pointer',
                transition: 'background 0.1s, color 0.1s',
              }}
            >
              {cat.icon}
            </button>
          ))}
        </div>
      )}

      {/* Search */}
      <div style={{ padding: '6px 8px', borderBottom: '1px solid #1e1e1e', flexShrink: 0 }}>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search symbols..."
          style={{
            width: '100%',
            background: '#3c3c3c',
            border: '1px solid #555',
            borderRadius: 3,
            color: '#ccc',
            fontSize: 12,
            padding: '4px 7px',
            outline: 'none',
            boxSizing: 'border-box',
          }}
        />
      </div>

      {/* Symbol grid */}
      <div style={{ flex: 1, overflowY: 'auto', padding: 4 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2 }}>
          {filtered.map(symbol => (
            <SymbolButton
              key={symbol.id}
              symbol={symbol}
              onClick={insertSymbol}
            />
          ))}
        </div>
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', color: '#666', fontSize: 12, padding: '16px 0' }}>
            No symbols found
          </div>
        )}
      </div>
    </div>
  );
}
