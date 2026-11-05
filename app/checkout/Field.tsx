export function Field({ id, label, error, ...rest }: { id: string; label: string; error?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label htmlFor={id} className="label">{label}</label>
      <input id={id} name={id} className="input" aria-invalid={!!error || undefined} aria-describedby={error ? `${id}-error` : undefined} {...rest} />
      {error ? (
        <p id={`${id}-error`} className="field-error">{error}</p>
      ) : null}
    </div>
  );
}
