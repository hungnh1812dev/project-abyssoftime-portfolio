import graphqlApi from "@/api/graphqlApi";
import { GET_MAIN_CV, GET_CONTACT } from "./cv.queries";
import type { CvPage, CvPageQueryData, CvContact, CvContactData } from "./cv.types";

export async function getMainCv(): Promise<CvPage | null> {
  const data = await graphqlApi.query<CvPageQueryData>({
    query: GET_MAIN_CV,
    mock: "cv-page",
    next: { revalidate: 300, tags: ["cv"] },
  });

  return data.cvPages?.[0] ?? null;
}

export async function getContact(): Promise<CvContact | null> {
  const data = await graphqlApi.query<CvContactData>({
    query: GET_CONTACT,
    mock: "cv-contact",
    next: { revalidate: 300, tags: ["cv"] },
  });

  return data.cvContact ?? null;
}
