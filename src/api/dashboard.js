import { api } from "./client";

/**
 * Back-office (préfixe /api/dashboard/). Lecture : tout membre de l'équipe.
 * Écriture selon le rôle : editor (catalogue, annonces, contributions),
 * support (messages, paiements), admin (tout, dont plans, site, utilisateurs,
 * équipe). Les listes sont paginées ({ count, next, previous, results }) et
 * acceptent `search`, `ordering` et `page`.
 */

// Construit les fonctions CRUD d'une ressource du routeur DRF.
const resource = (path) => ({
  list: (params) => api.get(`/dashboard/${path}/`, { params }),
  get: (id) => api.get(`/dashboard/${path}/${id}/`),
  create: (payload) => api.post(`/dashboard/${path}/`, payload),
  update: (id, payload) => api.patch(`/dashboard/${path}/${id}/`, payload),
  remove: (id) => api.delete(`/dashboard/${path}/${id}/`),
});

// --- Statistiques ---
export const fetchOverview = () => api.get("/dashboard/overview/");

export const fetchRevenue = (months = 6) =>
  api.get("/dashboard/stats/revenue/", { params: { months } });

export const fetchNewUsers = (months = 6) =>
  api.get("/dashboard/stats/new-users/", { params: { months } });

// Sans `months` : depuis le début.
export const fetchSalesByOrganization = (months) =>
  api.get("/dashboard/stats/sales-by-organization/", { params: months ? { months } : {} });

export const fetchActivity = (limit = 20) =>
  api.get("/dashboard/activity/", { params: { limit } });

// Filtres : status, track, plan, active, search.
export const fetchSubscribers = (params) => api.get("/dashboard/subscribers/", { params });

// --- Catalogue (épreuves : passer un FormData pour l'upload des PDF) ---
export const organizations = resource("catalog/organizations");
export const exams = resource("catalog/exams");
export const levels = resource("catalog/levels");
export const subjects = resource("catalog/subjects");
export const papers = resource("catalog/papers");

// --- Contenu ---
export const plans = resource("plans");
export const announcements = resource("announcements");
// GET / PATCH is_read / DELETE
export const contactMessages = resource("contact-messages");

export const fetchSiteInfo = () => api.get("/dashboard/site-info/");
export const updateSiteInfo = (payload) => api.patch("/dashboard/site-info/", payload);

// --- Paiements (lecture seule + resynchronisation FedaPay) ---
export const payments = resource("payments");
export const syncPayment = (id) => api.post(`/dashboard/payments/${id}/sync/`);

// --- Utilisateurs (PATCH is_active uniquement) ---
export const users = resource("users");

// --- Contributions (lecture ; validation via contributions.reviewContribution) ---
export const contributions = resource("contributions");

// --- Équipe ---
// PATCH team_role ("none" retire de l'équipe) : admin uniquement.
export const teamMembers = resource("team/members");
// create({ email, role }) envoie l'email ; remove(id) révoque.
export const teamInvitations = resource("team/invitations");
