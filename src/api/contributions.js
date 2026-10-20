import { api } from "./client";

export const submitContribution = (formData) =>
  api.post("/contributions/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const fetchMyContributions = () => api.get("/contributions/mine/");

// --- Back-office ---
export const fetchPendingContributions = () => api.get("/contributions/pending/");

export const reviewContribution = (id, payload) =>
  api.patch(`/contributions/${id}/review/`, payload);

// Fichier d'une contribution (son auteur ou l'équipe), en Blob.
export const downloadContributionFile = (id) =>
  api.get(`/contributions/${id}/file/`, { responseType: "blob" });
