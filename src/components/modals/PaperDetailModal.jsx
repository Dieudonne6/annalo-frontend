import { useEffect, useState } from "react";

import { downloadPaper, fetchPaperDetail } from "../../api/catalog";
import { fetchPlans } from "../../api/subscriptions";
import { useCart } from "../../context/CartContext";
import { useUI } from "../../context/UIContext";
import { apiErrorMessage, saveBlob } from "../../lib/api-helpers";
import { formatPrice, trackLabel } from "../../lib/format";
import Modal from "../common/Modal";
import { scrollToId } from "../common/SectionLink";

const PREVIEW_LINES = [55, 92, 87, 64, "Question 1", 96, 80, 90, "Question 2", 75, 93, 68];

const LockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="5" y="11" width="14" height="9" rx="2" />
    <path d="M8 11V8a4 4 0 018 0v3" />
  </svg>
);
const UnlockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="5" y="11" width="14" height="9" rx="2" />
    <path d="M8 11V8a4 4 0 017.5-2" />
  </svg>
);

/** "modal-detail" de la maquette, alimentée par GET /api/catalog/papers/{id}/. */
export default function PaperDetailModal() {
  const { modal, closeModal, toast, requireAuth } = useUI();
  const { addItem } = useCart();
  const isOpen = modal.name === "detail";
  const paperId = isOpen ? modal.payload : null;
  const [paper, setPaper] = useState(null);
  const [plans, setPlans] = useState([]);
  const [option, setOption] = useState("unit");
  const [isBusy, setIsBusy] = useState(false);

  useEffect(() => {
    if (!paperId) return;
    setPaper(null);
    setPlans([]);
    fetchPaperDetail(paperId)
      .then(({ data }) => {
        setPaper(data);
        setOption(data.standalone_price ? "unit" : "subscription");
        return fetchPlans(data.exam.track);
      })
      .then((res) => res && setPlans(res.data.results ?? res.data))
      .catch((err) => {
        toast(apiErrorMessage(err, "Impossible de charger ce sujet."));
        closeModal();
      });
  }, [paperId, toast, closeModal]);

  const cheapestPlan = plans.reduce((min, p) => (!min || Number(p.price) < Number(min.price) ? p : min), null);

  async function handleAction() {
    if (option === "subscription") {
      closeModal();
      scrollToId("tarifs");
      return;
    }
    if (!requireAuth("Connecte-toi pour ajouter des sujets au panier")) return;
    setIsBusy(true);
    try {
      await addItem(paper.id);
      toast(`${paper.subject.name} ajouté au panier`);
      closeModal();
    } catch (err) {
      toast(apiErrorMessage(err));
    } finally {
      setIsBusy(false);
    }
  }

  async function handleDownload(kind) {
    setIsBusy(true);
    try {
      const { data } = await downloadPaper(paper.id, kind);
      const base = paper.title || `${paper.exam.name} ${paper.subject.name} ${paper.session_year}`;
      saveBlob(data, `${base}${kind === "correction" ? " - corrigé" : ""}.pdf`);
    } catch (err) {
      toast(apiErrorMessage(err, "Téléchargement impossible pour le moment."));
    } finally {
      setIsBusy(false);
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={closeModal}>
      {!paper ? (
        <div className="acc-empty">Chargement…</div>
      ) : (
        <>
          <div className="eyebrow" style={{ color: "var(--navy-2)" }}>{trackLabel(paper.exam.track)}</div>
          <h3 style={{ marginTop: 8 }}>{paper.subject.name}</h3>
          <div className="sub">
            {paper.exam.name} · Session {paper.session_year} · {paper.level.name}
            {paper.has_correction && " · Corrigé inclus"}
          </div>

          <div className="doc-preview">
            <div className="doc-preview-page">
              {PREVIEW_LINES.map((l, i) =>
                typeof l === "string" ? (
                  <div className="dp-q" key={i}>{l}</div>
                ) : (
                  <div className="dp-line" key={i} style={{ width: `${l}%` }} />
                )
              )}
            </div>
            <div className="doc-preview-lock">
              <div className="lock-ic">{paper.has_access ? <UnlockIcon /> : <LockIcon />}</div>
              {paper.has_access ? (
                <>
                  <div className="lock-title">Sujet débloqué</div>
                  <div className="lock-sub">
                    {paper.is_free_sample ? "Sujet offert : télécharge-le librement" : "Tu as accès à ce sujet"}
                  </div>
                </>
              ) : (
                <>
                  <div className="lock-title">Sujet verrouillé</div>
                  <div className="lock-sub">Choisis une formule ci-dessous pour débloquer l'accès complet</div>
                </>
              )}
            </div>
          </div>

          {paper.has_access ? (
            <div className="detail-actions">
              <button className="btn btn-navy" onClick={() => handleDownload("paper")} disabled={isBusy}>
                Télécharger le sujet
              </button>
              {paper.correction_download_url && (
                <button className="btn btn-outline on-light" onClick={() => handleDownload("correction")} disabled={isBusy}>
                  Télécharger le corrigé
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="field-label">Choisis ta formule</div>
              <div className="detail-price-opts">
                {paper.standalone_price && (
                  <div className={`price-opt ${option === "unit" ? "selected" : ""}`} onClick={() => setOption("unit")}>
                    <div>
                      <div className="t">Sujet à l'unité</div>
                      <div className="s">{paper.has_correction ? "PDF + corrigé" : "Format PDF"}</div>
                    </div>
                    <div className="p">{formatPrice(paper.standalone_price)}</div>
                  </div>
                )}
                <div className={`price-opt ${option === "subscription" ? "selected" : ""}`} onClick={() => setOption("subscription")}>
                  <div>
                    <div className="t">Abonnement {trackLabel(paper.exam.track)}</div>
                    <div className="s">Tous les sujets de la voie, en illimité</div>
                  </div>
                  <div className="p">{cheapestPlan ? `dès ${formatPrice(cheapestPlan.price)}` : "—"}</div>
                </div>
              </div>
              <button className="btn btn-navy" style={{ width: "100%", marginTop: 20 }} onClick={handleAction} disabled={isBusy}>
                {option === "unit" ? "Ajouter au panier" : "Voir les abonnements"}
              </button>
            </>
          )}
        </>
      )}
    </Modal>
  );
}
