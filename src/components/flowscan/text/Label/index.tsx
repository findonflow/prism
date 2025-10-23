import { cn } from "@/lib/utils";

/* --------------------------------------------------------------------------------------------- */
export function Label(props: { text?: string | null; className?: string }) {
  const { text, className } = props;
  if (!text) {
    return null;
  }
  return <span className={cn("text-fineprint", className)}>{text}</span>;
}
