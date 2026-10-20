import { useEffect, useState } from "react";

import { fetchPendingContributions, reviewContribution } from "../../api/contributions";

/**
 * "Contributions en attente" — déjà branché sur l'API existante
 * (GET /api/contributions/pending/, PATCH /api/contributions/:id/review/).
 */
export default function Contributions() {
  const [items, setItems] = useState([]);

  function load() {
    fetchPendingContributions().then(({ data }) => setItems(data.results ?? data));
  }

  useEffect(load, []);

  async function handleReview(id, status) {
    await reviewContribution(id, { status });
    load();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-navy">Contributions en attente</h1>
      <div className="mt-4 space-y-3">
        {items.map((c) => (
          <div key={c.id} className="flex items-center justify-between rounded-xl border border-text-faint/20 bg-white2 p-4">
            <div>
              <p className="font-semibold">{c.name}</p>
              <p className="text-sm text-text-soft">Session {c.session_year}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleReview(c.id, "approved")} className="rounded-lg bg-navy px-3 py-1.5 text-sm text-white2">
                Approuver
              </button>
              <button onClick={() => handleReview(c.id, "rejected")} className="rounded-lg border border-brick px-3 py-1.5 text-sm text-brick">
                Rejeter
              </button>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-text-soft">Aucune contribution en attente.</p>}
      </div>
      {/* TODO (Claude Code): lier l'approbation à la création automatique du
          PastPaper correspondant, côté backend (voir TODO dans
          apps/contributions/models.py). */}
    </div>
  );
}
