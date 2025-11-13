import { Label } from "@atoms/text/primitives.tsx";
import { cn } from "@utils/twMerge.ts";
import { Timestamp } from "@molecules/Transactions/Components.tsx";
import React from "react";
import CopyText from "@atoms/CopyText";
import FlowTokens from "@molecules/FlowTokens";
import JumpingDots, { LoadingBlock } from "@atoms/JumpingDots";
import { DetailsElement } from "@atoms/TransactionDetails";
import CollapsablePanel from "@organisms/CollapsablePanel";
import SimpleTag from "@atoms/SimpleTag";
import { FileX2 } from "lucide-react";
import { TagNotFound } from "@atoms/SimpleTag/variants.tsx";

/* --------------------------------------------------------------------------------------------- */
export function SidebarHorizontalValue(props: { label: string; value: any; className?: string }) {
  const { label, value, className } = props;
  return (
    <div
      className={cn(
        "text-fineprint flex w-full flex-row items-center justify-between gap-2",
        className,
      )}>
      <Label text={label} className={"flex-shrink-0"} />
      {value}
    </div>
  );
}

export function SidebarLongId(props: { text?: any }) {
  const { text } = props;

  if (!text) {
    return null;
  }

  return (
    <div className="wrap-text flex w-full shrink flex-row gap-1">
      <CopyText className="text-colors-accent mt-px" color="#5D6A7A" text={text} />
      <p className="text-main text-text-color truncate" title={text}>
        {text}
      </p>
    </div>
  );
}

/* --------------------------------------------------------------------------------------------- */
export function SidebarSection(props: { children: React.ReactNode }) {
  const { children } = props;

  return (
    <div className={"mt-2 flex w-full flex-col gap-2"}>
      <SidebarDivider spacing={"bottom"} />
      {children}
    </div>
  );
}

/* --------------------------------------------------------------------------------------------- */
export function SidebarDivider(props: { className?: string; spacing?: "top" | "bottom" }) {
  const { className, spacing } = props;

  return (
    <div
      className={cn(
        "bg-bsn-layer-4 h-px w-full opacity-50",
        spacing === "top" && "mt-1",
        spacing === "bottom" && "mb-1",
        className,
      )}
    />
  );
}

/* --------------------------------------------------------------------------------------------- */
export function SidebarTimestamp(props: { timestamp: any }) {
  const { timestamp } = props;

  return (
    <SidebarSection>
      <SidebarHorizontalValue label={"Timestamp"} value={<Timestamp time={timestamp} />} />
    </SidebarSection>
  );
}

/* --------------------------------------------------------------------------------------------- */
export function SidebarFlowValue(props: {
  label: string;
  value?: number | string;
  precision?: number;
  skip?: boolean;
  className?: string;
}) {
  const { value, label, precision = 4 } = props;
  const { className, skip } = props;

  if (skip) {
    return null;
  }

  if (value === undefined || value === null) {
    return null;
  }

  const isEmpty = value === 0 || value === "0";

  return (
    <SidebarHorizontalValue
      className={cn(isEmpty && "opacity-25")}
      label={label}
      value={
        <FlowTokens
          value={value}
          logoPosition={"right"}
          iconClassName={"h-4 w-4"}
          digits={precision}
          className={cn(!isEmpty && className)}
        />
      }
    />
  );
}

/* --------------------------------------------------------------------------------------------- */
export function SidebarContent(props: { top: React.ReactNode; bottom?: React.ReactNode }) {
  const { top, bottom } = props;

  return (
    <div className={"sidebar-grid grid w-full flex-col items-start justify-between gap-4"}>
      {/* Top Part*/}
      <div
        className={cn(
          "flex h-auto w-auto flex-col items-start justify-start gap-4",
          "preview-scrollbar overflow-y-auto",
          "@md:h-full @md:w-full",
        )}>
        {top}
      </div>

      {/* Bottom Part */}
      {Boolean(!!bottom) && (
        <div className={"flex w-full flex-shrink-0 flex-col gap-2"}>{bottom}</div>
      )}
    </div>
  );
}

/* --------------------------------------------------------------------------------------------- */
export function SidebarHorizontalLoading() {
  return (
    <SidebarSection>
      <SidebarHorizontalValue
        className={"text-bsn-label"}
        label={"Loading"}
        value={
          <div className={"flex flex-row gap-2"}>
            <JumpingDots />
          </div>
        }
      />
    </SidebarSection>
  );
}

/* --------------------------------------------------------------------------------------------- */
export function SidebarVerticalLabel(props: { title: string; value: string }) {
  const { title, value } = props;

  return (
    <div
      className={cn(
        "section-title-vertical",
        "flex w-full flex-row justify-between gap-2 truncate",
        "md:justify-end md:gap-2",
      )}>
      <p className={"opacity-50"}>{title}</p>
      <span className={"bsn-max-label inline w-full truncate text-right text-ellipsis opacity-100"}>
        {value}
      </span>
    </div>
  );
}

