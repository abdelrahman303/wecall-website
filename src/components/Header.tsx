import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";
import { BrandLogo } from "./BrandLogo";
import { ClaimSeatCta } from "./ClaimSeatCta";

type Props = {
  onOpenMenu: () => void;
};

export function Header({ onOpenMenu }: Props) {
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let last = window.scrollY;
    let raf = 0;
    const apply = () => {
      raf = 0;
      const y = window.scrollY;
      const mobile = window.matchMedia("(max-width: 767px)").matches;
      const nextHidden = !mobile && y > last && y > 90;
      const nextScrolled = y > 16;
      setHidden((prev) => (prev === nextHidden ? prev : nextHidden));
      setScrolled((prev) => (prev === nextScrolled ? prev : nextScrolled));
      last = y;
    };
    const onScroll = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(apply);
    };
    apply();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <header className={`site-header ${hidden ? "is-hidden" : ""} ${scrolled ? "is-scrolled" : ""}`}>
      <div className="site-nav">
        <div className="nav-side nav-side-left">
          <button type="button" onClick={onOpenMenu} className="nav-menu">
            Menu
            <span className="nav-chevron" aria-hidden />
          </button>
          <NavLink to="/about" className="nav-link">
            About Us
          </NavLink>
          <NavLink to="/services" className="nav-link">
            Services
          </NavLink>
        </div>

        <Link to="/" className="nav-logo" aria-label="WeCall home">
          <BrandLogo />
        </Link>

        <div className="nav-side nav-side-right">
          <ThemeToggle />
          <ClaimSeatCta compact tight />
        </div>
      </div>
    </header>
  );
}
