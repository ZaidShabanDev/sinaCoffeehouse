import { heroSettings } from './settings';

interface ParallaxTargets {
  background: HTMLElement;
  content: HTMLElement;
}

function applyScroll({ background, content }: ParallaxTargets): void {
  const scroll = window.scrollY;
  const progress = Math.min(scroll / window.innerHeight, 1);

  background.style.transform =
    `translateY(${scroll * heroSettings.backgroundDriftRatio}px) scale(${1 + progress * heroSettings.backgroundMaxZoom})`;
  content.style.transform = `translateY(${-progress * heroSettings.contentMaxLiftPx}px)`;
  content.style.opacity = String(Math.max(1 - progress * heroSettings.contentFadeSpeed, 0));
}

export function startHeroParallax(targets: ParallaxTargets): void {
  let frameRequested = false;

  const onScroll = () => {
    if (frameRequested) return;
    frameRequested = true;
    requestAnimationFrame(() => {
      frameRequested = false;
      applyScroll(targets);
    });
  };

  applyScroll(targets);
  window.addEventListener('scroll', onScroll, { passive: true });
}
