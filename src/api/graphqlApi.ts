import { MockView } from "../mocks/mock-all";

export interface GraphQLError {
  message: string;
  locations?: { line: number; column: number }[];
  path?: string[];
  extensions?: Record<string, unknown>;
}

type NextFetchOptions = {
  next?: { revalidate?: number | false; tags?: string[] };
  cache?: RequestCache;
};

export interface GraphQLQueryOptions extends NextFetchOptions {
  query: string;
  variables?: Record<string, unknown>;
  // Key in response.data to extract — e.g. "cvPage" → response.data.cvPage
  // If omitted, returns response.data as-is
  dataKey?: string;
  mock?: string;
  url?: string;
}

const DEFAULT_URL = process.env.GRAPHQL_URL ?? "http://localhost:5000/graphql";
const GRAPHQL_TOKEN = process.env.GRAPHQL_TOKEN;
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

const graphqlQuery = async <T>(options: GraphQLQueryOptions): Promise<T> => {
  const {
    query,
    variables,
    mock,
    dataKey,
    url = DEFAULT_URL,
    next,
    cache,
  } = options;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  const authToken = GRAPHQL_TOKEN ?? STRAPI_API_TOKEN;
  if (authToken) headers["Authorization"] = `Bearer ${authToken}`;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify({ query, variables }),
      ...(next && { next }),
      ...(cache && { cache }),
    });

    if (res.ok) {
      const json: { data?: Record<string, unknown>; errors?: GraphQLError[] } =
        await res.json();
      if (json.data && !json.errors?.length) {
        const result = dataKey ? json.data[dataKey] : json.data;
        if (result != null && !(Array.isArray(result) && result.length === 0))
          return result as T;
      }

      if (json.errors?.length && !mock) {
        const messages = json.errors.map((e) => e.message).join("; ");
        throw new Error(`GraphQL errors: ${messages}`);
      }
    }
  } catch (err) {
    if (!mock) throw err;
    // Network / parse error — fall through to mock
  }

  if (mock) {
    const data = MockView[mock];
    if (data !== undefined) return data as T;
  }

  throw new Error(`GraphQL request failed for: ${url}`);
};

const graphqlApi = { query: graphqlQuery };
export default graphqlApi;
