/*--------------------------------------------------------------------------------------------------------------------*/
import { CSSProperties, Suspense } from "react";
import Footer from "@/components/ui/footer";
import Header from "@/components/ui/header";
import QueryProvider, { FCLProvider } from "@/fetch/provider";
import { Toaster } from "react-hot-toast";

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
    <FCLProvider>
      <div
        className="grid h-full max-h-dvh min-h-dvh w-full grid-rows-[auto_1fr_auto]"
        style={style}
      >
        <Suspense>
          <Header network={network} />
        </Suspense>

        <main
          className={
            "flex h-full w-full flex-col items-center justify-start overflow-hidden"
          }
        >
          <Suspense>
            <Toaster position="bottom-right" containerClassName="mb-18" />
            <QueryProvider>{children}</QueryProvider>
          </Suspense>
        </main>

        <Footer />
      </div>
    </FCLProvider>
  );
}
