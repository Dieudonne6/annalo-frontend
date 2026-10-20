/**
 * Liste des abonnés ("Abonnés" / sub-detail-nom / user-detail-name /
 * pay-detail-montant). Croise apps.accounts.User, apps.subscriptions.UserSubscription
 * et apps.payments.Payment côté backend.
 *
 * TODO (Claude Code): tableau avec recherche par nom/téléphone, filtre par
 * statut d'abonnement, et une vue détail par utilisateur (historique de
 * paiements + abonnements).
 */
export default function Subscribers() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-navy">Abonnés</h1>
      <p className="mt-2 text-text-soft">À implémenter — voir le commentaire TODO en haut du fichier.</p>
    </div>
  );
}
