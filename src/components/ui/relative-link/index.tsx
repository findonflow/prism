"use client";
/*--------------------------------------------------------------------------------------------------------------------*/
import Link from "next/link";
import { usePathname } from "next/navigation";

/*--------------------------------------------------------------------------------------------------------------------*/
export default function RelativeLink(props: {
  to: string;
  children: React.ReactNode;
}) {
  const { to, children } = props;
  const pathname = usePathname();

  return (
    <Link href={`${pathname}/${to}`} className={"underline"}>
      {children}
    </Link>
  );
}
