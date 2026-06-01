import { Search } from 'lucide-react';

interface Props {
  value: string;
  onChange: (v: string) => void;
}

export function SymbolSearch({ value, onChange }: Props) {
  return (
    <div className="relative px-2 py-2">
      <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="Search symbols..."
        className="w-full bg-gray-800 border border-gray-600 rounded pl-7 pr-2 py-1.5 text-sm text-gray-200 focus:outline-none focus:border-sky-500 placeholder-gray-500"
      />
    </div>
  );
}
