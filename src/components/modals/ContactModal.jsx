import { useEffect, useState } from "react";

import { sendContactMessage } from "../../api/cms";
import { useAuth } from "../../context/AuthContext";
import { useUI } from "../../context/UIContext";
import { apiErrorMessage } from "../../lib/api-helpers";
import Modal from "../common/Modal";

/** "modal-contact" de la maquette → POST /api/cms/contact/. */
export default function ContactModal() {
  const { user } = useAuth();
  const { modal, closeModal, toast } = useUI();
  const isOpen = modal.name === "contact";
  const [form, setForm] = useState({ name: "", reach: "", message: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pré-remplit avec le compte connecté.
  useEffect(() => {
    if (isOpen) {
      setError("");
      setForm((f) => ({
        ...f,
        name: f.name || user?.full_name || "",
        reach: f.reach || user?.phone || "",
      }));
    }
  }, [isOpen, user]);

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim() || !form.message.trim()) {
      setError("Merci de renseigner ton nom et ton message.");
      return;
    }
    setError("");
    setIsSubmitting(true);
    try {
      await sendContactMessage({
        name: form.name.trim(),
        reach: form.reach.trim(),
        message: form.message.trim(),
      });
      setForm({ name: "", reach: "", message: "" });
      closeModal();
      toast("Message envoyé — on te répond très vite");
    } catch (err) {
      setError(apiErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={closeModal}>
      <h3>Nous contacter</h3>
      <div className="sub">Une question, un souci de paiement ou une suggestion ? Écris-nous.</div>
      <form onSubmit={handleSubmit}>
        <div className="field-label">Nom complet</div>
        <input className="field-input" value={form.name} onChange={set("name")} placeholder="Ton nom" />
        <div className="field-label">Téléphone ou email</div>
        <input className="field-input" value={form.reach} onChange={set("reach")} placeholder="+229 00 00 00 00 ou email" required />
        <div className="field-label">Message</div>
        <textarea
          className="field-input"
          rows={4}
          value={form.message}
          onChange={set("message")}
          placeholder="Explique-nous ta demande..."
          style={{ resize: "vertical", minHeight: 90, fontFamily: "inherit" }}
        />
        {error && <div className="form-error">{error}</div>}
        <button className="btn btn-navy" type="submit" style={{ width: "100%", marginTop: 18 }} disabled={isSubmitting}>
          {isSubmitting ? "Envoi…" : "Envoyer le message"}
        </button>
      </form>
      <div style={{ textAlign: "center", marginTop: 14, fontSize: 12, color: "var(--text-faint)" }}>
        Ou écris-nous directement à <strong>contact@annalo.bj</strong>
      </div>
    </Modal>
  );
}
