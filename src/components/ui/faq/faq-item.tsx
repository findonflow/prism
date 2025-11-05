"use client";
/*--------------------------------------------------------------------------------------------------------------------*/
import { type FAQItem } from "./strings";
import { cn } from "@/lib/utils";

/*--------------------------------------------------------------------------------------------------------------------*/
interface FAQItemProps {
  item: FAQItem;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}

/*--------------------------------------------------------------------------------------------------------------------*/
export function FAQItemComponent({
  item,
  index,
  isOpen,
  onToggle,
}: FAQItemProps) {
  return (
    <div
      className={cn(
        "collapse-arrow collapse",
        "bg-prism-level-2 border border-prism-border rounded-xs text-prism-primary",
        "hover:bg-prism-level-3",
        isOpen && "border-prism-primary"
      )}
    >
      <input type="checkbox" checked={isOpen} onChange={onToggle} />
      <div className="collapse-title flex items-center justify-start gap-4 text-lg font-medium">
        <span
          className={cn(
            "text-prism-primary flex-shrink-0 text-lg font-bold",
            isOpen && "lg:self-start",
          )}
        >
          {index + 1}
        </span>
        <span className="text-prism-text text-left">{item.question}</span>
      </div>
      <div className="collapse-content space-y-4">
        <hr className={cn("w-full bg-prism-primary/50 opacity-0 transition duration-300", isOpen && "opacity-100")} />
        <div className="flex gap-4 p-4 bg-prism-level-4">
          <p className="text-prism-text-muted text-left leading-relaxed">
            {item.answer}
          </p>
        </div>
      </div>
    </div>
  );
}
