import { useState } from "react";

import { useAuth } from "../../context/AuthContext";
import Button from "../common/Button";
import Modal from "../common/Modal";

/**
 * Correspond à "modal-auth" / "auth-phone" de la maquette.
 * TODO (Claude Code): ajouter la validation des champs, les messages
 * d'erreur de l'API, et le toggle connexion ↔ inscription.
 */
export default function AuthModal({ isOpen, onClose }) {
  const { login, register } = useAuth();
  const [mode, setMode] = useState("login"); // "login" | "register"
  const [form, setForm] = useState({ phone: "", password: "", full_name: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      if (mode === "login") {
        await login(form.phone, form.password);
      } else {
        await register(form);
      }
      onClose();
    } catch (err) {
      setError("Connexion impossible. Vérifie tes identifiants.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Connexion à Annalo">
      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === "register" && (
          <input
            name="full_name"
            placeholder="Nom complet"
            value={form.full_name}
            onChange={handleChange}
            className="w-full rounded-xl border border-text-faint/30 px-4 py-2.5"
            required
          />
        )}
        <input
          id="auth-phone"
          name="phone"
          placeholder="Numéro de téléphone"
          value={form.phone}
          onChange={handleChange}
          className="w-full rounded-xl border border-text-faint/30 px-4 py-2.5"
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Mot de passe"
          value={form.password}
          onChange={handleChange}
          className="w-full rounded-xl border border-text-faint/30 px-4 py-2.5"
          required
        />
        {error && <p className="text-sm text-brick">{error}</p>}
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {mode === "login" ? "Se connecter" : "Créer mon compte"}
        </Button>
        <button
          type="button"
          onClick={() => setMode(mode === "login" ? "register" : "login")}
          className="w-full text-sm text-navy underline"
        >
          {mode === "login" ? "Pas de compte ? S'inscrire" : "Déjà un compte ? Se connecter"}
        </button>
      </form>
    </Modal>
  );
}
