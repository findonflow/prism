import type { ReactNode } from "react";
/*--------------------------------------------------------------------------------------------------------------------*/

export function LayoutPage(props: { children: ReactNode }) {
  const { children } = props;
  return (
    <div className="w-full flex flex-col items-center justify-between min-h-screen p-6">
      {children}
    </div>
  );
}
