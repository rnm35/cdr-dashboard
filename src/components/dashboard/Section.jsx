export function Section({ title, note, children, className = "" }) {
  return (
    <section className={`space-y-4 border-t pt-6 ${className}`} aria-label={title}>
      <div className="space-y-1">
        <h2 className="text-2xl">{title}</h2>
        {note && <p className="text-muted-foreground">{note}</p>}
      </div>
      {children}
    </section>
  );
}
