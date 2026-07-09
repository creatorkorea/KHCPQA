import Link from "next/link";
import { getCopy, type Locale } from "@/lib/content";

type AboutSubnavProps = {
  locale: Locale;
  activeKey: string;
};

export function AboutSubnav({ locale, activeKey }: AboutSubnavProps) {
  const items = getCopy(locale).aboutSubnav;

  return (
    <nav className="about-subnav" aria-label="About section navigation">
      {items.map((item) => {
        const isActive = item.key === activeKey;

        if (("disabled" in item && item.disabled) || !item.href) {
          return (
            <span className="is-disabled" aria-disabled="true" key={item.key}>
              {item.title}
            </span>
          );
        }

        return (
          <Link className={isActive ? "is-active" : undefined} href={`/${locale}/${item.href}`} key={item.key}>
            {item.title}
          </Link>
        );
      })}
    </nav>
  );
}
