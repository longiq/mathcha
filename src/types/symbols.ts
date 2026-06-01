export type SymbolCategory =
  | 'greek'
  | 'operators'
  | 'relations'
  | 'arrows'
  | 'structures'
  | 'accents'
  | 'delimiters'
  | 'misc';

export interface MathSymbol {
  id: string;
  category: SymbolCategory;
  label: string;
  latex: string;
  display: string;
  keywords: string[];
}
