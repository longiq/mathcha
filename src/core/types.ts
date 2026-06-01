export type BlockType = 'paragraph' | 'h1' | 'h2' | 'h3' | 'math' | 'graph';
export type Align = 'left' | 'center' | 'right';

export interface TextMark {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strike?: boolean;
}

export interface TextInline {
  kind: 'text';
  text: string;
  marks: TextMark;
}

export interface MathInline {
  kind: 'math';
  latex: string;
}

export type Inline = TextInline | MathInline;

export interface TextBlock {
  id: string;
  type: 'paragraph' | 'h1' | 'h2' | 'h3';
  align: Align;
  content: Inline[];
}

export interface MathBlock {
  id: string;
  type: 'math';
  latex: string;
}

export interface GraphBlock {
  id: string;
  type: 'graph';
  expressions: string[];
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
  width: number;
  height: number;
}

export type Block = TextBlock | MathBlock | GraphBlock;

export interface Doc {
  id: string;
  title: string;
  blocks: Block[];
}
