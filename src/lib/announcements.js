import { daysUntil, formatDate, plural } from "./format";

// Kind backend (apps/cms Announcement.Kind) -> variante visuelle de la maquette
// (kind-fp = navy, kind-ecole = doré, kind-ens = brique) et icône.
const KINDS = {
  info: { label: "Information", className: "kind-fp", icon: "megaphone" },
  promo: { label: "Promotion", className: "kind-ecole", icon: "tag" },
  partner: { label: "Partenariat", className: "kind-ens", icon: "briefcase" },
};

export const announcementKind = (kind) => KINDS[kind] ?? KINDS.info;

// L'API ne renvoie que les annonces actives et non expirées : elles sont donc
// "ouvertes". Le pied de carte affiche l'échéance quand il y en a une.
export function announcementFoot(a) {
  if (!a.ends_at) return { label: announcementKind(a.kind).label, countdown: "" };
  const days = daysUntil(a.ends_at);
  return {
    label: `Jusqu'au ${formatDate(a.ends_at)}`,
    countdown: days === 0 ? "Dernier jour" : plural(days, "jour"),
  };
}

// "conditions" est un texte libre : une condition par ligne.
export const announcementConditions = (a) =>
  (a.conditions || "")
    .split("\n")
    .map((l) => l.replace(/^\s*[-•*]\s*/, "").trim())
    .filter(Boolean);
