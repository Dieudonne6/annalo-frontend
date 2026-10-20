import { api } from "./client";

export const fetchPapers = (params) => api.get("/catalog/papers/", { params });

export const fetchPaperDetail = (id) => api.get(`/catalog/papers/${id}/`);

export const fetchOrganizations = (params) =>
  api.get("/catalog/organizations/", { params });

export const fetchExams = (params) => api.get("/catalog/exams/", { params });

export const fetchLevels = () => api.get("/catalog/levels/");

export const fetchSubjects = () => api.get("/catalog/subjects/");

/**
 * Télécharge le PDF d'une épreuve (ou sa correction). L'endpoint exige le
 * JWT : on récupère un Blob via axios plutôt qu'un simple lien <a href>.
 */
export const downloadPaper = (id, kind = "paper") =>
  api.get(`/catalog/papers/${id}/download/`, {
    params: kind === "correction" ? { kind } : {},
    responseType: "blob",
  });
