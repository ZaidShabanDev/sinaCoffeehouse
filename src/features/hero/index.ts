import { startAmmanClock } from './clock';
import { startHeroParallax } from './parallax';

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

function initHero(): void {
  const hero = document.querySelector<HTMLElement>('[data-hero]');
  if (!hero) return;

  const clock = hero.querySelector<HTMLTimeElement>('[data-hero-clock]');
  if (clock) startAmmanClock(clock);

  if (window.matchMedia(REDUCED_MOTION_QUERY).matches) return;

  const background = hero.querySelector<HTMLElement>('[data-hero-background]');
  const content = hero.querySelector<HTMLElement>('[data-hero-content]');
  if (background && content) startHeroParallax({ background, content });
}

initHero();
