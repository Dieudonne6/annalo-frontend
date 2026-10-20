import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import { useUI } from "../../context/UIContext";
import { firstName, initial } from "../../lib/format";
import SectionLink from "../common/SectionLink";

const LINKS = [
  { to: "categories", label: "Catégories" },
  { to: "catalogue", label: "Catalogue" },
  { to: "tarifs", label: "Tarifs" },
  { to: "annonces", label: "Annonces" },
  { to: "contribuer", label: "Contribuer" },
];

/** "site-header" de la maquette, avec le menu mobile ("mobile-nav" / burger). */
export default function Header() {
  const { isAuthenticated, user } = useAuth();
  const { openModal } = useUI();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // La maquette affiche "mobile-nav" via la classe body.nav-open.
  useEffect(() => {
    document.body.classList.toggle("nav-open", isNavOpen);
    return () => document.body.classList.remove("nav-open");
  }, [isNavOpen]);

  const closeNav = () => setIsNavOpen(false);

  function openAuthOrAccount() {
    closeNav();
    openModal(isAuthenticated ? "account" : "auth");
  }

  return (
    <header id="site-header" className={isScrolled ? "scrolled" : ""}>
      <div className="wrap nav">
        <Link to="/" className="brand" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          <span className="mark">A</span> Annalo
        </Link>
        <nav className="nav-links">
          {LINKS.map((l) => (
            <SectionLink key={l.to} to={l.to}>{l.label}</SectionLink>
          ))}
        </nav>
        <div className="nav-actions">
          {isAuthenticated ? (
            <button className="profile-chip" id="btn-profile-desktop" onClick={openAuthOrAccount}>
              <span className="avatar">{initial(user?.full_name)}</span>
              <span className="user-name-chip">{firstName(user?.full_name)}</span>
            </button>
          ) : (
            <button className="btn btn-navy" id="btn-login-desktop" onClick={openAuthOrAccount}>
              Connexion
            </button>
          )}
          <button className="burger" onClick={() => setIsNavOpen((v) => !v)} aria-label="Menu" aria-expanded={isNavOpen}>
            <svg viewBox="0 0 24 24">
              {isNavOpen ? (
                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </div>
      <div className="mobile-nav" id="mobile-nav">
        {LINKS.map((l) => (
          <SectionLink key={l.to} to={l.to} onNavigate={closeNav}>{l.label}</SectionLink>
        ))}
        <div className="mn-actions">
          {isAuthenticated ? (
            <button className="btn btn-outline on-light" onClick={openAuthOrAccount}>Mon compte</button>
          ) : (
            <button className="btn btn-navy" onClick={openAuthOrAccount}>Connexion</button>
          )}
        </div>
      </div>
    </header>
  );
}
