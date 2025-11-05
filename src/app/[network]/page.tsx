import { TypeH1, TypeP, TypeTextBlock } from "@/components/ui/typography";
import BigSearch from "@/components/ui/big-search";
import { cn } from "@/lib/utils";

/*--------------------------------------------------------------------------------------------------------------------*/
interface NetworkPageProps {
  params: Promise<{ network: string }>;
}
/*--------------------------------------------------------------------------------------------------------------------*/
export default async function NetworkPage(props: NetworkPageProps) {
  const params = await props.params;

  const { network } = params;

  return (
    <div
      className={cn(
        "x-auto flex h-full w-full max-w-[30rem] flex-1 flex-col items-center justify-center space-y-6",
        "px-8 lg:px-6",
      )}
    >
      <TypeTextBlock>
        <TypeH1 className={"font-light"}>
          Explore{" "}
          <span className={cn("text-prism-primary font-bold")}>{network}</span>{" "}
          data
        </TypeH1>

        <TypeP className={"text-center"}>
          Search address, transaction hash or{" "}
          <span className={"font-bold"}>.find</span> name
        </TypeP>
      </TypeTextBlock>

      <BigSearch />
    </div>
  );
}
