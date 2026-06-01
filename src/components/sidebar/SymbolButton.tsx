import { useState } from 'react';
import { MathRenderer } from '../math/MathRenderer';
import type { MathSymbol } from '../../types/symbols';

interface Props {
  symbol: MathSymbol;
  onClick: (latex: string) => void;
}

export function SymbolButton({ symbol, onClick }: Props) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="relative">
      <button
        className="w-9 h-9 flex items-center justify-center text-lg text-gray-300 hover:text-white hover:bg-gray-700 rounded transition-colors"
        onClick={() => onClick(symbol.latex)}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        title={symbol.label}
      >
        {symbol.display}
      </button>

      {showTooltip && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 bg-gray-900 border border-gray-600 rounded-lg p-3 shadow-xl min-w-[120px] pointer-events-none">
          <div className="flex justify-center mb-2">
            <MathRenderer latex={symbol.latex} />
          </div>
          <div className="text-xs text-gray-400 text-center">{symbol.label}</div>
          <div className="text-xs text-gray-500 text-center font-mono mt-0.5">{symbol.latex}</div>
        </div>
      )}
    </div>
  );
}
