import { MockView } from "../mocks/mock-all";
import restfulApi from "./restfulApi";

export interface GraphQLError {
  message: string;
  locations?: { line: number; column: number }[];
  path?: string[];
  extensions?: Record<string, unknown>;
}

export interface GraphQLOptions {
  url?: string;
  body: unknown;
  headers?: Record<string, string>;
  selectKey?: string;
  mock?: string;
  next?: { revalidate?: number | false; tags?: string[] };
  cache?: RequestCache;
}

const DEFAULT_URL = process.env.GRAPHQL_URL ?? "http://localhost:5000/graphql";
const GRAPHQL_TOKEN = process.env.GRAPHQL_TOKEN;
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

const graphqlFetch = async <T>(options: GraphQLOptions): Promise<T> => {
  const {
    url = DEFAULT_URL,
    body,
    headers = {},
    selectKey,
    mock,
    next,
    cache,
  } = options;

  const authToken = GRAPHQL_TOKEN ?? STRAPI_API_TOKEN;
  const authHeaders: Record<string, string> = authToken
    ? { Authorization: `Bearer ${authToken}` }
    : {};

  let json: { data?: Record<string, unknown>; errors?: GraphQLError[] };
  try {
    json = await restfulApi.fetch<typeof json>({
      url,
      method: "POST",
      body,
      headers: { ...authHeaders, ...headers },
      next,
      cache,
    });
  } catch (err) {
    if (mock) {
      const data = MockView[mock];
      if (data !== undefined) return data as T;
    }
    throw err;
  }

  if (json.data != null && !json.errors?.length) {
    const result = selectKey ? json.data[selectKey] : json.data;
    if (result != null && !(Array.isArray(result) && result.length === 0))
      return result as T;
  }

  if (json.errors?.length && !mock) {
    throw new Error(
      `GraphQL errors: ${json.errors.map((e) => e.message).join("; ")}`,
    );
  }

  if (mock) {
    const data = MockView[mock];
    if (data !== undefined) return data as T;
  }

  throw new Error(`GraphQL request failed for: ${url}`);
};

const graphqlApi = { fetch: graphqlFetch };
export default graphqlApi;
