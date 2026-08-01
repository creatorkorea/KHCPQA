"use client";

import Image from "next/image";

export function BrandLogoMark({
  className,
  priority = false
}: {
  className?: string;
  priority?: boolean;
}) {
  return (
    <span className={["brand-logo-mark", className].filter(Boolean).join(" ")} aria-hidden="true">
      <Image
        alt=""
        fill
        priority={priority}
        sizes="64px"
        src="/assets/brand/khcpqa-logo-mark.png"
      />
    </span>
  );
}
