import { useState } from 'react';
import { MathRenderer } from '../math/MathRenderer';
import type { MathSymbol } from '../../types/symbols';

interface Props {
  symbol: MathSymbol;
  onClick: (latex: string) => void;
}

export function SymbolButton({ symbol, onClick }: Props) {
  const [hover, setHover] = useState(false);

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => onClick(symbol.latex)}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        title={symbol.label}
        style={{
          width: '100%', height: 34,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: hover ? '#3a3a3a' : 'none',
          border: 'none', borderRadius: 3,
          cursor: 'pointer', color: '#ccc',
          fontSize: 16, transition: 'background 0.1s, color 0.1s',
        }}
      >
        {symbol.display}
      </button>

      {hover && (
        <div style={{
          position: 'fixed',
          zIndex: 9999,
          background: '#1a1a1a',
          border: '1px solid #444',
          borderRadius: 6,
          padding: '10px 12px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.6)',
          pointerEvents: 'none',
          minWidth: 110,
          transform: 'translateX(10px)',
          left: 220,
        }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 6, color: '#fff', fontSize: 18 }}>
            <MathRenderer latex={symbol.latex} />
          </div>
          <div style={{ color: '#ddd', fontSize: 12, textAlign: 'center' }}>{symbol.label}</div>
          <div style={{ color: '#777', fontSize: 11, textAlign: 'center', fontFamily: 'monospace', marginTop: 2 }}>
            {symbol.latex}
          </div>
        </div>
      )}
    </div>
  );
}
