import { useUI } from "../../context/UIContext";

export default function Toast() {
  const { toastMessage, isToastVisible } = useUI();
  return (
    <div className={`toast ${isToastVisible ? "show" : ""}`} role="status" aria-live="polite">
      {toastMessage}
    </div>
  );
}
