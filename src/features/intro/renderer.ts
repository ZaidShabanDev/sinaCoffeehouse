import type { Point } from './logoPoints';

const MAX_PIXEL_RATIO = 2;

export interface GrainStyle {
  radius: number;
  color: string;
}

export function prepareCanvas(canvas: HTMLCanvasElement): CanvasRenderingContext2D | null {
  const context = canvas.getContext('2d');
  if (!context) return null;

  const pixelRatio = Math.min(window.devicePixelRatio || 1, MAX_PIXEL_RATIO);
  canvas.width = Math.round(window.innerWidth * pixelRatio);
  canvas.height = Math.round(window.innerHeight * pixelRatio);
  context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  return context;
}

export function drawGrains(context: CanvasRenderingContext2D, points: Point[], style: GrainStyle): void {
  context.clearRect(0, 0, window.innerWidth, window.innerHeight);
  context.fillStyle = style.color;
  context.beginPath();
  for (const point of points) {
    context.moveTo(point.x + style.radius, point.y);
    context.arc(point.x, point.y, style.radius, 0, Math.PI * 2);
  }
  context.fill();
}
