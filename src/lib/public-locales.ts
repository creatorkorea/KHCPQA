export type PublicContentLookup = {
  kind: "activity" | "course" | "page";
  slug: string;
};

export function classifyLocalizedPath(pathname: string): PublicContentLookup {
  const segments = pathname.split("?")[0].split("/").filter(Boolean).slice(1).map(decodeURIComponent);

  if (segments[0] === "curriculum" && segments[1]) {
    return { kind: "course", slug: segments[1] };
  }
  if (segments[0] === "activities" && segments[2]) {
    return { kind: "activity", slug: segments[2] };
  }
  return { kind: "page", slug: segments.join("/") || "home" };
}
