/*--------------------------------------------------------------------------------------------------------------------*/
"use client";
/*--------------------------------------------------------------------------------------------------------------------*/
import Image from "next/image";
import { useParams } from "next/navigation";
import { Blend, Check, MailQuestionMark, Wallet } from "lucide-react";
import { TypeH3, TypeLabel, TypeSubsection } from "@/components/ui/typography";
import JumpingDots, { LoadingBlock } from "@/components/flowscan/JumpingDots";
import { useAccountCoa } from "@/hooks/useAccountCoa";
import CopyText from "@/components/flowscan/CopyText";
import FlowTokens from "@/components/flowscan/FlowTokens";
import { useHybridCustody } from "@/hooks/useHybridCustody";
import FatRow, { FatRowDetails } from "@/components/flowscan/FatRow";
import BasicAccountDetails from "@/components/ui/account-details";
import { useOwnedAccountInfo } from "@/hooks/useOwnedAccountInfo";
import SimpleTag from "@/components/flowscan/SimpleTag";
import { cn } from "@/lib/utils";
import { Entitlement } from "@/components/ui/hybrid-custody";
import { Divider } from "@/components/ui/primitive";
import { useLoginContext } from "@/fetch/provider";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { buttonClasses, hoverClasses } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import {
  claimChildAccount,
  publishToParent,
  removeParent,
  setChildDisplay,
  setOwnedDisplay,
} from "@/mutate/hybrid-custody";
import { Input } from "@/components/ui/input";
import useAccountResolver from "@/hooks/useAccountResolver";
import useResolver from "@/hooks/useResolver";

/*--------------------------------------------------------------------------------------------------------------------*/
export default function LinkedAccountsContent() {
  const { id } = useParams();

  const { data: resolved, isPending: isResolving } = useAccountResolver(
    id as string,
  );
  const address = resolved?.owner;

  return (
    <div className={"flex w-full flex-col gap-6"}>
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
    <>
      <div className={"flex flex-col items-start justify-start gap-2"}>
        <TypeH3>COA</TypeH3>
        {isPending && (
          <LoadingBlock title={`Loading coa for ${address} ... `} />
        )}
        {!coa && !isPending && (
          <p className={"opacity-50"}>This account doesn't have COA set up</p>
        )}
        {coa && (
          <>
            <div
              className={
                "flex w-full flex-row items-center justify-start gap-2"
              }
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
      </div>
      <hr className={"border-prism-border w-full"} />
    </>
  );
}

/*--------------------------------------------------------------------------------------------------------------------*/
function AccountHybrid(props: { address?: string | null }) {
  const { address } = props;
  const { data, isPending, refetch } = useHybridCustody(address);

  return (
    <>
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
              refetch={refetch}
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
              refetch={refetch}
              key={childAccount.address}
            />
          );
        })}
      </div>
      <hr className={"border-prism-border w-full"} />
    </>
  );
}

