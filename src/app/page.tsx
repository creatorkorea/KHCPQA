import { redirect } from "next/navigation";

function getSearchParamValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function RootPage({
  searchParams
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const code = getSearchParamValue(params?.code);

  if (code) {
    const callbackParams = new URLSearchParams();

    Object.entries(params || {}).forEach(([key, value]) => {
      const normalizedValue = getSearchParamValue(value);

      if (normalizedValue) {
        callbackParams.set(key, normalizedValue);
      }
    });

    if (!callbackParams.has("next")) {
      callbackParams.set("next", "/ko/account/security");
    }

    redirect(`/auth/callback?${callbackParams.toString()}`);
  }

  redirect("/ko");
}
