import graphqlApi from "@/api/graphqlApi";
import { unifyFetch } from "@/api/fetcher";
import { registerService } from "@/api/registry";

import { GET_HEADER_NAV } from "./header.queries";
import type { HeaderNav, HeaderNavData } from "./header.types";

export const HEADER_NAV_KEY = "header-nav" as const;

async function _fetchHeaderNav(): Promise<HeaderNav | null> {
  const data = await graphqlApi.fetch<HeaderNavData>({
    body: { query: GET_HEADER_NAV },
    mock: "header-nav",
    next: { revalidate: 600, tags: ["header-nav"] },
  });

  return data.headerNav ?? null;
}

registerService({
  key: HEADER_NAV_KEY,
  driver: "graphql",
  execute: _fetchHeaderNav,
});

export async function getHeaderNav(params?: Record<string, unknown>): Promise<HeaderNav | null> {
  return unifyFetch<HeaderNav | null>({ apiKey: HEADER_NAV_KEY, params });
}
