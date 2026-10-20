import { useEffect, useState } from "react";

import { fetchExams, fetchPapers } from "../../api/catalog";
import { TRACKS, plural } from "../../lib/format";
import { ChevronDown, Icon } from "../../lib/icons";

const CAT_LIMIT = 4;
const TRACK_ICON = { examen: "book", concours: "briefcase", national: "cap" };

/**
 * "Trois voies, un seul catalogue" : une carte par examen/concours de la voie
 * active. Cliquer filtre le catalogue sur cet examen.
 */
export default function CategoriesSection({ onPickExam }) {
  const [track, setTrack] = useState(TRACKS[0].value);
  const [exams, setExams] = useState([]);
  const [counts, setCounts] = useState({});
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setIsExpanded(false);
    fetchExams({ track })
      .then(({ data }) => {
        const list = data.results ?? data;
        if (cancelled) return;
        setExams(list);
        // Nombre de sujets publiés par examen (le `count` de la liste paginée).
        Promise.all(
          list.map((e) => fetchPapers({ exam: e.id }).then((r) => [e.id, r.data.count ?? 0]).catch(() => [e.id, null]))
        ).then((pairs) => !cancelled && setCounts(Object.fromEntries(pairs)));
      })
      .catch(() => !cancelled && setExams([]));
    return () => {
      cancelled = true;
    };
  }, [track]);

  const showAll = isExpanded || exams.length <= CAT_LIMIT;
  const visible = showAll ? exams : exams.slice(0, CAT_LIMIT);

  return (
    <section className="section" id="categories" style={{ paddingTop: 52 }}>
      <div className="wrap">
        <div className="section-head">
          <div className="eyebrow">Catégories</div>
          <h2>Trois voies, un seul catalogue</h2>
          <p>
            Que tu prépares un examen, que tu vises un concours de la fonction publique ou une école,
            retrouve tous les sujets classés par examen, par niveau et par matière.
          </p>
        </div>
        <div className="cat-tabs">
          {TRACKS.map((t) => (
            <button key={t.value} className={track === t.value ? "active" : ""} onClick={() => setTrack(t.value)}>
              {t.label}
            </button>
          ))}
        </div>
        <div className="cat-grid">
          {visible.map((exam) => {
            const count = counts[exam.id];
            return (
              <div className="cat-card" key={exam.id} onClick={() => onPickExam(track, exam.id)} role="button" tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && onPickExam(track, exam.id)}>
                <div className="ic"><Icon name={TRACK_ICON[track]} /></div>
                <h4>{exam.name}</h4>
                <p>{exam.organization?.name}</p>
                <div className="cat-count">
                  {count == null ? "…" : `${plural(count, "sujet")} disponible${count > 1 ? "s" : ""}`}
                </div>
              </div>
            );
          })}
        </div>
        {exams.length === 0 && <div className="empty-results show">Aucun examen dans cette voie pour le moment.</div>}
        {!showAll && (
          <div className="load-more-row">
            <button className="btn btn-outline on-light" onClick={() => setIsExpanded(true)}>
              Voir plus de catégories
              <ChevronDown />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
