import { useState } from 'react';
import { SYMBOLS } from '../lib/symbols/data';
import { CATEGORIES } from '../lib/symbols/categories';
import { useStore } from '../core/store';

export function SymbolPanel() {
  const { dispatch } = useStore();
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0].id);
  const [search, setSearch] = useState('');

  const filtered = search.trim()
    ? SYMBOLS.filter(s =>
        s.keywords?.some(k => k.includes(search.toLowerCase())) ||
        s.label.includes(search.toLowerCase()) ||
        s.latex.toLowerCase().includes(search.toLowerCase())
      )
    : SYMBOLS.filter(s => s.category === activeCategory);

  function insert(latex: string) {
    dispatch({ type: 'INSERT_SYMBOL', latex });
  }

  return (
    <div style={{
      width: 260,
      borderLeft: '1px solid #e8e8e8',
      background: '#fafafa',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      overflow: 'hidden',
    }}>
      <div style={{ padding: '8px 10px', borderBottom: '1px solid #e8e8e8' }}>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search symbols..."
          style={{
            width: '100%',
            padding: '5px 8px',
            fontSize: 12,
            border: '1px solid #ddd',
            borderRadius: 4,
            outline: 'none',
            boxSizing: 'border-box',
          }}
        />
      </div>

      {!search && (
        <div style={{
          display: 'flex',
          gap: 4,
          padding: '6px 8px',
          flexWrap: 'wrap',
          borderBottom: '1px solid #e8e8e8',
        }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              title={cat.label}
              style={{
                padding: '2px 8px',
                fontSize: 12,
                border: activeCategory === cat.id ? '1px solid #3a8ef6' : '1px solid #ddd',
                borderRadius: 12,
                background: activeCategory === cat.id ? '#e8f1ff' : '#fff',
                color: activeCategory === cat.id ? '#3a8ef6' : '#555',
                cursor: 'pointer',
              }}
            >
              {cat.icon} {cat.label}
            </button>
          ))}
        </div>
      )}

      <div style={{
        flex: 1,
        overflow: 'auto',
        padding: 8,
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(44px, 1fr))',
        gap: 4,
        alignContent: 'start',
      }}>
        {filtered.map(sym => (
          <button
            key={sym.id}
            title={`${sym.label}\n${sym.latex}`}
            onClick={() => insert(sym.latex)}
            style={{
              padding: '6px 2px',
              fontSize: 18,
              border: '1px solid #e8e8e8',
              borderRadius: 4,
              background: '#fff',
              cursor: 'pointer',
              textAlign: 'center',
              lineHeight: 1,
            }}
            onMouseEnter={e => (e.currentTarget.style.background = '#e8f1ff')}
            onMouseLeave={e => (e.currentTarget.style.background = '#fff')}
          >
            {sym.display}
          </button>
        ))}
      </div>
    </div>
  );
}
