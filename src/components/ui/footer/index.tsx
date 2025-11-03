import { TypeFineprint } from "@/components/ui/typography";
import { GithubOctaCat } from "@/components/ui/icons";
import { cn } from "@/lib/utils";
/*--------------------------------------------------------------------------------------------------------------------*/

export default function Footer() {
  return (
    <footer
      className={cn(
        "w-full",
        "flex flex-col-reverse flex-wrap items-start justify-between",
        "lg:flex-row lg:items-center lg:justify-between",
      )}
    >
      <TypeFineprint className={"text-left"}>
        Created by hearts and minds of people at{" "}
        <a href={"https://www.findlabs.io/"} className={"underline"}>
          Find Labs
        </a>
        .
      </TypeFineprint>

      <TypeFineprint
        className={"inline-flex flex-row items-start justify-start gap-1"}
      >
        <span>Help us improve</span>
        <a
          href={"https://github.com/findonflow/prism"}
          className={"inline-flex items-center gap-1 underline"}
        >
          <GithubOctaCat className={"fill-white"} />
          <span>Prism on Github</span>
        </a>
        .
      </TypeFineprint>
    </footer>
  );
}
