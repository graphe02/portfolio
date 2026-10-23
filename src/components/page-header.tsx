interface PageHeaderProps {
  title: string;
  lead?: React.ReactNode;
}

/** Title + optional one-line intro. Every page starts with this so headings line up. */
export function PageHeader({ title, lead }: PageHeaderProps) {
  return (
    <header className="page-header">
      <h1>{title}</h1>
      {lead && <p className="muted">{lead}</p>}
    </header>
  );
}
