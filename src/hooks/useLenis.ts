import { useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { setLenis } from "../lib/smoothScroll";
import { scheduleRefresh } from "../lib/motion";

gsap.registerPlugin(ScrollTrigger);

export function useLenis() {
  useEffect(() => {
    const touch = window.matchMedia("(pointer: coarse)").matches;
    if (touch) {
      gsap.ticker.lagSmoothing(500, 33);
      scheduleRefresh();
      return;
    }

    const lenis = new Lenis({
      duration: 0.9,
      smoothWheel: true,
      autoRaf: false,
      touchMultiplier: 1.1,
      wheelMultiplier: 1,
      prevent: (node) =>
        Boolean(node.closest?.("iframe, .qt-calendly, [data-lenis-prevent]")),
    });

    setLenis(lenis);
    lenis.on("scroll", ScrollTrigger.update);

    const ticker = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(ticker);
    gsap.ticker.lagSmoothing(0);
    scheduleRefresh();

    const onVisibility = () => {
      if (document.hidden) lenis.stop();
      else lenis.start();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      gsap.ticker.remove(ticker);
      setLenis(null);
      lenis.destroy();
    };
  }, []);
}
