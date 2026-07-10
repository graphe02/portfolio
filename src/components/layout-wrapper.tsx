import { AppHeader } from "@/components/app-header";
import { AppFooter } from "@/components/app-footer";

interface LayoutWrapperProps {
  children: React.ReactNode;
}

export function LayoutWrapper({ children }: LayoutWrapperProps) {
  return (
    <div className="shell">
      <AppHeader />
      {children}
      <AppFooter />
    </div>
  );
}
