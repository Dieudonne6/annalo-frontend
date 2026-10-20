import { announcementKind } from "../../lib/announcements";
import { daysUntil, plural } from "../../lib/format";
import { ArrowRight } from "../../lib/icons";
import { scrollToId } from "../common/SectionLink";

const Seal = () => (
  <div className="hero-seal" aria-hidden="true">
    <svg viewBox="0 0 200 200">
      <g fill="none" stroke="#E8B94D" strokeWidth="0.5">
        <circle cx="100" cy="100" r="96" /><circle cx="100" cy="100" r="88" />
        <circle cx="100" cy="100" r="72" /><circle cx="100" cy="100" r="64" />
        <circle cx="100" cy="100" r="46" /><circle cx="100" cy="100" r="38" />
        <circle cx="100" cy="100" r="20" />
      </g>
      <g fill="none" stroke="#E8B94D" strokeWidth="0.4" opacity="0.8">
        <path d="M100 4 A96 96 0 0 1 100 196 A96 96 0 0 1 100 4" strokeDasharray="2 3" />
      </g>
      <g fill="none" stroke="#E8B94D" strokeWidth="0.5">
        <circle cx="100" cy="100" r="96" strokeDasharray="0.5 5.6" />
      </g>
    </svg>
  </div>
);

export const STAT_ITEMS = [
  { key: "papers", label: "Sujets & corrigés" },
  { key: "exams", label: "Examens & concours" },
  { key: "organizations", label: "Organismes" },
  { key: "levels", label: "Niveaux" },
];

const statValue = (stats, key) => (stats?.[key] == null ? "—" : stats[key]);

/**
 * Section "hero" de la maquette. Le ticket affiche la prochaine annonce avec
 * échéance ; à défaut, un résumé du catalogue.
 */
export default function Hero({ stats, nextAnnouncement }) {
  const a = nextAnnouncement;
  const ticket = a
    ? {
        eyebrow: "Prochaine échéance",
        name: a.name,
        meta: a.organization_name || announcementKind(a.kind).label,
        facts: [
          ["Jours restants", daysUntil(a.ends_at)],
          ["Type", announcementKind(a.kind).label],
          ["Statut", "Ouvert"],
        ],
      }
    : {
        eyebrow: "Catalogue Annalo",
        name: "Sujets vérifiés",
        meta: "Examens, concours et national · Corrigés types",
        facts: [
          ["Sujets", statValue(stats, "papers")],
          ["Examens", statValue(stats, "exams")],
          ["Organismes", statValue(stats, "organizations")],
        ],
      };

  return (
    <section className="hero" id="top">
      <Seal />
      <div className="wrap hero-grid">
        <div>
          <h1>Prépare et réussis tes <em>examens</em> et concours publics</h1>
          <p className="lead">
            Sujets vérifiés, corrigés types et calendrier des examens nationaux (CEP, BEPC, BAC, Licence,
            Master...), des concours de la fonction publique et des écoles publiques du Bénin — réunis au
            même endroit.
          </p>
          <div className="hero-cta">
            <button className="btn btn-gold" onClick={() => scrollToId("catalogue")}>
              Parcourir le catalogue
              <ArrowRight />
            </button>
            <button className="btn btn-outline" onClick={() => scrollToId("tarifs")}>Voir les tarifs</button>
          </div>
          <div className="hero-trust">
            {STAT_ITEMS.map((s) => (
              <div className="item" key={s.key}>
                <div className="n">{statValue(stats, s.key)}</div>
                <div className="l">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="ticket-visual">
          <div className="ticket-card">
            <div className="row-top">
              <div>
                <div className="eyebrow" style={{ color: "var(--navy-2)" }}>{ticket.eyebrow}</div>
                <div className="name">{ticket.name}</div>
                <div className="meta">{ticket.meta}</div>
              </div>
              <div className="stamp">ANNALO<br />VÉRIFIÉ</div>
            </div>
            <div className="divider" />
            <div className="facts">
              {ticket.facts.map(([k, v]) => (
                <div className="f" key={k}><div className="k">{k}</div><div className="v">{v}</div></div>
              ))}
            </div>
          </div>
          <div className="float-chip fc-1"><span className="dot" /> Corrigé disponible</div>
          <div className="float-chip fc-2">
            🎓 {stats?.organizations != null ? `${plural(stats.organizations, "organisme")} couverts` : "Organismes publics couverts"}
          </div>
        </div>
      </div>
    </section>
  );
}
