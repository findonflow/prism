/*--------------------------------------------------------------------------------------------------------------------*/
"use client";
/*--------------------------------------------------------------------------------------------------------------------*/
import { useParams } from "next/navigation";
import useAccountResolver from "@/hooks/useAccountResolver";
import { TypeH3, TypeLabel, TypeSubsection } from "@/components/ui/typography";
import { LoadingBlock } from "@/components/flowscan/JumpingDots";
import { useAccountCoa } from "@/hooks/useAccountCoa";
import CopyText from "@/components/flowscan/CopyText";
import { Blend, Check, Wallet } from "lucide-react";
import FlowTokens from "@/components/flowscan/FlowTokens";
import { useHybridCustody } from "@/hooks/useHybridCustody";
import Image from "next/image";
import FatRow, { FatRowDetails } from "@/components/flowscan/FatRow";
import BasicAccountDetails from "@/components/ui/account-details";
import { useOwnedAccountInfo } from "@/hooks/useOwnedAccountInfo";
import SimpleTag from "@/components/flowscan/SimpleTag";
import { cn } from "@/lib/utils";
import { Entitlement } from "@/components/ui/hybrid-custody";
import { Divider } from "@/components/ui/primitive";

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
  const coaPrefixed = `0x${coa}`;

  return (
    <div className={"flex flex-col items-start justify-start gap-2"}>
      <TypeH3>COA</TypeH3>
      {isPending && <LoadingBlock title={`Loading coa for ${address} ... `} />}
      {!coa && !isPending && (
        <p className={"opacity-50"}>This account doesn't have COA set up</p>
      )}
      {coa && (
        <>
          <div
            className={"flex w-full flex-row items-center justify-start gap-2"}
          >
            <TypeLabel>Address:</TypeLabel>
            <p className={"truncate"}>{coaPrefixed}</p>
            <CopyText text={coaPrefixed} className={"text-lg"} />
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
      <hr className={"border-prism-border w-full"} />
    </div>
  );
}

/*--------------------------------------------------------------------------------------------------------------------*/
function AccountHybrid(props: { address?: string | null }) {
  const { address } = props;
  const { network } = useParams();
  const { data, isPending } = useHybridCustody(address);

  console.log({ hc: data });

  return (
    <div className={"flex flex-col items-start justify-start gap-2"}>
      <TypeSubsection className={"capitalize"}>Hybrid Custody</TypeSubsection>
      <TypeH3>Manager</TypeH3>
      {isPending && (
        <LoadingBlock
          title={`Loading hybrid custody info for ${address} ... `}
        />
      )}

      {!isPending && data?.childAccounts && (
        <TypeLabel>Child Accounts:</TypeLabel>
      )}
      {data?.childAccounts?.length === 0 && (
        <p className={"mb-4 opacity-50"}>
          This Manager doesn't control any <b>ChildAccounts</b>
        </p>
      )}
      {data?.childAccounts?.map((childAccount: FlowChildAccount) => {
        return (
          <SingleChildAccount
            childAccount={childAccount}
            key={childAccount.address}
          />
        );
      })}

      {!isPending && data?.childAccounts && (
        <TypeLabel>Owned Accounts:</TypeLabel>
      )}
      {data?.ownedAccounts?.length === 0 && (
        <p className={"opacity-50"}>
          This Manager doesn't control any <b>OwnedAccounts</b>
        </p>
      )}

      {data?.ownedAccounts?.map((childAccount: FlowChildAccount) => {
        return (
          <SingleChildAccount
            childAccount={childAccount}
            key={childAccount.address}
          />
        );
      })}
    </div>
  );
}

function SingleChildAccount(props: { childAccount: FlowChildAccount }) {
  const { childAccount } = props;
  const imgSrc = childAccount?.display?.thumbnail?.url;
  const { network } = useParams();
  return (
    <FatRow
      key={childAccount.address}
      id={"child-account"}
      details={<ChildAccountDetails account={childAccount} />}
      className={[]}
    >
      <div
        className={"flex w-full flex-row items-center justify-start gap-2 p-4"}
      >
        {imgSrc && (
          <Image
            unoptimized
            src={imgSrc}
            alt={childAccount?.display?.name || ""}
            width={20}
            height={20}
            className={"h-auto w-12"}
          />
        )}
        <div className={"flex flex-col items-start justify-start"}>
          <a href={`/${network}/account/${childAccount.address}`}>
            <TypeH3 className={"underline"}>{childAccount.address}</TypeH3>
          </a>
          {childAccount?.display && (
            <p className={"inline-flex flex-wrap gap-1 text-sm"}>
              <span className={"font-bold"}>{childAccount?.display?.name}</span>
              <span className={"opacity-50"}>|</span>
              <span>{childAccount?.display?.description}</span>
            </p>
          )}
        </div>
      </div>
    </FatRow>
  );
}

/*--------------------------------------------------------------------------------------------------------------------*/
function ChildAccountDetails(props: { account: FlowChildAccount }) {
  const { account } = props;

  return (
    <FatRowDetails>
      <div
        className={
          "flex flex-row flex-wrap items-center justify-start gap-2 truncate"
        }
      >
        <TypeLabel>Account address:</TypeLabel>
        <div className={"flex flex-row flex-wrap items-center gap-2"}>
          <span className={"text-sm font-bold"}>{account.address}</span>
          <CopyText text={account.address} />
        </div>
      </div>

      <div className={"flex w-full flex-col items-start"}>
        <BasicAccountDetails address={account.address || ""} />
      </div>

      {/* Supported types */}
      <Divider />
      <div className="flex w-full flex-col gap-2">
        <TypeLabel>Supported Types:</TypeLabel>
        <div className={"flex flex-col items-start gap-2"}>
          {account.factorySupportedTypes?.map((supportedType, index) => {
            console.log({ supportedType });
            return (
              <div className={"flex flex-row items-center gap-2"}>
                {supportedType.authorization?.kind ===
                  "EntitlementConjunctionSet" && (
                  <div className={"flex flex-row items-center gap-2"}>
                    {supportedType.authorization.entitlements.map(
                      (ent: any, i: number) => {
                        return <Entitlement entitlement={ent} />;
                      },
                    )}
                  </div>
                )}

                {supportedType.type?.kind === "Intersection" && (
                  <SimpleTag
                    label={<Blend className={"h-4 w-4"} />}
                    title={`Intersection: ${supportedType.type?.typeID || ""}`}
                    className={"text-pink-400"}
                  />
                )}

                <div className={"flex flex-row items-center gap-2"}>
                  {supportedType.type?.types?.map(
                    (t: any, j: number, arr: any) => {
                      const last = j === arr.length - 1;
                      return (
                        <span className={"text-xs"}>
                          {t.typeID}
                          {last ? "" : ","}
                        </span>
                      );
                    },
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <Divider />

      {/* Filter Details */}
      {account.filterDetails && (
        <div
          className={
            "flex w-full flex-row flex-wrap items-center justify-start gap-2 truncate"
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
            "flex w-full flex-row flex-wrap items-center justify-start gap-2 truncate"
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
  const { data, isPending } = useOwnedAccountInfo(address);
  const { network } = useParams();

  console.log({parents: data?.parents})

  return (
    <div className={"flex flex-col items-start justify-start gap-2"}>
      <TypeH3>Owned Account</TypeH3>
      {isPending && (
        <LoadingBlock
          title={`Loading hybrid custody info for ${address} ... `}
        />
      )}

      {!isPending && !data?.isOwnedAccountExists && (
        <div className={"opacity-50"}>
          This account doesn't have <b>OwnedAccount</b> set up
        </div>
      )}

      {!isPending && data?.isOwnedAccountExists && (
        <>
          {data.owner && (
            <div className={"flex flex-row items-center justify-start gap-2"}>
              <TypeLabel>Owned by:</TypeLabel>
              <a
                href={`/${network}/account/${data.owner}`}
                className={"underline"}
              >
                {data.owner}
              </a>
            </div>
          )}

          {data.parents.length > 0 && (
            <div
              className={"flex w-full flex-col items-start justify-start gap-2"}
            >
              <TypeH3>Parents</TypeH3>
              {data.parents.map((item: FlowParentAccount) => {
                return (
                  <div
                    key={item.address}
                    className={cn(
                      "bg-prism-level-3 flex w-full flex-col items-center justify-between",
                    )}
                  >
                    <div className="flex w-full flex-row items-center justify-start gap-4 p-4">
                      {item.isClaimed && (
                        <SimpleTag
                          label={"Claimed"}
                          className={"text-prism-primary"}
                          category={<Check />}
                        />
                      )}
                      <a
                        href={`/${network}/account/${item.address}`}
                        className={"font-bold underline"}
                      >
                        {item.address}
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
