"use client";
/*--------------------------------------------------------------------------------------------------------------------*/
import QueryProvider from "@/fetch/provider";
import { ReactNode } from "react";

/*--------------------------------------------------------------------------------------------------------------------*/
export default function MainContent(props: { children: ReactNode }) {
  const { children } = props;

  return <QueryProvider>{children}</QueryProvider>;
}
