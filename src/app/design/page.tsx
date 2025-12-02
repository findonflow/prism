/*--------------------------------------------------------------------------------------------------------------------*/
import { Pyramid } from "lucide-react";
import { TypeH1, TypeP } from "@/components/ui/typography";
import Sidebars from "@/app/design/sidebars";
import QueryProvider, { FCLProvider } from "@/fetch/provider";
import Inputs from "@/app/design/inputs";
import { Suspense } from "react";

/*--------------------------------------------------------------------------------------------------------------------*/
export default function DesignPage() {
  return (
    <FCLProvider override={"mainnet"}>
      <QueryProvider>
        <div
          className={
            "flex min-h-screen flex-col items-start justify-start space-y-8 p-8"
          }
        >
          <div className={"flex flex-col items-start space-y-4"}>
            <TypeH1 className={"flex flex-row items-end gap-2"}>
              <Pyramid className={"h-10 w-10"} />
              <b>Prism</b>
              <span>Design System</span>
            </TypeH1>
            <TypeP>
              The showcase of existing components used accross <b>Prism</b>{" "}
              application
            </TypeP>
          </div>

          {/*
            <Typography />
            <Tags />

          <Sidebars />*/}
          <Suspense>
            <Inputs />
          </Suspense>

        </div>
      </QueryProvider>
    </FCLProvider>
  );
}