function SingleChildAccount(props: {
  childAccount: FlowChildAccount;
  refetch?: () => void;
}) {
  const { childAccount, refetch } = props;
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
        <SetupDisplay address={childAccount.address} refetch={refetch} />
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
  const { data, isPending, refetch } = useOwnedAccountInfo(address);
  const { network } = useParams();

  return (
    <>
      <div className={"flex flex-col items-start justify-start gap-2"}>
        <TypeH3>Owned Account</TypeH3>
        {isPending && (
          <LoadingBlock
            title={`Loading hybrid custody info for ${address} ... `}
          />
        )}

        {!isPending && !data?.isOwnedAccountExists && (
          <div>
            <div className={"opacity-50"}>
              This account doesn't have <b>OwnedAccount</b> set up
            </div>
            {/*<PublishToParent refetch={refetch} />*/}
          </div>
        )}

        {!isPending && data?.isOwnedAccountExists && (
          <>
            {data.owner && (
              <div className={"flex flex-row items-center justify-start gap-2"}>
                {data?.display && (
                  <div className={"flex flex-row items-center gap-2"}>
                    <Image
                      unoptimized
                      src={data.display.thumbnail?.url}
                      alt={data?.display?.name || ""}
                      width={20}
                      height={20}
                      className={"h-auto w-12"}
                    />
                    <div className={"flex flex-col items-start justify-start"}>
                      <a href={`/${network}/account/${data.owner}`}>
                        <TypeH3 className={"underline"}>{data.owner}</TypeH3>
                      </a>
                      {data?.display && (
                        <p className={"inline-flex flex-wrap gap-1 text-sm"}>
                          <span className={"font-bold"}>
                            {data?.display?.name}
                          </span>
                          <span className={"opacity-50"}>|</span>
                          <span>{data?.display?.description}</span>
                        </p>
                      )}
                    </div>
                  </div>
                )}

                <SetupDisplay
                  address={data.owner}
                  type={"owned"}
                  refetch={refetch}
                />
              </div>
            )}

            <div
              className={"flex w-full flex-col items-start justify-start gap-2"}
            >
              <TypeH3>Parents</TypeH3>
              <PublishToParent refetch={refetch} />
              {data?.parents.length === 0 && (
                <p>This account doesn't have any parents</p>
              )}
              {data.parents.map((item: FlowParentAccount) => {
                return (
                  <div
                    key={item.address}
                    className={cn(
                      "bg-prism-level-3 flex w-full flex-row items-center justify-between p-4",
                    )}
                  >
                    <div className="flex flex-row items-center justify-start gap-4">
                      {item.isClaimed && (
                        <SimpleTag
                          label={"Claimed"}
                          className={"text-prism-primary"}
                          category={<Check />}
                        />
                      )}

                      {!item.isClaimed && (
                        <SimpleTag
                          title={"Parent account hasn't claimed this"}
                          label={"Not Claimed"}
                          className={"text-prism-text-muted"}
                          category={<MailQuestionMark />}
                        />
                      )}

                      <a
                        href={`/${network}/account/${item.address}`}
                        className={"font-bold underline"}
                      >
                        {item.address}
                      </a>
                    </div>

                    <div
                      className={"flex flex-row items-center justify-end gap-2"}
                    >
                      <RemoveParent
                        address={item.address}
                        childAddress={address}
                      />
                      <ClaimAccount
                        address={item.address}
                        childAddress={address}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </>
  );
}

function RemoveParent(props: {
  address?: string | null;
  childAddress?: string | null;
}) {
  const { address, childAddress } = props;
  const { user } = useLoginContext();

  const canRemove = user?.address === childAddress;
  const title = canRemove
    ? "Remove parent link"
    : "You are not allowed to control this ChildAccount";

  const [txProgress, setTxProgress] = useState<boolean>(false);
  const [txStatus, setTxStatus] = useState<any>(null);

  async function processRemove() {
    if (!childAddress) {
      return null;
    }
    const result = await removeParent(
      { parentAddress: address },
      { setStatus: setTxStatus, setInProgress: setTxProgress },
    );
  }

  // TODO: Display progress and emit toast when done

  return (
    <div>
      {!txProgress && (
        <button
          onClick={processRemove}
          disabled={!canRemove}
          className={cn(
            buttonClasses,
            "text-prism-text-muted",
            "disabled:bg-prism-level-3 disabled:opacity-50",
            canRemove && hoverClasses,
            canRemove ? "cursor-pointer" : "cursor-not-allowed",
          )}
          title={title}
        >
          Remove parent
        </button>
      )}
      {txProgress && <JumpingDots />}
    </div>
  );
}

function ClaimAccount(props: {
  address?: string | null;
  childAddress?: string | null;
}) {
  const { address, childAddress } = props;
  const { user } = useLoginContext();

  const canClaim = user?.address === address;
  const title = canClaim ? "Claim" : "You can't claim this ChildAccount";

  const [txProgress, setTxProgress] = useState<boolean>(false);
  const [txStatus, setTxStatus] = useState<any>(null);

  async function processClaiming() {
    if (!childAddress) {
      return null;
    }
    const result = await claimChildAccount(
      childAddress,
      setTxProgress,
      setTxStatus,
    );
  }

  // TODO: Display progress and emit toast when done

  return (
    <div>
      {!txProgress && (
        <button
          onClick={processClaiming}
          disabled={!canClaim}
          className={cn(
            buttonClasses,
            "text-prism-text-muted",
            "disabled:bg-prism-level-3 disabled:opacity-50",
            canClaim && hoverClasses,
            canClaim ? "cursor-pointer" : "cursor-not-allowed",
          )}
          title={title}
        >
          Claim
        </button>
      )}
      {txProgress && <JumpingDots />}
    </div>
  );
}

/*--------------------------------------------------------------------------------------------------------------------*/
const schema = z.object({
  parentAddress: z
    .string()
    .min(1, `address is required`)
    .regex(/^0x[a-fA-F0-9]{16}$/, `Invalid address`),
  filterAddress: z
    .string()
    .min(1, `address is required`)
    .regex(/^0x[a-fA-F0-9]{16}$/, `Invalid address`),
  factoryAddress: z
    .string()
    .min(1, `address is required`)
    .regex(/^0x[a-fA-F0-9]{16}$/, `Invalid address`),
});
/*--------------------------------------------------------------------------------------------------------------------*/
function PublishToParent(props: { refetch: () => void }) {
  const { address } = useResolver();
  const { user } = useLoginContext();
  const { refetch } = props;
  const [showOverlay, setShowOverlay] = useState(false);
  const mainInput = useRef<HTMLInputElement>(null);

  const [txProgress, setTxProgress] = useState<boolean>(false);
  const [txStatus, setTxStatus] = useState<any>(null);

  const defaultFactoryAddress = "0x1b7fa5972fcb8af5";
  const defaultFilterAddress = "0xe2664be06bb0fe62";

  const canPublish = user?.address && user.address === address;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      parentAddress: "",
      filterAddress: defaultFilterAddress,
      factoryAddress: defaultFactoryAddress,
    },
    mode: "onChange",
  });

  // Set default values after form initialization
  useEffect(() => {
    setValue("filterAddress", defaultFilterAddress);
    setValue("factoryAddress", defaultFactoryAddress);
  }, [setValue]);

  const onSubmit = async (data: z.infer<typeof schema>) => {
    try {
      setTxProgress(true);
      console.log("Submitting form with data:", data);

      // Ensure all required fields are present
      if (!data.parentAddress || !data.filterAddress || !data.factoryAddress) {
        throw new Error("All fields are required");
      }

      const result = await publishToParent(data, {
        setInProgress: setTxProgress,
        setStatus: setTxStatus,
      });

      console.log({ result });

      reset();
      refetch();
    } catch (error) {
      console.error("Error submitting form:", error);
      // You can add error handling here (e.g., show toast notification)
    } finally {
      setTxProgress(false);
    }
  };

  useEffect(() => {
    if (showOverlay && mainInput.current) {
      mainInput.current.focus();
    } else if (!showOverlay) {
      reset();
    }
  }, [showOverlay, reset]);

  return (
    <>
      <div className={"mt-4"}>
        <button
          disabled={!canPublish}
          className={cn(
            buttonClasses,
            hoverClasses,
            "disabled:opacity-35",
            canPublish ? "cursor-pointer" : "cursor-not-allowed",
          )}
          onClick={() => setShowOverlay(true)}
        >
          Publish to Parent
        </button>
      </div>

      {/* Overlay*/}
      {showOverlay && (
        <div
          className={cn(
            "bg-prism-level-1/90 fixed top-0 right-0 bottom-0 left-0 z-100 backdrop-blur-xs",
            "flex items-center justify-center",
          )}
        >
          <form
            onSubmit={handleSubmit(onSubmit)}
            className={cn(
              "bg-prism-level-2 flex w-full max-w-[360px] flex-col rounded-sm p-6 shadow-2xl",
              "space-y-4",
            )}
          >
            <TypeH3>Publish to Parent</TypeH3>

            <div className={"flex flex-col gap-2"}>
              <TypeLabel>Parent Address:</TypeLabel>
              <Input
                {...register("parentAddress", {
                  required: "Parent address is required",
                })}
                className={cn(
                  "input bg-prism-level-1 [&:focus]:outline-prism-text-muted max-w-md",
                  errors.parentAddress && "border-red-500",
                )}
                placeholder="Enter parent address"
                autoComplete="off"
              />
              {errors.parentAddress && (
                <p className="text-sm text-red-500">
                  {errors.parentAddress.message as string}
                </p>
              )}
            </div>

            <div className={"flex flex-col gap-2"}>
              <TypeLabel>Filter Address:</TypeLabel>
              <Input
                {...register("filterAddress")}
                placeholder={`${defaultFilterAddress} (AllowAll)`}
                className={cn(
                  "input bg-prism-level-1 [&:focus]:outline-prism-text-muted max-w-md",
                  "placeholder:opacity-50",
                  errors.filterAddress && "border-red-500",
                )}
              />
            </div>

            <div className={"flex flex-col gap-2"}>
              <TypeLabel>Factory Address:</TypeLabel>
              <Input
                {...register("factoryAddress")}
                placeholder={`${defaultFactoryAddress} (NFT + FT)`}
                className={cn(
                  "input bg-prism-level-1 [&:focus]:outline-prism-text-muted max-w-md",
                  "placeholder:opacity-50",
                  errors.factoryAddress && "border-red-500",
                )}
              />
            </div>

            <div
              className={
                "mt-6 flex w-full flex-row items-center justify-between gap-4"
              }
            >
              <button
                type="submit"
                disabled={txProgress}
                className={cn(
                  buttonClasses,
                  hoverClasses,
                  "w-full",
                  txProgress && "cursor-not-allowed opacity-50",
                )}
              >
                {txProgress ? "Publishing..." : "Publish"}
              </button>

              <button
                type={"button"}
                className={cn(buttonClasses, hoverClasses, "w-full")}
                onClick={() => setShowOverlay(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}

/*--------------------------------------------------------------------------------------------------------------------*/
function SetupDisplay(props: {
  address: string;
  refetch?: () => void;
  type?: string;
}) {
  const { address, refetch } = props;
  const { type = "child" } = props;

  const [showOverlay, setShowOverlay] = useState(false);
  const mainInput = useRef<HTMLInputElement>(null);

  const [txProgress, setInProgress] = useState<boolean>(false);
  const [txStatus, setStatus] = useState<any>(null);

  const displaySchema = z.object({
    name: z.string().min(1, `name is required`),
    description: z.string().optional(),
    thumbnail: z
      .union([z.string().url(`Invalid URL`), z.literal("")])
      .optional(),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<z.infer<typeof displaySchema>>({
    resolver: zodResolver(displaySchema),
    defaultValues: {
      name: "",
      description: "",
      thumbnail: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (data: z.infer<typeof displaySchema>) => {
    try {
      setInProgress(true);

      if (type === "child") {
        // Set child display
        await setChildDisplay(
          {
            childAddress: address,
            name: data.name,
            description: data.description || "",
            thumbnail: data.thumbnail || "",
          },
          { setInProgress, setStatus },
        );
      } else {
        // Set owned display
        await setOwnedDisplay(
          {
            name: data.name,
            description: data.description || "",
            thumbnail: data.thumbnail || "",
          },
          { setInProgress, setStatus },
        );
      }

      reset();
      refetch?.();
      setShowOverlay(false);
    } catch (e) {
      console.error(e);
    } finally {
      setInProgress(false);
    }
  };

  useEffect(() => {
    if (showOverlay && mainInput.current) {
      mainInput.current.focus();
    } else if (!showOverlay) {
      reset();
    }
  }, [showOverlay, reset]);

  return (
    <>
      <div>
        <button
          className={cn(buttonClasses, hoverClasses)}
          onClick={() => setShowOverlay(true)}
        >
          Setup display
        </button>
      </div>

      {showOverlay && (
        <div
          className={cn(
            "bg-prism-level-1/90 fixed top-0 right-0 bottom-0 left-0 z-100 backdrop-blur-xs",
            "flex items-center justify-center",
          )}
        >
          <form
            onSubmit={handleSubmit(onSubmit)}
            className={cn(
              "bg-prism-level-2 flex w-full max-w-[360px] flex-col rounded-sm p-6 shadow-2xl",
              "space-y-4",
            )}
          >
            <TypeH3>Setup Display</TypeH3>

            <div className={"flex flex-col gap-2"}>
              <TypeLabel>Name:</TypeLabel>
              <Input
                {...register("name", { required: "Name is required" })}
                className={cn(
                  "input bg-prism-level-1 [&:focus]:outline-prism-text-muted max-w-md",
                  errors.name && "border-red-500",
                )}
                placeholder="Enter name"
                autoComplete="off"
              />
              {errors.name && (
                <p className="text-sm text-red-500">
                  {errors.name.message as string}
                </p>
              )}
            </div>

            <div className={"flex flex-col gap-2"}>
              <TypeLabel>Description:</TypeLabel>
              <Input
                {...register("description")}
                placeholder="Enter description (optional)"
                className={cn(
                  "input bg-prism-level-1 [&:focus]:outline-prism-text-muted max-w-md",
                  errors.description && "border-red-500",
                )}
              />
            </div>

            <div className={"flex flex-col gap-2"}>
              <TypeLabel>Thumbnail URL:</TypeLabel>
              <Input
                {...register("thumbnail")}
                placeholder="https://... (optional)"
                className={cn(
                  "input bg-prism-level-1 [&:focus]:outline-prism-text-muted max-w-md",
                  "placeholder:opacity-50",
                  errors.thumbnail && "border-red-500",
                )}
              />
              {errors.thumbnail && (
                <p className="text-sm text-red-500">
                  {errors.thumbnail.message as string}
                </p>
              )}
            </div>

            <div
              className={
                "mt-6 flex w-full flex-row items-center justify-between gap-4"
              }
            >
              <button
                type="submit"
                disabled={txProgress}
                className={cn(
                  buttonClasses,
                  hoverClasses,
                  "w-full",
                  txProgress && "cursor-not-allowed opacity-50",
                )}
              >
                {txProgress ? "Saving..." : "Save"}
              </button>

              <button
                type={"button"}
                className={cn(buttonClasses, hoverClasses, "w-full")}
                onClick={() => setShowOverlay(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
