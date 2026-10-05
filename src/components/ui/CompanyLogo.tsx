import { useEffect, useState } from "react";

interface CompanyLogoProps {
  mark: string;
  color: string;
  size?: "sm" | "md" | "lg";
  imageUrl?: string;
}

export default function CompanyLogo({
  mark,
  color,
  size = "md",
  imageUrl,
}: CompanyLogoProps) {
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    setImageFailed(false);
  }, [imageUrl]);

  const sizeClasses =
    size === "lg"
      ? "h-14 w-14 text-xl"
      : size === "sm"
        ? "h-10 w-10 text-sm"
        : "h-12 w-12 text-lg";

  return (
    <div
      className={`${sizeClasses} relative grid shrink-0 place-items-center overflow-hidden rounded-xl font-black text-white shadow-sm`}
      style={{ backgroundColor: color }}
      aria-hidden="true"
    >
      <span>{mark}</span>
      {imageUrl && !imageFailed && (
        <img
          src={imageUrl}
          alt=""
          className="absolute inset-0 h-full w-full bg-white object-contain"
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={() => setImageFailed(true)}
        />
      )}
    </div>
  );
}
