import { useEffect, useRef } from "react";
import gsap from "gsap";
import { photos } from "../media";
import { onRafMove } from "../lib/motion";

const slides = [
  { text: "Off-Market", light: photos.deals.light, dark: photos.deals.dark, rotate: -8 },
  { text: "Excellence", light: photos.closings.light, dark: photos.closings.dark, rotate: 12 },
  { text: "Acquisition", light: photos.close.light, dark: photos.close.dark, rotate: -10 },
];

export function HeroSlider() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const node = root.current;
    if (!node) return;

    const clip = node.querySelector(".ah-clip") as HTMLElement;
    const track = node.querySelector(".ah-track") as HTMLElement;
    const rig = node.querySelector(".ah-rig") as HTMLElement;
    const card = node.querySelector(".ah-card") as HTMLElement;
    const frontImg = node.querySelector(".ah-front img") as HTMLImageElement;
    const backImg = node.querySelector(".ah-back img") as HTMLImageElement;
    const n = slides.length;
    let index = 0;
    let showingBack = false;
    let running = true;
    let flipTimeout: ReturnType<typeof setTimeout>;
    let isFlipping = false;
    
    // Store current mouse position
    let currentNX = 0;
    let currentNY = 0;

    gsap.set(rig, {
      transformPerspective: 900,
      transformOrigin: "center center",
      scale: 1,
      z: 0,
      force3D: true,
    });
    gsap.set(card, {
      rotate: slides[0].rotate,
      rotateX: 0,
      transformOrigin: "center center",
      transformPerspective: 1800,
      force3D: true,
    });
    gsap.set(track, { y: 0 });
    const faceSrc = (slide: (typeof slides)[number]) =>
      document.documentElement.classList.contains("light") ? slide.light : slide.dark;

    frontImg.src = faceSrc(slides[0]);
    backImg.src = faceSrc(slides[1]);

    const wordY = (step: number) => -step * clip.offsetHeight;

    const flip = () => {
      if (!running || isFlipping) return;
      isFlipping = true;
      
      const next = (index + 1) % n;
      const after = (index + 2) % n;
      const toBack = !showingBack;

      // Kill ONLY mouse animations on card, keep the flip
      gsap.killTweensOf(card, "rotateX,rotateY,z,skewX,skewY");
      gsap.killTweensOf(track);

      const tl = gsap.timeline({
        defaults: { ease: "power3.inOut" },
        onComplete: () => {
          // Swap images AFTER flip completes
          index = next;
          showingBack = toBack;
          if (toBack) {
            frontImg.src = faceSrc(slides[after]);
          } else {
            backImg.src = faceSrc(slides[after]);
          }
          if (next === 0) gsap.set(track, { y: 0 });
          isFlipping = false;
          
          // Restore mouse position after flip
          const distance = Math.hypot(currentNX, currentNY);
          gsap.set(card, {
            rotateX: -currentNY * 30,
            rotateY: currentNX * 30,
            z: -distance * 100,
          });
          
          flipTimeout = setTimeout(flip, 2200);
        },
      });

      // Text track moves
      tl.to(
        track,
        {
          y: wordY(index + 1),
          duration: 1.2,
          ease: "power3.inOut",
        },
        0,
      );

      // CARD FLIPS - starting from current mouse position
      tl.to(
        card,
        {
          rotateX: toBack ? 180 : 360,
          rotate: slides[next].rotate,
          duration: 1.2,
          ease: "power3.inOut",
        },
        0,
      );

      tl.set(card, { rotateX: toBack ? 180 : 0 });
    };

    const rigX = gsap.quickTo(rig, "x", { duration: 0.15, ease: "power2.out" });
    const rigY = gsap.quickTo(rig, "y", { duration: 0.15, ease: "power2.out" });
    const cardTiltX = gsap.quickTo(card, "rotateX", { duration: 0.15, ease: "power2.out" });
    const cardTiltY = gsap.quickTo(card, "rotateY", { duration: 0.15, ease: "power2.out" });
    const cardZ = gsap.quickTo(card, "z", { duration: 0.15, ease: "power2.out" });

    const start = setTimeout(flip, 2200);

    const stopMove = onRafMove(node, (nx, ny) => {
      if (!window.matchMedia("(pointer: fine)").matches) return;
      currentNX = nx;
      currentNY = ny;
      const distance = Math.hypot(nx, ny);
      rigX(nx * 200);
      rigY(ny * 100);
      if (!isFlipping) {
        cardTiltX(-ny * 30);
        cardTiltY(nx * 30);
        cardZ(-distance * 100);
      }
    });

    const reset = () => {
      currentNX = 0;
      currentNY = 0;
      rigX(0);
      rigY(0);
      if (!isFlipping) {
        cardTiltX(0);
        cardTiltY(0);
        cardZ(0);
      }
    };

    node.addEventListener("mouseleave", reset);

    const io = new IntersectionObserver(
      ([entry]) => {
        running = entry.isIntersecting;
        if (!running) {
          clearTimeout(flipTimeout);
          isFlipping = false;
        } else if (!isFlipping) {
          clearTimeout(flipTimeout);
          flipTimeout = setTimeout(flip, 2200);
        }
      },
      { threshold: 0.35 },
    );
    io.observe(node);

    return () => {
      running = false;
      clearTimeout(start);
      clearTimeout(flipTimeout);
      io.disconnect();
      stopMove();
      node.removeEventListener("mouseleave", reset);
      gsap.killTweensOf([rig, card, track]);
    };
  }, []);

  return (
    <section
      ref={root}
      className="ah-hero relative isolate flex h-[100svh] w-full items-center justify-center overflow-hidden"
      style={{ perspective: "800px" }}
    >
      <div className="ah-blueprint pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute inset-6 rounded-[28px] border border-gold/25 md:inset-10" />

      <div className="absolute top-1/2 left-1/2 z-[1] h-[26vh] w-[38vw] min-h-[150px] min-w-0 max-w-[300px] -translate-x-1/2 -translate-y-1/2 md:h-[38vh] md:w-[22vw] md:min-h-[220px]">
        <div className="ah-rig h-full w-full" style={{ transformStyle: "preserve-3d" }}>
          <div
            className="ah-card relative h-full w-full border border-white/15"
            style={{ transformStyle: "preserve-3d" }}
          >
            <div className="ah-face ah-front absolute inset-0 overflow-hidden rounded-lg">
              <img alt="" className="h-full w-full object-cover" />
            </div>
            <div className="ah-face ah-back absolute inset-0 overflow-hidden rounded-lg">
              <img alt="" className="h-full w-full object-cover" />
            </div>
          </div>
        </div>
      </div>

      <div className="ah-clip relative z-[2] h-[0.92em] w-full overflow-hidden text-center font-playfair text-[11vw] leading-none font-semibold tracking-[-0.03em] md:text-[11.5vw]">
        <div className="ah-track">
          {[...slides, slides[0]].map((slide, i) => (
            <h1 key={`${slide.text}-${i}`} className="ah-word flex h-[0.92em] items-center justify-center">
              {slide.text}
            </h1>
          ))}
        </div>
      </div>
    </section>
  );
}