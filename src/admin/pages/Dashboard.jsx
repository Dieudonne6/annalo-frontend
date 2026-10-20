import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import StatCard from "../components/StatCard";

/**
 * Correspond au tableau de bord admin : "Revenus — 6 derniers mois",
 * "Nouveaux utilisateurs — 6 derniers mois", "Ventes par corps / école",
 * "Activité récente".
 *
 * IMPORTANT (Claude Code) : ces données sont des PLACEHOLDERS. Le backend
 * n'a pas encore d'endpoint de stats (voir étape 5 du CLAUDE.md backend).
 * Une fois `GET /api/dashboard/stats/` (ou équivalent) créé, remplacer les
 * tableaux ci-dessous par un `useEffect` + fetch, avec un état de chargement.
 */
const revenueData = [
  { month: "Mai", revenue: 0 },
  { month: "Juin", revenue: 0 },
  { month: "Juil", revenue: 0 },
  { month: "Août", revenue: 0 },
  { month: "Sept", revenue: 0 },
  { month: "Oct", revenue: 0 },
];

const usersData = [
  { month: "Mai", users: 0 },
  { month: "Juin", users: 0 },
  { month: "Juil", users: 0 },
  { month: "Août", users: 0 },
  { month: "Sept", users: 0 },
  { month: "Oct", users: 0 },
];

const salesByOrg = [{ name: "À connecter à l'API", value: 1 }];
const COLORS = ["#003976", "#0F5CA8", "#B8862F", "#E8B94D", "#A23E2E"];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-navy">Tableau de bord</h1>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard label="Revenus du mois" value="0 FCFA" />
        <StatCard label="Nouveaux abonnés" value="0" />
        <StatCard label="Contributions en attente" value="0" />
        <StatCard label="Messages non lus" value="0" />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-text-faint/15 bg-white2 p-4">
          <h3 className="mb-3 font-semibold">Revenus — 6 derniers mois</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="revenue" fill="#003976" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-2xl border border-text-faint/15 bg-white2 p-4">
          <h3 className="mb-3 font-semibold">Nouveaux utilisateurs — 6 derniers mois</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={usersData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="users" fill="#B8862F" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-2xl border border-text-faint/15 bg-white2 p-4 md:col-span-2">
          <h3 className="mb-3 font-semibold">Ventes par corps / école</h3>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={salesByOrg} dataKey="value" nameKey="name" outerRadius={90}>
                {salesByOrg.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-2xl border border-text-faint/15 bg-white2 p-4">
        <h3 className="mb-3 font-semibold">Activité récente</h3>
        <p className="text-sm text-text-soft">
          TODO: flux d'événements (nouveaux paiements, contributions, inscriptions).
        </p>
      </div>
    </div>
  );
}
