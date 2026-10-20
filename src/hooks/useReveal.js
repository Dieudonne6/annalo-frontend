import { useEffect } from "react";

const SELECTORS =
  ".section-head, .cat-grid, .catalogue-panel, .steps, .annonce-grid, .plan-grid, .contrib-band, .stats-strip .stats-row";

/**
 * Apparition au défilement de la maquette (classes .reveal / .in), appliquée
 * aux blocs présents dans `rootRef` au montage.
 */
export default function useReveal(rootRef) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    const targets = root.querySelectorAll(SELECTORS);
    if (!("IntersectionObserver" in window)) {
      targets.forEach((t) => t.classList.add("reveal", "in"));
      return undefined;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.01, rootMargin: "0px 0px -8% 0px" }
    );
    targets.forEach((t) => {
      t.classList.add("reveal");
      io.observe(t);
    });
    // Filet de sécurité de la maquette : ne jamais laisser du contenu invisible.
    const timer = setTimeout(() => targets.forEach((t) => t.classList.add("in")), 1800);
    return () => {
      io.disconnect();
      clearTimeout(timer);
    };
  }, [rootRef]);
}
