import { useEffect, useState } from "react";

import { fetchSiteInfo } from "../../api/cms";
import { useUI } from "../../context/UIContext";
import SectionLink from "../common/SectionLink";

export default function Footer() {
  const { openModal } = useUI();
  const [site, setSite] = useState(null);

  useEffect(() => {
    fetchSiteInfo().then(({ data }) => setSite(data)).catch(() => {});
  }, []);

  const contactEmail = site?.contact_email || "contact@annalo.bj";
  const openContact = (e) => {
    e.preventDefault();
    openModal("contact");
  };

  return (
    <footer>
      <div className="wrap foot-grid">
        <div>
          <div className="foot-brand"><span className="mark">A</span> {site?.site_name || "Annalo"}</div>
          <p className="tagline">
            {site?.tagline || "La plateforme des examens et concours publics du Bénin."}
          </p>
        </div>
        <div>
          <h5>Catalogue</h5>
          <ul>
            <li><SectionLink to="categories">Catégories</SectionLink></li>
            <li><SectionLink to="catalogue">Catalogue</SectionLink></li>
            <li><SectionLink to="annonces">Annonces</SectionLink></li>
          </ul>
        </div>
        <div>
          <h5>Annalo</h5>
          <ul>
            <li><SectionLink to="tarifs">Tarifs</SectionLink></li>
            <li><SectionLink to="contribuer">Contribuer</SectionLink></li>
            <li><a href="#" onClick={openContact}>Assistance</a></li>
          </ul>
        </div>
        <div>
          <h5>Contact</h5>
          <ul>
            <li><a href="#" onClick={openContact}>Nous contacter</a></li>
            {site?.contact_phone && <li><a href={`tel:${site.contact_phone}`}>{site.contact_phone}</a></li>}
            <li><a href={`mailto:${contactEmail}`}>{contactEmail}</a></li>
          </ul>
        </div>
      </div>
      <div className="wrap foot-bottom">
        <span>© {new Date().getFullYear()} Annalo. Tous droits réservés.</span>
        <span>Conditions d'utilisation · Confidentialité</span>
      </div>
    </footer>
  );
}
