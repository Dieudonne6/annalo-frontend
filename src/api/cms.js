import { api } from "./client";

export const fetchAnnouncements = () => api.get("/cms/announcements/");

export const fetchSiteInfo = () => api.get("/cms/site-info/");

export const sendContactMessage = (payload) => api.post("/cms/contact/", payload);
