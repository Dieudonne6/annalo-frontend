import { formatPrice } from "../../lib/format";

function priceLabel(paper) {
  if (paper.is_free_sample) return "Gratuit";
  if (paper.standalone_price) return formatPrice(paper.standalone_price);
  return "Abonnement";
}

/** Une carte "tcard" du catalogue ; cliquer ouvre "modal-detail". */
export default function PaperCard({ paper, isFavorite, onToggleFavorite, onOpen }) {
  return (
    <div className="tcard" onClick={() => onOpen(paper.id)} role="button" tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onOpen(paper.id)}>
      <div className="top-row">
        <span className="badge" title={paper.exam}>{paper.exam}</span>
        <button
          className={`heart ${isFavorite ? "on" : ""}`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(paper.id);
          }}
          aria-label={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
        >
          <svg viewBox="0 0 24 24">
            <path d="M12 21s-7-4.6-9.5-9C.8 8.4 2.6 5 6 5c2 0 3.3 1 4 2 .7-1 2-2 4-2 3.4 0 5.2 3.4 3.5 7-2.5 4.4-9.5 9-9.5 9z" />
          </svg>
        </button>
      </div>
      <div className="matiere">{paper.subject}</div>
      <div className="meta">
        Session {paper.session_year}
        {paper.has_correction && " · Corrigé inclus"}
      </div>
      <div className="bottom">
        <span className="price">{priceLabel(paper)}</span>
        <span className="niveau-tag">{paper.level}</span>
      </div>
    </div>
  );
}
