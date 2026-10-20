import { api } from "./client";

export const fetchMyPayments = () => api.get("/payments/me/");

/**
 * Démarre un paiement FedaPay : `{ purpose: "cart" }` ou
 * `{ purpose: "subscription", plan_id }`.
 * Réponse : `{ payment_id, amount, transaction_id, payment_url, token }`.
 * Le frontend redirige vers `payment_url` ; FedaPay renvoie ensuite sur
 * `/paiement/retour` (PAYMENT_CALLBACK_URL côté backend).
 */
export const initiatePayment = (payload) => api.post("/payments/initiate/", payload);

// À appeler depuis la page de retour : synchronise le statut chez FedaPay.
export const verifyPayment = (paymentId) => api.post(`/payments/${paymentId}/verify/`);
