import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ClaimSeatCta } from "./ClaimSeatCta";
import { ThemePhoto } from "./ThemePhoto";
import { photos } from "../media";
import { scheduleRefresh } from "../lib/motion";

gsap.registerPlugin(ScrollTrigger);

const chapters = [
  {
    n: "01",
    kicker: "Who are we?",
    title: "About WeCall's Foundation",
    photo: photos.office,
    script: "not a BPO",
    copy: [
      "WeCall wasn't built by standard outsourcing middlemen. It was founded by active U.S. real estate acquisition managers who spent years inside the industry researching, testing, and perfecting the science of deal-sourcing.",
      "Having closed deals across wholesaling, fix-and-flips, and rental acquisitions, our team identified every major flaw in traditional BPOs—from poor data quality and unvetted leads to robotic callers. We engineered WeCall to fix those exact breakdowns, equipping real estate investors with clean data, true seller motivation, and real-world acquisition standards built from hands-on closing experience.",
    ],
  },
  {
    n: "02",
    kicker: "Turnkey acquisitions",
    title: "How WeCall Scales Your Business: Turnkey Acquisitions Built for Growth",
    photo: photos.desks,
    script: "zero lift",
    copy: [
      "Instead of managing entry-level freelancers, burning expensive lists, or dealing with unvetted data, WeCall operates as a high-yield extension of your acquisitions desk. We integrate seamlessly into your operation, handling recruitment, training, scripts, CRM setup, and campaign management from day one.",
      "Our cold callers source and qualify highly motivated sellers, then route warm transfers straight to our closing team to lock up contracts for you—requiring zero operational effort on your end. You retain total visibility to monitor daily leads, data, and active deals, with our team available at all times to adjust scripts, optimize workflows, or switch CRM configurations on demand. To guarantee white-glove quality and flawless execution, we cap our active client load to micromanage every campaign and maximize your ROI.",
    ],
  },
  {
    n: "03",
    kicker: "Capped at 10 seats",
    title: "Guaranteed Exclusivity: Capped Client Capacity for Maximum Quality",
    photo: photos.seats,
    script: "ten desks",
    copy: [
      "WeCall enforces a strict limit of just 10 active acquisition desks at any given time. This self-imposed cap guarantees that your campaign receives undivided operational attention—including dedicated agent training, continuous QA monitoring, and daily workflow optimization to maximize lead quality.",
      "To keep you fully informed, we deliver daily performance metrics straight to your inbox and provide 24/7 direct communication with our management team for complete peace of mind.",
    ],
  },
  {
    n: "04",
    kicker: "45 leads / agent",
    title: "Unmatched Lead Quality: Driven by Veteran Acquisition Training",
    photo: photos.deals,
    script: "veteran QA",
    copy: [
      "We deliver an average benchmark of 45 high-converting leads per agent through a training curriculum engineered by veteran Acquisition Managers. Having spent years cold calling, negotiating, and consistently closing deals, our managers built a custom framework designed to eliminate common BPO mistakes, pinpoint true seller motivation, and maximize your ROI.",
      "Every campaign receives personalized training adjustments tailored to your specific market needs, ensuring zero missed opportunities and consistent month-over-month performance.",
    ],
  },
  {
    n: "05",
    kicker: "14-day onboard",
    title: "The WeCall Guarantee: Security, Speed, and Strategic Growth",
    photo: photos.nightDesk,
    script: "your data",
    copy: [
      "We operate as your long-term growth partner, combining a swift 14-day onboarding process with complete operational security. Your proprietary data, seller lists, and contracts are protected under strict security protocols with 100% data ownership retained on your end.",
      "From day one, we align our success with yours—delivering rapid setup, full system transparency, and continuous campaign optimization designed to scale your portfolio for months and years to come.",
    ],
  },
];

const stats = [
  { n: 10, pad: 2, label: "Active desks at a time" },
  { n: 45, pad: 2, label: "Leads per agent / month" },
  { n: 14, pad: 2, label: "Day onboarding" },
  { n: 100, pad: 3, label: "Data ownership" },
];

const headline = ["Built", "for", "investors", "who", "want", "closed", "escrows,", "not", "another", "BPO."];

