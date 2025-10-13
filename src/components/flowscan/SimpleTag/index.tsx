"use client";
/*--------------------------------------------------------------------------------------------------------------------*/
import { SquareArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

/*--------------------------------------------------------------------------------------------------------------------*/
interface SimpleTagProps {
  title?: string;
  label: string | React.ReactNode;
  hoverLabel?: string;
  category?: string | React.ReactNode;
  className?: string;
}

/*--------------------------------------------------------------------------------------------------------------------*/
export default function SimpleTag(props: SimpleTagProps) {
  const { category, title } = props;
  const { label, hoverLabel } = props;
  const { className } = props;

  const showDivider = Boolean(!!category);

  return (
    <span
      title={title}
      className={cn(
        "flex shrink-0 flex-row items-center justify-center gap-1",
        "border-current/60 border border-solid",
        "text-sm p-1 rounded-xs",
        "group",
        "simple-tag",
        className,
      )}
    >
      {/*Category and divider */}
      {showDivider && (
        <>
          <span
            className={cn(
              "inline-grid place-items-center truncate opacity-75",
              "vertical-text-icon",
            )}
          >
            <span className={"[&>svg]:h-4 [&>svg]:w-4"}>{category}</span>
          </span>
          <span className={cn("opacity-60")}>|</span>
        </>
      )}

      {/* Label */}
      <div
        className={cn("flex items-center justify-start gap-1 px-0.5")}
      >
        <span
          className={cn(
            "truncate",
            "group-hover:max-w-[100rem]",
            "vertical-text-icon",
          )}
        >
          {hoverLabel ? (
            <>
              <div
                className={"block group-hover:hidden [&>svg]:h-4 [&>svg]:w-4"}
              >
                {label}
              </div>
              <div
                className={"hidden group-hover:block [&>svg]:h-4 [&>svg]:w-4"}
              >
                {hoverLabel}
              </div>
            </>
          ) : (
            <div className={"[&>svg]:h-4 [&>svg]:w-4"}>{label}</div>
          )}
        </span>
      </div>

      {/* Conditional Link symbol */}
      <SquareArrowUpRight
        className={cn(
          "st__link-icon",
          "relative bottom-[0.5px] hidden h-3 w-3 shrink-0 opacity-50",
          "in-[:where(a)]:block",
        )}
      />
    </span>
  );
}
