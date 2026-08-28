"use client";

import { useLayoutEffect, useRef } from "react";
import VehicleCard from "./VehicleCard";
import type { VehicleGroup } from "@/lib/types";

export default function VehicleCarousel({ groups }: { groups: VehicleGroup[] }) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  // Render 3 copies so there's always a buffer of cards to scroll into on
  // either side; scrolling into a buffer copy silently re-centers the
  // viewport into the middle copy, creating the illusion of an endless loop.
  const loopedGroups = [...groups, ...groups, ...groups];

  useLayoutEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller || groups.length === 0) return;

    const singleSetWidth = scroller.scrollWidth / 3;
    scroller.scrollLeft = singleSetWidth;

    // Scroll-snap resolves the resting position to the container's padding
    // rather than exactly 0/max, so the edge check needs a buffer wider than
    // that padding instead of comparing against exact 0/max.
    const EDGE_BUFFER = 48;

    const handleScroll = () => {
      const maxScrollLeft = scroller.scrollWidth - scroller.clientWidth;
      if (scroller.scrollLeft <= EDGE_BUFFER) {
        scroller.scrollLeft += singleSetWidth;
      } else if (scroller.scrollLeft >= maxScrollLeft - EDGE_BUFFER) {
        scroller.scrollLeft -= singleSetWidth;
      }
    };

    scroller.addEventListener("scroll", handleScroll, { passive: true });
    return () => scroller.removeEventListener("scroll", handleScroll);
  }, [groups.length]);

  return (
    <div
      ref={scrollerRef}
      className="scrollbar-hide flex snap-x snap-mandatory gap-6 overflow-x-auto px-6 py-3"
    >
      {loopedGroups.map((group, i) => (
        <div
          key={`${group.name}-${i}`}
          className="h-[520px] w-80 shrink-0 snap-start sm:w-[368px]"
        >
          {/*
            Every copy loads eagerly, not just the one visible on mount: the
            loop-reset in handleScroll above snaps scrollLeft programmatically
            whenever a buffer copy is scrolled into view, and native
            loading="lazy" doesn't reliably re-trigger for images whose
            container just got jumped to rather than smoothly scrolled to.
          */}
          <VehicleCard vehicle={group} eager />
        </div>
      ))}
    </div>
  );
}
