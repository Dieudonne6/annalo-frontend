/**
 * Gestion des épreuves/sujets ("Ajouter un sujet" / sujet-modal-title,
 * "cd-nom" pour le détail d'une catégorie). Alimenté par
 * apps.catalog.PastPaper côté backend.
 *
 * TODO (Claude Code): tableau listant les PastPaper (GET /api/catalog/papers/),
 * avec recherche, filtres, et une modale de création/édition (upload du
 * fichier PDF + champs exam/subject/level/session_year/prix).
 */
export default function Subjects() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-navy">Sujets</h1>
      <p className="mt-2 text-text-soft">À implémenter — voir le commentaire TODO en haut du fichier.</p>
    </div>
  );
}
