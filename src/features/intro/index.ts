import { sampleLogoPoints } from './logoPoints';
import { drawGrains, prepareCanvas } from './renderer';

const GRAINS_DESKTOP = 5000;
const GRAINS_MOBILE = 2500;
const MOBILE_MAX_WIDTH = 768;
const GRAIN_RADIUS = 1;
const RESIZE_DEBOUNCE_MS = 150;

export function startIntro(): void {
  const canvas = document.querySelector<HTMLCanvasElement>('.intro-canvas');
  const logo = document.querySelector<SVGSVGElement>('.intro-logo');
  if (!canvas || !logo) return;

  const render = () => renderFrozenLogo(canvas, logo);

  let resizeTimer = 0;
  window.addEventListener('resize', () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(render, RESIZE_DEBOUNCE_MS);
  });

  render();
}

async function renderFrozenLogo(canvas: HTMLCanvasElement, logo: SVGSVGElement): Promise<void> {
  const context = prepareCanvas(canvas);
  if (!context) return;

  const count = window.innerWidth < MOBILE_MAX_WIDTH ? GRAINS_MOBILE : GRAINS_DESKTOP;
  const points = await sampleLogoPoints(logo, count);

  drawGrains(context, points, { radius: GRAIN_RADIUS, color: readCssColor('--color-rust') });
}

function readCssColor(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}
