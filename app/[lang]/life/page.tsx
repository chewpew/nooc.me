import { lifePosts, lifeCategories } from "@/.velite";
import Link from "next/link";
import { displayDate } from "@/lib/date";
import { getDictionary, Language } from "@/dictionaries";
import { Metadata } from "next";
import {
  PrintedSection,
  PrintedLabel,
  PrintedDivider,
} from "@/components/printed-elements";

export const runtime = "edge";

export async function generateMetadata({
  params,
}: {
  params: { lang: Language };
}): Promise<Metadata> {
  const dictionary = await getDictionary(params.lang);

  return {
    metadataBase: new URL(dictionary.meta.baseUrl),
    title: `${dictionary.labels.life} - ${dictionary.meta.websiteName}`,
    description: dictionary.labels.life,
    keywords: dictionary.meta.fillKeywords([]),
    openGraph: {
      type: "website",
      url: new URL(dictionary.urls.life, dictionary.meta.baseUrl).href,
      siteName: dictionary.meta.websiteName,
      title: dictionary.labels.life,
      description: dictionary.labels.life,
      images: "/static/banner.png",
    },
    twitter: {
      title: dictionary.labels.life,
      description: dictionary.labels.life,
      site: "@noobnooc",
      card: "summary_large_image",
    },
  };
}

function getPublishedLifePosts(lang: Language) {
  return lifePosts
    .filter((post) => post.lang === lang)
    .sort(
      (p1, p2) => new Date(p2.date).getTime() - new Date(p1.date).getTime(),
    );
}

export default async function LifePage({
  params,
}: {
  params: {
    lang: Language;
  };
}) {
  const dictionary = await getDictionary(params.lang);
  const allPosts = getPublishedLifePosts(params.lang);

  return (
    <div>
      {/* Header */}
      <PrintedSection>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-lg">✦</span>
          <h1 className="font-mono text-xl font-bold tracking-tight text-printer-ink dark:text-printer-ink-dark uppercase">
            {dictionary.labels.life}
          </h1>
        </div>
        <p className="font-mono text-xs text-printer-ink-light dark:text-printer-ink-dark/50">
          {allPosts.length} entries
        </p>
      </PrintedSection>

      {/* Categories as label strips */}
      <PrintedSection label={dictionary.labels.categories}>
        <div className="flex flex-wrap gap-1.5 mb-2">
          {lifeCategories.map((category) => (
            <Link key={category.slug} href={category.permalink[params.lang]}>
              <PrintedLabel variant="default">
                {category.name[params.lang]}{" "}
                <span className="opacity-50">({category.count[params.lang]})</span>
              </PrintedLabel>
            </Link>
          ))}
        </div>
      </PrintedSection>

      <PrintedDivider style="dashed" />

      {/* Post list */}
      <div className="flex flex-col">
        {allPosts.map((post, index) => (
          <div key={post.slug}>
            <Link href={post.permalink} className="group block">
              <div className="py-3 -mx-2 px-2 rounded-md hover:bg-printer-ink/3 dark:hover:bg-printer-ink-dark/3 transition-colors">
                <div className="font-mono text-[10px] text-printer-ink-light dark:text-printer-ink-dark/40 tabular-nums mb-1">
                  {displayDate(post.date, params.lang)}
                </div>
                <h2 className="font-serif text-base text-printer-ink dark:text-printer-ink-dark group-hover:text-printer-accent dark:group-hover:text-printer-accent-dark transition-colors leading-snug">
                  {post.title}
                </h2>
                {post.description && (
                  <p className="font-mono text-xs text-printer-ink-light dark:text-printer-ink-dark/40 mt-1 line-clamp-2">
                    {post.description}
                  </p>
                )}
              </div>
            </Link>
            {index < allPosts.length - 1 && (
              <div className="border-b border-dotted border-printer-ink/5 dark:border-printer-ink-dark/5" />
            )}
          </div>
        ))}
      </div>

      <PrintedDivider style="dashed" />

      {/* Archive sections - links to subpages */}
      <PrintedSection label={`✦ ${dictionary.labels.recommended}`}>
        <div className="flex flex-wrap gap-2">
          <Link href={`${dictionary.urls.life}/reading`}>
            <PrintedLabel variant="default">
              📖 {dictionary.labels.reading}
            </PrintedLabel>
          </Link>
          <Link href={`${dictionary.urls.life}/films`}>
            <PrintedLabel variant="default">
              🎬 {dictionary.labels.films}
            </PrintedLabel>
          </Link>
          <Link href={`${dictionary.urls.life}/music`}>
            <PrintedLabel variant="default">
              🎵 {dictionary.labels.music}
            </PrintedLabel>
          </Link>
        </div>
      </PrintedSection>
    </div>
  );
}
