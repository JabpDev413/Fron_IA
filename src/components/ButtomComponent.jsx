export function ButtomComponent({ className, onClick, type, label, children }) {
  return (
    <button className={className} onClick={onClick} type={type}>
      {label}
      {children}
    </button>
  );
}
