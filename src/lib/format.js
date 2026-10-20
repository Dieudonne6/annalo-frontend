// Les trois voies du catalogue, avec les mêmes valeurs et libellés que
// `Track` côté backend (apps/catalog/models.py).
export const TRACKS = [
  { value: "examen", label: "Examens" },
  { value: "concours", label: "Concours" },
  { value: "national", label: "National" },
];

export const trackLabel = (value) =>
  TRACKS.find((t) => t.value === value)?.label ?? value;

// "1500.00" -> "1 500 FCFA"
export function formatPrice(amount) {
  const n = Number(amount);
  if (!Number.isFinite(n)) return "—";
  return `${n.toLocaleString("fr-FR")} FCFA`;
}

// 30 -> "1 mois", 90 -> "3 mois", 10 -> "10 jours"
export function durationLabel(days) {
  if (days % 30 === 0) return `${days / 30} mois`;
  if (days % 7 === 0) return `${days / 7} semaine${days > 7 ? "s" : ""}`;
  return `${days} jours`;
}

// Nombre de jours (arrondi au supérieur) jusqu'à une date ISO, jamais négatif.
export function daysUntil(isoDate) {
  if (!isoDate) return null;
  return Math.max(0, Math.ceil((new Date(isoDate) - new Date()) / 86400000));
}

export function formatDate(isoDate) {
  if (!isoDate) return "—";
  return new Date(isoDate).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export const plural = (n, word) => `${n} ${word}${n > 1 ? "s" : ""}`;

export const firstName = (fullName) => (fullName || "").trim().split(/\s+/)[0] || "";

export const initial = (fullName) => (fullName || "?").trim().charAt(0).toUpperCase();
