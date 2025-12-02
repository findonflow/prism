"use client";
/*--------------------------------------------------------------------------------------------------------------------*/
import { useState } from "react";
import { createPortal } from "react-dom";
import ImageClient from "@/components/flowscan/ImageClient";
import { Dimension } from "@/lib/url";

/*--------------------------------------------------------------------------------------------------------------------*/
export default function TokenImage(props: {
  src: string;
  alt: string;
  dimension?: Dimension;
}) {
  const { src, alt, dimension, ...rest } = props;
  const [expanded, setExpanded] = useState(false);
  return (
    <>
      <div
        onClick={() => setExpanded(true)}
        className="relative h-full w-full cursor-zoom-in"
      >
        <ImageClient src={src} alt={alt} dimension={dimension} {...rest} />
      </div>
      {expanded &&
        createPortal(
          <div
            onClick={(e) => {
              e.stopPropagation();
              setExpanded(false);
            }}
            className="fixed top-0 left-0 z-100 flex h-screen w-screen cursor-zoom-out flex-col items-center justify-center bg-[rgba(0,0,0,0.5)] p-8"
          >
            <div className="relative aspect-square w-[50%]">
              <ImageClient src={src} alt={alt} />
            </div>
          </div>,
          document?.body,
        )}
    </>
  );
}
