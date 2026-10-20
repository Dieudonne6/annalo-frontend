import { useUI } from "../../context/UIContext";
import { ArrowRight } from "../../lib/icons";

export default function ContributeBand() {
  const { openModal, requireAuth } = useUI();

  function handleClick() {
    if (requireAuth("Connecte-toi pour contribuer un sujet")) openModal("contrib");
  }

  return (
    <section className="section" id="contribuer" style={{ paddingBottom: 52 }}>
      <div className="wrap">
        <div className="contrib-band">
          <div>
            <div className="eyebrow" style={{ color: "var(--gold-light)" }}>Communauté</div>
            <h3>Tu as un sujet d'examen ou de concours à partager ?</h3>
            <p>Contribue au catalogue en quelques minutes — aide d'autres candidats à mieux se préparer.</p>
          </div>
          <button className="btn btn-gold" onClick={handleClick}>
            Contribuer un sujet
            <ArrowRight />
          </button>
        </div>
      </div>
    </section>
  );
}
