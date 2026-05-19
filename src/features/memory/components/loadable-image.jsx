"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { cx } from "@/shared/lib/cx";
import styles from "./loadable-image.module.css";

export function LoadableImage({ alt, className = "", src, ...props }) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(false);
  }, [src]);

  return (
    <>
      {isLoaded ? null : <span className={styles.skeleton} aria-hidden="true" />}
      <Image
        {...props}
        className={cx(className, styles.image, isLoaded && styles.isLoaded)}
        src={src}
        alt={alt}
        onLoad={() => setIsLoaded(true)}
        onError={() => setIsLoaded(true)}
      />
    </>
  );
}
