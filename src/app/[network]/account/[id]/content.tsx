/*--------------------------------------------------------------------------------------------------------------------*/
"use client";
/*--------------------------------------------------------------------------------------------------------------------*/
import { useParams } from "next/navigation";
import useAccountResolver from "@/hooks/useAccountResolver";
import { TypeH3, TypeLabel } from "@/components/ui/typography";
import { LoadingBlock } from "@/components/flowscan/JumpingDots";
import { useAccountCoa } from "@/hooks/useAccountCoa";
import CopyText from "@/components/flowscan/CopyText";
import { Wallet } from "lucide-react";
import FlowTokens from "@/components/flowscan/FlowTokens";
import { useHybridCustody } from "@/hooks/useHybridCustody";
import Image from "next/image";
import FatRow, { FatRowDetails } from "@/components/flowscan/FatRow";
import BasicAccountDetails from "@/components/ui/account-details";
import { useOwnedAccountInfo } from "@/hooks/useOwnedAccountInfo";

/*--------------------------------------------------------------------------------------------------------------------*/
export default function LinkedAccountsContent() {
  const { id } = useParams();

  const { data: resolved, isPending: isResolving } = useAccountResolver(
    id as string,
  );
  const address = resolved?.owner;

  return (
    <div className={"flex w-full flex-col gap-4"}>
      {isResolving && (
        <LoadingBlock title={`Resolving address for ${id} ... `} />
      )}
      {address && <AccountCoa address={address} />}
      {address && <AccountHybrid address={address} />}
      {address && <AccountOwnedInfo address={address} />}
    </div>
  );
}

/*--------------------------------------------------------------------------------------------------------------------*/
function AccountCoa(props: { address?: string | null }) {
  const { address } = props;
  const { data, isPending } = useAccountCoa(address);

  const coa = data ? data[0] : null;
  const coaBalance = data ? data[1] : null;

  return (
    <div className={"flex flex-col gap-2 items-start justify-start"}>
      <TypeLabel>Cadence Owned Account (COA):</TypeLabel>
      {isPending && <LoadingBlock title={`Loading coa for ${address} ... `} />}
      {!coa && (
        <p className={"opacity-50"}>This account doesn't have COA set up</p>
      )}
      {coa && (
        <>
          <div
            className={"flex flex-row items-center justify-start gap-3 w-full"}
          >
            <TypeH3 className={"truncate"}>{coa}</TypeH3>
            <CopyText text={coa || ""} className={"text-lg"} />
          </div>

          <div className={"flex flex-row gap-2"}>
            <div className={"flex flex-row items-center gap-2"}>
              <Wallet className={"h-5 w-5"} />
              <TypeLabel className={"whitespace-nowrap"}>
                COA Balance:
              </TypeLabel>
            </div>

            <FlowTokens
              animated
              digits={6}
              value={coaBalance}
              iconClassName={"w-4 h-4"}
              className={"w-auto"}
            />
          </div>
        </>
      )}
    </div>
  );
}

/*--------------------------------------------------------------------------------------------------------------------*/
function AccountHybrid(props: { address?: string | null }) {
  const { address } = props;
  const { network } = useParams();
  const { data, isPending } = useHybridCustody(address);

  return (
    <div className={"flex flex-col gap-2 items-start justify-start"}>
      <TypeLabel>Hybrid Custody:</TypeLabel>
      {isPending && (
        <LoadingBlock
          title={`Loading hybrid custody info for ${address} ... `}
        />
      )}

      {data?.childAccounts?.map((childAccount: FlowChildAccount) => {
        const imgSrc = childAccount?.display?.thumbnail?.url;
        return (
          <div key={childAccount.address} className={"flex flex-col w-full"}>
            <TypeLabel>Child Accounts:</TypeLabel>
            <FatRow
              id={"child-account"}
              details={<ChildAccountDetails account={childAccount} />}
              key={childAccount.address}
              className={[]}
            >
              <div
                className={
                  "flex flex-row gap-2 items-center justify-start w-full p-4"
                }
              >
                {imgSrc && (
                  <Image
                    unoptimized
                    src={imgSrc}
                    alt={childAccount?.display?.name || ""}
                    width={20}
                    height={20}
                    className={"w-12 h-auto"}
                  />
                )}
                <div className={"flex flex-col justify-start items-start"}>
                  <a href={`/${network}/account/${childAccount.address}`}>
                    <TypeH3 className={"underline"}>
                      {childAccount.address}
                    </TypeH3>
                  </a>
                  {childAccount?.display && (
                    <p className={"text-sm inline-flex gap-1 flex-wrap"}>
                      <span className={"font-bold"}>
                        {childAccount?.display?.name}
                      </span>
                      <span className={"opacity-50"}>|</span>
                      <span>{childAccount?.display?.description}</span>
                    </p>
                  )}
                </div>
              </div>
            </FatRow>
          </div>
        );
      })}
    </div>
  );
}

/*--------------------------------------------------------------------------------------------------------------------*/
function ChildAccountDetails(props: { account: FlowChildAccount }) {
  const { account } = props;

  return (
    <FatRowDetails>
      <div
        className={
          "flex flex-row items-center justify-start gap-2 truncate flex-wrap"
        }
      >
        <TypeLabel>Account address:</TypeLabel>
        <div className={"flex flex-row gap-2 flex-wrap items-center"}>
          <span className={"text-sm font-bold"}>{account.address}</span>
          <CopyText text={account.address} />
        </div>
      </div>

      <div className={"flex flex-col items-start"}>
        <BasicAccountDetails address={account.address || ""} />
      </div>

      {/* Supported types */}
      <div
        className={
          "flex flex-col items-start justify-start gap-2 truncate flex-wrap w-full"
        }
      >
        <TypeLabel>Supported Types:</TypeLabel>
        <div
          className={"flex flex-col gap-1 bg-gray-400/30 p-3 w-full rounded-xs"}
        >
          {account.factorySupportedTypes?.map((supportedType) => {
            return (
              <div className={"text-sm"}>{supportedType?.type?.typeID}</div>
            );
          })}
        </div>
      </div>

      {/* Filter Details */}
      {account.filterDetails && (
        <div
          className={
            "flex flex-row items-center justify-start gap-2 truncate flex-wrap w-full"
          }
        >
          <TypeLabel>Filter Type:</TypeLabel>
          <div className={"text-sm font-bold"}>
            {account.filterDetails?.type?.typeID}
          </div>
          <CopyText text={account.filterDetails.type.typeID || ""} />
        </div>
      )}

      {/* Manager Filter Details */}
      {account.managerFilterDetails && (
        <div
          className={
            "flex flex-row items-center justify-start gap-2 truncate flex-wrap w-full"
          }
        >
          <TypeLabel>Manager Filter Type:</TypeLabel>

          <div className={"text-sm font-bold"}>
            {account.managerFilterDetails?.type?.typeID}
          </div>
          <CopyText text={account.filterDetails.type.typeID || ""} />
        </div>
      )}
    </FatRowDetails>
  );
}

/*--------------------------------------------------------------------------------------------------------------------*/
function AccountOwnedInfo(props: { address?: string | null }) {
  const { address } = props;
  const { network } = useParams();
  const { data, isPending } = useOwnedAccountInfo(address);

  return (
    <div className={"flex flex-col gap-2 items-start justify-start"}>
      <TypeLabel>Parent Accounts:</TypeLabel>
      {isPending && (
        <LoadingBlock
          title={`Loading hybrid custody info for ${address} ... `}
        />
      )}
    </div>
  );
}
