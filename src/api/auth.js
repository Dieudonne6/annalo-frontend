import { api } from "./client";

export const register = (payload) => api.post("/auth/register/", payload);

export const login = (phone, password) =>
  api.post("/auth/login/", { phone, password });

export const fetchMe = () => api.get("/auth/me/");

export const updateMe = (payload) => api.patch("/auth/me/", payload);

// --- Mot de passe oublié (code SMS) ---
export const requestPasswordReset = (phone) =>
  api.post("/auth/password-reset/request/", { phone });

export const confirmPasswordReset = (phone, code, newPassword) =>
  api.post("/auth/password-reset/confirm/", { phone, code, new_password: newPassword });

// --- Vérification du numéro (utilisateur connecté) ---
export const requestPhoneVerification = () => api.post("/auth/phone/verify/request/");

// Renvoie l'utilisateur mis à jour (phone_verified = true).
export const confirmPhoneVerification = (code) =>
  api.post("/auth/phone/verify/confirm/", { code });

// --- Invitations d'équipe (lien reçu par email : /invitation/<token>) ---
export const fetchInvitation = (token) => api.get(`/auth/invitations/${token}/`);

// Renvoie l'utilisateur avec son nouveau team_role.
export const acceptInvitation = (token) => api.post(`/auth/invitations/${token}/accept/`);
