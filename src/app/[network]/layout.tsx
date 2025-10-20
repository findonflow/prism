/*--------------------------------------------------------------------------------------------------------------------*/
import { Suspense } from "react";
import Footer from "@/components/ui/footer";
import Header from "@/components/ui/header";
import { LayoutPage } from "@/components/ui/layout";
import QueryProvider, { FCLProvider } from "@/fetch/provider";

/*--------------------------------------------------------------------------------------------------------------------*/
interface NetworkLayoutProps {
  params: Promise<{ network: string }>;
  children: any;
}
/*--------------------------------------------------------------------------------------------------------------------*/
export default async function NetworkLayout(props: NetworkLayoutProps) {
  const { children } = props;
  const params = await props.params;

  const { network } = params;

  return (
    <LayoutPage>
      <FCLProvider>
        <Suspense>
          <Header network={network} />
        </Suspense>

        <main
          className={
            "flex flex-col h-full w-full items-start justify-start flex-1 py-6"
          }
        >
          <Suspense>
            <QueryProvider>{children}</QueryProvider>
          </Suspense>
        </main>

        <Footer />
      </FCLProvider>
    </LayoutPage>
  );
}
