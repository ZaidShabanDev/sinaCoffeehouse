import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { smoothScrollSettings } from './settings';

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

function initSmoothScroll(): void {
  if (window.matchMedia(REDUCED_MOTION_QUERY).matches) return;

  new Lenis({
    lerp: smoothScrollSettings.lerp,
    wheelMultiplier: smoothScrollSettings.wheelMultiplier,
    autoRaf: true,
    anchors: true,
  });
}

initSmoothScroll();
