/*--------------------------------------------------------------------------------------------------------------------*/
import "./styles.css";
import { cn } from "@/lib/utils";

/*--------------------------------------------------------------------------------------------------------------------*/
export default function JumpingDots() {
  return (
    <span className={"jumping-dots"} title={"Retrieving data..."}>
      <i />
      <i />
      <i />
      <i />
      <i />
    </span>
  );
}

/*--------------------------------------------------------------------------------------------------------------------*/
export function LoadingBlock(props: { title?: string; className?: string }) {
  const { title, className } = props;
  return (
    <div
      className={cn(
        "flex flex-row items-center justify-start gap-2 opacity-50",
        className,
      )}
    >
      <span className="capitalize">{title || "Loading"}</span>
      <JumpingDots />
    </div>
  );
}
