import {
  TypeFineprint,
  TypeH1,
  TypeH2,
  TypeH3,
  TypeLabel,
  TypeP,
  TypeTextBlock,
} from "@/components/ui/typography";
import { Showcase, ShowcaseGroup } from "@/app/design/templates";
import { Divider } from "@/components/ui/primitive";

/*--------------------------------------------------------------------------------------------------------------------*/
export default function Typography() {
  return (
    <div className={"flex w-full flex-col items-start justify-start space-y-6"}>
      <Divider />

      <div className={"flex flex-col items-start space-y-2"}>
        <TypeH2 className={"flex flex-row items-end gap-2"}>
          <span>Typography</span>
        </TypeH2>
        <TypeP>
          Unified typography brings consistency and readability to the
          application
        </TypeP>
      </div>

      <ShowcaseGroup>
        <Showcase title={"Tile header"}>
          <TypeH1>Title Header</TypeH1>
        </Showcase>

        <Showcase title={"Section header"}>
          <TypeH2>Section Header</TypeH2>
        </Showcase>

        <Showcase title={"Item header"}>
          <TypeH3>Item Header</TypeH3>
        </Showcase>
      </ShowcaseGroup>

      <ShowcaseGroup>
        <Showcase title={"Fineprint"}>
          <TypeFineprint>Fineprint</TypeFineprint>
        </Showcase>

        <Showcase title={"Label"}>
          <TypeLabel>Label</TypeLabel>
        </Showcase>

        <Showcase title={"Paragraph"}>
          <TypeP>This is simple paragraph of text</TypeP>
        </Showcase>
      </ShowcaseGroup>

      <ShowcaseGroup>
        <Showcase title={"Centered Text Block"} labelClassName={"mb-10"}>
          <TypeTextBlock>
            <TypeH1>
              Welcome to <b>Prism</b>
            </TypeH1>
            <TypeP>
              Dissect full spectrum of blockchain data into narrow spectrum you
              explore
            </TypeP>
          </TypeTextBlock>
        </Showcase>
      </ShowcaseGroup>
    </div>
  );
}
