import type { Apod } from "@/app/lib/getPicture";
import Image from "next/image";

function isDirectVideoUrl(url: string) {
  return /\.(mp4|webm|mov)(\?|$)/i.test(url);
}

export const Media = (props: Apod) => {
  if (props.media_type === "video") {
    if (isDirectVideoUrl(props.url)) {
      return (
        <video controls preload="metadata" playsInline className="w-full h-full object-cover">
          <source src={props.url} />
        </video>
      );
    }

    return <embed src={props.url} className="w-full h-full object-cover" />;
  }

  return (
    <Image
      fill
      priority
      sizes="(max-width: 768px) 100vw, (max-width: 1440px) 60vw, 880px"
      src={props.url}
      alt={`${props.title} | © · ${props.copyright}`}
      className="object-cover"
    />
  );
};
