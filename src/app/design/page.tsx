/*--------------------------------------------------------------------------------------------------------------------*/
import { Pyramid } from "lucide-react";
import { TypeH1, TypeP } from "@/components/ui/typography";
import Typography from "@/app/design/typography";
import Tags from "@/app/design/tags";

/*--------------------------------------------------------------------------------------------------------------------*/
export default function DesignPage() {
  return (
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

      <Typography />
      <Tags />
    </div>
  );
}
