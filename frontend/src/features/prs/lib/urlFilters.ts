/**
 * Helpers to sync PR filters + pagination with the URL query string.
 */
export interface PrUrlState {
  repo?: string;
  state?: string;
  author?: string;
  q?: string;
  page?: number;
  pageSize?: number;
}

const PARAMS: (keyof PrUrlState)[] = [
  "repo",
  "state",
  "author",
  "q",
  "page",
  "pageSize",
];

export function readPrUrlState(loc: Location = window.location): PrUrlState {
  const sp = new URLSearchParams(loc.search);
  const state: PrUrlState = {};
  PARAMS.forEach((k) => {
    const v = sp.get(k);
    if (v !== null && v !== "") {
      if (k === "page" || k === "pageSize") state[k] = Number(v);
      else state[k] = v as any;
    }
  });
  return state;
}

export function writePrUrlState(next: PrUrlState, replace = false) {
  const sp = new URLSearchParams();
  PARAMS.forEach((k) => {
    const v = next[k];
    if (v !== undefined && v !== null && v !== "") sp.set(k, String(v));
  });
  const url = `${window.location.pathname}?${sp.toString()}`;
  if (replace) window.history.replaceState(null, "", url);
  else window.history.pushState(null, "", url);
}
