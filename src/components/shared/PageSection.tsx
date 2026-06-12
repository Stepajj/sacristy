interface PageSectionProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
}

export function PageSection({ children, title, className = "" }: PageSectionProps) {
  return (
    <section className={`py-12 ${className}`}>
      {title && <h2 className="text-3xl font-bold mb-8">{title}</h2>}
      {children}
    </section>
  );
}
