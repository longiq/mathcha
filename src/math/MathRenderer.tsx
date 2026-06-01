import { renderMath } from './adapter';

interface Props {
  latex: string;
  display?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export function MathRenderer({ latex, display = false, className, style }: Props) {
  return (
    <span
      className={className}
      style={style}
      dangerouslySetInnerHTML={{ __html: renderMath(latex, display) }}
    />
  );
}
