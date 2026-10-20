import { useEffect, useState } from "react";

import { fetchMyPayments } from "../api/payments";
import { fetchMySubscriptions } from "../api/subscriptions";
import { useAuth } from "../context/AuthContext";

/**
 * Correspond à "modal-account" / "acc-panel-subjects" / "acc-panel-payments"
 * de la maquette. Ici en page dédiée plutôt qu'en modale (plus confortable
 * sur desktop) — à ajuster si l'utilisateur préfère garder la modale.
 */
export default function Account() {
  const { user, logout } = useAuth();
  const [subscriptions, setSubscriptions] = useState([]);
  const [payments, setPayments] = useState([]);
  const [tab, setTab] = useState("subjects");

  useEffect(() => {
    fetchMySubscriptions().then(({ data }) => setSubscriptions(data.results ?? data));
    fetchMyPayments().then(({ data }) => setPayments(data.results ?? data));
  }, []);

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <div className="mb-6 flex items-center gap-4">
        <div id="acc-avatar" className="flex h-14 w-14 items-center justify-center rounded-full bg-navy text-xl font-bold text-white2">
          {user?.full_name?.[0]}
        </div>
        <div>
          <p id="acc-name" className="text-lg font-bold">{user?.full_name}</p>
          <p id="acc-phone" className="text-text-soft">{user?.phone}</p>
        </div>
      </div>

      <div className="mb-4 flex gap-4 border-b border-text-faint/20">
        <button
          onClick={() => setTab("subjects")}
          className={`pb-2 ${tab === "subjects" ? "border-b-2 border-navy font-semibold" : "text-text-soft"}`}
        >
          Mes abonnements
        </button>
        <button
          onClick={() => setTab("payments")}
          className={`pb-2 ${tab === "payments" ? "border-b-2 border-navy font-semibold" : "text-text-soft"}`}
        >
          Mes paiements
        </button>
      </div>

      {tab === "subjects" && (
        <div id="acc-panel-subjects" className="space-y-3">
          {subscriptions.map((sub) => (
            <div key={sub.id} className="rounded-xl border border-text-faint/20 p-4">
              <p className="font-semibold">{sub.plan.name}</p>
              <p className="text-sm text-text-soft">Statut : {sub.status}</p>
            </div>
          ))}
          {subscriptions.length === 0 && <p className="text-text-soft">Aucun abonnement actif.</p>}
        </div>
      )}

      {tab === "payments" && (
        <div id="acc-panel-payments" className="space-y-3">
          {payments.map((p) => (
            <div key={p.id} className="flex justify-between rounded-xl border border-text-faint/20 p-4">
              <span>{p.purpose}</span>
              <span className="font-semibold">{p.amount} FCFA — {p.status}</span>
            </div>
          ))}
          {payments.length === 0 && <p className="text-text-soft">Aucun paiement pour le moment.</p>}
        </div>
      )}

      <button onClick={logout} className="mt-8 text-sm font-semibold text-brick">
        Se déconnecter
      </button>
    </main>
  );
}
