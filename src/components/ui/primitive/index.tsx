import { cn } from "@/lib/utils";

/*--------------------------------------------------------------------------------------------------------------------*/
export function Divider(props: { className?: String }) {
  const { className } = props;
  return <hr className={cn("h-px w-full bg-prism-text-muted/5", className)} />;
}
