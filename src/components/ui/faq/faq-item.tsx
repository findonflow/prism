"use client";

import { type FAQItem } from "./strings";

interface FAQItemProps {
  item: FAQItem;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}

export function FAQItemComponent({
  item,
  index,
  isOpen,
  onToggle,
}: FAQItemProps) {
  return (
    <div className="collapse collapse-arrow bg-prism-level-2 border border-prism-border">
      <input
        type="checkbox"
        checked={isOpen}
        onChange={onToggle}
      />
      <div className="collapse-title text-lg font-medium flex items-center justify-start gap-4">
        <span
          className={`text-prism-primary font-bold text-lg flex-shrink-0 ${
            isOpen ? "self-start mt-1" : ""
          }`}
        >
          {index + 1}
        </span>
        <span className="text-prism-text">{item.question}</span>
      </div>
      <div className="collapse-content">
        <div className="flex gap-4">
          <span className="text-prism-primary font-bold text-xl flex-shrink-0 invisible">
            {index + 1}
          </span>
          <p className="text-prism-text-muted leading-relaxed text-left">{item.answer}</p>
        </div>
      </div>
    </div>
  );
}
