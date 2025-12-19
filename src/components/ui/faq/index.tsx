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
    <div className="min-h-screen w-full space-y-8">
      <div className={"flex flex-col gap-3"}>
        <Link
          href={"#welcome-to-prism"}
          className={"text-prism-primary underline"}
          scroll={true}
        >
          Select Network
        </Link>

        <TypeH1
          className="scroll-mt-32 text-center font-light"
          id={"what-is-prism"}
        >
          What is <span className="font-bold">Prism</span>?
        </TypeH1>
      </div>

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
