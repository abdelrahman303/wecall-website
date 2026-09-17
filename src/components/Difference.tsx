import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { wecallValues } from "../data";
import { photos } from "../media";
import { ThemePhoto } from "./ThemePhoto";
import { onRafMove } from "../lib/motion";

gsap.registerPlugin(ScrollTrigger);

const floaters = [
  {
    photo: photos.desks,
    className:
      "top-[16%] left-[8%] h-[68px] w-[104px] sm:top-[8%] sm:left-[6%] sm:h-28 sm:w-44 md:left-[8%] md:h-40 md:w-64 lg:left-[10%] lg:h-44 lg:w-72",
  },
  {
    photo: photos.deals,
    className:
      "top-[10%] left-1/2 h-[58px] w-[80px] -translate-x-1/2 sm:top-[5%] sm:h-24 sm:w-36 md:h-32 md:w-48 lg:h-36 lg:w-56",
  },
  {
    photo: photos.nightDesk,
    className:
      "top-[18%] right-[8%] h-[68px] w-[108px] sm:top-[10%] sm:right-[6%] sm:h-28 sm:w-48 md:right-[8%] md:h-40 md:w-72 lg:right-[10%] lg:h-44 lg:w-80",
  },
  {
    photo: photos.flip,
    className:
      "bottom-[22%] left-[10%] h-[96px] w-[56px] sm:bottom-[16%] sm:left-[8%] sm:h-44 sm:w-24 md:left-[11%] md:h-60 md:w-32 lg:left-[13%] lg:h-72 lg:w-36",
  },
  {
    photo: photos.seats,
    className:
      "bottom-[11%] left-1/2 h-[64px] w-[92px] -translate-x-1/2 sm:bottom-[7%] sm:h-28 sm:w-40 md:h-36 md:w-56 lg:h-40 lg:w-64",
  },
  {
    photo: photos.close,
    className:
      "right-[9%] bottom-[20%] h-[70px] w-[96px] sm:right-[8%] sm:bottom-[15%] sm:h-32 sm:w-44 md:right-[11%] md:h-40 md:w-56 lg:right-[13%] lg:h-44 lg:w-64",
  },
];

export function Difference() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = root.current;
    if (!node) return;

    const lines = Array.from(node.querySelectorAll<HTMLElement>(".lyric-line"));
    let active = 0;
    let timer: number | undefined;

    const paint = (index: number) => {
      const step = window.innerWidth < 768 ? 76 : 64;
      lines.forEach((el, i) => {
        const d = i - index;
        gsap.to(el, {
          y: d * step,
          opacity: d === 0 ? 1 : Math.max(0.16, 1 - Math.abs(d) * 0.38),
          scale: d === 0 ? 1 : 0.72,
          filter: d === 0 ? "blur(0px)" : "blur(0.35px)",
          duration: 0.7,
          ease: "sine.inOut",
          overwrite: "auto",
        });
      });
    };

    paint(0);

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".floater").forEach((el, i) => {
        gsap.to(el, {
          y: i % 2 === 0 ? -28 : 28,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.2,
          },
        });
      });

      ScrollTrigger.create({
        trigger: root.current,
        start: "top 70%",
        end: "bottom 20%",
        onEnter: () => {
          timer = window.setInterval(() => {
            active = (active + 1) % lines.length;
            paint(active);
          }, 1600);
        },
        onLeave: () => {
          if (timer) window.clearInterval(timer);
        },
        onEnterBack: () => {
          timer = window.setInterval(() => {
            active = (active + 1) % lines.length;
            paint(active);
          }, 1600);
        },
        onLeaveBack: () => {
          if (timer) window.clearInterval(timer);
        },
      });
    }, root);

    const floatEls = Array.from(node.querySelectorAll<HTMLElement>(".floater"));
    const pointers = floatEls.map((el) => ({
      x: gsap.quickTo(el, "x", { duration: 0.9, ease: "power2.out" }),
      rotateY: gsap.quickTo(el, "rotateY", { duration: 0.9, ease: "power2.out" }),
      rotateX: gsap.quickTo(el, "rotateX", { duration: 0.9, ease: "power2.out" }),
    }));

    const stopMove = onRafMove(node, (x, y) => {
      if (!window.matchMedia("(pointer: fine)").matches) return;
      pointers.forEach((pointer, i) => {
        const depth = 14 + (i % 3) * 8;
        pointer.rotateY(x * depth);
        pointer.rotateX(-y * depth);
        pointer.x(x * (8 + i * 3));
      });
    });

    const reset = () => {
      pointers.forEach((pointer) => {
        pointer.rotateX(0);
        pointer.rotateY(0);
        pointer.x(0);
      });
    };

    node.addEventListener("mouseleave", reset);

    return () => {
      if (timer) window.clearInterval(timer);
      node.removeEventListener("mouseleave", reset);
      stopMove();
      ctx.revert();
    };
  }, []);

  return (
    <section className="keep-dark bg-brown">
      <div className="mx-auto max-w-3xl px-4 pt-10 text-center md:px-6 md:pt-16">
        <p className="font-manrope text-[11px] tracking-[0.28em] text-cream/70 uppercase md:text-[12px]">
          The WeCall Difference
        </p>
        <h2 className="mt-2 font-nohemi text-[24px] leading-[0.95] font-medium text-cream md:mt-3 md:text-[48px]">
          Why High-Volume Investors Choose Us
        </h2>
      </div>

      <div
        ref={root}
        className="relative min-h-[78vh] overflow-hidden px-2 py-6 md:min-h-screen md:px-6 md:py-10"
        style={{ perspective: "1100px" }}
      >
        {floaters.map((f) => (
          <div
            key={f.photo.dark + f.className}
            data-cursor
            className={`floater absolute overflow-hidden ${f.className}`}
            style={{ transformStyle: "preserve-3d", boxShadow: "none" }}
          >
            <ThemePhoto light={f.photo.light} dark={f.photo.dark} className="h-full w-full object-cover" />
          </div>
        ))}

        <div className="relative z-[2] mx-auto flex min-h-[78vh] w-full max-w-[360px] items-center justify-center px-2 sm:max-w-md md:min-h-screen md:max-w-3xl">
          <div className="lyric-mask relative h-[300px] w-full overflow-hidden sm:h-[220px] md:h-[280px]">
            {wecallValues.map((v) => (
              <p
                key={v}
                className="lyric-line absolute inset-x-0 top-1/2 -translate-y-1/2 px-1 text-center font-nohemi text-[36px] leading-[1.08] font-medium tracking-[-0.03em] text-cream sm:text-[32px] md:text-[52px] lg:text-[64px]"
              >
                {v}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
