import { FlaskConical, Globe } from "lucide-react";
import { TypeH2, TypeP } from "@/components/ui/typography";
import { Showcase, ShowcaseGroup } from "@/app/design/templates";
import NetworkSelector from "@/components/ui/network-selector";
import { Divider } from "@/components/ui/primitive";
import { TagDomain } from "@/components/ui/tags/client";
import { TagBigFish, TagEpochCounter, TagNodeType } from "@/components/ui/tags";
import { NODE_TITLES } from "@/consts/node";

export default function Tags() {
  return (
    <div className={"flex w-full flex-col items-start justify-start space-y-6"}>
      <Divider />

      <div className={"flex flex-col items-start space-y-2"}>
        <TypeH2 className={"flex flex-row items-end gap-2"}>
          <span>Tags</span>
        </TypeH2>
        <TypeP>
          Simple components that bring variations in monotonous textual display
        </TypeP>
      </div>

      <ShowcaseGroup>
        <Showcase title={"Network Selector: Mainnet"}>
          <NetworkSelector
            link={"/mainnet"}
            title={"Mainnet"}
            copy={"Production & Live Assets"}
            icon={<Globe className={"h-5 w-5"} />}
          />
        </Showcase>
        <Showcase title={"Network Selector: Testnet"}>
          <NetworkSelector
            link={"/testnet"}
            title={"Testnet"}
            copy={"Development & Staging Environment"}
            icon={<FlaskConical className={"h-5 w-5"} />}
          />
        </Showcase>
      </ShowcaseGroup>

      <ShowcaseGroup>
        <Showcase title={"Tag: Domain"}>
          <TagDomain name={"design"} />
        </Showcase>

        <Showcase title={"Tag: Epoch Counter"}>
          <TagEpochCounter counter={"1337"}/>
          <TagEpochCounter isPending={true} />
        </Showcase>

        <Showcase title={"Tag: BigFish"}>
          <TagBigFish balance={"100"} />
          <TagBigFish balance={"10000"} />
        </Showcase>

        <Showcase title={"Tag: Nodes"}>
          <div className={"flex flex-row flex-wrap gap-2"}>
            {Object.keys(NODE_TITLES).map((role) => {
              return <TagNodeType role={role} key={role} />;
            })}
          </div>
        </Showcase>
      </ShowcaseGroup>
    </div>
  );
}
