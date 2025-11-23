"use client";
/*--------------------------------------------------------------------------------------------------------------------*/
import { applyVideoAspectRatio, handleIpfs } from "@/lib/url";
import { cn } from "@/lib/utils";

/*--------------------------------------------------------------------------------------------------------------------*/
export default function VideoPlayer(props: { src: string | undefined }) {
  const { src } = props;

  if (!src) {
    return null;
  }

  return (
    <video
      onLoadedData={(event) => {
        applyVideoAspectRatio(event.currentTarget);
      }}
      className={cn("aspect-video w-full")}
      controls
      preload={"always"}
      autoPlay={false}
      key={src}
    >
      <source src={handleIpfs(src || "")} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
}
