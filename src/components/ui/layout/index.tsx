import type { ReactNode } from "react";
/*--------------------------------------------------------------------------------------------------------------------*/

export function LayoutPage(props: { children: ReactNode }) {
  const { children } = props;
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-between p-6">
      {children}
    </div>
  );
}
