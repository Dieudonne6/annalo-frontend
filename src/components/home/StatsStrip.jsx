import { STAT_ITEMS } from "./Hero";

export default function StatsStrip({ stats }) {
  return (
    <div className="stats-strip">
      <div className="wrap stats-row">
        {STAT_ITEMS.map((s) => (
          <div className="st" key={s.key}>
            <div className="n">{stats?.[s.key] ?? "—"}</div>
            <div className="l">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
