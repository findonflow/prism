import { TypeH1, TypeP, TypeTextBlock } from "@/components/ui/typography";
import BigSearch from "@/components/ui/big-search";

/*--------------------------------------------------------------------------------------------------------------------*/
interface NetworkPageProps {
  params: Promise<{ network: string }>;
}
/*--------------------------------------------------------------------------------------------------------------------*/
export default async function NetworkPage(props: NetworkPageProps) {
  const params = await props.params;

  return (
    <div
      className={
        "space-y-6 mx-auto w-full max-w-[30rem] h-full flex flex-col items-center justify-center flex-1"
      }
    >
      <TypeTextBlock>
        <TypeH1 className={"font-light"}>
          Explore <span className={"font-bold"}>{params.network}</span> data
        </TypeH1>
        <TypeP className={"text-center text-sm"}>
          Search address, transaction hash or{" "}
          <span className={"font-bold"}>.find</span> name
        </TypeP>
      </TypeTextBlock>

      <BigSearch />
    </div>
  );
}
