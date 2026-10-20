import { useEffect } from "react";

import { CloseIcon } from "../../lib/icons";

/** Structure "modal-backdrop" > "modal" de la maquette. Échap ferme la modale. */
export default function Modal({ isOpen, onClose, className = "", children }) {
  useEffect(() => {
    if (!isOpen) return undefined;
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="modal-backdrop show"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className={`modal ${className}`} role="dialog" aria-modal="true">
        <button className="modal-close" onClick={onClose} aria-label="Fermer">
          <CloseIcon />
        </button>
        {children}
      </div>
    </div>
  );
}