/* --------------------------------------------------------------------------------------------- */
export function SidebarVerticalContent(props: {
  title: string;
  value: string;
  children?: React.ReactNode | Array<React.ReactNode>;
}) {
  const { title, value } = props;
  const { children } = props;

  return (
    <div
      className={cn(
        "flex w-full flex-col items-start justify-between gap-2",
        "lg:items-between lg:h-full lg:flex-row lg:gap-16",
      )}
      title={`${title}: ${value}`}>
      <div className={"text-main flex w-full flex-row items-center justify-start gap-2"}>
        {children}
      </div>

      <SidebarVerticalLabel title={title} value={value} />
    </div>
  );
}

/* --------------------------------------------------------------------------------------------- */
export function SidebarLoadingState(props: { value: string; title: string }) {
  const { value, title } = props;

  const content = (
    <SidebarContent
      top={
        <div className={"grid h-full w-full grid-cols-1 grid-rows-[auto_1fr]"}>
          <DetailsElement heading={title} className={"w-full"}>
            <SidebarLongId text={value} />
          </DetailsElement>
          <div
            className={"flex h-full w-full flex-col items-center justify-center gap-6 opacity-30"}>
            <LoadingBlock
              className={"text-fineprint flex-col-reverse gap-6 text-center font-light"}
              dotsClassName={"text-[1.25rem]"}
            />
          </div>
        </div>
      }
      bottom={<SidebarHorizontalLoading />}
    />
  );

  const verticalContent = (
    <SidebarVerticalContent title={title} value={value}>
      <JumpingDots className={"w-full"} />
    </SidebarVerticalContent>
  );

  return (
    <CollapsablePanel
      title={title}
      verticalContent={verticalContent}
      content={content}
      className={"bg-bsn-layer-1.5"}
    />
  );
}

/* --------------------------------------------------------------------------------------------- */
export function SidebarNotFound(props: { value: string; title: string }) {
  const { value, title } = props;

  const content = (
    <SidebarContent
      top={
        <div className={"grid h-full w-full grid-cols-1 grid-rows-[auto_1fr]"}>
          <div className={"flex w-full flex-col gap-4"}>
            <div className={"flex flex-row gap-2"}>
              <TagNotFound />
            </div>
            <DetailsElement heading={title} className={"w-full"}>
              <SidebarLongId text={value} />
            </DetailsElement>
          </div>

          <div
            className={"flex h-full w-full flex-col items-center justify-center gap-6 opacity-30"}>
            <div className={"flex w-full items-center justify-center"}>
              <FileX2 className={"bsn-not-found h-15 w-15 opacity-50"} />
            </div>
            <p className={"text-fineprint text-center font-light"}>
              Could not find record in our database for this {title.toLowerCase()}
            </p>
          </div>
        </div>
      }
    />
  );

  const verticalContent = (
    <SidebarVerticalContent title={title} value={value}>
      <SimpleTag label={"Not found"} className={"text-bsn-failure"} category={<FileX2 />} />
    </SidebarVerticalContent>
  );

  return (
    <CollapsablePanel
      title={`${title}`}
      verticalContent={verticalContent}
      content={content}
      className={"bg-bsn-layer-1.5"}
    />
  );
}

/* --------------------------------------------------------------------------------------------- */
export function SidebarContainer(props: {
  title: string;
  value: string;
  content: React.ReactNode;
  verticalContent?: React.ReactNode;
  isPending: boolean;
  itemMissing: boolean;
  idLabel?: string;
}) {
  const { title, value } = props;
  const { isPending, itemMissing } = props;
  const { content, verticalContent } = props;
  const { idLabel } = props;

  let finalContent = content;
  let finalVerticalContent = verticalContent;

  if (isPending) {
    return <SidebarLoadingState value={value} title={idLabel || title} />;
  }

  if (!isPending && itemMissing) {
    finalContent = (
      <SidebarContent
        top={
          <div className={"grid h-full w-full grid-cols-1 grid-rows-[auto_1fr]"}>
            <div className={"flex w-full flex-col gap-4"}>
              <div className={"flex flex-row gap-2"}>
                <TagNotFound />
              </div>
              <DetailsElement heading={idLabel || title} className={"w-full"}>
                <SidebarLongId text={value} />
              </DetailsElement>
            </div>

            <div
              className={
                "flex h-full w-full flex-col items-center justify-center gap-6 opacity-30"
              }>
              <div className={"flex w-full items-center justify-center"}>
                <FileX2 className={"bsn-not-found h-15 w-15 opacity-50"} />
              </div>
              <p className={"text-fineprint text-center font-light"}>
                Could not find record in our database for this {title.toLowerCase()}
              </p>
            </div>
          </div>
        }
      />
    );

    finalVerticalContent = (
      <SidebarVerticalContent title={title} value={value}>
        <SimpleTag label={"Not found"} className={"text-bsn-failure"} category={<FileX2 />} />
      </SidebarVerticalContent>
    );
  }

  return (
    <CollapsablePanel
      title={title}
      content={finalContent}
      verticalContent={finalVerticalContent}
      className={"bg-bsn-layer-1.5"}
    />
  );
}
