const STEPS = [
  {
    badge: "01",
    label: "Choisir",
    title: "Trouve ton sujet",
    text: "Filtre par examen, niveau ou matière et sélectionne les sujets qui t'intéressent.",
    icon: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="M21 21l-4.3-4.3" />
      </>
    ),
  },
  {
    badge: "02",
    label: "Payer",
    title: "Règle en Mobile Money",
    text: "Paiement sécurisé via MTN MoMo, Moov Money ou Celtiis Money, en quelques secondes.",
    icon: (
      <>
        <rect x="3" y="6" width="18" height="13" rx="2.5" />
        <path d="M3 10.5h18M7 15h3" />
      </>
    ),
  },
  {
    badge: "03",
    label: "Réviser",
    title: "Télécharge et entraîne-toi",
    text: "Accède au sujet et à son corrigé type, où que tu sois, même après la session.",
    icon: (
      <>
        <path d="M12 3v13m0 0l-4.5-4.5M12 16l4.5-4.5" />
        <path d="M4 19.5h16" />
      </>
    ),
  },
];

export default function HowItWorks() {
  return (
    <section className="section section-alt">
      <div className="wrap">
        <div className="section-head">
          <div className="eyebrow">Comment ça marche</div>
          <h2>Trois étapes pour t'entraîner</h2>
        </div>
        <div className="steps">
          {STEPS.map((s) => (
            <div className="step-card" key={s.badge}>
              <div className="step-ic">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  {s.icon}
                </svg>
              </div>
              <div className="step-badge">{s.badge}</div>
              <div className="step-label">{s.label}</div>
              <h4>{s.title}</h4>
              <p>{s.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
