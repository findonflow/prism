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
  mainDimension: Dimension = "height",
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
