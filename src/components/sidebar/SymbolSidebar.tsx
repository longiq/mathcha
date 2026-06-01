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
    <div className="flex flex-col h-full bg-gray-900 border-r border-gray-700">
      <div className="px-3 py-3 border-b border-gray-700">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Symbols</span>
      </div>

      <SymbolSearch value={search} onChange={setSearch} />

      {!search && (
        <div className="flex flex-col border-b border-gray-700">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-2 px-3 py-1.5 text-sm transition-colors ${
                activeCategory === cat.id
                  ? 'bg-sky-600/20 text-sky-400 border-l-2 border-sky-500'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800 border-l-2 border-transparent'
              }`}
            >
              <span className="text-base w-5 text-center">{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-2">
        <div className="grid grid-cols-4 gap-0.5">
          {filtered.map(symbol => (
            <SymbolButton
              key={symbol.id}
              symbol={symbol}
              onClick={insertSymbol}
            />
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="text-center text-gray-500 text-sm py-4">No symbols found</div>
        )}
      </div>
    </div>
  );
}
