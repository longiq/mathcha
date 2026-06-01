import type { Block, Doc, Inline, TextBlock, MathBlock, GraphBlock } from './types';

const uid = () => Math.random().toString(36).slice(2, 9);

export function createDoc(): Doc {
  return {
    id: uid(),
    title: 'Untitled',
    blocks: [{ id: uid(), type: 'paragraph', align: 'left', content: [] }],
  };
}

export function insertBlock(doc: Doc, afterId: string | null, block: Block): Doc {
  const idx = afterId ? doc.blocks.findIndex(b => b.id === afterId) : -1;
  const blocks = [...doc.blocks];
  blocks.splice(idx + 1, 0, block);
  return { ...doc, blocks };
}

export function deleteBlock(doc: Doc, id: string): Doc {
  const blocks = doc.blocks.filter(b => b.id !== id);
  // Always keep at least one block
  if (blocks.length === 0) {
    blocks.push({ id: uid(), type: 'paragraph', align: 'left', content: [] });
  }
  return { ...doc, blocks };
}

export function updateBlock(doc: Doc, id: string, patch: Partial<Block>): Doc {
  return {
    ...doc,
    blocks: doc.blocks.map(b => b.id === id ? { ...b, ...patch } as Block : b),
  };
}

export function moveBlock(doc: Doc, fromIdx: number, toIdx: number): Doc {
  const blocks = [...doc.blocks];
  const [moved] = blocks.splice(fromIdx, 1);
  blocks.splice(toIdx, 0, moved);
  return { ...doc, blocks };
}

export function splitBlock(doc: Doc, id: string, beforeInlines: Inline[], afterInlines: Inline[]): Doc {
  const idx = doc.blocks.findIndex(b => b.id === id);
  if (idx === -1) return doc;
  const orig = doc.blocks[idx];
  if (orig.type === 'math' || orig.type === 'graph') return doc;

  const updated: TextBlock = { ...orig, content: beforeInlines };
  const newBlock: TextBlock = {
    id: uid(),
    type: orig.type === 'h1' || orig.type === 'h2' || orig.type === 'h3' ? 'paragraph' : orig.type,
    align: orig.align,
    content: afterInlines,
  };
  const blocks = [...doc.blocks];
  blocks.splice(idx, 1, updated, newBlock);
  return { ...doc, blocks, _splitNewId: newBlock.id } as any;
}

export function mergeBlockIntoPrev(
  doc: Doc,
  id: string
): { doc: Doc; prevId: string; mergePoint: number } | null {
  const idx = doc.blocks.findIndex(b => b.id === id);
  if (idx <= 0) return null;
  const prev = doc.blocks[idx - 1];
  const curr = doc.blocks[idx];
  if (prev.type === 'math' || prev.type === 'graph') return null;
  if (curr.type === 'math' || curr.type === 'graph') return null;

  const mergePoint = prev.content.length;
  const merged: TextBlock = {
    ...prev,
    content: [...prev.content, ...curr.content],
  };
  const blocks = [...doc.blocks];
  blocks.splice(idx - 1, 2, merged);
  return { doc: { ...doc, blocks }, prevId: prev.id, mergePoint };
}

// Factory helpers
export function newTextBlock(type: TextBlock['type'] = 'paragraph'): TextBlock {
  return { id: uid(), type, align: 'left', content: [] };
}

export function newMathBlock(latex = ''): MathBlock {
  return { id: uid(), type: 'math', latex };
}

export function newGraphBlock(): GraphBlock {
  return {
    id: uid(),
    type: 'graph',
    expressions: [],
    xMin: -6,
    xMax: 6,
    yMin: -4,
    yMax: 4,
    width: 480,
    height: 300,
  };
}
