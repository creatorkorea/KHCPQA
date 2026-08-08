"use client";

/* eslint-disable @next/next/no-img-element */

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import type { PublishedBanner } from "@/lib/public-content";

export function HomePopup({ banner }: { banner?: PublishedBanner }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!banner?.imageUrl) {
      return;
    }

    const storageKey = `khcpqa-home-popup:${banner.title}:${banner.startsAt || ""}:${banner.endsAt || ""}`;
    const dismissed = window.sessionStorage.getItem(storageKey);

    if (!dismissed) {
      setIsVisible(true);
    }
  }, [banner]);

  if (!banner?.imageUrl || !isVisible) {
    return null;
  }

  const storageKey = `khcpqa-home-popup:${banner.title}:${banner.startsAt || ""}:${banner.endsAt || ""}`;

  function closePopup() {
    window.sessionStorage.setItem(storageKey, "dismissed");
    setIsVisible(false);
  }

  const popupImage = (
    <img
      alt={banner.title}
      className="home-popup-image"
      src={banner.imageUrl}
    />
  );

  return (
    <div className="home-popup-backdrop" role="presentation">
      <aside aria-label={banner.title} className="home-popup" role="dialog">
        <button aria-label="팝업 닫기" className="home-popup-close" onClick={closePopup} type="button">
          <X size={18} />
        </button>
        {banner.targetUrl ? (
          <a className="home-popup-link" href={banner.targetUrl}>
            {popupImage}
          </a>
        ) : (
          popupImage
        )}
      </aside>
    </div>
  );
}
