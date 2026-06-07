import graphqlApi from "@/api/graphqlApi";
import { registerService } from "@/api/registry";
import { unifyFetch } from "@/api/fetcher";
import { GET_CONTACT } from "./contact.queries";
import type { Contact, ContactData } from "./contact.types";

export const CONTACT_KEY = "contact" as const;

async function _fetchContact(): Promise<Contact | null> {
  const data = await graphqlApi.fetch<ContactData>({
    body: { query: GET_CONTACT },
    mock: "cv-contact",
    next: { revalidate: 300, tags: ["contact"] },
  });

  return data.cvContact ?? null;
}

registerService({ key: CONTACT_KEY, driver: "graphql", execute: _fetchContact });

export async function getContact(params?: Record<string, unknown>): Promise<Contact | null> {
  return unifyFetch<Contact | null>({ apiKey: CONTACT_KEY, params });
}
