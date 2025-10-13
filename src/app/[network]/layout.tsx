import { Suspense } from "react";
import Footer from "@/components/ui/footer";
import Header from "@/components/ui/header";
import { LayoutPage } from "@/components/ui/layout";
/*--------------------------------------------------------------------------------------------------------------------*/

export default async function NetworkLayout(props: {
  params: any;
  children: any;
}) {
  const { children } = props;
  return (
    <LayoutPage>
      <Header />

      <main className={"flex flex-col h-full"}>
        <Suspense>{children}</Suspense>
      </main>

      <Footer />
    </LayoutPage>
  );
}
