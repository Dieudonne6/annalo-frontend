import { useEffect, useState } from "react";

import { confirmPasswordReset, requestPasswordReset } from "../../api/auth";
import { useAuth } from "../../context/AuthContext";
import { useUI } from "../../context/UIContext";
import { apiErrorMessage } from "../../lib/api-helpers";
import { firstName } from "../../lib/format";
import Modal from "../common/Modal";

const TITLES = {
  login: ["Connexion à Annalo", "Retrouve ton catalogue et ton historique d'achats."],
  register: ["Créer un compte", "Quelques secondes suffisent pour commencer à réviser."],
  reset: ["Mot de passe oublié", "On t'envoie un code par SMS pour choisir un nouveau mot de passe."],
  resetConfirm: ["Nouveau mot de passe", "Saisis le code reçu par SMS et ton nouveau mot de passe."],
};

const EMPTY = { full_name: "", phone: "", email: "", password: "", code: "" };

/** "modal-auth" de la maquette : connexion, inscription et mot de passe oublié. */
export default function AuthModal() {
  const { login, register } = useAuth();
  const { modal, closeModal, toast } = useUI();
  const isOpen = modal.name === "auth";
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setMode("login");
      setError("");
      setForm(EMPTY);
    }
  }, [isOpen]);

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });
  const switchMode = (next) => (e) => {
    e?.preventDefault();
    setError("");
    setMode(next);
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      if (mode === "login") {
        const me = await login(form.phone.trim(), form.password);
        closeModal();
        toast(`Connecté(e) — bienvenue ${firstName(me.full_name)}`);
      } else if (mode === "register") {
        const me = await register({
          full_name: form.full_name.trim(),
          phone: form.phone.trim(),
          email: form.email.trim() || null,
          password: form.password,
        });
        closeModal();
        toast(`Compte créé — bienvenue ${firstName(me.full_name)}`);
      } else if (mode === "reset") {
        const { data } = await requestPasswordReset(form.phone.trim());
        toast(data.detail);
        setMode("resetConfirm");
      } else {
        const { data } = await confirmPasswordReset(form.phone.trim(), form.code.trim(), form.password);
        toast(data.detail);
        setForm({ ...form, password: "", code: "" });
        setMode("login");
      }
    } catch (err) {
      const fallback = mode === "login" ? "Numéro ou mot de passe incorrect." : undefined;
      setError(err.response?.status === 401 ? fallback : apiErrorMessage(err, fallback));
    } finally {
      setIsSubmitting(false);
    }
  }

  const [title, sub] = TITLES[mode];
  const submitLabel = {
    login: "Se connecter",
    register: "Créer mon compte",
    reset: "Recevoir un code",
    resetConfirm: "Changer le mot de passe",
  }[mode];

  return (
    <Modal isOpen={isOpen} onClose={closeModal}>
      <h3>{title}</h3>
      <div className="sub">{sub}</div>
      <form onSubmit={handleSubmit}>
        {mode === "register" && (
          <>
            <div className="field-label">Nom complet</div>
            <input className="field-input" value={form.full_name} onChange={set("full_name")} placeholder="Ton nom" required />
          </>
        )}
        {mode !== "resetConfirm" && (
          <>
            <div className="field-label">Numéro de téléphone</div>
            <input className="field-input" type="tel" id="auth-phone" value={form.phone} onChange={set("phone")} placeholder="+229 00 00 00 00" autoComplete="tel" required />
          </>
        )}
        {mode === "register" && (
          <>
            <div className="field-label">Email (facultatif)</div>
            <input className="field-input" type="email" value={form.email} onChange={set("email")} placeholder="toi@exemple.com" autoComplete="email" />
          </>
        )}
        {mode === "resetConfirm" && (
          <>
            <div className="field-label">Code reçu par SMS</div>
            <input className="field-input" inputMode="numeric" maxLength={6} value={form.code} onChange={set("code")} placeholder="000000" autoComplete="one-time-code" required />
          </>
        )}
        {mode !== "reset" && (
          <>
            <div className="field-label">{mode === "resetConfirm" ? "Nouveau mot de passe" : "Mot de passe"}</div>
            <input
              className="field-input"
              type="password"
              value={form.password}
              onChange={set("password")}
              placeholder="••••••••"
              minLength={mode === "login" ? undefined : 6}
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              required
            />
          </>
        )}
        {mode === "login" && (
          <div className="form-aside">
            <a href="#" onClick={switchMode("reset")}>Mot de passe oublié ?</a>
          </div>
        )}
        {error && <div className="form-error">{error}</div>}
        <button className="btn btn-navy" type="submit" style={{ width: "100%", marginTop: 22 }} disabled={isSubmitting}>
          {isSubmitting ? "Patiente…" : submitLabel}
        </button>
      </form>
      <div className="form-switch">
        {mode === "login" ? (
          <>Pas encore de compte ? <a href="#" onClick={switchMode("register")}>Créer un compte</a></>
        ) : (
          <>Déjà un compte ? <a href="#" onClick={switchMode("login")}>Se connecter</a></>
        )}
      </div>
    </Modal>
  );
}
