import graphqlApi from "@/api/graphqlApi";
import { registerService } from "@/api/registry";
import { unifyFetch } from "@/api/fetcher";
import { GET_COMMON_TEXT } from "./common-text.queries";
import type { CommonText, CommonTextData } from "./common-text.types";

export const COMMON_TEXT_KEY = "common-text" as const;

async function _fetchCommonText(params?: unknown): Promise<CommonText | null> {
  const data = await graphqlApi.fetch<CommonTextData>({
    body: { query: GET_COMMON_TEXT },
    mock: "common-text",
    next: { revalidate: 600, tags: ["common-text"] },
  });

  return data.commonText ?? null;
}

registerService({
  key: COMMON_TEXT_KEY,
  driver: "graphql",
  execute: _fetchCommonText,
});

export async function getCommonText(
  params?: Record<string, unknown>,
): Promise<CommonText | null> {
  return unifyFetch<CommonText | null>({ apiKey: COMMON_TEXT_KEY, params });
}
