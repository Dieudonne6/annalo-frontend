import { useState } from "react";

import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { useUI } from "../../context/UIContext";
import { apiErrorMessage, startPayment } from "../../lib/api-helpers";
import { formatPrice } from "../../lib/format";
import { CloseIcon, DocIcon } from "../../lib/icons";

/**
 * "cart-drawer" + "cart-fab" de la maquette. Le paiement redirige vers
 * FedaPay ; le retour se fait sur /paiement/retour.
 */
export default function CartDrawer() {
  const { isAuthenticated } = useAuth();
  const { cart, count, isDrawerOpen, openDrawer, closeDrawer, removeItem } = useCart();
  const { toast, requireAuth } = useUI();
  const [isPaying, setIsPaying] = useState(false);

  async function handleRemove(itemId) {
    try {
      await removeItem(itemId);
    } catch (err) {
      toast(apiErrorMessage(err));
    }
  }

  async function handleCheckout() {
    if (!requireAuth("Connecte-toi pour finaliser ton achat")) {
      closeDrawer();
      return;
    }
    setIsPaying(true);
    try {
      await startPayment({ purpose: "cart" });
    } catch (err) {
      toast(apiErrorMessage(err, "Le paiement n'a pas pu démarrer."));
      setIsPaying(false);
    }
  }

  return (
    <>
      <div className={`cart-drawer-backdrop ${isDrawerOpen ? "show" : ""}`} onClick={closeDrawer} />
      <aside className={`cart-drawer ${isDrawerOpen ? "open" : ""}`} aria-hidden={!isDrawerOpen}>
        <div className="cart-head">
          <h3>Mon panier</h3>
          <button className="modal-close" style={{ position: "static" }} onClick={closeDrawer} aria-label="Fermer">
            <CloseIcon />
          </button>
        </div>
        <div className="cart-body">
          {count === 0 ? (
            <div className="cart-empty-drawer">
              Ton panier est vide.<br />
              {isAuthenticated ? "Ajoute des sujets depuis le catalogue." : "Connecte-toi pour retrouver ton panier."}
            </div>
          ) : (
            cart.items.map((item) => (
              <div className="cart-row" key={item.id}>
                <div className="thumb"><DocIcon /></div>
                <div className="info">
                  <div className="m">{item.paper.subject}</div>
                  <div className="s">{item.paper.exam} · {item.paper.session_year}</div>
                </div>
                <div className="p">{formatPrice(item.paper.standalone_price)}</div>
                <button className="rm" onClick={() => handleRemove(item.id)} aria-label="Retirer">
                  <CloseIcon />
                </button>
              </div>
            ))
          )}
        </div>
        {count > 0 && (
          <div className="cart-foot">
            <div className="total-row"><span>Total</span><span>{formatPrice(cart.total)}</span></div>
            <button className="btn btn-gold" style={{ width: "100%" }} onClick={handleCheckout} disabled={isPaying}>
              {isPaying ? "Redirection vers le paiement…" : "Payer via Mobile Money"}
            </button>
          </div>
        )}
      </aside>
      <button className="cart-fab" onClick={openDrawer}>
        <DocIcon />
        Panier <span className="n">{count}</span>
      </button>
    </>
  );
}
