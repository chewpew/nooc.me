import { getDictionary, Language } from "@/dictionaries";
import { Metadata } from "next";
import classNames from "classnames";
import {
  PrintedSection,
  PrintedDivider,
} from "@/components/printed-elements";

export const runtime = "edge";

export async function generateMetadata({
  params,
}: {
  params: { lang: Language };
}): Promise<Metadata> {
  const dictionary = await getDictionary(params.lang);
  const subtitle = dictionary.labels.aboutSubtitle.trim();
  const description = subtitle || dictionary.labels.aboutTitle;

  return {
    metadataBase: new URL(dictionary.meta.baseUrl),
    title: `${dictionary.labels.aboutTitle} - ${dictionary.meta.websiteName}`,
    description,
    keywords: dictionary.meta.fillKeywords([]),
    openGraph: {
      type: "website",
      url: new URL(dictionary.urls.about, dictionary.meta.baseUrl).href,
      siteName: dictionary.meta.websiteName,
      title: dictionary.labels.aboutTitle,
      description,
      images: "/static/banner.png",
    },
    twitter: {
      title: dictionary.labels.aboutTitle,
      description,
      site: "@noobnooc",
      card: "summary_large_image",
    },
  };
}

export default async function AboutPage({
  params,
}: {
  params: {
    lang: Language;
  };
}) {
  const dictionary = await getDictionary(params.lang);
  const subtitle = dictionary.labels.aboutSubtitle.trim();

  // Convert markdown-like content to simple HTML
  const aboutHtml = dictionary.aboutContent
    .replace(/### (.+)/g, "<h3>$1</h3>")
    .replace(/## (.+)/g, "<h2>$1</h2>")
    .replace(/# (.+)/g, "<h1>$1</h1>")
    .replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener">$1</a>',
    )
    .replace(/\n\n/g, "</p><p>")
    .replace(/^/, "<p>")
    .replace(/$/, "</p>")
    .replace(/<p><h([123])>/g, "<h$1>")
    .replace(/<\/h([123])><\/p>/g, "</h$1>")
    .replace(/<p><\/p>/g, "");

  return (
    <div>
      {/* Header */}
      <PrintedSection>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-lg">◉</span>
          <h1 className="font-mono text-xl font-bold tracking-tight text-printer-ink dark:text-printer-ink-dark uppercase">
            {dictionary.labels.aboutTitle}
          </h1>
        </div>
        {subtitle && (
          <p className="font-mono text-xs text-printer-ink-light dark:text-printer-ink-dark/50">
            {subtitle}
          </p>
        )}
      </PrintedSection>

      <PrintedDivider style="solid" />

      {/* About content */}
      <div
        className={classNames(
          "prose dark:prose-invert max-w-none",
          "prose-headings:font-serif prose-headings:text-printer-ink dark:prose-headings:text-printer-ink-dark prose-headings:mt-8",
          "prose-h1:text-2xl",
          "prose-h2:text-xl",
          "prose-h3:text-lg",
          "prose-p:text-printer-ink/80 dark:prose-p:text-printer-ink-dark/80 prose-p:leading-relaxed",
          "prose-a:text-printer-accent dark:prose-a:text-printer-accent-dark prose-a:no-underline hover:prose-a:underline",
          "prose-blockquote:font-normal prose-blockquote:border-printer-ink/20 dark:prose-blockquote:border-printer-ink-dark/20",
        )}
        dangerouslySetInnerHTML={{ __html: aboutHtml }}
      ></div>

      <PrintedDivider style="dashed" />

      {/* Footer */}
      <div className="font-mono text-[9px] text-printer-ink-light dark:text-printer-ink-dark/30 tracking-wider uppercase text-center py-4">
        {params.lang === "zh" ? "就酱～" : "That's about it~"}
      </div>
    </div>
  );
}
