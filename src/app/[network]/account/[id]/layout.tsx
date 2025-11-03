import { ReactNode, Suspense } from "react";
import AccountSidebar from "@/components/ui/account-sidebar";
import AccountNavigation from "@/app/[network]/account/[id]/navigation";
import { cn } from "@/lib/utils";

/*--------------------------------------------------------------------------------------------------------------------*/
interface AccountProps {
  children: ReactNode;
  params: Promise<{ id: string; network: string }>;
}
/*--------------------------------------------------------------------------------------------------------------------*/
export default function AccountDetailsLayout(props: AccountProps) {
  const { children } = props;

  return (
    <div
      className={cn(
        "grid w-full",
        // Mobile: single column, sidebar and content stack
        "grid-cols-1 grid-rows-[auto_1fr]",
        "[grid-template-areas:'header''content']",
        // Desktop: sidebar + content columns
        "md:grid-cols-[auto_1fr] md:grid-rows-[auto_1fr]",
        "md:[grid-template-areas:'header_header''sidebar_content']",
        // Make it fill available space
        "min-h-0 flex-1",
      )}
    >
      {/* Header - always visible */}
      <header className={"[grid-area:header] w-full border-b border-prism-border bg-prism-level-1 py-4"}>
        <Suspense>
          <AccountNavigation />
        </Suspense>
      </header>

      {/* Sidebar - hidden on mobile, fixed on desktop */}
      <aside className={"hidden md:flex [grid-area:sidebar] border-r border-prism-border bg-prism-level-2 min-h-0"}>
        <Suspense>
          <AccountSidebar />
        </Suspense>
      </aside>

      {/* Content - scrollable, includes sidebar content on mobile */}
      <main
        className={cn(
          "[grid-area:content]",
          "overflow-y-auto",
          "bg-prism-level-1",
          "min-h-0",
        )}
      >
        {/* Mobile sidebar content */}
        <div className="md:hidden border-b border-prism-border bg-prism-level-2 px-6 py-6">
          <Suspense>
            <AccountSidebar />
          </Suspense>
        </div>
        
        {/* Main content */}
        <div className="px-6 py-6">
          {children}
        </div>
      </main>
    </div>
  );
}
