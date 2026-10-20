import { useState } from "react";

const KEY = "annalo_favorites";

function load() {
  try {
    return new Set(JSON.parse(localStorage.getItem(KEY) || "[]"));
  } catch {
    return new Set();
  }
}

/**
 * Favoris (cœurs des cartes) gardés dans le navigateur : le backend n'a pas
 * de modèle de favoris pour l'instant.
 */
export default function useFavorites() {
  const [favorites, setFavorites] = useState(load);

  // Renvoie true si l'élément vient d'être ajouté.
  function toggle(id) {
    const next = new Set(favorites);
    const added = !next.has(id);
    if (added) next.add(id);
    else next.delete(id);
    setFavorites(next);
    try {
      localStorage.setItem(KEY, JSON.stringify([...next]));
    } catch {
      // stockage indisponible : les favoris restent valables pour la session
    }
    return added;
  }

  return { favorites, toggle };
}
