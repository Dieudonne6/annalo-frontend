import { useState } from "react";
import { Link } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import AuthModal from "../auth/AuthModal";

/**
 * TODO (Claude Code): ajouter le menu mobile ("mobile-nav" / "burger-icon")
 * et le chip utilisateur ("chip-avatar" / "chip-name") une fois connecté.
 */
export default function Header() {
  const { isAuthenticated, user } = useAuth();
  const { count, openDrawer } = useCart();
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-text-faint/10 bg-white2/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="text-xl font-bold text-navy">Annalo</Link>

        <nav className="hidden items-center gap-6 md:flex">
          <a href="#catalogue" className="text-sm font-medium text-text-soft hover:text-navy">Catalogue</a>
          <a href="#abonnements" className="text-sm font-medium text-text-soft hover:text-navy">Abonnements</a>
          <a href="#contribuer" className="text-sm font-medium text-text-soft hover:text-navy">Contribuer</a>
        </nav>

        <div className="flex items-center gap-3">
          <button onClick={openDrawer} id="cart-fab" className="relative">
            🛒
            {count > 0 && (
              <span id="cart-fab-count" className="absolute -right-2 -top-2 rounded-full bg-gold px-1.5 text-xs text-white2">
                {count}
              </span>
            )}
          </button>

          {isAuthenticated ? (
            <Link to="/compte" id="chip-name" className="font-semibold text-navy">
              {user?.full_name}
            </Link>
          ) : (
            <button
              id="btn-login-desktop"
              onClick={() => setIsAuthOpen(true)}
              className="rounded-xl bg-navy px-4 py-2 text-sm font-semibold text-white2"
            >
              Se connecter
            </button>
          )}
        </div>
      </div>

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </header>
  );
}
