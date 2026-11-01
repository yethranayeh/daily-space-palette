import type { Picture } from "@/app/lib/getPicture";

import Image from "next/image";

// ? A video we cannot play still has a poster, so that poster links out to NASA
function Poster({ picture, linkOut }: { picture: Picture; linkOut: boolean }) {
  return (
    <>
      <Image
        fill
        preload
        sizes="(max-width: 768px) 100vw, (max-width: 1440px) 60vw, 880px"
        src={picture.imageUrl}
        alt={picture.alt}
        className="object-cover"
      />
      {linkOut && (
        <a
          href={picture.permalink}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Open ${picture.title} on NASA`}
          className="absolute inset-0"
        />
      )}
    </>
  );
}

export const Media = ({ picture }: { picture: Picture }) => {
  if (picture.videoUrl) {
    return (
      <video controls preload="metadata" playsInline className="w-full h-full object-cover">
        <source src={picture.videoUrl} />
      </video>
    );
  }

  if (picture.embedUrl) {
    return (
      <iframe
        src={picture.embedUrl}
        title={picture.title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
        allowFullScreen
        className="w-full h-full border-0"
      />
    );
  }

  if (!picture.imageUrl) {
    return null;
  }

  return <Poster picture={picture} linkOut={picture.mediaType === "video"} />;
};
