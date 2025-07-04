export function AppFooter() {
  return (
    <footer className="bg-muted border-t border-border py-8 text-center">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Daniel Yi. All rights reserved.
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Built with Next.js, Tailwind CSS, and ShadCN UI.
        </p>
      </div>
    </footer>
  );
}
