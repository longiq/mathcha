import React, { useRef, useLayoutEffect, useCallback, useEffect } from 'react';
import type { TextBlock as TBlock } from '../core/types';
import {
  htmlToInlines,
  inlinesToHtml,
  isAtStart,
  getCursorOffset,
  splitInlines,
  focusAtEnd,
} from './dom';
import { useStore } from '../core/store';

interface Props {
  block: TBlock;
  isActive: boolean;
  onFocus: () => void;
  focusAtEndFlag?: boolean;
}

// Styles per block type
const BLOCK_STYLES: Record<TBlock['type'], React.CSSProperties> = {
  paragraph: { fontSize: 15, fontWeight: 400, margin: '1px 0', minHeight: '1.6em' },
  h1: { fontSize: 28, fontWeight: 700, margin: '12px 0 4px', lineHeight: 1.3 },
  h2: { fontSize: 22, fontWeight: 700, margin: '10px 0 3px', lineHeight: 1.3 },
  h3: { fontSize: 18, fontWeight: 700, margin: '8px 0 2px', lineHeight: 1.3 },
};

export function TextBlockComp({ block, isActive, onFocus, focusAtEndFlag }: Props) {
  const { dispatch } = useStore();
  const elRef = useRef<HTMLDivElement>(null);
  const composing = useRef(false);
  const lastHtml = useRef('');
  const isUserEditing = useRef(false);

  // Sync DOM ← model (only when content changes from outside)
  useLayoutEffect(() => {
    const el = elRef.current;
    if (!el) return;
    if (isUserEditing.current) return; // don't clobber cursor during user input
    const html = inlinesToHtml(block.content);
    if (html !== lastHtml.current) {
      el.innerHTML = html || '';
      lastHtml.current = html;
    }
  });

  // When focusAtEndFlag changes to true, focus this block
  useEffect(() => {
    if (focusAtEndFlag && elRef.current) {
      focusAtEnd(elRef.current);
    }
  }, [focusAtEndFlag]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const el = elRef.current;
      if (!el) return;

      if (e.key === 'Enter' && !e.shiftKey && !composing.current) {
        e.preventDefault();
        const offset = getCursorOffset(el);
        const inlines = htmlToInlines(el);
        const [before, after] = splitInlines(inlines, offset);
        isUserEditing.current = false;
        dispatch({ type: 'SPLIT_BLOCK', id: block.id, before, after });
        return;
      }

      if (e.key === 'Backspace' && isAtStart(el) && !composing.current) {
        const inlines = htmlToInlines(el);
        if (inlines.length === 0) {
          e.preventDefault();
          isUserEditing.current = false;
          dispatch({ type: 'DELETE_BLOCK', id: block.id });
          return;
        }
        e.preventDefault();
        isUserEditing.current = false;
        dispatch({ type: 'MERGE_BLOCK', id: block.id });
        return;
      }

      // Ctrl/Cmd shortcuts
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'b') {
          e.preventDefault();
          document.execCommand('bold');
          return;
        }
        if (e.key === 'i') {
          e.preventDefault();
          document.execCommand('italic');
          return;
        }
        if (e.key === 'u') {
          e.preventDefault();
          document.execCommand('underline');
          return;
        }
      }
    },
    [block.id, dispatch]
  );

  const handleInput = useCallback(() => {
    if (composing.current) return;
    const el = elRef.current;
    if (!el) return;
    isUserEditing.current = true;
    const inlines = htmlToInlines(el);
    lastHtml.current = el.innerHTML;
    dispatch({ type: 'UPDATE_BLOCK', id: block.id, patch: { content: inlines } });
    // Reset flag after brief delay so re-renders don't clobber
    setTimeout(() => { isUserEditing.current = false; }, 0);
  }, [block.id, dispatch]);

  const handleCompositionStart = () => {
    composing.current = true;
  };
  const handleCompositionEnd = () => {
    composing.current = false;
    handleInput();
  };

  const tag = block.type === 'paragraph' ? 'p' : block.type;

  return React.createElement(tag, {
    ref: elRef,
    contentEditable: true,
    suppressContentEditableWarning: true,
    'data-block-id': block.id,
    'data-placeholder': block.type === 'paragraph' ? 'Type something...' : block.type.toUpperCase(),
    onFocus: onFocus,
    onKeyDown: handleKeyDown,
    onInput: handleInput,
    onCompositionStart: handleCompositionStart,
    onCompositionEnd: handleCompositionEnd,
    style: {
      ...BLOCK_STYLES[block.type],
      textAlign: block.align,
      outline: 'none',
      color: '#1a1a1a',
      lineHeight: 1.75,
      padding: '2px 4px',
      borderLeft: isActive ? '2px solid #3a8ef6' : '2px solid transparent',
      borderRadius: 2,
      transition: 'border-color 0.1s',
      cursor: 'text',
      wordBreak: 'break-word',
    },
  });
}

// Export focusAtEnd for use by Editor
export { focusAtEnd };
