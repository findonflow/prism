import { TypeFineprint } from "@/components/ui/typography";
import { GithubOctaCat } from "@/components/ui/icons";
/*--------------------------------------------------------------------------------------------------------------------*/

export default function Footer() {
  return (
    <footer className="flex flex-row flex-wrap items-center justify-between w-full">
      <TypeFineprint>
        Created by hearts and minds of people at{" "}
        <a href={"https://www.findlabs.io/"} className={"underline"}>
          Find Labs
        </a>
        .
      </TypeFineprint>

      <TypeFineprint className={"flex flex-row gap-1 items-center justify-end"}>
        <span>Help us improve</span>
        <a
          href={"https://github.com/findonflow/prism"}
          className={"underline inline-flex gap-1 items-center"}
        >
          <GithubOctaCat />
          <span>Prism on Github</span>
        </a>
        .
      </TypeFineprint>
    </footer>
  );
}
