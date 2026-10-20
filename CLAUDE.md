# Annalo — Frontend (React + Vite + Tailwind)

## Le projet

Interface du site **Annalo** (banque d'épreuves/sujets de concours et
d'examens au Bénin) + son back-office admin. Consomme l'API du projet
Django séparé `../annalo-backend` (voir son propre `CLAUDE.md` pour l'état
de l'API).

Deux maquettes HTML servent de référence pixel-perfect pour l'UI :
- site public : section hero, "Trois voies, un seul catalogue", catalogue
  filtrable + panier, "Un abonnement, un accès illimité", "Contribuer un
  sujet", compte utilisateur
- back-office : dashboard avec graphiques, gestion des sujets/corps/
  tarifs/abonnés/contributions/annonces, paramètres & rôles d'équipe

La palette de couleurs (navy/doré/papier) a déjà été reprise telle quelle
dans `tailwind.config.js` depuis les variables CSS `:root` de la maquette.

## État actuel (déjà fait)

- Projet Vite + React Router + Tailwind configuré.
- **Couche API** (`src/api/`) : un fichier par domaine (auth, catalog,
  subscriptions, payments, contributions, cms, dashboard). Tous les
  endpoints du backend sont couverts (vérifié contre le code backend en
  octobre 2026), y compris mot de passe oublié / vérification du numéro /
  invitations (`auth.js`), téléchargement protégé (`downloadPaper`),
  `verifyPayment`, et tout le back-office dans `dashboard.js`.
- **`src/api/client.js`** : instance axios avec attache automatique du JWT
  et refresh automatique du token sur 401.
- **Contexts** : `AuthContext` (login/register/logout/me) et `CartContext`
  (panier, tiroir `cart-drawer`).
- **Routing** : `/` (accueil public), `/compte` (protégé), `/admin/*`
  (protégé + réservé aux membres d'équipe), via `ProtectedRoute` et
  `AdminRoute`.
- **Site public** : `Header`, `Footer`, `AuthModal`, `CartDrawer`,
  `FilterBar`, `PaperCard`, page `Home` (hero + catalogue filtrable déjà
  branché à l'API), page `Account` (onglets abonnements/paiements).
- **Back-office** : `AdminLayout` + `Sidebar`, page `Dashboard` avec
  graphiques Recharts (⚠️ données factices, à brancher sur `dashboard.js`), pages stub
  pour Sujets/Corps/Tarifs/Abonnés/Annonces/Paramètres (à construire), page
  Contributions déjà fonctionnelle (branchée à l'API).

Chaque fichier a des commentaires `// TODO (Claude Code): ...` aux endroits
qui restent à faire — grep `TODO` dans `src/` pour toutes les retrouver.

**Rien n'a été installé ni testé** (pas d'accès réseau pendant la création
de ce squelette) — `npm install` n'a jamais été lancé.

## À faire ensuite, dans l'ordre

1. **Installer et lancer le projet**
   ```bash
   npm install
   cp .env.example .env   # ajuster VITE_API_URL si besoin
   npm run dev
   ```
   Vérifier que ça compile (le `package.json` a été écrit à la main, sans
   `npm install` préalable — il peut y avoir un ajustement de version à
   faire si une dépendance a changé entre-temps).

2. **Comparer chaque page au pixel près avec les maquettes HTML**
   (`maquettes/index (3).html` pour le site public,
   `maquettes/annalo-admin (3).html` pour le back-office). La structure/logique est en place mais
   le rendu visuel actuel est minimal (classes Tailwind basiques) : il faut
   reproduire fidèlement le style des maquettes (espacements, ombres,
   typographie, interactions) section par section.

3. **Sections manquantes de la page d'accueil** (`src/pages/Home.jsx`) :
   - "Un abonnement, un accès illimité" : récupérer les plans via
     `fetchPlans(track)` (déjà dans `src/api/subscriptions.js`) et afficher
     les cartes `plans-examens` / `plans-concours` / `plans-national`.
   - Bande "Contribuer un sujet" + `modal-contrib` (formulaire avec upload
     de fichier → `submitContribution`).
   - `modal-detail` pour une épreuve sélectionnée (déjà le state
     `selectedPaper` dans `Home.jsx`, juste la modale à créer) —
     utiliser `fetchPaperDetail`.
   - Section "Concours à suivre" → `fetchAnnouncements` (`src/api/cms.js`).
   - `modal-contact` ("Nous contacter") → `sendContactMessage`.

4. **Paiement FedaPay (redirection, pas de widget).** Le backend a retenu
   FedaPay (KkiaPay abandonné). Flux :
   - `initiatePayment({ purpose: "cart" })` ou
     `initiatePayment({ purpose: "subscription", plan_id })` → réponse
     `{ payment_id, payment_url, token, ... }` → `window.location = payment_url`
     (garder `payment_id` en `sessionStorage`).
   - FedaPay renvoie sur **`/paiement/retour`** (route à créer) →
     `verifyPayment(payment_id)` → afficher succès/échec, recharger panier
     et abonnements.
   Brancher dans `CartDrawer` ("Payer maintenant") et dans les cartes de
   plans de `Home.jsx`.

5. **Back-office — pages à construire** (actuellement des stubs) :
   `Subjects`, `Categories`, `Pricing`, `Subscribers`, `Announcements`,
   `Settings`. Chaque fichier contient un commentaire décrivant précisément
   ce qui est attendu et quel modèle backend il consomme.

6. **Dashboard admin — brancher sur les vraies données.** Les endpoints
   existent : `fetchOverview`, `fetchRevenue`, `fetchNewUsers`,
   `fetchSalesByOrganization`, `fetchActivity` (`src/api/dashboard.js`).
   Remplacer les tableaux statiques de `Dashboard.jsx`.

7. **Responsive & menu mobile.** Le `Header` n'a pas encore le menu burger
   (`mobile-nav` / `burger-icon` dans la maquette) — uniquement la nav
   desktop pour l'instant.

8. **Pages / routes manquantes** :
   - `/paiement/retour` (voir étape 4).
   - `/invitation/:token` : lien envoyé par email aux membres d'équipe
     invités → `fetchInvitation` puis (une fois connecté) `acceptInvitation`.
   - Mot de passe oublié dans `AuthModal` (code SMS) et vérification du
     numéro dans `Account`.
   - `/admin/messages` (lien présent dans l'email envoyé au support) et
     gestion d'équipe dans `Settings`.

9. **Tests** — au minimum un test de rendu sur `Home`, et un test du flux
   login → accès à `/compte`.

## Notes / décisions à garder en tête

- Login par **téléphone** (pas email) — voir `AuthModal.jsx` et
  `src/api/auth.js`, cohérent avec le backend.
- Le panier (`CartContext`) ne se charge que si l'utilisateur est
  authentifié ; un visiteur non connecté qui clique "Ajouter" sur une
  épreuve doit d'abord être invité à se connecter (pas encore géré — TODO
  à ajouter dans `PaperCard.jsx` ou `CartContext.addItem`).
- `AdminRoute` vérifie `isTeamMember` (déduit de `user.team_role` renvoyé
  par `/api/auth/me/`), pas un simple `is_staff` Django — à garder
  cohérent si le modèle backend évolue. ⚠️ Le backend laisse aussi passer
  les superusers, mais `/me/` ne renvoie pas `is_superuser` : créer les
  comptes d'équipe avec `team_role` (ex: `admin`), pas juste superuser.
- Droits d'écriture selon le rôle (le backend renvoie 403 sinon) :
  editor → catalogue, annonces, contributions ; support → messages,
  paiements ; admin → tout (plans, infos du site, utilisateurs, équipe).
  Masquer les boutons d'édition en conséquence.
- **Toutes les listes sont paginées** (`PAGE_SIZE = 20`,
  `{ count, next, previous, results }`), y compris niveaux et matières :
  prévoir pagination / "charger plus".
- **Fichiers privés** : les PDF ne sont jamais exposés par URL publique ;
  `downloadPaper` / `downloadContributionFile` renvoient un Blob (JWT
  requis) → `URL.createObjectURL` pour ouvrir/télécharger.
- Upload (épreuves admin, contributions) en `FormData` multipart ; les
  contributions acceptent PDF/JPG/PNG ≤ 20 Mo, les épreuves admin PDF.
- Limitation de débit côté backend (429) sur login/inscription, codes SMS
  et formulaire de contact : afficher un message clair.
- Supprimer un élément lié à des ventes renvoie 400 : proposer de
  dépublier/désactiver à la place.
