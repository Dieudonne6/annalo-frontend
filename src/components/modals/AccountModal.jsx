import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { fetchMyPayments } from "../../api/payments";
import { fetchMySubscriptions } from "../../api/subscriptions";
import { useAuth } from "../../context/AuthContext";
import { useUI } from "../../context/UIContext";
import { formatDate, formatPrice, initial, trackLabel } from "../../lib/format";
import Modal from "../common/Modal";

const SUB_STATUS = {
  pending: "En attente de paiement",
  active: "Actif",
  expired: "Expiré",
  cancelled: "Annulé",
};
const PAY_STATUS = { pending: "En attente", success: "Réussi", failed: "Échoué", cancelled: "Annulé" };
const PAY_PURPOSE = { subscription: "Abonnement", cart: "Achat de sujets" };

const CardIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 10h18M6 6h12a2 2 0 012 2v8a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2z" />
  </svg>
);
const BadgeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.4 6.8 19.1l1-5.8L3.5 9.2l5.9-.9L12 3z" />
  </svg>
);

/**
 * "modal-account" de la maquette. L'onglet "Mes sujets" de la maquette est
 * remplacé par les abonnements : le backend n'expose pas encore la liste des
 * épreuves achetées à l'unité.
 */
export default function AccountModal() {
  const { user, logout, isTeamMember } = useAuth();
  const { modal, closeModal, toast } = useUI();
  const isOpen = modal.name === "account";
  const [tab, setTab] = useState("subscriptions");
  const [subscriptions, setSubscriptions] = useState(null);
  const [payments, setPayments] = useState(null);

  useEffect(() => {
    if (!isOpen) return;
    setTab("subscriptions");
    fetchMySubscriptions()
      .then(({ data }) => setSubscriptions(data.results ?? data))
      .catch(() => setSubscriptions([]));
    fetchMyPayments()
      .then(({ data }) => setPayments(data.results ?? data))
      .catch(() => setPayments([]));
  }, [isOpen]);

  function handleLogout() {
    logout();
    closeModal();
    toast("Déconnecté(e)");
  }

  return (
    <Modal isOpen={isOpen && Boolean(user)} onClose={closeModal} className="modal-account">
      <div className="acc-header">
        <div className="acc-avatar">{initial(user?.full_name)}</div>
        <div className="acc-id">
          <div className="acc-name">{user?.full_name}</div>
          <div className="acc-phone">{user?.phone}</div>
        </div>
      </div>
      <div className="acc-tabs">
        <button className={tab === "subscriptions" ? "active" : ""} onClick={() => setTab("subscriptions")}>
          Mes abonnements
        </button>
        <button className={tab === "payments" ? "active" : ""} onClick={() => setTab("payments")}>
          Paiements
        </button>
      </div>

      {tab === "subscriptions" && (
        <div className="acc-panel">
          {subscriptions === null && <div className="acc-empty">Chargement…</div>}
          {subscriptions?.length === 0 && <div className="acc-empty">Tu n'as encore aucun abonnement.</div>}
          {subscriptions?.map((s) => (
            <div className="acc-row" key={s.id}>
              <div className="thumb"><BadgeIcon /></div>
              <div className="info">
                <div className="m">{s.plan.name}</div>
                <div className="s">
                  {trackLabel(s.plan.track)} · {SUB_STATUS[s.status] ?? s.status}
                  {s.expires_at && ` · jusqu'au ${formatDate(s.expires_at)}`}
                </div>
              </div>
              <div className="p">{formatPrice(s.plan.price)}</div>
            </div>
          ))}
        </div>
      )}

      {tab === "payments" && (
        <div className="acc-panel">
          {payments === null && <div className="acc-empty">Chargement…</div>}
          {payments?.length === 0 && <div className="acc-empty">Aucun paiement pour le moment.</div>}
          {payments?.map((p) => (
            <div className="acc-row" key={p.id}>
              <div className="thumb"><CardIcon /></div>
              <div className="info">
                <div className="m">{PAY_PURPOSE[p.purpose] ?? p.purpose}</div>
                <div className="s">
                  {formatDate(p.created_at)} · Mobile Money · {PAY_STATUS[p.status] ?? p.status}
                </div>
              </div>
              <div className="p">{formatPrice(p.amount)}</div>
            </div>
          ))}
        </div>
      )}

      {isTeamMember && (
        <Link to="/admin" className="btn btn-navy" style={{ width: "100%", marginTop: 18 }} onClick={closeModal}>
          Ouvrir le back-office
        </Link>
      )}
      <button className="btn btn-outline on-light" style={{ width: "100%", marginTop: isTeamMember ? 10 : 18 }} onClick={handleLogout}>
        Se déconnecter
      </button>
    </Modal>
  );
}
