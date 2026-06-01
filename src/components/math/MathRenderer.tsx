import { renderMath } from '../../lib/katex/render';

interface Props {
  latex: string;
  display?: boolean;
  className?: string;
}

export function MathRenderer({ latex, display = false, className = '' }: Props) {
  const html = renderMath(latex || '\\square', display);
  return (
    <span
      className={className}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
