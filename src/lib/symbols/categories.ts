import type { SymbolCategory } from '../../types/symbols';

export const CATEGORIES: { id: SymbolCategory; label: string; icon: string }[] = [
  { id: 'greek', label: 'Greek', icon: 'α' },
  { id: 'operators', label: 'Operators', icon: '±' },
  { id: 'relations', label: 'Relations', icon: '≤' },
  { id: 'arrows', label: 'Arrows', icon: '→' },
  { id: 'structures', label: 'Structures', icon: '∑' },
  { id: 'accents', label: 'Accents', icon: 'â' },
  { id: 'delimiters', label: 'Delimiters', icon: '⌊' },
  { id: 'misc', label: 'Misc', icon: '∞' },
];
