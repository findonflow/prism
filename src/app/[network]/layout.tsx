/*--------------------------------------------------------------------------------------------------------------------*/
import { Suspense } from "react";
import Footer from "@/components/ui/footer";
import Header from "@/components/ui/header";
import { LayoutPage } from "@/components/ui/layout";
import MainContent from "@/app/[network]/content";

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
      <Suspense>
        <Header network={network} />
      </Suspense>

      <main className={"flex flex-col h-full w-full"}>
        <Suspense>
          <MainContent>{children}</MainContent>
        </Suspense>
      </main>

      <Footer />
    </LayoutPage>
  );
}
