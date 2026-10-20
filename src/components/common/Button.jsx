const VARIANTS = {
  primary: "bg-navy text-white2 hover:bg-navy-2",
  gold: "bg-gold text-white2 hover:bg-gold-deep",
  outline: "border border-navy text-navy hover:bg-navy/5",
  ghost: "text-navy hover:bg-navy/5",
};

export default function Button({
  variant = "primary",
  className = "",
  children,
  ...props
}) {
  return (
    <button
      className={`rounded-xl px-5 py-2.5 font-semibold transition-colors disabled:opacity-50 ${VARIANTS[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
