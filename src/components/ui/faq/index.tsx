"use client";
/*--------------------------------------------------------------------------------------------------------------------*/
import { useState } from "react";
import { FAQ_ITEMS } from "./strings";
import { FAQItemComponent } from "./faq-item";
import { TypeH1 } from "@/components/ui/typography";
import Link from "next/link";

/*--------------------------------------------------------------------------------------------------------------------*/
export function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="w-full space-y-8 min-h-screen">
      <Link href={"#welcome-to-prism"} className={"text-prism-primary underline mb-6"} scroll={true}>
        Select Network
      </Link>

      <TypeH1 className="text-center font-light scroll-mt-32" id={"what-is-prism"}>
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
