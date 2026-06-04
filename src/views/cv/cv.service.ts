import graphqlApi from "@/api/graphqlApi";
import { GET_MAIN_CV } from "./cv.queries";
import type { CvPage, CvPageData } from "./cv.types";

export async function getMainCv(): Promise<CvPage | null> {
  const data = await graphqlApi.query<CvPageData>({
    query: GET_MAIN_CV,
    mock: "cv-page",
    next: { revalidate: 300 },
  });

  return data.cvPages?.[0] ?? null;
}
