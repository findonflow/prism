"use client";
/* --------------------------------------------------------------------------------------------- */
import { useRef, useState } from "react";
import { ImageProps } from "next/image";

export function handleIpfs(src: string) {
  return src.startsWith("ipfs")
    ? `https://ipfs.io/ipfs/${src.split("//")[1] ? src.split("//")[1] : src}`
    : src;
}

export function applyVideoAspectRatio(target: EventTarget & HTMLVideoElement) {
  const h = target.videoHeight;
  const w = target.videoWidth;

  const aspect = w / h;
  target.style.aspectRatio = aspect.toString();
}

export type Dimension = "width" | "height" | "none";
export function applyImageAspectRatio(
  target: EventTarget & HTMLImageElement,
  mainDimension: Dimension = "height"
) {
  const h = target.naturalHeight;
  const w = target.naturalWidth;

  const aspect = w / h;

  target.style.aspectRatio = aspect.toString();

  const parent = target.parentElement;
  if (!parent || mainDimension === "none") {
    return;
  }

  if (mainDimension === "height") {
    parent.style.height = target.clientHeight.toString() + "px";
    parent.style.width = (aspect * target.clientHeight).toString() + "px";
  } else {
    parent.style.height = target.clientWidth.toString() + "px";
    parent.style.width = (target.clientWidth / aspect).toString() + "px";
  }
}

/* --------------------------------------------------------------------------------------------- */
interface Props {
  src: string;
  alt: string;
  fallbackOnErrorSrc?: (string | undefined)[];
  dimension?: Dimension;
}
/* --------------------------------------------------------------------------------------------- */
export default function ImageClient(props: Props & ImageProps) {
  const { src, alt, fallbackOnErrorSrc, dimension = "height", ...rest } = props;
  const ref = useRef<HTMLImageElement>(null);
  const [loading, setLoading] = useState(true);

  return (
    <>
      <div className="absolute inset-0 flex h-full w-full items-center justify-center ">
        {loading && (
          <div className=" animate-ping rounded-full border-[5px] border-solid border-blue-400 duration-1000" />
        )}
        <img
          ref={ref}
          loading="lazy"
          onLoad={(e) => {
            // TODO: Add ResizeObserver
            setLoading(false);
            applyImageAspectRatio(e.currentTarget, dimension);
          }}
          onError={(e) => {
            setLoading(true);
            const element = e.target as HTMLImageElement;
            const imageSource = fallbackOnErrorSrc?.shift();
            if (imageSource) element.src = handleIpfs(imageSource);
            else element.src = "/no-image.png";
            setLoading(false);
          }}
          className="imageClass absolute inset-0 h-full w-full"
          style={{ objectFit: "contain" }}
          // objectFit="contain"
          alt={alt}
          src={handleIpfs(src)}
          {...rest}
        />
      </div>
    </>
  );
}
