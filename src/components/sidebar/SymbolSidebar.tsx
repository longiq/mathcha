import { useState, useMemo } from 'react';
import { useEditorStore } from '../../store/editorStore';
import { SYMBOLS } from '../../lib/symbols/data';
import { CATEGORIES } from '../../lib/symbols/categories';
import { SymbolButton } from './SymbolButton';
import { SymbolSearch } from './SymbolSearch';

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
    <div style={{ display: 'flex', height: '100%', background: '#252526' }}>
      {/* Icon tabs column */}
      <div style={{
        width: 36,
        background: '#1e1e1e',
        borderRight: '1px solid #333',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: 4,
        gap: 1,
        flexShrink: 0,
      }}>
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => { setActiveCategory(cat.id); setSearch(''); }}
            title={cat.label}
            style={{
              width: 32,
              height: 32,
              background: activeCategory === cat.id && !search ? '#3a8ef6' : 'none',
              border: 'none',
              borderRadius: 4,
              cursor: 'pointer',
              color: activeCategory === cat.id && !search ? '#fff' : '#888',
              fontSize: 15,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 0.1s, color 0.1s',
            }}
            onMouseEnter={e => {
              if (!(activeCategory === cat.id && !search)) {
                e.currentTarget.style.background = '#333';
                e.currentTarget.style.color = '#ccc';
              }
            }}
            onMouseLeave={e => {
              if (!(activeCategory === cat.id && !search)) {
                e.currentTarget.style.background = 'none';
                e.currentTarget.style.color = '#888';
              }
            }}
          >
            {cat.icon}
          </button>
        ))}
      </div>

      {/* Symbol panel */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Category label */}
        <div style={{
          padding: '6px 8px 4px',
          fontSize: 11,
          fontWeight: 600,
          color: '#888',
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          borderBottom: '1px solid #333',
          flexShrink: 0,
        }}>
          {search ? 'Search results' : CATEGORIES.find(c => c.id === activeCategory)?.label}
        </div>

        {/* Search */}
        <SymbolSearch value={search} onChange={setSearch} />

        {/* Grid */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 4 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1 }}>
            {filtered.map(symbol => (
              <SymbolButton key={symbol.id} symbol={symbol} onClick={insertSymbol} />
            ))}
          </div>
          {filtered.length === 0 && (
            <div style={{ color: '#666', fontSize: 12, textAlign: 'center', padding: '20px 8px' }}>
              No symbols found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
