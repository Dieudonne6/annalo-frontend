import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

import { fetchExams, fetchLevels, fetchOrganizations, fetchPapers } from "../api/catalog";
import { fetchAnnouncements } from "../api/cms";
import { scrollToId } from "../components/common/SectionLink";
import AnnouncementsSection from "../components/home/AnnouncementsSection";
import CatalogueSection from "../components/home/CatalogueSection";
import CategoriesSection from "../components/home/CategoriesSection";
import ContributeBand from "../components/home/ContributeBand";
import Hero from "../components/home/Hero";
import HowItWorks from "../components/home/HowItWorks";
import PlansSection from "../components/home/PlansSection";
import StatsStrip from "../components/home/StatsStrip";
import useReveal from "../hooks/useReveal";
import { TRACKS } from "../lib/format";

const countOf = (request) => request.then(({ data }) => data.count ?? null).catch(() => null);

/** Page d'accueil publique : reprend section par section maquettes/index (3).html. */
export default function Home() {
  const rootRef = useRef(null);
  const location = useLocation();
  const [stats, setStats] = useState(null);
  const [announcements, setAnnouncements] = useState(null);
  const [filters, setFilters] = useState({ track: TRACKS[0].value, exam: "", level: "", subject: "", search: "" });

  useReveal(rootRef);

  useEffect(() => {
    Promise.all([
      countOf(fetchPapers()),
      countOf(fetchExams()),
      countOf(fetchOrganizations()),
      countOf(fetchLevels()),
    ]).then(([papers, exams, organizations, levels]) => setStats({ papers, exams, organizations, levels }));

    fetchAnnouncements()
      .then(({ data }) => setAnnouncements(data.results ?? data))
      .catch(() => setAnnouncements([]));
  }, []);

  // Arrivée depuis une autre page sur "/#section".
  useEffect(() => {
    if (!location.hash) return undefined;
    const t = setTimeout(() => scrollToId(location.hash.slice(1)), 100);
    return () => clearTimeout(t);
  }, [location.hash]);

  function pickExam(track, examId) {
    setFilters({ track, exam: examId, level: "", subject: "", search: "" });
    scrollToId("catalogue");
  }

  // Annonce dont l'échéance est la plus proche, pour le ticket du hero.
  const nextAnnouncement = (announcements ?? [])
    .filter((a) => a.ends_at)
    .sort((a, b) => new Date(a.ends_at) - new Date(b.ends_at))[0];

  return (
    <main ref={rootRef}>
      <Hero stats={stats} nextAnnouncement={nextAnnouncement} />
      <StatsStrip stats={stats} />
      <CategoriesSection onPickExam={pickExam} />
      <CatalogueSection filters={filters} onFiltersChange={setFilters} />
      <HowItWorks />
      <AnnouncementsSection announcements={announcements} />
      <PlansSection />
      <ContributeBand />
    </main>
  );
}
