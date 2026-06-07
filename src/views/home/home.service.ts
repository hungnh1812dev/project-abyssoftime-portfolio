import graphqlApi from "@/api/graphqlApi";
import { registerService } from "@/api/registry";
import { unifyFetch } from "@/api/fetcher";
import { getContact } from "@/services/contact/contact.service";
import { GET_HOME_PAGE } from "./home.queries";
import type { HomePageData, HomePageQueryData, HomeData } from "./home.types";

export const HOME_PAGE_KEY = "home.page" as const;

async function _fetchHomePage(): Promise<HomePageData | null> {
  const data = await graphqlApi.fetch<HomePageQueryData>({
    body: { query: GET_HOME_PAGE },
    mock: "home-page",
    next: { revalidate: 300, tags: ["home"] },
  });

  return data.homePage ?? null;
}

registerService({ key: HOME_PAGE_KEY, driver: "graphql", execute: _fetchHomePage });

export async function getHomeData(): Promise<HomeData | null> {
  const [page, contact] = await Promise.all([
    unifyFetch<HomePageData | null>({ apiKey: HOME_PAGE_KEY }),
    getContact(),
  ]);

  if (!page || !contact) return null;
  return { page, contact };
}
