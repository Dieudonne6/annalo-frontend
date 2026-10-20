import { useEffect, useState } from "react";

import { fetchPapers } from "../api/catalog";
import FilterBar from "../components/catalog/FilterBar";
import PaperCard from "../components/catalog/PaperCard";

/**
 * Page d'accueil publique. Sections à reconstituer depuis index__3_.html :
 * hero ("Prépare et réussis tes..."), "Trois voies, un seul catalogue",
 * catalogue filtrable (ci-dessous, déjà câblé à l'API), "Concours à suivre"
 * (Announcement), "Un abonnement, un accès illimité" (plans), bande
 * "Contribuer un sujet".
 *
 * TODO (Claude Code): découper en sous-composants dédiés au fur et à mesure
 * (Hero.jsx, AnnouncementBand.jsx, PlansSection.jsx, ContributeBand.jsx...)
 * plutôt que de tout garder ici.
 */
export default function Home() {
  const [track, setTrack] = useState("examen");
  const [filters, setFilters] = useState({});
  const [papers, setPapers] = useState([]);
  const [selectedPaper, setSelectedPaper] = useState(null);

  useEffect(() => {
    fetchPapers({ track, ...filters }).then(({ data }) => {
      setPapers(data.results ?? data);
    });
  }, [track, filters]);

  function handleFilterChange(key, value) {
    setFilters((prev) => ({ ...prev, [key]: value || undefined }));
  }

  return (
    <main>
      {/* Hero */}
      <section className="bg-navy py-16 text-center text-white2">
        <h1 className="mx-auto max-w-2xl text-4xl font-bold">
          Prépare et réussis tes concours et examens
        </h1>
        <p className="mt-3 text-white2/80">
          Trouve ton sujet en quelques secondes, dans un seul catalogue.
        </p>
      </section>

      {/* Catalogue */}
      <section id="catalogue" className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="mb-6 text-2xl font-bold text-navy">
          Trois voies, un seul catalogue
        </h2>
        <FilterBar
          track={track}
          onTrackChange={setTrack}
          filters={filters}
          onFilterChange={handleFilterChange}
        />
        <div id="cat-grid" className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {papers.map((paper) => (
            <PaperCard key={paper.id} paper={paper} onOpenDetail={setSelectedPaper} />
          ))}
        </div>
      </section>

      {/* TODO: Section "Un abonnement, un accès illimité" (plans-examens/concours/national) */}
      {/* TODO: Bande "Contribuer un sujet" (modal-contrib) */}
      {/* TODO: Modale "modal-detail" pilotée par `selectedPaper` */}
    </main>
  );
}
