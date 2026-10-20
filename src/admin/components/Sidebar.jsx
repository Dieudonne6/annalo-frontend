import { NavLink } from "react-router-dom";

const LINKS = [
  { to: "/admin", label: "Tableau de bord", end: true },
  { to: "/admin/sujets", label: "Sujets" },
  { to: "/admin/categories", label: "Corps / Écoles" },
  { to: "/admin/tarifs", label: "Tarifs" },
  { to: "/admin/abonnes", label: "Abonnés" },
  { to: "/admin/contributions", label: "Contributions" },
  { to: "/admin/annonces", label: "Annonces" },
  { to: "/admin/parametres", label: "Paramètres" },
];

export default function Sidebar() {
  return (
    <aside className="w-64 shrink-0 border-r border-text-faint/10 bg-navy-deep p-4 text-white2">
      <p className="mb-6 px-2 text-lg font-bold">Annalo Admin</p>
      <nav className="space-y-1">
        {LINKS.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) =>
              `block rounded-lg px-3 py-2 text-sm font-medium ${
                isActive ? "bg-navy-2 text-white2" : "text-white2/70 hover:bg-navy-2/50"
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
