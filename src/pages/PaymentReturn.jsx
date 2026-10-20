import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { verifyPayment } from "../api/payments";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { apiErrorMessage, clearPendingPayment, readPendingPayment } from "../lib/api-helpers";
import { formatPrice } from "../lib/format";

const MESSAGES = {
  success: ["Paiement confirmé", "Merci ! Ton accès est débloqué : retrouve tes sujets dans le catalogue."],
  pending: ["Paiement en attente", "FedaPay n'a pas encore confirmé ton paiement. Valide-le sur ton téléphone puis vérifie à nouveau."],
  failed: ["Paiement échoué", "Le paiement n'a pas abouti. Aucun montant n'a été débité ; tu peux réessayer."],
  cancelled: ["Paiement annulé", "Tu as annulé le paiement. Ton panier est conservé."],
};

/**
 * Page de retour FedaPay (PAYMENT_CALLBACK_URL côté backend) : vérifie le
 * paiement démarré juste avant (id gardé en sessionStorage).
 */
export default function PaymentReturn() {
  const { isAuthenticated, isLoading } = useAuth();
  const { refresh: refreshCart } = useCart();
  const [paymentId] = useState(readPendingPayment);
  const [payment, setPayment] = useState(null);
  const [error, setError] = useState("");
  const [isChecking, setIsChecking] = useState(false);

  const check = useCallback(async () => {
    setIsChecking(true);
    setError("");
    try {
      const { data } = await verifyPayment(paymentId);
      setPayment(data);
      if (data.status !== "pending") clearPendingPayment();
      if (data.status === "success") refreshCart().catch(() => {});
    } catch (err) {
      setError(apiErrorMessage(err, "Impossible de vérifier le paiement pour le moment."));
    } finally {
      setIsChecking(false);
    }
  }, [paymentId, refreshCart]);

  useEffect(() => {
    if (paymentId && isAuthenticated) check();
  }, [paymentId, isAuthenticated]); // eslint-disable-line react-hooks/exhaustive-deps

  let title;
  let text;
  if (!paymentId) {
    [title, text] = ["Aucun paiement en cours", "Nous n'avons pas trouvé de paiement à vérifier depuis ce navigateur. Consulte l'onglet Paiements de ton compte."];
  } else if (!isLoading && !isAuthenticated) {
    [title, text] = ["Connecte-toi", "Connecte-toi avec le compte qui a effectué le paiement pour voir son statut."];
  } else if (payment) {
    [title, text] = MESSAGES[payment.status] ?? MESSAGES.pending;
  } else {
    [title, text] = ["Vérification du paiement…", "Un instant, on interroge FedaPay."];
  }

  return (
    <main>
      <section className="page-banner">
        <div className="wrap">
          <div className="eyebrow">Paiement</div>
          <h1>{title}</h1>
          <p>{text}</p>
          {payment && (
            <p className="payment-amount">Montant : <strong>{formatPrice(payment.amount)}</strong></p>
          )}
          {error && <div className="form-error">{error}</div>}
          <div className="hero-cta">
            {payment?.status === "pending" || error ? (
              <button className="btn btn-navy" onClick={check} disabled={isChecking}>
                {isChecking ? "Vérification…" : "Vérifier à nouveau"}
              </button>
            ) : null}
            <Link className="btn btn-outline on-light" to="/#catalogue">Retour au catalogue</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
