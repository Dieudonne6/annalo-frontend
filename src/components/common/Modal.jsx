export default function Modal({ isOpen, onClose, title, children, maxWidth = "max-w-md" }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-ink/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className={`relative w-full ${maxWidth} rounded-2xl bg-white2 p-6 shadow-xl`}>
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-text-soft hover:text-text"
          aria-label="Fermer"
        >
          ✕
        </button>
        {title && <h3 className="mb-4 text-lg font-bold text-navy">{title}</h3>}
        {children}
      </div>
    </div>
  );
}
