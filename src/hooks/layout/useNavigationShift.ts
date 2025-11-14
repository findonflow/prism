"use client";
/*--------------------------------------------------------------------------------------------------------------------*/
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/*--------------------------------------------------------------------------------------------------------------------*/
export default function useNavigationShift(
  callback: (pathname: string) => void,
) {
  const pathname = usePathname();
  const oldPathName = useRef(pathname);

  useEffect(() => {
    if (oldPathName.current !== pathname) {
      oldPathName.current = pathname;
      callback(pathname);
    }
  }, [pathname]);
}
