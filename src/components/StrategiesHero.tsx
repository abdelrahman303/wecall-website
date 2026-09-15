import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { photos } from "../media";
import { ThemePhoto } from "./ThemePhoto";
import { ClaimSeatCta } from "./ClaimSeatCta";
import { scrollToTarget } from "../lib/smoothScroll";

gsap.registerPlugin(ScrollTrigger);

const playbooks = [
  { n: "01", name: "Wholesale", photo: photos.deals },
  { n: "02", name: "Fix & Flip", photo: photos.flip },
  { n: "03", name: "Turnkey", photo: photos.brrr },
  { n: "04", name: "Creative", photo: photos.creative },
] as const;

const headline = ["Specialized", "Investment", "Strategies"];

export function StrategiesHero() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const node = root.current;
    if (!node) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobile = window.matchMedia("(max-width: 767px)").matches;
    const shots = gsap.utils.toArray<HTMLElement>(".sth-shot", node);
    const chips = gsap.utils.toArray<HTMLElement>(".sth-chip", node);
    let hot = 0;
    let hovered = false;

    const mark = (index: number) => {
      hot = index;
      shots.forEach((el, i) => el.classList.toggle("is-hot", i === index));
      chips.forEach((el, i) => el.classList.toggle("is-hot", i === index));
    };

    const cleanups: Array<() => void> = [];

    const ctx = gsap.context(() => {
      if (reduce) {
        mark(0);
        const count = node.querySelector<HTMLElement>(".sth-count");
        if (count) count.textContent = "04";
        return;
      }

      gsap.set(".sth-word", { yPercent: 118 });
      gsap.set(".sth-kicker, .sth-script, .sth-lede, .sth-cta, .sth-scroll, .sth-spine", {
        opacity: 0,
        y: 22,
      });
      gsap.set(".sth-chip", { opacity: 0, y: 18 });
      gsap.set(".sth-wm", { opacity: 0, scale: 1.12, xPercent: -6 });

      const path = node.querySelector<SVGPathElement>(".sth-arc-path");
      if (path) {
        const len = path.getTotalLength();
        gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
      }

      shots.forEach((el, i) => {
        gsap.set(el, {
          opacity: 0,
          y: mobile ? 36 : 90,
          x: mobile ? 0 : i % 2 === 0 ? -48 : 56,
          rotate: mobile ? 0 : i % 2 === 0 ? -12 : 10,
          scale: mobile ? 0.96 : 0.86,
        });
      });

      const intro = gsap.timeline({ defaults: { ease: "power3.out" } });

      intro
        .to(".sth-wm", { opacity: 1, scale: 1, xPercent: 0, duration: 1.35 }, 0)
        .to(".sth-spine", { opacity: 1, y: 0, duration: 0.8 }, 0.12)
        .to(".sth-kicker", { opacity: 1, y: 0, duration: 0.7 }, 0.18)
        .to(".sth-script", { opacity: 1, y: 0, duration: 0.75 }, 0.26)
        .to(".sth-word", { yPercent: 0, duration: 1.05, stagger: 0.1 }, 0.28)
        .to(".sth-lede", { opacity: 1, y: 0, duration: 0.8 }, 0.72)
        .to(".sth-cta, .sth-scroll", { opacity: 1, y: 0, duration: 0.7, stagger: 0.08 }, 0.86)
        .to(
          shots,
          {
            opacity: 1,
            x: 0,
            y: 0,
            rotate: 0,
            scale: 1,
            duration: 1.15,
            stagger: 0.1,
            ease: "power4.out",
          },
          0.22,
        )
        .to(".sth-chip", { opacity: 1, y: 0, duration: 0.55, stagger: 0.07 }, 0.7);

      if (path) {
        intro.to(path, { strokeDashoffset: 0, duration: 1.45, ease: "power2.inOut" }, 0.42);
      }

      gsap.fromTo(
        ".sth-bg",
        { scale: 1.16, xPercent: -3 },
        {
          scale: 1.06,
          xPercent: 2,
          duration: 22,
          ease: "none",
          repeat: -1,
          yoyo: true,
        },
      );

      gsap.to(".sth-bg-shift", {
        yPercent: 14,
        ease: "none",
        scrollTrigger: {
          trigger: node,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      gsap.to(".sth-wm", {
        yPercent: 18,
        xPercent: -8,
        ease: "none",
        scrollTrigger: {
          trigger: node,
          start: "top top",
          end: "bottom top",
          scrub: 1.1,
        },
      });

      if (!mobile) {
        gsap.to(".sth-stage", {
          yPercent: -8,
          ease: "none",
          scrollTrigger: {
            trigger: node,
            start: "top top",
            end: "bottom top",
            scrub: 0.8,
          },
        });

        const tiltY = gsap.quickTo(".sth-stage-tilt", "rotateY", { duration: 0.7, ease: "power3.out" });
        const tiltX = gsap.quickTo(".sth-stage-tilt", "rotateX", { duration: 0.7, ease: "power3.out" });

        const onMove = (event: MouseEvent) => {
          const box = node.getBoundingClientRect();
          const x = (event.clientX - box.left) / box.width - 0.5;
          const y = (event.clientY - box.top) / box.height - 0.5;
          tiltY(x * 7);
          tiltX(-y * 5);
          shots.forEach((el, i) => {
            const depth = (i + 1) * 6;
            gsap.to(el, {
              x: x * depth,
              y: y * depth,
              duration: 0.85,
              ease: "power3.out",
              overwrite: "auto",
            });
          });
        };

        const onLeave = () => {
          tiltY(0);
          tiltX(0);
          gsap.to(shots, { x: 0, y: 0, duration: 0.9, ease: "power3.out" });
        };

        node.addEventListener("mousemove", onMove);
        node.addEventListener("mouseleave", onLeave);
        cleanups.push(() => {
          node.removeEventListener("mousemove", onMove);
          node.removeEventListener("mouseleave", onLeave);
        });
      }

      mark(0);
      const cycle = gsap.delayedCall(2.6, () => {
        if (!hovered) mark((hot + 1) % shots.length);
        cycle.restart(true);
      });

      shots.forEach((el, i) => {
        const enter = () => {
          hovered = true;
          mark(i);
        };
        const leave = () => {
          hovered = false;
        };
        el.addEventListener("mouseenter", enter);
        el.addEventListener("mouseleave", leave);
        cleanups.push(() => {
          el.removeEventListener("mouseenter", enter);
          el.removeEventListener("mouseleave", leave);
        });
      });

      chips.forEach((el, i) => {
        const activate = () => {
          hovered = true;
          mark(i);
        };
        const rest = () => {
          hovered = false;
        };
        el.addEventListener("mouseenter", activate);
        el.addEventListener("mouseleave", rest);
        el.addEventListener("focus", activate);
        el.addEventListener("blur", rest);
        el.addEventListener("click", activate);
        cleanups.push(() => {
          el.removeEventListener("mouseenter", activate);
          el.removeEventListener("mouseleave", rest);
          el.removeEventListener("focus", activate);
          el.removeEventListener("blur", rest);
          el.removeEventListener("click", activate);
        });
      });

      const count = node.querySelector<HTMLElement>(".sth-count");
      if (count) {
        const state = { n: 0 };
        gsap.to(state, {
          n: 4,
          duration: 1.4,
          ease: "power2.out",
          delay: 0.45,
          onUpdate: () => {
            count.textContent = String(Math.round(state.n)).padStart(2, "0");
          },
        });
      }

      requestAnimationFrame(() => ScrollTrigger.refresh());
    }, node);

    return () => {
      cleanups.forEach((fn) => fn());
      ctx.revert();
    };
  }, []);

  return (
    <section ref={root} className="sth-hero keep-dark">
      <div className="sth-atmosphere" aria-hidden>
        <div className="sth-bg-shift">
          <div className="sth-bg">
            <ThemePhoto
              light={photos.deals.light}
              dark={photos.deals.dark}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
        <div className="sth-veil" />
        <div className="sth-slash" />
        <div className="sth-grid" />
        <div className="sth-grain" />
        <span className="sth-orb sth-orb-a" />
        <span className="sth-orb sth-orb-b" />
      </div>

      <p className="sth-wm font-nohemi" aria-hidden>
        04
      </p>
      <p className="sth-spine font-manrope">Investment Strategies</p>

      <div className="sth-shell">
        <div className="sth-copy">
          <p className="sth-kicker">
            <span className="sth-count">00</span>
            <span>Buy-boxes · Egyptian desks</span>
          </p>
          <p className="sth-script font-mariyam">playbooks</p>
          <h1 className="sth-title">
            {headline.map((word) => (
              <span key={word} className="sth-line">
                <span className={`sth-word${word === "Strategies" ? " is-gold" : ""}`}>{word}</span>
              </span>
            ))}
          </h1>
          <p className="sth-lede">
            Specialized real estate acquisition for high-volume investors — wholesale, fix &amp; flip,
            turnkey &amp; BRRRR, and creative finance, sourced by desks trained in U.S. markets.
          </p>
          <div className="sth-cta">
            <ClaimSeatCta />
            <button type="button" className="sth-scroll" onClick={() => scrollToTarget("#strategies")}>
              <span className="sth-scroll-mark" aria-hidden>
                <span />
              </span>
              Scroll the playbooks
            </button>
          </div>
        </div>

        <div className="sth-stage">
          <div className="sth-stage-tilt">
            <svg className="sth-arc" viewBox="0 0 640 520" fill="none" aria-hidden>
              <path
                className="sth-arc-path"
                d="M72 430C128 220 214 86 332 118C458 152 486 318 568 92"
                stroke="currentColor"
                strokeWidth="1.4"
              />
            </svg>

            {playbooks.map((book, i) => (
              <article key={book.n} className={`sth-shot sth-shot-${i + 1}`}>
                <div className="sth-shot-inner">
                  <ThemePhoto
                    light={book.photo.light}
                    dark={book.photo.dark}
                    alt={book.name}
                    className="sth-shot-img h-full w-full object-cover"
                  />
                  <span className="sth-shot-wash" />
                  <div className="sth-shot-meta">
                    <span>{book.n}</span>
                    <strong>{book.name}</strong>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        <ul className="sth-rail">
          {playbooks.map((book, i) => (
            <li key={book.n}>
              <button type="button" className={`sth-chip${i === 0 ? " is-hot" : ""}`}>
                <span>{book.n}</span>
                {book.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
