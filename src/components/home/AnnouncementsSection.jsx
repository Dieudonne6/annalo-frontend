import { useState } from "react";

import { useUI } from "../../context/UIContext";
import { announcementFoot, announcementKind } from "../../lib/announcements";
import { ArrowRight, Icon } from "../../lib/icons";

const HOME_LIMIT = 3;

/** "Concours à suivre" : annonces actives de GET /api/cms/announcements/. */
export default function AnnouncementsSection({ announcements }) {
  const { openModal } = useUI();
  const [showAll, setShowAll] = useState(false);
  const list = announcements ?? [];
  const visible = showAll ? list : list.slice(0, HOME_LIMIT);

  return (
    <section className="section" id="annonces">
      <div className="wrap">
        <div className="section-head" style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 20, flexWrap: "wrap" }}>
          <div>
            <div className="eyebrow">Annonces</div>
            <h2>Concours à suivre</h2>
            <p>Dates, conditions et statut des sessions en cours ou à venir.</p>
          </div>
          {!showAll && list.length > HOME_LIMIT && (
            <button className="btn btn-ghost" onClick={() => setShowAll(true)} style={{ whiteSpace: "nowrap", paddingBottom: 6 }}>
              Voir toutes les annonces
              <ArrowRight />
            </button>
          )}
        </div>
        <div className="annonce-grid">
          {visible.map((a) => {
            const kind = announcementKind(a.kind);
            const foot = announcementFoot(a);
            return (
              <div
                key={a.id}
                className={`annonce-card st-open ${kind.className}`}
                onClick={() => openModal("annonce", a)}
                onKeyDown={(e) => e.key === "Enter" && openModal("annonce", a)}
                role="button"
                tabIndex={0}
              >
                <div className="annonce-media">
                  <span className="status-pill open">Ouvert</span>
                  <div className="ic"><Icon name={kind.icon} strokeWidth={1.5} /></div>
                </div>
                <div className="annonce-body">
                  <div className="kind"><Icon name={kind.icon} strokeWidth={1.8} />{kind.label}</div>
                  <div className="name">{a.name}</div>
                  {a.organization_name && <div className="org">{a.organization_name}</div>}
                  <div className="foot"><span>{foot.label}</span><span className="cd">{foot.countdown}</span></div>
                </div>
              </div>
            );
          })}
        </div>
        {announcements && list.length === 0 && (
          <div className="empty-results show">Aucune annonce en cours pour le moment. Reviens bientôt !</div>
        )}
      </div>
    </section>
  );
}
