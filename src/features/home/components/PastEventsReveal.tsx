"use client";

import { useState } from "react";
import styles from "@/styles/Events.module.css";

interface PastEventsRevealProps {
  totalCount: number;
}

const PAGE_SIZE = 3;

export const PastEventsReveal = ({ totalCount }: PastEventsRevealProps) => {
  const [remainingCount, setRemainingCount] = useState(
    Math.max(totalCount - PAGE_SIZE, 0),
  );

  const revealNext = () => {
    const items = Array.from(
      document.querySelectorAll<HTMLElement>("[data-past-event][hidden]"),
    ).slice(0, PAGE_SIZE);

    items.forEach((item) => {
      const deferredImage = item.querySelector<HTMLImageElement>("img[data-src]");
      const src = deferredImage?.dataset.src;

      if (deferredImage && src) {
        deferredImage.src = src;
        deferredImage.removeAttribute("data-src");
      }

      item.hidden = false;
    });

    items[0]?.scrollIntoView({ behavior: "smooth", block: "start" });
    setRemainingCount((current) => Math.max(current - items.length, 0));
  };

  if (remainingCount <= 0) return null;

  return (
    <div className={styles.seeMoreWrap} style={{ display: "flex" }}>
      <button
        className={styles.seeMore}
        onClick={revealNext}
      >
        See More
      </button>
    </div>
  );
};
