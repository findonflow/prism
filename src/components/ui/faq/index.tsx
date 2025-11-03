"use client";

import { useState } from "react";
import { FAQ_ITEMS } from "./strings";
import { FAQItemComponent } from "./faq-item";
import { TypeH1 } from "@/components/ui/typography";

export function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-8 py-16 space-y-8">
      <TypeH1 className="text-center font-light">
        What is <span className="font-bold">Prism</span>?
      </TypeH1>

      <div className="space-y-4">
        {FAQ_ITEMS.map((item, index) => (
          <FAQItemComponent
            key={index}
            item={item}
            index={index}
            isOpen={openIndex === index}
            onToggle={() => handleToggle(index)}
          />
        ))}
      </div>
    </div>
  );
}
