export interface PlotOptions {
  expressions: string[];
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
  width: number;
  height: number;
  colors?: string[];
  gridColor?: string;
  axisColor?: string;
  bgColor?: string;
}

function evalExpr(expr: string, x: number): number {
  const cleaned = expr
    .replace(/\^/g, '**')
    .replace(/(\d)(x)/g, '$1*x')
    .replace(/\)(x|\()/g, ')*($1')
    .replace(/sin\(/g, 'Math.sin(')
    .replace(/cos\(/g, 'Math.cos(')
    .replace(/tan\(/g, 'Math.tan(')
    .replace(/exp\(/g, 'Math.exp(')
    .replace(/log\(/g, 'Math.log(')
    .replace(/sqrt\(/g, 'Math.sqrt(')
    .replace(/abs\(/g, 'Math.abs(')
    .replace(/pi/g, 'Math.PI')
    .replace(/e(?![a-zA-Z])/g, 'Math.E');
  try {
    // eslint-disable-next-line no-new-func
    return new Function('x', `"use strict"; return (${cleaned});`)(x);
  } catch {
    return NaN;
  }
}

function niceStep(range: number, targetTicks: number): number {
  const roughStep = range / targetTicks;
  const mag = Math.pow(10, Math.floor(Math.log10(roughStep)));
  const norm = roughStep / mag;
  let step: number;
  if (norm < 1.5) step = 1;
  else if (norm < 3.5) step = 2;
  else if (norm < 7.5) step = 5;
  else step = 10;
  return step * mag;
}

export function plotToCanvas(canvas: HTMLCanvasElement, opts: PlotOptions): void {
  const {
    expressions, xMin, xMax, yMin, yMax, width, height,
    colors = ['#e53e3e', '#3a8ef6', '#38a169', '#d69e2e', '#805ad5'],
    gridColor = '#e8e8e8',
    axisColor = '#555',
    bgColor = '#fff',
  } = opts;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  canvas.width = width;
  canvas.height = height;

  // Fill background
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, width, height);

  const xRange = xMax - xMin;
  const yRange = yMax - yMin;

  // Convert math coords to canvas coords
  const toCanvasX = (x: number) => ((x - xMin) / xRange) * width;
  const toCanvasY = (y: number) => height - ((y - yMin) / yRange) * height;

  // Grid step
  const xStep = niceStep(xRange, 10);
  const yStep = niceStep(yRange, 8);

  // Draw grid lines
  ctx.strokeStyle = gridColor;
  ctx.lineWidth = 1;

  const xStart = Math.ceil(xMin / xStep) * xStep;
  for (let gx = xStart; gx <= xMax + 1e-10; gx += xStep) {
    const cx = toCanvasX(gx);
    ctx.beginPath();
    ctx.moveTo(cx, 0);
    ctx.lineTo(cx, height);
    ctx.stroke();
  }

  const yStart = Math.ceil(yMin / yStep) * yStep;
  for (let gy = yStart; gy <= yMax + 1e-10; gy += yStep) {
    const cy = toCanvasY(gy);
    ctx.beginPath();
    ctx.moveTo(0, cy);
    ctx.lineTo(width, cy);
    ctx.stroke();
  }

  // Draw axes
  ctx.strokeStyle = axisColor;
  ctx.lineWidth = 1.5;

  // X axis
  const axisY = Math.max(yMin, Math.min(yMax, 0));
  const cAxisY = toCanvasY(axisY);
  ctx.beginPath();
  ctx.moveTo(0, cAxisY);
  ctx.lineTo(width, cAxisY);
  ctx.stroke();

  // Y axis
  const axisX = Math.max(xMin, Math.min(xMax, 0));
  const cAxisX = toCanvasX(axisX);
  ctx.beginPath();
  ctx.moveTo(cAxisX, 0);
  ctx.lineTo(cAxisX, height);
  ctx.stroke();

  // Axis tick labels
  ctx.fillStyle = '#999';
  ctx.font = '10px sans-serif';
  ctx.textAlign = 'center';

  // X labels
  for (let gx = xStart; gx <= xMax + 1e-10; gx += xStep) {
    if (Math.abs(gx) < xStep * 0.01) continue; // skip 0
    const cx = toCanvasX(gx);
    const labelY = Math.min(cAxisY + 14, height - 4);
    const label = parseFloat(gx.toPrecision(6)).toString();
    ctx.fillText(label, cx, labelY);
  }

  // Y labels
  ctx.textAlign = 'right';
  for (let gy = yStart; gy <= yMax + 1e-10; gy += yStep) {
    if (Math.abs(gy) < yStep * 0.01) continue; // skip 0
    const cy = toCanvasY(gy);
    const labelX = Math.max(cAxisX - 4, 32);
    const label = parseFloat(gy.toPrecision(6)).toString();
    ctx.fillText(label, labelX, cy + 3);
  }

  // Plot expressions
  const N = 400;
  expressions.forEach((expr, i) => {
    const color = colors[i % colors.length];
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.beginPath();

    let inPath = false;
    let prevY: number | null = null;

    for (let j = 0; j <= N; j++) {
      const x = xMin + (xMax - xMin) * (j / N);
      const y = evalExpr(expr, x);

      if (!isFinite(y)) {
        inPath = false;
        prevY = null;
        continue;
      }

      // Detect discontinuities: if y jumps more than half the visible range, don't connect
      const jumpThreshold = (yMax - yMin) * 2;
      if (prevY !== null && Math.abs(y - prevY) > jumpThreshold) {
        inPath = false;
      }
      prevY = y;

      const cx = toCanvasX(x);
      const cy = toCanvasY(y);

      if (!inPath) {
        ctx.moveTo(cx, cy);
        inPath = true;
      } else {
        ctx.lineTo(cx, cy);
      }
    }
    ctx.stroke();
  });
}
