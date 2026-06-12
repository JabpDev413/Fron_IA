export function InputComponent({
  placeholder,
  type,
  name,
  value,
  onChange,
  className,
}) {
  return (
    <input
      className={className}
      placeholder={placeholder}
      type={type}
      name={name}
      value={value}
      onChange={onChange}
    />
  );
}
