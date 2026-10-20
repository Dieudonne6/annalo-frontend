import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

import { useAuth } from "./AuthContext";

/**
 * État d'interface partagé du site public : la modale ouverte (une seule à la
 * fois, comme dans la maquette : "auth", "contact", "account", "detail",
 * "annonce", "contrib") avec sa donnée associée, et le toast.
 */
const UIContext = createContext(null);

export function UIProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [modal, setModal] = useState({ name: null, payload: null });
  const [toastMessage, setToastMessage] = useState("");
  const [isToastVisible, setIsToastVisible] = useState(false);
  const toastTimer = useRef(null);

  const openModal = useCallback((name, payload = null) => setModal({ name, payload }), []);
  const closeModal = useCallback(() => setModal({ name: null, payload: null }), []);

  const toast = useCallback((message) => {
    setToastMessage(message);
    setIsToastVisible(true);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setIsToastVisible(false), 2600);
  }, []);

  // Renvoie true si l'utilisateur est connecté, sinon ouvre la connexion.
  const requireAuth = useCallback(
    (message = "Connecte-toi pour continuer") => {
      if (isAuthenticated) return true;
      toast(message);
      openModal("auth");
      return false;
    },
    [isAuthenticated, toast, openModal]
  );

  // Bloque le défilement de la page tant qu'une modale est ouverte.
  useEffect(() => {
    document.body.style.overflow = modal.name ? "hidden" : "";
  }, [modal.name]);

  const value = {
    modal,
    openModal,
    closeModal,
    toast,
    toastMessage,
    isToastVisible,
    requireAuth,
  };

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}

export function useUI() {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error("useUI doit être utilisé dans <UIProvider>");
  return ctx;
}
