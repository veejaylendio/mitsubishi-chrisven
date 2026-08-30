"use client";

import { useEffect, useRef, useState } from "react";

type LazyImageProps = {
  src: string;
  alt: string;
  /** Sizing/positioning classes for the wrapping container (e.g. "h-56 w-full"). */
  wrapperClassName?: string;
  /** Classes for the <img> itself. Defaults to a fill + object-cover treatment. */
  imgClassName?: string;
  /**
   * Skip native lazy-loading so the browser fetches immediately. Needed for
   * anything visible without scrolling, including carousel items that start
   * pre-scrolled past their initial DOM position — native lazy-load's
   * intersection check runs against the pre-scroll layout and can miss
   * images that end up actually on screen.
   */
  eager?: boolean;
  /**
   * True LCP-element treatment (e.g. the hero image): skip the skeleton +
   * fade-in, since an opacity transition on the LCP element pushes back the
   * browser's reported paint time, and hint fetchPriority high. Implies eager.
   */
  lcp?: boolean;
};

export default function LazyImage({
  src,
  alt,
  wrapperClassName,
  imgClassName = "h-full w-full object-cover",
  eager = false,
  lcp = false,
}: LazyImageProps) {
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // The browser starts loading <img src> as soon as it parses the HTML,
  // independent of React — by the time hydration attaches onLoad/onError
  // below, a fast (e.g. cached or local) image may have already finished,
  // so that event never reaches us. Catch that already-settled state here.
  useEffect(() => {
    if (imgRef.current?.complete) {
      setLoaded(true);
    }
  }, []);

  if (lcp) {
    return (
      <div className={`overflow-hidden bg-gray-200 ${wrapperClassName ?? ""}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} loading="eager" fetchPriority="high" className={imgClassName} />
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden bg-gray-200 ${wrapperClassName ?? ""}`}>
      {!loaded && <div className="absolute inset-0 animate-pulse bg-gray-200" />}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        loading={eager ? "eager" : "lazy"}
        fetchPriority="auto"
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(true)}
        className={`${imgClassName} transition-opacity duration-300 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
}
