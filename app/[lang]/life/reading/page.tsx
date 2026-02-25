import { getDictionary } from "@/dictionaries";
import { Metadata } from "next";
import Link from "next/link";
import {
  PrintedSection,
  PrintedDivider,
} from "@/components/printed-elements";

export const runtime = "edge";

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}): Promise<Metadata> {
  const dictionary = await getDictionary(params.lang);

  return {
    metadataBase: new URL(dictionary.meta.baseUrl),
    title: `${dictionary.labels.reading} - ${dictionary.labels.life} - ${dictionary.meta.websiteName}`,
    description: dictionary.labels.reading,
    keywords: dictionary.meta.fillKeywords([]),
    openGraph: {
      type: "website",
      url: new URL(
        `${dictionary.urls.life}/reading`,
        dictionary.meta.baseUrl,
      ).href,
      siteName: dictionary.meta.websiteName,
      title: dictionary.labels.reading,
      description: dictionary.labels.reading,
      images: "/static/banner.png",
    },
    twitter: {
      title: dictionary.labels.reading,
      description: dictionary.labels.reading,
      site: "@noobnooc",
      card: "summary_large_image",
    },
  };
}

export default async function ReadingPage({
  params,
}: {
  params: {
    lang: string;
  };
}) {
  const dictionary = await getDictionary(params.lang);

  return (
    <div>
      {/* Header */}
      <PrintedSection>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-lg">📖</span>
          <h1 className="font-mono text-xl font-bold tracking-tight text-printer-ink dark:text-printer-ink-dark uppercase">
            {dictionary.labels.reading}
          </h1>
        </div>
        <p className="font-mono text-xs text-printer-ink-light dark:text-printer-ink-dark/50">
          {dictionary.archive.reading.length} entries
        </p>
      </PrintedSection>

      <PrintedDivider style="dashed" />

      {/* Reading list */}
      <PrintedSection>
        <div className="flex flex-col">
          {dictionary.archive.reading.map(
            (item: { title: string; summary: string }, index: number) => (
              <div key={item.title}>
                <div className="py-2.5 -mx-2 px-2">
                  <div className="font-mono text-sm text-printer-ink dark:text-printer-ink-dark">
                    {item.title}
                  </div>
                  <p className="font-mono text-[10px] text-printer-ink-light dark:text-printer-ink-dark/40 mt-0.5">
                    {item.summary}
                  </p>
                </div>
                {index < dictionary.archive.reading.length - 1 && (
                  <div className="border-b border-dotted border-printer-ink/5 dark:border-printer-ink-dark/5" />
                )}
              </div>
            ),
          )}
        </div>
      </PrintedSection>

      <PrintedDivider style="dashed" />

      {/* Back link */}
      <PrintedSection>
        <Link
          href={dictionary.urls.life}
          className="inline-flex items-center gap-1.5 font-mono text-xs text-printer-ink-light dark:text-printer-ink-dark/50 hover:text-printer-accent dark:hover:text-printer-accent-dark transition-colors"
        >
          <span>←</span>
          <span className="uppercase tracking-wider">
            {dictionary.labels.life}
          </span>
        </Link>
      </PrintedSection>
    </div>
  );
}
