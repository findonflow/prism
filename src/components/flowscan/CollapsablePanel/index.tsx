"use client";
/* --------------------------------------------------------------------------------------------- */
import React, { CSSProperties, Ref, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { ArrowLeftFromLine } from "lucide-react";
/* --------------------------------------------------------------------------------------------- */
const EVENT_COLLAPSE_PANEL = "ui-event-collapse-panel";

/* --------------------------------------------------------------------------------------------- */
export function emitCollapseEvent(id: string) {
  document?.dispatchEvent(
    new CustomEvent(EVENT_COLLAPSE_PANEL, {
      detail: {
        id,
      },
    }),
  );
}

/* --------------------------------------------------------------------------------------------- */
interface CollapsableProps {
  noTitle?: boolean;
  title: string;
  rotateToggleIcon?: boolean;
  verticalTitle?: string;
  verticalValue?: React.ReactNode;
  verticalContent?: React.ReactNode;
  content?: React.ReactNode;
  children?: React.ReactNode | React.ReactNode[];
  className?: string;
  ref?: Ref<HTMLDivElement>;
  style?: CSSProperties;
  defaultOpen?: boolean;
  eventName?: string;
}
/* --------------------------------------------------------------------------------------------- */
export default function CollapsablePanel(props: CollapsableProps) {
  const { title, content, children, ref, style } = props;
  const { verticalValue, verticalTitle, verticalContent } = props;
  const { defaultOpen = true } = props;
  const { className } = props;

  const [open, setOpen] = useState(defaultOpen);

  useEffect(() => {
    // Simple mobile detection
    const isMobile =
      /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) ||
      window.innerWidth <= 768;
    if (isMobile) setOpen(false);
  }, []);

  function collapse() {
    setOpen(false);
  }

  useEffect(() => {
    document?.addEventListener(EVENT_COLLAPSE_PANEL, collapse);
    return () => {
      document?.removeEventListener(EVENT_COLLAPSE_PANEL, collapse);
    };
  }, []);

  function toggle() {
    setOpen(!open);
  }

  const verticalNode = (
    <div
      key={"details-vertical"}
      className={cn(
        "vertical-text animation-slide-in text-title flex w-full gap-2 truncate",
        "sm:w-full sm:text-left",
        "sm:pb-8",
        "md:h-full",
      )}
    >
      {!verticalContent && (
        <>
          <span>{verticalTitle}</span>
          {verticalValue && (
            <span className={"truncate font-bold"}>{verticalValue}</span>
          )}
        </>
      )}
      {verticalContent}
    </div>
  );

  const horizontalNode = props.noTitle ? null : (
    <h1
      key={"details-title"}
      className={"section-title mb-2 md:mb-4"}
    >
      {title}
    </h1>
  );

  const titleContent = open ? horizontalNode : verticalNode;

  return (
    <section
      ref={ref}
      style={{ scrollbarWidth: "none", ...style }}
      onClick={() => {
        if (!open) {
          toggle();
        }
      }}
      className={cn(
        "relative flex h-auto w-full flex-col items-start justify-start transition-all",
        "shrink-0 p-6 pb-3 pt-6",
        "md:items-between md:h-full md:w-auto md:p-8",
        "thin-scrollbar",
        open && "items-start justify-start md:h-full",
        open && "md:w-[360px]",
        className,
      )}
    >
      {/* Collapse controller */}
      <div
        onClick={toggle}
        className={cn(
          "absolute top-4 right-4 z-3 cursor-pointer transition-colors",
          "text-bsn-label opacity-subtle",
          "hover:text-bsn-accent hover:opacity-100",
          "rotate-90 lg:rotate-0",
          !open && "-rotate-90",
          !open &&
            "lg:right-[unset] lg:left-1/2 lg:-translate-x-1/2 lg:rotate-180",
        )}
      >
        <ArrowLeftFromLine className={cn("h-4 w-4 text-prism-text-muted")} />
      </div>

      {titleContent}
      {open && content}
      {open && children}
    </section>
  );
}
