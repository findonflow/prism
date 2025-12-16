import { ReactNode, Suspense } from "react";
import TransactionSidebar from "@/components/ui/transaction-sidebar";
import TransactionNavigation from "@/app/[network]/tx/[hash]/navigation";
import { cn } from "@/lib/utils";

/*--------------------------------------------------------------------------------------------------------------------*/
interface TransactionProps {
  children: ReactNode;
  params: Promise<{ hash: string; network: string }>;
}

/*--------------------------------------------------------------------------------------------------------------------*/
export default async function TransactionDetailsLayout(props: TransactionProps) {
  const { hash } = await props.params;
  const { children } = props;

  return (
    <div
      className={cn(
        "grid w-full",
        "grid-cols-1 grid-rows-[auto_1fr]",
        "[grid-template-areas:'header''content']",
        "md:grid-cols-[auto_1fr] md:grid-rows-[auto_1fr]",
        "md:[grid-template-areas:'header_header''sidebar_content']",
        "min-h-0 flex-1",
      )}
    >
      <aside
        className={
          "border-prism-border bg-prism-level-2 hidden min-h-0 border-r [grid-area:sidebar] md:flex"
        }
      >
        <Suspense>
          <TransactionSidebar hash={hash}/>
        </Suspense>
      </aside>

      <main
        className={cn(
          "[grid-area:content]",
          "overflow-y-auto",
          "bg-prism-level-1",
          "min-h-0",
        )}
      >
        <div className="border-prism-border bg-prism-level-2 border-b md:hidden">
          <Suspense>
            <TransactionSidebar />
          </Suspense>
        </div>

        <div className="p-6">
          <Suspense>
            <TransactionNavigation />
          </Suspense>
          {children}
        </div>
      </main>
    </div>
  );
}
