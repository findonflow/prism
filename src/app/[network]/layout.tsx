/*--------------------------------------------------------------------------------------------------------------------*/
import { CSSProperties, Suspense } from "react";
import Footer from "@/components/ui/footer";
import Header from "@/components/ui/header";
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
  const style = {
    "--prism-primary":
      network === "mainnet" ? "var(--prism-mainnet)" : "var(--prism-testnet)",
  } as CSSProperties;

  return (
    <div
      className="grid h-screen w-full grid-rows-[auto_1fr_auto]"
      style={style}
    >
      <FCLProvider>
        <Suspense>
          <Header network={network} />
        </Suspense>

        <main
          className={
            "flex h-full w-full flex-1 flex-col items-center justify-start"
          }
        >
          <Suspense>
            <QueryProvider>{children}</QueryProvider>
          </Suspense>
        </main>

        <Footer />
      </FCLProvider>
    </div>
  );
}
