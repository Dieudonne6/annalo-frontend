import { api } from "./client";

export const fetchPlans = (track) =>
  api.get("/subscriptions/plans/", { params: track ? { track } : {} });

export const fetchMySubscriptions = () => api.get("/subscriptions/me/");

export const fetchCart = () => api.get("/subscriptions/cart/");

export const addToCart = (paperId) =>
  api.post("/subscriptions/cart/items/", { paper_id: paperId });

export const removeFromCart = (itemId) =>
  api.delete(`/subscriptions/cart/items/${itemId}/`);
