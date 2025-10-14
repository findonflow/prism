import { useEffect, useMemo, useRef, useState } from "react";

/*--------------------------------------------------------------------------------------------------------------------*/
export function useExpandEffect(options: { id?: string; eventName?: string }) {
  const { id, eventName } = options;

  const [show, setShow] = useState<boolean>(false);
  const ref = useRef<HTMLDivElement>(null);

  const customEventName = eventName || "row-expand";

  // Interaction
  const collapse = useMemo(() => {
    return (e?: any) => {
      if (e.detail.id !== id) {
        setShow(false);
      }
    };
  }, []);
  const expand = useMemo(() => {
    return () => {
      setShow(!show);
      document.dispatchEvent(
        new CustomEvent(customEventName, {
          detail: {
            id,
          },
        }),
      );
    };
  }, [show]);

  useEffect(() => {
    document.addEventListener(customEventName, collapse);
    return () => {
      document.removeEventListener(customEventName, collapse);
    };
  }, []);

  return { show, expand, ref };
}
