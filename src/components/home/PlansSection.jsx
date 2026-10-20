import { useEffect, useState } from "react";

import { fetchPlans } from "../../api/subscriptions";
import { useUI } from "../../context/UIContext";
import { apiErrorMessage, startPayment } from "../../lib/api-helpers";
import { TRACKS, durationLabel } from "../../lib/format";
import { CheckIcon } from "../../lib/icons";

/**
 * "Un abonnement, un accès illimité" (plans-examens / plans-concours /
 * plans-national). "Choisir" lance le paiement FedaPay de l'abonnement.
 */
export default function PlansSection() {
  const { toast, requireAuth } = useUI();
  const [plans, setPlans] = useState(null);
  const [track, setTrack] = useState(TRACKS[0].value);
  const [payingId, setPayingId] = useState(null);

  useEffect(() => {
    fetchPlans()
      .then(({ data }) => setPlans(data.results ?? data))
      .catch(() => setPlans([]));
  }, []);

  async function choose(plan) {
    if (!requireAuth("Connecte-toi pour t'abonner")) return;
    setPayingId(plan.id);
    try {
      await startPayment({ purpose: "subscription", plan_id: plan.id });
    } catch (err) {
      toast(apiErrorMessage(err, "Le paiement n'a pas pu démarrer."));
      setPayingId(null);
    }
  }

  const visible = (plans ?? []).filter((p) => p.track === track);

  return (
    <section className="section section-alt" id="tarifs">
      <div className="wrap">
        <div className="section-head" style={{ marginLeft: "auto", marginRight: "auto", textAlign: "center", maxWidth: 560 }}>
          <div className="eyebrow" style={{ justifyContent: "center", display: "flex" }}>Tarifs</div>
          <h2>Un abonnement, un accès illimité</h2>
          <p style={{ marginLeft: "auto", marginRight: "auto" }}>
            Débloque tous les sujets et corrigés d'une voie pour la durée de ton choix.
          </p>
        </div>
        <div className="price-toggle">
          <div className="segmented">
            {TRACKS.map((t) => (
              <button key={t.value} className={track === t.value ? "active" : ""} onClick={() => setTrack(t.value)}>
                {t.label}
              </button>
            ))}
          </div>
        </div>
        <div className={`plan-grid count-${Math.min(visible.length, 4)}`} id={`plans-${track}`}>
          {visible.map((p) => (
            <div className={`plan-card ${p.is_highlighted ? "best" : ""}`} key={p.id}>
              {p.is_highlighted && <div className="best-tag">Populaire</div>}
              <div className="dur">{durationLabel(p.duration_days)}</div>
              <div className="amount">{Number(p.price).toLocaleString("fr-FR")} <span>FCFA</span></div>
              <ul>
                {(p.features ?? []).map((f) => (
                  <li key={f}><span className="ck"><CheckIcon /></span>{f}</li>
                ))}
              </ul>
              <button
                className={`btn ${p.is_highlighted ? "btn-gold" : "btn-outline on-light"}`}
                onClick={() => choose(p)}
                disabled={payingId !== null}
              >
                {payingId === p.id ? "Redirection…" : "Choisir"}
              </button>
            </div>
          ))}
        </div>
        {plans && visible.length === 0 && (
          <div className="empty-results show">Aucune formule disponible pour cette voie pour le moment.</div>
        )}
      </div>
    </section>
  );
}
