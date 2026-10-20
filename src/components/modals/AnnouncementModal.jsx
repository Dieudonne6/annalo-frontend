import { useUI } from "../../context/UIContext";
import {
  announcementConditions,
  announcementFoot,
  announcementKind,
} from "../../lib/announcements";
import { CheckIcon, Icon } from "../../lib/icons";
import Modal from "../common/Modal";
import { scrollToId } from "../common/SectionLink";

/** "modal-annonce" de la maquette ; la donnée vient de la carte cliquée. */
export default function AnnouncementModal() {
  const { modal, closeModal } = useUI();
  const isOpen = modal.name === "annonce";
  const a = isOpen ? modal.payload : null;
  if (!a) return null;

  const kind = announcementKind(a.kind);
  const foot = announcementFoot(a);
  const conditions = announcementConditions(a);

  function handleCta() {
    if (a.cta_url) {
      window.open(a.cta_url, "_blank", "noopener");
      return;
    }
    closeModal();
    scrollToId("catalogue");
  }

  return (
    <Modal isOpen={isOpen} onClose={closeModal} className="modal-annonce-detail">
      <div className={`ad-media ${kind.className}`}>
        <span className="status-pill open">Ouvert</span>
        <div className="ic"><Icon name={kind.icon} strokeWidth={1.5} /></div>
      </div>
      <div id="ad-kind" className={`kind ${kind.className}`}>
        <Icon name={kind.icon} strokeWidth={1.8} />
        {kind.label}
      </div>
      <h3 style={{ marginTop: 8 }}>{a.name}</h3>
      {a.organization_name && <div className="sub">{a.organization_name}</div>}
      {a.description && <p className="ad-desc">{a.description}</p>}
      {conditions.length > 0 && (
        <>
          <div className="field-label">Conditions &amp; à savoir</div>
          <ul className="ad-conditions">
            {conditions.map((c) => (
              <li key={c}><span className="ck"><CheckIcon /></span>{c}</li>
            ))}
          </ul>
        </>
      )}
      <div className="ad-foot">
        <span>{foot.label}</span>
        <span className="cd">{foot.countdown}</span>
      </div>
      <button className="btn btn-navy" style={{ width: "100%", marginTop: 18 }} onClick={handleCta}>
        {a.cta_label || "Voir le catalogue"}
      </button>
    </Modal>
  );
}
