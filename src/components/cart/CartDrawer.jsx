import { useCart } from "../../context/CartContext";
import Button from "../common/Button";

/**
 * Correspond à "cart-drawer" / "cart-body" / "cart-foot" / "cart-total".
 * TODO (Claude Code): brancher le bouton de paiement sur
 * initiatePayment({ purpose: "cart" }) (src/api/payments.js) puis rediriger
 * vers le `payment_url` FedaPay renvoyé.
 */
export default function CartDrawer() {
  const { cart, isDrawerOpen, closeDrawer, removeItem } = useCart();

  if (!isDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-ink/50" onClick={closeDrawer} id="cart-backdrop" />
      <div className="relative flex h-full w-full max-w-sm flex-col bg-white2 p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-navy">Mon panier</h3>
          <button onClick={closeDrawer} aria-label="Fermer">✕</button>
        </div>

        <div id="cart-body" className="flex-1 space-y-3 overflow-y-auto">
          {cart.items.length === 0 && (
            <p className="text-sm text-text-soft">Ton panier est vide.</p>
          )}
          {cart.items.map((item) => (
            <div key={item.id} className="flex items-center justify-between rounded-xl border border-text-faint/20 p-3">
              <div>
                <p className="font-semibold">{item.paper.subject} — {item.paper.exam}</p>
                <p className="text-sm text-text-soft">{item.paper.session_year}</p>
              </div>
              <button onClick={() => removeItem(item.id)} className="text-brick">Retirer</button>
            </div>
          ))}
        </div>

        <div id="cart-foot" className="mt-4 border-t border-text-faint/20 pt-4">
          <p id="cart-total" className="mb-3 text-lg font-bold">
            Total : {cart.total} FCFA
          </p>
          <Button className="w-full" disabled={cart.items.length === 0}>
            Payer maintenant
          </Button>
        </div>
      </div>
    </div>
  );
}
