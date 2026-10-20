/**
 * "Informations du site", "Changer le mot de passe", "Protection du
 * compte", "Sessions actives", "Notifications automatiques",
 * "Rôles d'équipe" / "Inviter un membre".
 *
 * TODO (Claude Code): plusieurs sous-sections distinctes, probablement
 * dans des sous-composants (SiteInfoForm, PasswordForm, TeamRoles...).
 * Le backend n'a pas encore d'endpoint pour les invitations d'équipe
 * (voir apps/accounts/models.py::TeamInvitation et le CLAUDE.md backend,
 * étape 5).
 */
export default function Settings() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-navy">Paramètres</h1>
      <p className="mt-2 text-text-soft">À implémenter — voir le commentaire TODO en haut du fichier.</p>
    </div>
  );
}
