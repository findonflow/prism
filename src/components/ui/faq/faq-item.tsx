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
    <div className="collapse-arrow bg-prism-level-2 border-prism-border collapse border">
      <input type="checkbox" checked={isOpen} onChange={onToggle} />
      <div className="collapse-title flex items-center justify-start gap-4 text-lg font-medium">
        <span
          className={cn(
            "text-prism-primary flex-shrink-0 text-lg font-bold",
            isOpen && "mt-1 self-start",
          )}
        >
          {index + 1}
        </span>
        <span className="text-prism-text text-left">{item.question}</span>
      </div>
      <div className="collapse-content">
        <div className="flex gap-4">
          <span
            className={cn(
              "invisible",
              "text-prism-primary flex-shrink-0 text-lg font-bold",
              isOpen && "mt-1 self-start",
            )}
          >
            {index + 1}
          </span>
          <p className="text-prism-text-muted text-left leading-relaxed">
            {item.answer}
          </p>
        </div>
      </div>
    </div>
  );
}
