/**
 * Correspond aux "filter-row-examens" / "filter-row-concours" /
 * "filter-row-national" + menus "menu-ecole", "menu-examen",
 * "menu-matiere", "menu-niveau" de la maquette.
 *
 * TODO (Claude Code):
 * - Charger dynamiquement les options (organizations/exams/levels/subjects)
 *   depuis src/api/catalog.js selon la voie active.
 * - Les "pill-*" de la maquette affichent la sélection courante sous forme
 *   de chips cliquables — à reproduire ici.
 */
export default function FilterBar({ track, onTrackChange, filters, onFilterChange }) {
  const tracks = [
    { value: "examen", label: "Examens" },
    { value: "concours", label: "Concours" },
    { value: "national", label: "National" },
  ];

  return (
    <div className="mb-6 space-y-3">
      <div className="flex gap-2">
        {tracks.map((t) => (
          <button
            key={t.value}
            onClick={() => onTrackChange(t.value)}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold ${
              track === t.value ? "bg-navy text-white2" : "bg-paper-2 text-text-soft"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div id={`filter-row-${track}s`} className="flex flex-wrap gap-3">
        {/* TODO: remplacer par de vrais <select> alimentés par l'API */}
        <select
          id="menu-ecole"
          onChange={(e) => onFilterChange("organization", e.target.value)}
          className="rounded-xl border border-text-faint/30 px-3 py-2 text-sm"
        >
          <option value="">École / Corps</option>
        </select>
        <select
          id="menu-niveau"
          onChange={(e) => onFilterChange("level", e.target.value)}
          className="rounded-xl border border-text-faint/30 px-3 py-2 text-sm"
        >
          <option value="">Niveau</option>
        </select>
        <select
          id="menu-matiere"
          onChange={(e) => onFilterChange("subject", e.target.value)}
          className="rounded-xl border border-text-faint/30 px-3 py-2 text-sm"
        >
          <option value="">Matière</option>
        </select>
      </div>
    </div>
  );
}