export function AboutNarrative() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".an-script", {
        y: 24,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: { trigger: root.current, start: "top 80%" },
      });

      gsap.from(".an-head-word", {
        y: 70,
        opacity: 0,
        rotateX: 50,
        stagger: 0.045,
        duration: 0.85,
        ease: "power3.out",
        scrollTrigger: { trigger: ".an-headline", start: "top 82%" },
      });

      gsap.from(".an-stat", {
        y: 40,
        opacity: 0,
        scale: 0.92,
        stagger: 0.1,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: { trigger: ".an-stats", start: "top 86%" },
      });

      gsap.utils.toArray<HTMLElement>(".an-stat-n").forEach((el) => {
        const end = Number(el.dataset.n || 0);
        const pad = Number(el.dataset.pad || 0);
        const state = { n: 0 };
        gsap.to(state, {
          n: end,
          duration: 1.35,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 90%" },
          onUpdate: () => {
            el.textContent = String(Math.round(state.n)).padStart(pad, "0");
          },
        });
      });

      const cards = gsap.utils.toArray<HTMLElement>(".an-stack-card");
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const mobile = window.matchMedia("(max-width: 767px)").matches;

      cards.forEach((card, i) => {
        gsap.set(card, { zIndex: i + 1, force3D: !mobile });
        if (reduce || i === cards.length - 1) return;

        gsap.to(card, {
          scale: mobile ? 0.97 : 0.96,
          ease: "none",
          force3D: !mobile,
          scrollTrigger: {
            trigger: cards[i + 1],
            start: mobile ? "top 92%" : "top 90%",
            end: mobile ? "top 58%" : "top 48%",
            scrub: 0.2,
          },
        });
      });
    }, root);

    scheduleRefresh();
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="relative bg-ink px-3 pt-10 pb-16 text-white md:px-10 md:pt-16 md:pb-28">
      <header className="mx-auto max-w-4xl text-center">
        <p className="an-script font-mariyam text-[36px] leading-none text-gold md:text-[64px]">about</p>
        <h2
          className="an-headline mt-3 font-nohemi text-[28px] leading-[0.95] font-medium md:text-[64px]"
          style={{ perspective: "800px" }}
        >
          {headline.map((word) => (
            <span key={word} className="an-head-word mr-[0.22em] inline-block origin-bottom">
              {word}
            </span>
          ))}
        </h2>
      </header>

      <div className="an-stats mx-auto mt-8 grid max-w-5xl grid-cols-2 gap-2 md:mt-12 md:grid-cols-4 md:gap-4">
        {stats.map((s) => (
          <article key={s.label} className="an-stat">
            <p className="an-stat-n font-nohemi text-[32px] leading-none text-gold md:text-[52px]" data-n={s.n} data-pad={s.pad}>
              {"".padStart(s.pad, "0")}
            </p>
            <p className="mt-2 font-manrope text-[10px] tracking-[0.14em] text-white/60 uppercase md:text-[12px]">
              {s.label}
            </p>
          </article>
        ))}
      </div>

      <div className="an-stack mx-auto mt-10 max-w-6xl md:mt-16">
        {chapters.map((c) => (
          <article key={c.n} className="an-stack-card keep-dark">
            <div className="an-stack-photo">
              <ThemePhoto light={c.photo.light} dark={c.photo.dark} alt="" className="h-full w-full object-cover" />
              <p className="font-mariyam">{c.script}</p>
            </div>
            <div className="an-stack-copy">
              <p className="font-manrope text-[11px] tracking-[0.22em] text-gold uppercase">
                {c.n} — {c.kicker}
              </p>
              <h3 className="mt-2 font-nohemi text-[26px] leading-[1.05] font-medium md:text-[42px]">{c.title}</h3>
              <div className="mt-3 space-y-3 font-manrope text-[15px] leading-relaxed text-white/85 md:mt-5 md:text-[18px]">
                {c.copy.map((p) => (
                  <p key={p.slice(0, 28)}>{p}</p>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="relative z-20 mx-auto mt-10 flex max-w-xl flex-col items-stretch gap-3 md:mt-14 md:flex-row md:justify-center">
        <ClaimSeatCta />
        <Link to="/pricing" className="hero-cta-ghost">
          Build Your Custom Desk
        </Link>
      </div>
    </section>
  );
}
