/* --------------------------------------------------------------------------------------------- */
import { usePathname, useRouter, useSearchParams } from "next/navigation";
/* --------------------------------------------------------------------------------------------- */
type QueryParam = { [key: string]: any };
type GetParamResult = string | undefined;
interface SetQueryParamsOptions {
  scroll?: boolean;
  push?: boolean;
  clear?: boolean;
}
/* --------------------------------------------------------------------------------------------- */
const DEFAULT_OPTIONS = {
  scroll: false,
  push: false,
  clear: false,
};
/* --------------------------------------------------------------------------------------------- */
export default function useQueryParams() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  function makeUpdateUrl(
    updatedParams: QueryParam,
    clear: boolean = false
  ): string {
    const initValue = clear ? "" : searchParams?.toString() || "";
    const params = new URLSearchParams(initValue);

    // Go through updated params and add values to search params, remove if anything is empty
    Object.keys(updatedParams).forEach((key) => {
      let value = updatedParams[key];
      if (!value) {
        params.delete(key);
      } else {
        value = typeof value === "boolean" ? "1" : value.toString();
        params.set(key, value);
      }
    });

    return pathname + "?" + params.toString();
  }

  function setQueryParams(
    updatedParams: QueryParam,
    options: SetQueryParamsOptions = DEFAULT_OPTIONS
  ) {
    const { scroll, push, clear } = options;

    const updateRoute = push ? router.push : router.replace;
    const newUrl = makeUpdateUrl(updatedParams, clear);

    // Commit changes to url
    updateRoute(newUrl, { scroll });
  }

  function getQueryParams(keys: Array<string>): Array<GetParamResult> {
    return keys.map((key) => {
      return searchParams?.get(key) || undefined;
    });
  }

  return { setQueryParams, getQueryParams, makeUpdateUrl };
}
