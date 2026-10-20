import { useEffect, useState } from "react";

import { fetchExams, fetchLevels, fetchPapers, fetchSubjects } from "../../api/catalog";
import { useUI } from "../../context/UIContext";
import useFavorites from "../../hooks/useFavorites";
import { TRACKS } from "../../lib/format";
import { ArrowRight } from "../../lib/icons";
import FilterBar from "../catalog/FilterBar";
import PaperCard from "../catalog/PaperCard";

const HOME_LIMIT = 6;

const toOptions = (list) => list.map((x) => ({ value: x.id, label: x.name }));

/**
 * Section "catalogue" de la maquette, branchée sur GET /api/catalog/papers/.
 * `filters` = { track, exam, level, subject, search } est porté par Home pour
 * que les cartes de catégories puissent le piloter.
 */
export default function CatalogueSection({ filters, onFiltersChange }) {
  const { openModal, toast } = useUI();
  const { favorites, toggle } = useFavorites();
  const [exams, setExams] = useState([]);
  const [levels, setLevels] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [search, setSearch] = useState(filters.search ?? "");
  const [papers, setPapers] = useState([]);
  const [count, setCount] = useState(null);
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchLevels().then(({ data }) => setLevels(data.results ?? data)).catch(() => {});
    fetchSubjects().then(({ data }) => setSubjects(data.results ?? data)).catch(() => {});
  }, []);

  useEffect(() => {
    fetchExams({ track: filters.track }).then(({ data }) => setExams(data.results ?? data)).catch(() => {});
  }, [filters.track]);

  // Recherche : on attend une courte pause dans la frappe avant d'interroger l'API.
  useEffect(() => {
    if (search === (filters.search ?? "")) return undefined;
    const t = setTimeout(() => onFiltersChange({ ...filters, search }), 300);
    return () => clearTimeout(t);
  }, [search]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setSearch(filters.search ?? "");
  }, [filters.search]);

  // Première page à chaque changement de filtre.
  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setIsExpanded(false);
    fetchPapers(buildParams(filters, 1))
      .then(({ data }) => {
        if (cancelled) return;
        setPapers(data.results ?? data);
        setCount(data.count ?? (data.results ?? data).length);
        setHasNext(Boolean(data.next));
        setPage(1);
      })
      .catch(() => {
        if (cancelled) return;
        setPapers([]);
        setCount(0);
        setHasNext(false);
      })
      .finally(() => !cancelled && setIsLoading(false));
    return () => {
      cancelled = true;
    };
  }, [filters]);

  async function loadMore() {
    setIsLoading(true);
    try {
      const { data } = await fetchPapers(buildParams(filters, page + 1));
      setPapers((prev) => [...prev, ...(data.results ?? [])]);
      setHasNext(Boolean(data.next));
      setPage(page + 1);
    } catch {
      toast("Impossible de charger plus de sujets.");
    } finally {
      setIsLoading(false);
    }
  }

  function handleFavorite(id) {
    if (toggle(id)) toast("Ajouté aux favoris");
  }

  const setFilter = (key, value) => onFiltersChange({ ...filters, [key]: value });
  const reset = () => onFiltersChange({ track: filters.track, exam: "", level: "", subject: "", search: "" });

  const shown = isExpanded ? papers : papers.slice(0, HOME_LIMIT);
  const isTruncated = !isExpanded && count > HOME_LIMIT;
  const countLabel =
    count == null
      ? "— résultats"
      : isTruncated
        ? `${shown.length} sur ${count} résultats`
        : `${count} résultat${count > 1 ? "s" : ""}`;

  const pills = [
    { key: "exam", label: "Examen", allLabel: "Tous", options: toOptions(exams) },
    { key: "level", label: "Niveau", allLabel: "Tous", options: toOptions(levels) },
    { key: "subject", label: "Matière", allLabel: "Toutes", options: toOptions(subjects) },
  ];

  return (
    <section className="section" id="catalogue" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <div className="section-head">
          <div className="eyebrow">Catalogue</div>
          <h2>Trouve ton sujet en quelques secondes</h2>
          <p>Filtre par examen, niveau et matière — ou lance simplement une recherche.</p>
        </div>

        <div className="catalogue-panel">
          <div className="cat-panel-top">
            <div className="segmented">
              {TRACKS.map((t) => (
                <button
                  key={t.value}
                  className={filters.track === t.value ? "active" : ""}
                  onClick={() => onFiltersChange({ track: t.value, exam: "", level: "", subject: "", search: filters.search })}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <div className="search-box">
              <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" strokeLinecap="round" /></svg>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher un sujet, une matière…"
                aria-label="Rechercher"
              />
            </div>
          </div>

          <FilterBar pills={pills} values={filters} onChange={setFilter} onReset={reset} />

          <div className="results-count">{countLabel}</div>
          <div className="ticket-grid" style={{ opacity: isLoading ? 0.6 : 1, transition: "opacity .15s ease" }}>
            {shown.map((paper) => (
              <PaperCard
                key={paper.id}
                paper={paper}
                isFavorite={favorites.has(paper.id)}
                onToggleFavorite={handleFavorite}
                onOpen={(id) => openModal("detail", id)}
              />
            ))}
          </div>
          <div className={`empty-results ${count === 0 ? "show" : ""}`}>
            Aucun sujet ne correspond à ces filtres pour le moment.
          </div>
          {(isTruncated || (isExpanded && hasNext)) && (
            <div className="load-more-row">
              <button
                className="btn btn-outline on-light"
                onClick={isTruncated ? () => setIsExpanded(true) : loadMore}
                disabled={isLoading}
              >
                {isTruncated ? "Voir tout le catalogue" : "Charger plus de sujets"}
                <ArrowRight />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function buildParams(filters, page) {
  const params = { page };
  for (const key of ["track", "exam", "level", "subject", "search"]) {
    if (filters[key]) params[key] = filters[key];
  }
  return params;
}
