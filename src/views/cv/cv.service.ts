import graphqlApi from "@/api/graphqlApi";
import { registerService } from "@/api/registry";
import { unifyFetch } from "@/api/fetcher";
import { GET_MAIN_CV, GET_CONTACT } from "./cv.queries";
import type { CvPage, CvPageQueryData, CvContact, CvContactData } from "./cv.types";

export const CV_MAIN_KEY = "cv.main" as const;
export const CV_CONTACT_KEY = "cv.contact" as const;

// params: currently unused — infrastructure ready for variables (lang, locale, etc.)
async function _fetchMainCv(params?: unknown): Promise<CvPage | null> {
  const data = await graphqlApi.fetch<CvPageQueryData>({
    body: { query: GET_MAIN_CV },
    mock: "cv-page",
    next: { revalidate: 300, tags: ["cv"] },
  });

  return data.cvPages?.[0] ?? null;
}

async function _fetchContact(params?: unknown): Promise<CvContact | null> {
  const data = await graphqlApi.fetch<CvContactData>({
    body: { query: GET_CONTACT },
    mock: "cv-contact",
    next: { revalidate: 300, tags: ["cv"] },
  });

  return data.cvContact ?? null;
}

registerService({ key: CV_MAIN_KEY, driver: "graphql", execute: _fetchMainCv });
registerService({
  key: CV_CONTACT_KEY,
  driver: "graphql",
  execute: _fetchContact,
});

export async function getMainCv(
  params?: Record<string, unknown>,
): Promise<CvPage | null> {
  return unifyFetch<CvPage | null>({ apiKey: CV_MAIN_KEY, params });
}

export async function getContact(
  params?: Record<string, unknown>,
): Promise<CvContact | null> {
  return unifyFetch<CvContact | null>({ apiKey: CV_CONTACT_KEY, params });
}
