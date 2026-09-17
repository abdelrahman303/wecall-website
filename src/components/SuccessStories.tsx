import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ClaimSeatCta } from "./ClaimSeatCta";
import { ThemePhoto } from "./ThemePhoto";
import { photos } from "../media";
import { scheduleRefresh } from "../lib/motion";

gsap.registerPlugin(ScrollTrigger);

const ticker = [
  "$24,000 spread",
  "44 CRM leads",
  "6 flip contracts",
  "4 deals / month",
  "90%+ satisfaction",
  "48-hour recovery",
  "Hashed under NDA",
  "Zero public recordings",
];

const cases = [
  {
    id: "01",
    kind: "win" as const,
    kicker: "Case 01 · Starter Desk",
    tier: "$1,500/mo",
    label: "The Solo Wholesaler",
    metric: "$24K",
    metricLabel: "wholesale spread in month one",
    chips: ["1 caller + 10k records", "44 pre-vetted leads", "2 assignments closed"],
    who: "James Taylor",
    firm: "TX Properties LLC",
    market: "Dallas, TX",
    email: "james.t@txproperties.com",
    phone: "+1 (817) 492-8371",
    quote:
      "We were burning thousands on Upwork freelancers who couldn't handle basic seller objections. Switched to a Starter desk to feed my own pipeline. The caller is trained on the 4 pillars, and leads land in GHL with clean notes. Two wholesale deals in Tarrant County in month one — it covers its own overhead if you work the data.",
    photo: photos.deals,
    script: "month one",
  },
  {
    id: "02",
    kind: "win" as const,
    kicker: "Case 02 · Upcoming Millionaire",
    tier: "$5,500/mo",
    label: "The Fix & Flip Operator",
    metric: "06",
    metricLabel: "fix-and-flip contracts in 90 days",
    chips: ["3 callers + 1 AM", "comps & offers in-house", "~$84k net in 3 months"],
    who: "Elena Carter",
    firm: "Suncoast Capital",
    market: "Tampa, FL",
    email: "e.carter@suncoastcapital.com",
    phone: "+1 (813) 745-9210",
    quote:
      "I don't have time on the dialer or initial seller negotiations while managing rehab sites. We took a Millionaire seat so their team handles calling and our AM runs comps and offers. Six fix-and-flip properties in 90 days. Solid pipeline without micromanaging the front end.",
    photo: photos.flip,
    script: "ninety days",
  },
  {
    id: "03",
    kind: "win" as const,
    kicker: "Case 03 · Custom Scaler",
    tier: "7 callers + 2 AMs",
    label: "The Portfolio Scaler",
    metric: "04",
    metricLabel: "closed deals every month",
    chips: ["7 callers + 2 closers", "contracts to email", "hands-off signatures"],
    who: "Marcus Vance",
    firm: "Midwest Equities",
    market: "Columbus, OH",
    email: "mvance@midwestequities.com",
    phone: "+1 (614) 832-4911",
    quote:
      "We scaled to a custom desk once the script and buy-box were dialed in. Now we run 7 callers and 2 closers through them. I get a notification when a contract needs a signature. A few weeks to iron out the market data, then a steady 4 deals a month — so I could step back and scale the STR portfolio overseas.",
    photo: photos.seats,
    script: "hands off",
  },
  {
    id: "04",
    kind: "fix" as const,
    kicker: "Operational Transparency",
    tier: "Starter · adjustment",
    label: "How We Handle Friction",
    metric: "48h",
    metricLabel: "skip-trace + dialer recovery",
    chips: ["Week-one disconnects", "Moe Kotait + QA stepped in", "Flow back above benchmark"],
    who: "Brian Miller",
    firm: "Keystone Partners",
    market: "Atlanta, GA",
    email: "b.miller@keystonepartners.com",
    phone: "+1 (404) 581-2294",
    quote:
      "We had a rough first week where the local data in our target submarket underperformed. Moe and his team recleaned the lists and adjusted dialer filters. Since that bottleneck was fixed, lead quality has been solid. Good to work with an outfit that actually picks up the phone.",
    photo: photos.nightDesk,
    script: "we pick up",
  },
];

function hashEmail(email: string) {
  const [user = "", domain = ""] = email.split("@");
  const dot = domain.indexOf(".");
  const host = dot === -1 ? domain : domain.slice(0, dot);
  const tld = dot === -1 ? "" : domain.slice(dot);
  return `${user.slice(0, 1)}••••@${host.slice(0, 1)}••••${tld}`;
}

function hashPhone() {
  return "+1 (•••) •••-••••";
}

