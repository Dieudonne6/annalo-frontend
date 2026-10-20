import { initiatePayment } from "../api/payments";

const PENDING_PAYMENT_KEY = "annalo_pending_payment";

/**
 * Message lisible à partir d'une erreur axios/DRF : `detail`, sinon la
 * première erreur de champ, sinon un message générique.
 */
export function apiErrorMessage(error, fallback = "Une erreur est survenue. Réessaie.") {
  const status = error?.response?.status;
  const data = error?.response?.data;
  if (status === 429) return "Trop de tentatives. Patiente un peu avant de réessayer.";
  if (!error?.response) return "Impossible de joindre le serveur. Vérifie ta connexion.";
  if (typeof data?.detail === "string") return data.detail;
  if (data && typeof data === "object") {
    const first = Object.values(data)[0];
    if (Array.isArray(first) && typeof first[0] === "string") return first[0];
    if (typeof first === "string") return first;
  }
  return fallback;
}

/**
 * Démarre un paiement FedaPay puis redirige vers la page de paiement.
 * L'id est gardé en sessionStorage pour la page /paiement/retour.
 */
export async function startPayment(payload) {
  const { data } = await initiatePayment(payload);
  try {
    sessionStorage.setItem(PENDING_PAYMENT_KEY, String(data.payment_id));
  } catch {
    // stockage indisponible : la page de retour affichera un message générique
  }
  window.location.assign(data.payment_url);
}

export function readPendingPayment() {
  try {
    return sessionStorage.getItem(PENDING_PAYMENT_KEY);
  } catch {
    return null;
  }
}

export function clearPendingPayment() {
  try {
    sessionStorage.removeItem(PENDING_PAYMENT_KEY);
  } catch {
    // rien à faire
  }
}

// Enregistre un Blob reçu de l'API (téléchargements protégés par JWT).
export function saveBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
