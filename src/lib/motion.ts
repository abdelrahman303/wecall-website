import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

let refreshRaf = 0;

export function scheduleRefresh() {
  if (refreshRaf) return;
  refreshRaf = window.requestAnimationFrame(() => {
    refreshRaf = 0;
    ScrollTrigger.refresh();
  });
}

export function initMotion() {
  const touch = window.matchMedia("(pointer: coarse)").matches;
  gsap.config({
    nullTargetWarn: false,
    autoSleep: 60,
    force3D: touch ? false : true,
  });
  ScrollTrigger.config({
    ignoreMobileResize: true,
    limitCallbacks: true,
    autoRefreshEvents: "visibilitychange,DOMContentLoaded,load",
  });

  if (touch) {
    gsap.ticker.lagSmoothing(500, 33);
    return;
  }

  gsap.defaults({
    force3D: true,
    overwrite: "auto",
  });
  gsap.ticker.lagSmoothing(0, 33);
  gsap.ticker.fps(60);

  const onVisibility = () => {
    document.documentElement.classList.toggle("is-hidden-tab", document.hidden);
    if (document.hidden) gsap.ticker.sleep();
    else gsap.ticker.wake();
  };
  document.addEventListener("visibilitychange", onVisibility);
}

export function watchInfiniteAnimations(root: ParentNode = document) {
  const nodes = root.querySelectorAll<HTMLElement>(".marquee-track, .btn-track");
  if (!nodes.length) return () => undefined;

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        (entry.target as HTMLElement).style.animationPlayState = entry.isIntersecting
          ? "running"
          : "paused";
      }
    },
    { rootMargin: "18% 0px" },
  );
  nodes.forEach((node) => io.observe(node));
  return () => io.disconnect();
}

export function onRafMove(
  el: HTMLElement,
  fn: (nx: number, ny: number) => void,
) {
  let raf = 0;
  let nx = 0;
  let ny = 0;
  const move = (event: MouseEvent) => {
    const box = el.getBoundingClientRect();
    const w = box.width || 1;
    const h = box.height || 1;
    nx = (event.clientX - box.left) / w - 0.5;
    ny = (event.clientY - box.top) / h - 0.5;
    if (raf) return;
    raf = window.requestAnimationFrame(() => {
      raf = 0;
      fn(nx, ny);
    });
  };
  el.addEventListener("mousemove", move, { passive: true });
  return () => {
    el.removeEventListener("mousemove", move);
    if (raf) window.cancelAnimationFrame(raf);
  };
}
