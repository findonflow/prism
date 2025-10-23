"use client";
/*--------------------------------------------------------------------------------------------------------------------*/
import CopyText from "@/components/flowscan/CopyText";
import FatRow, { FatRowDetails } from "@/components/flowscan/FatRow";
import FlowTokens from "@/components/flowscan/FlowTokens";
import JumpingDots from "@/components/flowscan/JumpingDots";
import { NodeRole } from "@/components/flowscan/NodeRole";
import SimpleTag from "@/components/flowscan/SimpleTag";
import { Label } from "@/components/flowscan/text/Label";
import useAccountResolver from "@/hooks/useAccountResolver";
import { useStakingInfo } from "@/hooks/useStakingInfo";
import { formatNumberToAccounting } from "@/lib/format";
import { cn } from "@/lib/utils";
import { CalendarClock } from "lucide-react";
import { useParams } from "next/navigation";
import type { DelegatorInfo, NodeInfo } from "./types";
/*--------------------------------------------------------------------------------------------------------------------*/

export function getRole(roleNumber: number | string) {
  const key = typeof roleNumber === "string" ? Number(roleNumber) : roleNumber;
  const roles = [
    "",
    "collection",
    "consensus",
    "execution",
    "verification",
    "access",
  ];
  return roles[key] || "Unknown";
}

export default function AccountStakingContent() {
  const { id } = useParams();

  const { data: resolved, isPending: isResolving } = useAccountResolver(
    id as string
  );
  const address = resolved?.owner;

  const { data, isPending } = useStakingInfo(address);

  const stakingInfo = data?.stakingInfo;
  const showList = !isPending && Boolean(data?.stakingInfo);

  return (
    <div className={"flex w-full flex-col"}>
      <div
        className={
          "mb-4 flex w-full flex-row items-center justify-between gap-2"
        }
      >
        <h2 className={"text-xl font-bold"}>Delegator Info</h2>
        <SimpleTag
          title={`Current epoch number is ${stakingInfo?.epochInfo.currentEpochCounter}`}
          category={<CalendarClock className={"h-4 w-4"} />}
          label={`Epoch: ${stakingInfo?.epochInfo.currentEpochCounter}`}
          className="text-green-800"
        />
      </div>
      <div className={"fat-row-column w-full"}>
        {isPending && <JumpingDots />}

        {showList &&
          stakingInfo?.delegatorInfos.map((delegatorInfo) => {
            const details = (
              <FatRowDetails>
                <div
                  className={
                    "flex w-full flex-col items-start justify-start gap-2"
                  }
                >
                  <DelegatorDetails delegatorInfo={delegatorInfo} />
                  <div className={"h-2 w-full"} />
                  <NodeInfo nodeInfo={delegatorInfo.nodeInfo} />
                </div>
              </FatRowDetails>
            );

            const { nodeInfo } = delegatorInfo;
            const shortNodeId =
              delegatorInfo.nodeID.slice(0, 8) +
              "..." +
              delegatorInfo.nodeID.slice(-8);

            const nodeRole = getRole(delegatorInfo.nodeInfo.role);

            return (
              <FatRow
                id={"delegator-info"}
                details={details}
                className={[]}
                key={delegatorInfo.nodeID}
              >
                <div
                  className={cn(
                    "flex flex-col items-start gap-2 p-4 ",
                    "@md:flex-row"
                  )}
                >
                  <div className={"flex w-full flex-col justify-between gap-2"}>
                    <div
                      title={delegatorInfo.nodeID}
                      className={"flex flex-row items-center gap-2 "}
                    >
                      <NodeRole role={nodeRole} />
                      <span className={"max-w-[80%] truncate"}>
                        {delegatorInfo.nodeID}
                      </span>
                    </div>
                    <div
                      title={nodeInfo.networkingAddress}
                      className={
                        "flex flex-col items-start justify-start gap-1 text-fineprint @md:flex-row @md:items-center"
                      }
                    >
                      <span>Networking Address:</span>
                      <div className={"flex flex-row items-center gap-1"}>
                        <span className={""}>{nodeInfo.networkingAddress}</span>
                        <CopyText text={nodeInfo.networkingAddress} />
                      </div>
                    </div>
                  </div>

                  <div
                    className={
                      "flex w-full flex-col items-start justify-between  @md:items-end"
                    }
                  >
                    <div
                      className={
                        "flex flex-row items-center justify-between gap-2 text-copy"
                      }
                    >
                      <span>Stake:</span>
                      <FlowTokens
                        value={delegatorInfo.tokensStaked}
                        iconClassName={"w-4 h-4"}
                        className={""}
                      />
                    </div>

                    <div
                      className={
                        "flex flex-row items-center justify-between gap-2 text-copy"
                      }
                    >
                      <span>Rewarded:</span>
                      <FlowTokens
                        value={delegatorInfo.tokensRewarded}
                        iconClassName={"w-4 h-4"}
                        className={""}
                      />
                    </div>
                  </div>
                </div>
              </FatRow>
            );
          })}
      </div>
    </div>
  );
}

