import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ThemePhoto } from "./ThemePhoto";
import { photos } from "../media";

gsap.registerPlugin(ScrollTrigger);

const lines = [
  ["Limited", "capacity"],
  ["protects", "quality"],
  ["and", "closes"],
  ["every", "deal"],
];

export function FillText() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const mobile = window.matchMedia("(max-width: 767px)").matches;
    if (mobile) ScrollTrigger.config({ ignoreMobileResize: true });

    const ctx = gsap.context(() => {
      const letters = gsap.utils.toArray<HTMLElement>(".fill-letter");
      gsap.set(letters, { color: "rgba(255,255,255,0.12)" });
      gsap.set(".fill-curve", { yPercent: mobile ? 58 : 72 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: mobile ? "+=85%" : "+=30%",
          scrub: mobile ? true : 0.28,
          pin: true,
          anticipatePin: 1,
          fastScrollEnd: mobile,
          invalidateOnRefresh: true,
        },
      });

      tl.to(letters, {
        color: "#ffffff",
        stagger: mobile ? 0.022 : 0.038,
        ease: "none",
        duration: 0.2,
      }).to(
        ".fill-curve",
        {
          yPercent: 0,
          ease: "none",
          duration: mobile ? 0.55 : 0.85,
        },
        0.18,
      );
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="fill-sec keep-dark relative z-[2] overflow-hidden bg-ink">
      <div className="relative flex h-screen items-center justify-center">
        <ThemePhoto
          light={photos.seats.light}
          dark={photos.seats.dark}
          className="absolute inset-0 h-full w-full object-cover md:scale-[1.04]"
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(25,29,35,0.28)_0%,rgba(25,29,35,0.62)_58%,rgba(25,29,35,0.88)_100%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/55 via-transparent to-ink/70" />

        <div className="relative z-[2] -mt-16 px-6 text-center">
          {lines.map((line) => (
            <p
              key={line.join("-")}
              className="font-nohemi text-[9.5vw] leading-[0.95] font-light tracking-[-0.01em] sm:text-[11vw] md:text-[72px] lg:text-[96px]"
            >
              {line.map((word) => (
                <span key={word} className="fill-word inline-block px-[0.18em]">
                  {word.split("").map((letter, i) => (
                    <span key={`${word}-${i}`} className="fill-letter">
                      {letter}
                    </span>
                  ))}
                </span>
              ))}
            </p>
          ))}
        </div>

        <div className="fill-curve pointer-events-none absolute right-0 bottom-0 left-0 z-[4] w-full text-[#343434]">
          <svg
            className="curve-rise"
            viewBox="0 0 1440 150"
            preserveAspectRatio="none"
            aria-hidden
          >
            <path
              d="M0 150 C 240 150 360 28 720 28 C 1080 28 1200 150 1440 150 L 1440 150 L 0 150 Z"
              fill="currentColor"
            />
          </svg>
          <div className="h-10 w-full bg-[#343434]" />
        </div>
      </div>
    </section>
  );
}
