import { useEffect, useState } from "react";

import { fetchLevels, fetchSubjects } from "../../api/catalog";
import { submitContribution } from "../../api/contributions";
import { useUI } from "../../context/UIContext";
import { apiErrorMessage } from "../../lib/api-helpers";
import { TRACKS } from "../../lib/format";
import Modal from "../common/Modal";

const EMPTY = { name: "", track: "examen", level: "", session_year: "", subject: "", file: null };
const MAX_SIZE = 20 * 1024 * 1024; // même limite que le backend

/**
 * "modal-contrib" de la maquette → POST /api/contributions/ (multipart).
 * Le backend n'accepte qu'un fichier par contribution : la ligne "Corrigé
 * (optionnel)" de la maquette n'est donc pas reprise.
 */
export default function ContributeModal() {
  const { modal, closeModal, toast } = useUI();
  const isOpen = modal.name === "contrib";
  const [form, setForm] = useState(EMPTY);
  const [levels, setLevels] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setError("");
    fetchLevels().then(({ data }) => setLevels(data.results ?? data)).catch(() => {});
    fetchSubjects().then(({ data }) => setSubjects(data.results ?? data)).catch(() => {});
  }, [isOpen]);

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  function handleFile(e) {
    const file = e.target.files?.[0] ?? null;
    if (file && file.size > MAX_SIZE) {
      setError("Fichier trop volumineux (20 Mo maximum).");
      return;
    }
    setError("");
    setForm({ ...form, file });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const year = Number(form.session_year);
    if (!form.name.trim() || !year) {
      setError("Complète le nom du concours et l'année de la session.");
      return;
    }
    if (!form.level) {
      setError("Précise le niveau du sujet.");
      return;
    }
    if (!form.file) {
      setError("Ajoute le fichier du sujet.");
      return;
    }
    const body = new FormData();
    body.append("name", form.name.trim());
    body.append("track", form.track);
    body.append("level", form.level);
    body.append("session_year", String(year));
    if (form.subject) body.append("subject", form.subject);
    body.append("file", form.file);

    setError("");
    setIsSubmitting(true);
    try {
      await submitContribution(body);
      setForm(EMPTY);
      closeModal();
      toast("Contribution envoyée — merci !");
    } catch (err) {
      setError(apiErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={closeModal}>
      <h3>Contribuer un sujet</h3>
      <div className="sub">Envoie un sujet d'examen ou de concours, avec ou sans corrigé type.</div>
      <form onSubmit={handleSubmit}>
        <div className="field-label">Examen ou concours</div>
        <input className="field-input" value={form.name} onChange={set("name")} placeholder="Ex. BEPC, Concours Police, ENAM…" />

        <div className="field-label">Voie</div>
        <select className="field-input" value={form.track} onChange={set("track")}>
          {TRACKS.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>

        <div className="field-label">Niveau</div>
        <div className="chip-row-modal">
          {levels.map((l) => (
            <button
              type="button"
              key={l.id}
              className={`chip-modal ${String(form.level) === String(l.id) ? "active" : ""}`}
              onClick={() => setForm({ ...form, level: l.id })}
            >
              {l.name}
            </button>
          ))}
        </div>

        <div className="field-label">Session / Année</div>
        <input
          className="field-input"
          type="number"
          min="1960"
          max={new Date().getFullYear()}
          value={form.session_year}
          onChange={set("session_year")}
          placeholder={`Ex. ${new Date().getFullYear() - 1}`}
        />

        <div className="field-label">Matière</div>
        <select className="field-input" value={form.subject} onChange={set("subject")}>
          <option value="">Choisir une matière</option>
          {subjects.map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>

        <div className="field-label">Fichier</div>
        <label className={`file-row ${form.file ? "filled" : ""}`}>
          <svg viewBox="0 0 24 24"><path d="M6 3h9l3 3v15H6z" /><path d="M9 12h6M9 16h6" /></svg>
          <span>{form.file ? `✓ Sujet ajouté — ${form.file.name}` : "Sujet (PDF, JPG ou PNG — obligatoire)"}</span>
          <input type="file" accept=".pdf,.jpg,.jpeg,.png" style={{ display: "none" }} onChange={handleFile} />
        </label>

        {error && <div className="form-error">{error}</div>}
        <button className="btn btn-navy" type="submit" style={{ width: "100%", marginTop: 22 }} disabled={isSubmitting}>
          {isSubmitting ? "Envoi…" : "Envoyer ma contribution"}
        </button>
      </form>
    </Modal>
  );
}