function DelegatorDetails(props: { delegatorInfo: DelegatorInfo }) {
  const { delegatorInfo } = props;

  return (
    <div
      className={cn("grid w-full grid-cols-2 items-start gap-4 md:grid-cols-3")}
    >
      <div className={"flex w-full flex-col items-start justify-start"}>
        <Label text={"Staked"} />
        <FlowTokens
          className={"justify-start "}
          value={delegatorInfo.tokensStaked}
          iconClassName={"w-4 h-4"}
          digits={4}
        />
      </div>

      <div className={"flex flex-col items-start justify-start"}>
        <Label text={"Rewarded"} />
        <FlowTokens
          className={"justify-start text-lg text-main "}
          value={delegatorInfo.tokensRewarded}
          iconClassName={"w-4 h-4"}
          digits={4}
        />
      </div>

      <div className={"flex flex-col items-start justify-start"}>
        <Label text={"Committed"} />
        <FlowTokens
          className={"justify-start text-lg text-main "}
          value={delegatorInfo.tokensCommitted}
          iconClassName={"w-4 h-4"}
          digits={4}
        />
      </div>

      <div className={"flex flex-col items-start justify-start"}>
        <Label text={"Requested to Unstake"} />
        <FlowTokens
          className={"justify-start text-lg text-main "}
          value={delegatorInfo.tokensRequestedToUnstake}
          iconClassName={"w-4 h-4"}
          digits={4}
        />
      </div>

      <div className={"flex flex-col items-start justify-start"}>
        <Label text={"Unstaking"} />
        <FlowTokens
          className={"justify-start text-lg text-main "}
          value={delegatorInfo.tokensUnstaking}
          iconClassName={"w-4 h-4"}
          digits={4}
        />
      </div>

      <div className={"flex flex-col items-start justify-start"}>
        <Label text={"Unstaked"} />
        <FlowTokens
          className={"justify-start text-lg text-main "}
          value={delegatorInfo.tokensUnstaked}
          iconClassName={"w-4 h-4"}
          digits={4}
        />
      </div>
    </div>
  );
}

function NodeInfo(props: { nodeInfo: NodeInfo }) {
  const { nodeInfo } = props;

  return (
    <div className={"w-full gap-4 rounded-sm bg-gray-400/30 p-4"}>
      <h3 className={"text-md"}>Node Info</h3>
      <div className={"flex flex-row gap-1 text-fineprint"}>
        <span>ID:</span>
        <b className={"truncate "}>{nodeInfo.id}</b>
        <CopyText text={nodeInfo.id} />
      </div>

      <div
        className={"mb-4 flex flex-col text-fineprint @md:flex-row @md:gap-1"}
      >
        <span>Networking Address:</span>
        <b className={""}>{nodeInfo.networkingAddress}</b>
      </div>

      <hr className={"mb-6 opacity-10"} />

      <div className={cn("grid w-full grid-cols-1 gap-4 @md:grid-cols-3")}>
        <div className={"flex flex-col items-start justify-start"}>
          <Label text={"Delegator Count"} />
          <span className={"text-main font-bold "}>
            {formatNumberToAccounting(Number(nodeInfo.delegatorIDCounter))}
          </span>
        </div>

        <div className={"flex flex-col items-start justify-start"}>
          <Label text={"Role"} />
          <span className={"text-main font-bold capitalize "}>
            {getRole(nodeInfo.role)}
          </span>
        </div>

        <div className={"flex flex-col items-start justify-start"}>
          <Label text={"Initial Weight"} />
          <span className={"text-main font-bold "}>
            {nodeInfo.initialWeight}
          </span>
        </div>

        <div className={"flex flex-col items-start justify-start"}>
          <Label text={"Staked"} />
          <FlowTokens
            className={"justify-start text-lg text-main "}
            value={nodeInfo.tokensStaked}
            iconClassName={"w-4 h-4"}
            digits={4}
          />
        </div>

        <div className={"flex flex-col items-start justify-start"}>
          <Label text={"Rewarded"} />
          <FlowTokens
            className={"justify-start text-lg text-main "}
            value={nodeInfo.tokensRewarded}
            iconClassName={"w-4 h-4"}
            digits={4}
          />
        </div>

        <div className={"flex flex-col items-start justify-start"}>
          <Label text={"Committed"} />
          <FlowTokens
            className={"justify-start text-lg text-main "}
            value={nodeInfo.tokensCommitted}
            iconClassName={"w-4 h-4"}
            digits={4}
          />
        </div>

        <div className={"flex flex-col items-start justify-start"}>
          <Label text={"Requested to Unstake"} />
          <FlowTokens
            className={"justify-start text-lg text-main "}
            value={nodeInfo.tokensRequestedToUnstake}
            iconClassName={"w-4 h-4"}
            digits={4}
          />
        </div>

        <div className={"flex flex-col items-start justify-start"}>
          <Label text={"Unstaking"} />
          <FlowTokens
            className={"justify-start text-lg text-main "}
            value={nodeInfo.tokensUnstaking}
            iconClassName={"w-4 h-4"}
            digits={4}
          />
        </div>

        <div className={"flex flex-col items-start justify-start"}>
          <Label text={"Unstaked"} />
          <FlowTokens
            className={"justify-start text-lg text-main "}
            value={nodeInfo.tokensUnstaked}
            iconClassName={"w-4 h-4"}
            digits={4}
          />
        </div>
      </div>
    </div>
  );
}
