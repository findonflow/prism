/*--------------------------------------------------------------------------------------------------------------------*/
import { motion } from "motion/react";
import { useExpandEffect } from "@/hooks/layout/useExpandEffect";
import { rowBoundaries } from "@/lib/animate";
import { cn } from "@/lib/utils";
import "./styles.css";

/*--------------------------------------------------------------------------------------------------------------------*/
interface FatRowProps {
  id: string | undefined;
  children: React.ReactNode | Array<React.ReactNode>;
  details: React.ReactNode;
  className: Array<string | undefined>;
  eventName?: string;
}

/*--------------------------------------------------------------------------------------------------------------------*/
export default function FatRow(props: FatRowProps) {
  const { id, className } = props;
  const { children, details } = props;
  const { eventName = "tx-row-expand" } = props;

  const { show, expand, ref } = useExpandEffect({ id, eventName: eventName });

  const handleRowClick = (e: React.MouseEvent) => {
    const isLinkClick = (e.target as HTMLElement).closest("a");

    if (!isLinkClick) {
      expand();
    } else {
      e.stopPropagation();
    }
  };

  return (
    <motion.div
      ref={ref}
      variants={rowBoundaries}
      animate={show ? "selected" : "initial"}
      transition={{
        type: "spring",
        damping: 9,
        stiffness: 100,
      }}
      className={cn(
        "flex w-full flex-col items-center justify-between",
        "bg-prism-level-2 hover:bg-gray-500",
        "fat-row @container",
        show &&
          "fat-row-expanded border-1 border-solid border-gray-400/65 rounded-xs",
        ...className,
      )}
    >
      <div
        className={cn(
          "relative w-full",
          show ? "cursor-zoom-out" : "cursor-zoom-in",
        )}
        onClick={handleRowClick}
      >
        {/* Collapsed Content*/}
        {children}
      </div>

      {/* Details */}
      {show && details}
    </motion.div>
  );
}

export function FatRowDetails(props: { children: React.ReactNode }) {
  const { children } = props;
  return (
    <div
      className={
        "flex w-full flex-col items-start justify-start gap-2 bg-gray-700 p-4 text-md"
      }
    >
      {children}
    </div>
  );
}
