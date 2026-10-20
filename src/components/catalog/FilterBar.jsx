import { useEffect, useRef, useState } from "react";

import { ChevronDown } from "../../lib/icons";

/**
 * "filter-row" de la maquette : des "select-pill" avec menu déroulant
 * (un seul ouvert à la fois, fermés au clic extérieur).
 *
 * `pills` : [{ key, label, allLabel, options: [{ value, label }] }]
 */
export default function FilterBar({ pills, values, onChange, onReset }) {
  const [openKey, setOpenKey] = useState(null);
  const rowRef = useRef(null);

  useEffect(() => {
    const onClick = (e) => {
      if (!e.target.closest?.(".select-pill")) setOpenKey(null);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  function choose(key, value) {
    setOpenKey(null);
    onChange(key, value);
  }

  return (
    <div className="filter-row" ref={rowRef}>
      {pills.map((pill) => {
        const current = values[pill.key] ?? "";
        const selected = pill.options.find((o) => String(o.value) === String(current));
        const classes = ["select-pill", current ? "active" : "", openKey === pill.key ? "open" : ""];
        return (
          <div className={classes.join(" ")} key={pill.key}>
            <button type="button" onClick={() => setOpenKey(openKey === pill.key ? null : pill.key)}>
              <span className="lbl">{pill.label}</span> <span>{selected?.label ?? pill.allLabel}</span>
              <ChevronDown />
            </button>
            <div className="select-menu">
              <div className={`opt ${!current ? "on" : ""}`} onClick={() => choose(pill.key, "")}>{pill.allLabel}</div>
              {pill.options.map((o) => (
                <div
                  key={o.value}
                  className={`opt ${String(o.value) === String(current) ? "on" : ""}`}
                  onClick={() => choose(pill.key, o.value)}
                >
                  {o.label}
                </div>
              ))}
            </div>
          </div>
        );
      })}
      <div className="reset-link" role="button" tabIndex={0} onClick={onReset}>Réinitialiser</div>
    </div>
  );
}