export function SuccessStories() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const node = root.current;
    if (!node) return;

    const films = Array.from(node.querySelectorAll<HTMLElement>(".ss-track > .ss-film"));
    const strip = node.querySelector<HTMLElement>(".ss-filmstrip");
    const track = node.querySelector<HTMLElement>(".ss-track");
    const bar = node.querySelector<HTMLElement>(".ss-scrub-bar");
    const idxEl = node.querySelector<HTMLElement>(".ss-rail-idx");
    const nameEl = node.querySelector<HTMLElement>(".ss-rail-name");
    const metricEl = node.querySelector<HTMLElement>(".ss-rail-metric");
    const capEl = node.querySelector<HTMLElement>(".ss-rail-cap");
    const dots = Array.from(node.querySelectorAll<HTMLElement>(".ss-dot"));
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const desktopMq = window.matchMedia("(min-width: 768px)");
    const isDesktop = () => desktopMq.matches;
    let active = 0;
    let pinSt: ScrollTrigger | undefined;

    const paint = (index: number, progress = 0) => {
      const next = ((index % cases.length) + cases.length) % cases.length;
      if (next !== active) {
        active = next;
        films.forEach((el, i) => el.classList.toggle("is-on", i === next));
        dots.forEach((el) => el.classList.toggle("is-on", Number(el.dataset.i) === next));
        const item = cases[next];
        if (idxEl) idxEl.textContent = item.id;
        if (nameEl) nameEl.textContent = item.label;
        if (metricEl) metricEl.textContent = item.metric;
        if (capEl) capEl.textContent = item.metricLabel;
      }
      if (bar) bar.style.transform = `scaleX(${Math.max(0.06, progress)})`;
    };

    paint(0, 0.06);

    const slideTo = (index: number) => {
      if (!track) return;
      const next = ((index % cases.length) + cases.length) % cases.length;
      const film = films[next];
      if (!film) return;
      const pad = Number.parseFloat(window.getComputedStyle(track).paddingLeft) || 0;
      const wrap = active === cases.length - 1 && next === 0;
      if (wrap) track.style.transition = "none";
      track.style.transform = `translate3d(${-(film.offsetLeft - pad)}px,0,0)`;
      paint(next, next / Math.max(cases.length - 1, 1));
      if (wrap) {
        track.offsetWidth;
        requestAnimationFrame(() => {
          track.style.transition = "";
        });
      }
    };

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add("(max-width: 767px)", () => {
        gsap.set(".ss-sec .tr-arc", { strokeDashoffset: 55 });
      });

      mm.add("(min-width: 768px)", () => {
        gsap.from(".ss-head-in", {
          y: 36,
          opacity: 0,
          stagger: 0.08,
          duration: 0.85,
          ease: "power3.out",
          scrollTrigger: { trigger: root.current, start: "top 78%" },
        });

        if (!reduce) {
          gsap.to(".ss-script", {
            yPercent: -18,
            ease: "none",
            scrollTrigger: {
              trigger: root.current,
              start: "top bottom",
              end: "top top",
              scrub: 1,
            },
          });
        }

        gsap.fromTo(
          ".ss-sec .tr-arc",
          { strokeDashoffset: 553 },
          {
            strokeDashoffset: 55,
            duration: reduce ? 0 : 1.4,
            ease: "power2.out",
            scrollTrigger: { trigger: ".ss-sec .tr-meter", start: "top 85%" },
          },
        );

        if (reduce || !strip || !track) return;

        const getX = () => -(track.scrollWidth - strip.clientWidth);

        gsap.to(track, {
          x: getX,
          ease: "none",
          scrollTrigger: {
            trigger: ".ss-pin",
            start: "top top",
            end: () => `+=${Math.max(track.scrollWidth - strip.clientWidth, window.innerHeight * 1.6)}`,
            pin: true,
            scrub: 0.85,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              pinSt = self;
              const i = Math.min(cases.length - 1, Math.round(self.progress * (cases.length - 1)));
              paint(i, self.progress);
            },
          },
        });
      });
    }, root);

    let autoTimer = 0;
    let resumeTimer = 0;
    let inView = false;
    let startX = 0;
    let io: IntersectionObserver | undefined;

    const stopAuto = () => {
      window.clearInterval(autoTimer);
      autoTimer = 0;
      window.clearTimeout(resumeTimer);
    };

    const startAuto = () => {
      if (isDesktop() || reduce || autoTimer) return;
      autoTimer = window.setInterval(() => slideTo(active + 1), 3400);
    };

    const pauseAuto = () => {
      window.clearInterval(autoTimer);
      autoTimer = 0;
      window.clearTimeout(resumeTimer);
    };

    const resumeAuto = () => {
      window.clearTimeout(resumeTimer);
      resumeTimer = window.setTimeout(() => {
        if (inView) startAuto();
      }, 2800);
    };

    const onDotPointer = (event: Event) => {
      const pointer = event as PointerEvent;
      if (typeof pointer.button === "number" && pointer.button !== 0) return;
      event.preventDefault();
      event.stopPropagation();
      const button = event.currentTarget as HTMLElement;
      const i = Number(button.dataset.i || 0);
      if (isDesktop()) {
        if (pinSt) {
          pinSt.scroll(pinSt.start + (pinSt.end - pinSt.start) * (i / Math.max(cases.length - 1, 1)));
        }
        return;
      }
      pauseAuto();
      slideTo(i);
      resumeAuto();
    };

    const onStripDown = (event: PointerEvent) => {
      if (isDesktop()) return;
      startX = event.clientX;
      pauseAuto();
    };

    const onStripUp = (event: PointerEvent) => {
      if (isDesktop()) return;
      const dx = event.clientX - startX;
      if (dx < -40) slideTo(active + 1);
      else if (dx > 40) slideTo(active - 1);
      resumeAuto();
    };

    dots.forEach((dot) => {
      dot.addEventListener("pointerdown", onDotPointer);
      dot.addEventListener("click", onDotPointer);
    });

    if (!isDesktop() && strip && track) {
      io = new IntersectionObserver(
        ([entry]) => {
          inView = Boolean(entry?.isIntersecting);
          if (inView && !reduce) startAuto();
          else pauseAuto();
        },
        { threshold: 0.25 },
      );
      io.observe(strip);
      strip.addEventListener("pointerdown", onStripDown, { passive: true });
      strip.addEventListener("pointerup", onStripUp, { passive: true });
      strip.addEventListener("pointercancel", resumeAuto);
    }

    if (isDesktop()) scheduleRefresh();

    return () => {
      stopAuto();
      io?.disconnect();
      strip?.removeEventListener("pointerdown", onStripDown);
      strip?.removeEventListener("pointerup", onStripUp);
      strip?.removeEventListener("pointercancel", resumeAuto);
      dots.forEach((dot) => {
        dot.removeEventListener("pointerdown", onDotPointer);
        dot.removeEventListener("click", onDotPointer);
      });
      if (track && !isDesktop()) track.style.transform = "";
      ctx.revert();
    };
  }, []);

  return (
    <section ref={root} id="proof" className="ss-sec keep-dark relative bg-ink text-white">
      <div className="ss-head relative overflow-x-clip px-4 pt-12 pb-6 md:px-10 md:pt-24 md:pb-8">
        <p className="ss-script pointer-events-none absolute top-6 left-1/2 z-0 -translate-x-1/2 font-mariyam text-[22vw] leading-none text-gold/15 md:top-4 md:text-[9.5vw]">
          successes
        </p>
        <div className="relative z-[1] mx-auto grid max-w-6xl items-center gap-6 lg:grid-cols-[1fr_280px] lg:gap-14">
          <div className="text-center lg:text-left">
            <p className="ss-head-in font-manrope text-[11px] tracking-[0.32em] text-gold uppercase">
              Reviews & Success Stories
            </p>
            <h2 className="ss-head-in mt-3 font-nohemi text-[34px] leading-[0.9] font-medium md:text-[76px]">
              Proof Over Promises
            </h2>
            <p className="ss-head-in mt-3 font-mariyam text-[28px] leading-none text-gold md:mt-4 md:text-[48px]">
              Verified. Zero fluff.
            </p>
            <p className="ss-head-in mx-auto mt-4 max-w-2xl font-manrope text-[14px] leading-relaxed text-white/70 lg:mx-0 md:mt-5 md:text-[17px]">
              We don&apos;t sell fantasy margins. These are live desk results from the capped
              acquisition boardroom — identities hashed to honor NDAs and active escrows.
            </p>
            <p className="ss-head-in mt-5 font-manrope text-[11px] tracking-[0.22em] text-white/40 uppercase md:hidden">
              Auto-plays · swipe anytime
            </p>
          </div>
          <div className="ss-head-in tr-meter keep-dark mx-auto">
            <svg viewBox="0 0 200 200" aria-hidden>
              <circle className="tr-track" cx="100" cy="100" r="88" />
              <circle className="tr-arc" cx="100" cy="100" r="88" />
            </svg>
            <div className="tr-meter-copy">
              <p>90%+</p>
              <span className="tr-meter-full">Overall customer satisfaction</span>
              <span className="tr-meter-short">Satisfaction</span>
            </div>
          </div>
        </div>
      </div>

      <div className="ss-ticker border-y border-gold/20 py-3 md:py-4">
        <div className="marquee-track flex w-max items-center font-manrope text-[12px] font-medium tracking-[0.22em] text-gold uppercase md:text-[18px]">
          {Array.from({ length: 2 }).map((_, loop) => (
            <span key={loop} className="flex items-center">
              {ticker.map((item) => (
                <span key={`${loop}-${item}`} className="flex items-center px-5 md:px-8">
                  <span className="ss-ticker-dot" />
                  {item}
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      <div className="ss-pin">
        <div className="ss-stage">
          <aside className="ss-rail">
            <p className="font-manrope text-[11px] tracking-[0.28em] text-gold uppercase">Now on desk</p>
            <p className="ss-rail-idx mt-5 font-nohemi text-[64px] leading-none text-gold">01</p>
            <h3 className="ss-rail-name mt-4 font-nohemi text-[32px] leading-[0.95] font-medium">
              The Solo Wholesaler
            </h3>
            <p className="ss-rail-metric mt-6 font-nohemi text-[56px] leading-none text-gold">$24K</p>
            <p className="ss-rail-cap mt-2 font-manrope text-[12px] tracking-[0.16em] text-white/55 uppercase">
              wholesale spread in month one
            </p>
            <div className="ss-dots mt-10">
              {cases.map((item, i) => (
                <button
                  key={item.id}
                  type="button"
                  className={`ss-dot ${i === 0 ? "is-on" : ""}`}
                  data-i={i}
                  tabIndex={-1}
                  aria-label={`Show ${item.label}`}
                />
              ))}
            </div>
            <p className="mt-6 font-manrope text-[11px] tracking-[0.18em] text-white/40 uppercase">
              Scroll to move through the boardroom
            </p>
          </aside>

          <div className="ss-filmstrip" data-lenis-prevent>
            <div className="ss-track">
              {cases.map((item, i) => (
                <article key={item.id} className={`ss-film ${item.kind} ${i === 0 ? "is-on" : ""}`}>
                  <div className="ss-film-photo">
                    <ThemePhoto
                      light={item.photo.light}
                      dark={item.photo.dark}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="ss-film-veil" />
                  <p className="ss-film-mark">{item.id}</p>
                  <div className="ss-film-copy">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      <p className="font-manrope text-[10px] tracking-[0.22em] text-gold uppercase md:text-[11px]">
                        {item.kicker}
                      </p>
                      <p className="font-manrope text-[10px] tracking-[0.14em] text-white/55 uppercase">
                        {item.tier}
                      </p>
                    </div>
                    <h3 className="mt-2 font-nohemi text-[26px] leading-[0.95] md:text-[42px]">{item.label}</h3>
                    <p className="ss-film-metric">{item.metric}</p>
                    <p className="ss-film-cap">{item.metricLabel}</p>
                    <ul className="ss-chips">
                      {item.chips.map((chip) => (
                        <li key={chip}>{chip}</li>
                      ))}
                    </ul>
                    <blockquote className="ss-film-quote">“{item.quote}”</blockquote>
                    <div className="ss-file">
                      <span>Classified</span>
                      <p>
                        <b className="ss-hash">{item.who}</b>
                        <em> · {item.market}</em>
                      </p>
                      <p className="ss-hash">
                        {hashEmail(item.email)} · {hashPhone()}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
          <div className="ss-dots ss-dots-mobile" data-lenis-prevent>
            {cases.map((item, i) => (
              <button
                key={`m-${item.id}`}
                type="button"
                className={`ss-dot ${i === 0 ? "is-on" : ""}`}
                data-i={i}
                tabIndex={-1}
                aria-label={`Show ${item.label}`}
              />
            ))}
          </div>
        </div>
        <div className="ss-scrub hidden md:block" aria-hidden>
          <span className="ss-scrub-bar" />
        </div>
      </div>

      <div className="ss-close">
        <div className="ss-close-photo">
          <ThemePhoto
            light={photos.office.light}
            dark={photos.office.dark}
            alt=""
            className="h-full w-full object-cover"
          />
        </div>
        <div className="ss-close-veil" />
        <div className="relative z-[1] mx-auto max-w-3xl px-5 py-14 text-center md:py-24">
          <p className="font-manrope text-[11px] tracking-[0.28em] text-gold uppercase">
            The Confidentiality Guarantee
          </p>
          <h3 className="mt-3 font-nohemi text-[28px] leading-[0.95] md:text-[56px]">
            Audition the elite caller roster
          </h3>
          <p className="mt-2 font-mariyam text-[26px] leading-none text-gold md:text-[40px]">private review</p>
          <p className="mx-auto mt-5 max-w-xl font-manrope text-[14px] leading-relaxed text-white/75 md:text-[16px]">
            Live seller recordings stay off the public web — we run active escrows under strict NDAs.
            Hear the roster on a private strategy call. We walk redacted call logs and CRM workflows
            in the session.
          </p>
          <div className="mt-8 flex justify-center">
            <ClaimSeatCta />
          </div>
          <p className="mt-4 font-manrope text-[11px] tracking-[0.18em] text-white/50 uppercase">
            Limited-time discount · capped at 10 desks
          </p>
        </div>
      </div>
    </section>
  );
}
