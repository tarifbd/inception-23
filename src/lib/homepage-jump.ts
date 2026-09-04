'use client';

const JUMP_LAYOUT_CLASS = 'homepage-jump-layout';

function getJumpOffset() {
  const header = document.querySelector<HTMLElement>('[data-site-header]');
  const sectionNav = document.querySelector<HTMLElement>("nav[aria-label='Homepage sections']");
  return (header?.getBoundingClientRect().height ?? 0) + (sectionNav?.getBoundingClientRect().height ?? 0) + 10;
}

function getTargetTop(target: HTMLElement) {
  return Math.max(0, window.scrollY + target.getBoundingClientRect().top - getJumpOffset());
}

function jumpWithoutAnimation(target: HTMLElement) {
  const root = document.documentElement;
  const previousScrollBehavior = root.style.scrollBehavior;
  root.style.scrollBehavior = 'auto';
  window.scrollTo({ top: getTargetTop(target), behavior: 'auto' });
  root.style.scrollBehavior = previousScrollBehavior;
}

export function prepareHomepageJump() {
  document.documentElement.classList.add(JUMP_LAYOUT_CLASS);
  window.dispatchEvent(new Event('homepage:jump-request'));
}

export function scrollToHomepageTargetWhenReady(id: string, smooth = true) {
  let cancelled = false;
  let timer = 0;
  let attempts = 0;
  let stableSamples = 0;
  let previousHeight = -1;

  const check = () => {
    if (cancelled) return;

    const target = document.getElementById(id);
    const currentHeight = document.documentElement.scrollHeight;
    stableSamples = target && Math.abs(currentHeight - previousHeight) <= 2 ? stableSamples + 1 : 0;
    previousHeight = currentHeight;
    attempts += 1;

    if (target && (stableSamples >= 3 || attempts >= 60)) {
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({
        top: getTargetTop(target),
        behavior: smooth && !reduceMotion ? 'smooth' : 'auto',
      });

      // Font, image, and animation setup can settle just after the first paint.
      window.setTimeout(() => jumpWithoutAnimation(target), 700);
      window.setTimeout(() => jumpWithoutAnimation(target), 1400);
      return;
    }

    timer = window.setTimeout(check, 80);
  };

  check();
  return () => {
    cancelled = true;
    window.clearTimeout(timer);
  };
}
