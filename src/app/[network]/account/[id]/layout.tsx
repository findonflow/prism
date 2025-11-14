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
export default async function AccountDetailsLayout(props: AccountProps) {
  const { id } = await props.params;
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
      {/* Sidebar - hidden on mobile, fixed on desktop */}
      <aside
        className={
          "border-prism-border bg-prism-level-2 hidden min-h-0 border-r [grid-area:sidebar] md:flex"
        }
      >
        <Suspense>
          <AccountSidebar id={id} />
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
        <div className="border-prism-border bg-prism-level-2 border-b md:hidden">
          <Suspense>
            <AccountSidebar id={id} />
          </Suspense>
        </div>

        {/* Main content */}
        <div className="h-full overflow-y-auto p-6">
          <Suspense>
            <AccountNavigation />
          </Suspense>
          {children}
        </div>
      </main>
    </div>
  );
}
