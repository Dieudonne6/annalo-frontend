import { useLocation, useNavigate } from "react-router-dom";

export function scrollToId(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

/**
 * Lien vers une section de l'accueil (#catalogue, #tarifs...). Sur l'accueil
 * on fait défiler, ailleurs on revient sur "/#section" (Home gère le hash).
 */
export default function SectionLink({ to, onNavigate, children, ...props }) {
  const location = useLocation();
  const navigate = useNavigate();

  function handleClick(e) {
    e.preventDefault();
    onNavigate?.();
    if (location.pathname === "/") scrollToId(to);
    else navigate(`/#${to}`);
  }

  return (
    <a href={`/#${to}`} onClick={handleClick} {...props}>
      {children}
    </a>
  );
}
