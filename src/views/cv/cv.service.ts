import graphqlApi from "@/api/graphqlApi";
import { registerService } from "@/api/registry";
import { unifyFetch } from "@/api/fetcher";
import { GET_MAIN_CV } from "./cv.queries";
import type { CvPage, CvPageQueryData } from "./cv.types";

export { getContact } from "@/services/contact/contact.service";

export const CV_MAIN_KEY = "cv.main" as const;

// params: currently unused — infrastructure ready for variables (lang, locale, etc.)
async function _fetchMainCv(): Promise<CvPage | null> {
  const data = await graphqlApi.fetch<CvPageQueryData>({
    body: { query: GET_MAIN_CV },
    mock: "cv-page",
    next: { revalidate: 300, tags: ["cv"] },
  });

  return data.cvPages?.[0] ?? null;
}

registerService({ key: CV_MAIN_KEY, driver: "graphql", execute: _fetchMainCv });

export async function getMainCv(params?: Record<string, unknown>): Promise<CvPage | null> {
  return unifyFetch<CvPage | null>({ apiKey: CV_MAIN_KEY, params });
}
