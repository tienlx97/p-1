"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { cx } from "@/shared/lib/styles";

export function LoadableImage({ alt, className = "", src, ...props }) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(false);
  }, [src]);

  return (
    <>
      {isLoaded ? null : <span className={cx("image-load-skeleton")} aria-hidden="true" />}
      <Image
        {...props}
        className={cx(className, "loadable-image", isLoaded && "is-loaded")}
        src={src}
        alt={alt}
        onLoad={() => setIsLoaded(true)}
        onError={() => setIsLoaded(true)}
      />
    </>
  );
}
