import { lifePosts, lifeCategories } from "@/lib/velite";
import Link from "next/link";
import { displayDate } from "@/lib/date";
import { getDictionary, Language } from "@/dictionaries";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  PrintedSection,
  PrintedLabel,
  PrintedDivider,
} from "@/components/printed-elements";

export const runtime = "edge";

export async function generateMetadata({
  params,
}: {
  params: { lang: Language; categorySlug: string };
}): Promise<Metadata> {
  const dictionary = await getDictionary(params.lang);
  const category = lifeCategories.find(
    (category) => category.slug === params.categorySlug,
  );

  if (!category) {
    notFound();
  }

  return {
    metadataBase: new URL(dictionary.meta.baseUrl),
    title: `${category.name[params.lang]} - ${dictionary.labels.life} - ${dictionary.meta.websiteName}`,
    description: category.description?.[params.lang],
    keywords: dictionary.meta.fillKeywords([]),
    openGraph: {
      type: "website",
      url: new URL(category.permalink[params.lang], dictionary.meta.baseUrl).href,
      siteName: dictionary.meta.websiteName,
      title: category.name[params.lang],
      description: category.description?.[params.lang],
      images: "/static/banner.png",
    },
    twitter: {
      title: category.name[params.lang],
      description: category.description?.[params.lang],
      site: "@noobnooc",
      card: "summary_large_image",
    },
  };
}

function getPostsByCategory(categorySlug: string, lang: Language) {
  return lifePosts
    .filter(
      (post) => post.categories.includes(categorySlug) && post.lang === lang,
    )
    .sort(
      (p1, p2) => new Date(p2.date).getTime() - new Date(p1.date).getTime(),
    );
}

export default async function LifeCategoryPage({
  params,
}: {
  params: {
    lang: Language;
    categorySlug: string;
  };
}) {
  const dictionary = await getDictionary(params.lang);
  const category = lifeCategories.find(
    (category) => category.slug === params.categorySlug,
  );

  if (!category) {
    notFound();
  }

  const posts = getPostsByCategory(category.slug, params.lang);

  return (
    <div>
      {/* Header */}
      <PrintedSection>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-lg">✦</span>
          <h1 className="font-mono text-xl font-bold tracking-tight text-printer-ink dark:text-printer-ink-dark uppercase">
            {category.name[params.lang]}
          </h1>
        </div>
        <p className="font-mono text-xs text-printer-ink-light dark:text-printer-ink-dark/50">
          {category.description?.[params.lang]}
        </p>
        <p className="font-mono text-[10px] text-printer-ink-light dark:text-printer-ink-dark/40 mt-1">
          {posts.length} entries
        </p>
      </PrintedSection>

      {/* Back to all life posts */}
      <div className="mb-4">
        <Link
          href={dictionary.urls.life}
          className="inline-flex items-center gap-1 font-mono text-[11px] tracking-wider text-printer-accent dark:text-printer-accent-dark hover:underline"
        >
          ← ALL LIFE POSTS
        </Link>
      </div>

      <PrintedDivider style="dashed" />

      {/* Post list */}
      <div className="flex flex-col">
        {posts.map((post, index) => (
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
            {index < posts.length - 1 && (
              <div className="border-b border-dotted border-printer-ink/5 dark:border-printer-ink-dark/5" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
