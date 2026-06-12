export function DivComponent({ className, children, onClick }) {
  return (
    <div className={className} onClick={onClick}>
      {children}
    </div>
  );
}
