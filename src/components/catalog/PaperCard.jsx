import { useCart } from "../../context/CartContext";
import Button from "../common/Button";

/**
 * Une carte du "cat-grid". Cliquer sur la carte ouvre normalement
 * "modal-detail" (detail-matiere, detail-badge, detail-meta,
 * detail-price-opts) — à brancher par Claude Code (ex: onOpenDetail(paper)).
 */
export default function PaperCard({ paper, onOpenDetail }) {
  const { addItem } = useCart();

  return (
    <div className="rounded-2xl border border-text-faint/15 bg-white2 p-4 shadow-sm">
      <button onClick={() => onOpenDetail?.(paper)} className="text-left">
        <p className="text-sm text-text-faint">{paper.exam} · {paper.level}</p>
        <h4 className="font-bold text-navy">{paper.subject}</h4>
        <p className="text-sm text-text-soft">Session {paper.session_year}</p>
        {paper.has_correction && (
          <span className="mt-2 inline-block rounded-full bg-gold-light/40 px-2 py-0.5 text-xs font-semibold text-gold-deep">
            Corrigé disponible
          </span>
        )}
      </button>

      {paper.standalone_price && (
        <div className="mt-3 flex items-center justify-between">
          <span className="font-semibold">{paper.standalone_price} FCFA</span>
          <Button variant="outline" onClick={() => addItem(paper.id)}>
            Ajouter
          </Button>
        </div>
      )}
    </div>
  );
}
