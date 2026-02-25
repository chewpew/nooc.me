import { MetadataRoute } from "next";
import { dictionaryKeys, getDictionary } from "../dictionaries";
import { posts, lifePosts } from "@/.velite";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const dictionaries = await Promise.all(dictionaryKeys.map(getDictionary));

  const basicUrls = dictionaries.map((dictionary) => {
    return [
      {
        url: new URL(dictionary.urls.home, dictionary.meta.baseUrl).href,
        lastModified: new Date(),
        changeFrequency: "daily" as const,
        priority: 1,
      },
      {
        url: new URL(dictionary.urls.posts, dictionary.meta.baseUrl).href,
        lastModified: new Date(),
        changeFrequency: "daily" as const,
        priority: 1,
      },
      {
        url: new URL(dictionary.urls.life, dictionary.meta.baseUrl).href,
        lastModified: new Date(),
        changeFrequency: "daily" as const,
        priority: 1,
      },
      {
        url: new URL(dictionary.urls.works, dictionary.meta.baseUrl).href,
        lastModified: new Date(),
        changeFrequency: "daily" as const,
        priority: 0.8,
      },
      {
        url: new URL(dictionary.urls.about, dictionary.meta.baseUrl).href,
        lastModified: new Date(),
        changeFrequency: "daily" as const,
        priority: 0.8,
      },
      {
        url: new URL(`${dictionary.urls.life}/reading`, dictionary.meta.baseUrl).href,
        lastModified: new Date(),
        changeFrequency: "daily" as const,
        priority: 0.6,
      },
      {
        url: new URL(`${dictionary.urls.life}/films`, dictionary.meta.baseUrl).href,
        lastModified: new Date(),
        changeFrequency: "daily" as const,
        priority: 0.6,
      },
      {
        url: new URL(`${dictionary.urls.life}/music`, dictionary.meta.baseUrl).href,
        lastModified: new Date(),
        changeFrequency: "daily" as const,
        priority: 0.6,
      },
    ];
  });

  const postUrls = posts.map((post) => {
    return {
      url: new URL(post.permalink, dictionaries[0].meta.baseUrl).href,
      lastModified: post.updated || post.date,
      changeFrequency: "daily" as const,
      priority: 1,
    };
  });

  const lifePostUrls = lifePosts.map((post) => {
    return {
      url: new URL(post.permalink, dictionaries[0].meta.baseUrl).href,
      lastModified: post.updated || post.date,
      changeFrequency: "daily" as const,
      priority: 0.9,
    };
  });

  return [...basicUrls.flat(), ...postUrls, ...lifePostUrls];
}
