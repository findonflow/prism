/*--------------------------------------------------------------------------------------------------------------------*/
import {
  Cpu,
  FileX2,
  Flame,
  HandCoins,
  Hash,
  KeyRound,
  OctagonAlert,
  Package,
  PackageCheck,
  ShieldUser,
  Signature,
  VenetianMask,
} from "lucide-react";
import { formatNumberToAccounting } from "@/lib/format";
import SimpleTag from "@/components/flowscan/SimpleTag";
import { cn } from "@/lib/utils";
import { getErrorInfo } from "@/consts/error-codes";
import { NODE_TITLES } from "@/consts/node";

/*--------------------------------------------------------------------------------------------------------------------*/
export function NumberOfItems(props: { items?: number }) {
  const { items } = props;

  if (!items) return null;

  return (
    <div
      title={`This collection has ${items} item${items > 1 ? "s" : ""} in it`}
      className={cn(
        "flex flex-row items-center justify-end gap-1",
        items === 0 ? "text-grey-200/10" : "text-blue-500",
      )}
    >
      <Package className={"h-4 w-4"} />
      <b className={"text-copy"}>{items}</b>
    </div>
  );
}
/*--------------------------------------------------------------------------------------------------------------------*/
export function VaultBalance(props: { balance?: string; symbol?: string }) {
  const { balance, symbol } = props;
  const formatted = Number(balance);

  return (
    <div
      className={cn(
        "flex flex-row items-center justify-end gap-1",
        formatted === 0 ? "text-gray-400" : "text-prism-primary",
      )}
    >
      <span className={"opacity-75"}>{symbol}</span>
      <b className={cn("text-md")}>
        {formatNumberToAccounting(formatted, 4, 2)}
      </b>
    </div>
  );
}

/*--------------------------------------------------------------------------------------------------------------------*/
export function TagGas(props: { gas?: number; title?: string }) {
  const { gas, title } = props;
  const formattedGas = formatNumberToAccounting(gas);
  const finalTitle = title || `Gas: ${formattedGas}`;

  if (!gas) {
    return null;
  }

  return (
    <SimpleTag
      title={finalTitle}
      label={`Gas: ${formattedGas}`}
      className={"text-bsn-label hover:text-orange-300"}
      category={<Flame />}
    />
  );
}

/*--------------------------------------------------------------------------------------------------------------------*/
export function TagMultisig(props: {
  signers?: Array<string>;
  short?: boolean;
}) {
  const { signers, short } = props;

  if (!signers) {
    return null;
  }

  const numSigners = signers.length;
  const title = `This transaction was signed by ${numSigners} signers`;

  const label = short ? numSigners : `Multisig: ${numSigners}`;
  const hoverLabel = short
    ? numSigners.toString()
    : `Multisig: ${signers.join(", ")}`;

  return (
    <SimpleTag
      title={title}
      label={label}
      hoverLabel={hoverLabel}
      className={"text-flsn-unusual"}
      category={<Signature />}
    />
  );
}

/* --------------------------------------------------------------------------------------------- */
export function TagStaker(props: { balance?: number }) {
  const { balance } = props;

  if (!balance) {
    return null;
  }

  const staked = formatNumberToAccounting(balance);

  return (
    <SimpleTag
      label={<ShieldUser />}
      className={"text-orange-300"}
      title={`Staker: This account has staked ${staked} FLOW to secure network stability`}
    />
  );
}

/* --------------------------------------------------------------------------------------------- */
export function TagDelegator(props: { balance?: number }) {
  const { balance } = props;

  if (!balance) {
    return null;
  }

  const delegated = formatNumberToAccounting(balance);

  return (
    <SimpleTag
      label={<HandCoins />}
      className={"text-orange-300"}
      title={`Delegator: This account has delegated ${delegated} FLOW to other nodes`}
    />
  );
}

/*--------------------------------------------------------------------------------------------------------------------*/
export function TagExecEffort(props: { effort?: number; title?: string }) {
  const { effort } = props;

  if (!effort) {
    return null;
  }

  const precision = parseInt(effort.toString().split("-")[1]);
  const formatted = effort.toFixed(precision);
  const title = `Execution Effort: ${formatted}`;

  if (!effort) {
    return null;
  }

  return (
    <SimpleTag
      title={title}
      label={`${formatted}`}
      className={"text-bsn-label"}
      category={<Cpu />}
    />
  );
}

/* --------------------------------------------------------------------------------------------- */
export function TagNonce(props: { nonce?: number; title?: string }) {
  const { nonce, title } = props;
  const tagTitle = title || `Proposer Sequence Number: ${nonce}`;

  if (!nonce) {
    return null;
  }

  return (
    <SimpleTag
      title={tagTitle}
      label={nonce}
      className={"text-bsn-label"}
      category={<Hash />}
    />
  );
}

/* --------------------------------------------------------------------------------------------- */
export function TagKey(props: { keyIndex?: number; title?: string }) {
  const { keyIndex, title } = props;
  const tagTitle = title || `Proposer Key Index: ${keyIndex}`;

  if (!keyIndex) {
    return null;
  }

  return (
    <SimpleTag
      title={tagTitle}
      label={keyIndex}
      className={"text-bsn-label"}
      category={<KeyRound />}
    />
  );
}

/*--------------------------------------------------------------------------------------------------------------------*/
export function TagFlowStatus(props: {
  status?: string;
  error?: string;
  errorCode?: string;
}) {
  const { status } = props;
  const { error, errorCode } = props;

  const { title, description } = getErrorInfo(errorCode);

  return !error ? (
    <SimpleTag
      label={status || "SEALED"}
      category={<PackageCheck />}
      className={"text-bsn-success"}
    />
  ) : (
    <div className={"cursor-pointer"}>
      <SimpleTag
        label={title}
        title={description}
        category={<OctagonAlert />}
        className={"text-bsn-failure"}
      />
    </div>
  );
}

/* --------------------------------------------------------------------------------------------- */
export function TagNodeType(props: { role?: string }) {
  const { role } = props;

  if (!role) {
    return null;
  }

  const title = NODE_TITLES[role as keyof typeof NODE_TITLES] || "";

  return (
    <SimpleTag
      label={role}
      title={`Role: ${title}`}
      className={"text-bsn-label capitalize"}
      category={<VenetianMask />}
    />
  );
}

/* --------------------------------------------------------------------------------------------- */
export function TagNotFound() {
  return (
    <SimpleTag
      label={"Not found"}
      className={"text-bsn-failure"}
      category={<FileX2 />}
    />
  );
}
