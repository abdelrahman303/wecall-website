import { useEffect, useLayoutEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useLenis } from "../hooks/useLenis";
import { Header } from "./Header";
import { Menu } from "./Menu";
import { Footer } from "./Footer";
import { scrollToTop } from "../lib/smoothScroll";
import { scheduleRefresh, watchInfiniteAnimations } from "../lib/motion";

export function Layout() {
  const [menu, setMenu] = useState(false);
  const location = useLocation();
  useLenis();

  useLayoutEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    scrollToTop(false);
    const mobile = window.matchMedia("(max-width: 767px)").matches;
    if (mobile) {
      scheduleRefresh();
      return;
    }
    const timer = window.setTimeout(() => {
      scrollToTop(false);
      scheduleRefresh();
    }, 40);
    const late = window.setTimeout(() => scrollToTop(false), 160);
    return () => {
      window.clearTimeout(timer);
      window.clearTimeout(late);
    };
  }, [location.pathname, location.key]);

  useEffect(() => watchInfiniteAnimations(document), [location.pathname]);

  useEffect(() => {
    const onNavClick = (event: MouseEvent) => {
      const link = (event.target as HTMLElement | null)?.closest("a");
      if (!link || link.target === "_blank") return;
      const href = link.getAttribute("href");
      if (
        !href ||
        href === "#" ||
        href.startsWith("#") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:")
      ) {
        return;
      }
      const url = new URL(href, window.location.href);
      if (url.origin !== window.location.origin) return;
      scrollToTop(false);
    };
    document.addEventListener("click", onNavClick, true);
    return () => document.removeEventListener("click", onNavClick, true);
  }, []);

  return (
    <div className="theme-page min-h-screen">
      <Header onOpenMenu={() => setMenu(true)} />
      <Menu open={menu} onClose={() => setMenu(false)} />
      <Outlet />
      <Footer />
    </div>
  );
}
