import graphqlApi from "@/api/graphqlApi";
import { GET_COMMON_TEXT } from "./common-text.queries";
import type { CommonText, CommonTextData } from "./common-text.types";

export async function getCommonText(): Promise<CommonText | null> {
  const data = await graphqlApi.query<CommonTextData>({
    query: GET_COMMON_TEXT,
    mock: "common-text",
    next: { revalidate: 600, tags: ["common-text"] },
  });

  return data.commonText ?? null;
}
