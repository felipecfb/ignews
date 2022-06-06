import * as Prismic from "@prismicio/client";
import sm from "../../sm.json";

export const endpoint = process.env.PRISMIC_ENDPOINT;
export const repositoryName = Prismic.getRepositoryName(endpoint);
export const acessToken = process.env.PRISMIC_ACESS_TOKEN;

export function linkResolver(doc) {
  switch (doc.type) {
    case "homepage":
      return "/";
    case "page":
      return `/posts/${doc.uid}`;
    default:
      return null;
  }
}

export function createClient() {
  const prismic = Prismic.createClient(endpoint, {
    accessToken: acessToken,
  });

  return prismic;
}
