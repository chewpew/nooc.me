import { lifePosts, lifeCategories } from "@/lib/velite";
import { displayDate } from "@/lib/date";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getDictionary, Language, languageLabels } from "@/dictionaries";
import { SiX } from "@icons-pack/react-simple-icons";
import { Metadata } from "next";
import classNames from "classnames";
import {
  PrintedSection,
  PrintedLabel,
  PrintedDivider,
} from "@/components/printed-elements";
import { QRCodeSVG } from "qrcode.react";

export const runtime = "edge";

export async function generateMetadata({
  params,
}: {
  params: { lang: Language; slug: string };
}): Promise<Metadata> {
  const { slug } = params;
  const dictionary = await getDictionary(params.lang);

  const post = lifePosts.find(
    (post) => post.slug === slug && post.lang === params.lang,
  );

  if (!post) {
    notFound();
  }

  return {
    metadataBase: new URL(dictionary.meta.baseUrl),
    title: post.title,
    description: post.description,
    keywords: dictionary.meta.fillKeywords(post.keywords),
    openGraph: {
      type: "article",
      url: new URL(post.permalink, dictionary.meta.baseUrl).href,
      siteName: dictionary.meta.websiteName,
      title: post.title,
      description: post.description,
      images: post.cover?.src ?? "/static/banner.png",
    },
    twitter: {
      title: post.title,
      description: post.description,
      site: "@noobnooc",
      card: "summary_large_image",
      images: post.cover?.src ?? "/static/banner.png",
    },
  };
}

export default async function LifePostPage({
  params,
}: {
  params: {
    lang: Language;
    slug: string;
  };
}) {
  const { slug } = params;

  const dictionary = await getDictionary(params.lang);

  const post = lifePosts.find(
    (post) => post.slug === slug && post.lang === params.lang,
  );

  const otherLanguages = lifePosts.filter(
    (post) => post.slug === slug && post.lang !== params.lang,
  );

  if (!post) {
    notFound();
  }

  return (
    <div>
      {/* Post header */}
      <PrintedSection>
        <div className="flex flex-wrap gap-1.5 mb-3">
          {post.categories.map((cat) => {
            const category = lifeCategories.find((c) => c.slug === cat);
            return (
              <Link
                key={cat}
                href={`/${params.lang}/life/categories/${cat}`}
              >
                <PrintedLabel variant="accent">
                  {category ? category.name[params.lang] : cat}
                </PrintedLabel>
              </Link>
            );
          })}
        </div>
        <h1 className="font-serif text-2xl font-bold text-printer-ink dark:text-printer-ink-dark mt-3 leading-tight">
          {post.title}
        </h1>
        <div className="flex items-center gap-3 mt-2 flex-wrap">
          <span className="font-mono text-[10px] text-printer-ink-light dark:text-printer-ink-dark/40 tabular-nums">
            {displayDate(post.date, params.lang)}
          </span>
          {otherLanguages.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] text-printer-ink-light dark:text-printer-ink-dark/40">
                |
              </span>
              {otherLanguages.map((p) => (
                <Link
                  key={p.lang}
                  className="font-mono text-[10px] text-printer-accent dark:text-printer-accent-dark hover:underline"
                  href={p.permalink}
                >
                  {languageLabels[p.lang]}
                </Link>
              ))}
            </div>
          )}
        </div>
        {post.description && (
          <p className="font-mono text-xs text-printer-ink-light dark:text-printer-ink-dark/50 mt-2 leading-relaxed">
            {post.description}
          </p>
        )}
      </PrintedSection>

      <PrintedDivider style="solid" />

      {/* Post content */}
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
          "prose-pre:border prose-pre:border-printer-ink/10 dark:prose-pre:border-printer-ink-dark/10 prose-pre:rounded-lg prose-pre:bg-printer-ink/3 dark:prose-pre:bg-printer-ink-dark/5",
          "prose-code:text-printer-accent dark:prose-code:text-printer-accent-dark",
          "prose-img:rounded-lg prose-img:border prose-img:border-printer-ink/10",
          "before:prose-p:content-none after:prose-p:content-none",
        )}
        dangerouslySetInnerHTML={{ __html: post.content }}
      ></div>

      {/* WeChat QR Code */}
      {post.wechatLink && (
        <>
          <PrintedDivider style="dashed" />
          <div className="flex items-center gap-4 py-1">
            <div className="shrink-0">
              <QRCodeSVG
                value={post.wechatLink}
                size={80}
                level="M"
                bgColor="#ffffff"
                fgColor="#2C2824"
              />
            </div>
            <div>
              <p className="font-mono text-[11px] text-printer-ink dark:text-printer-ink-dark">
                WeChat
              </p>
              <p className="font-mono text-[10px] text-printer-ink-light dark:text-printer-ink-dark/40 mt-0.5">
                {params.lang === "zh" ? "微信扫码阅读原文" : "Scan to read on WeChat"}
              </p>
            </div>
          </div>
        </>
      )}

      <PrintedDivider style="dashed" />

      {/* Footer actions */}
      <div className="flex items-center gap-4">
        <span className="font-mono text-[10px] text-printer-ink-light dark:text-printer-ink-dark/40 uppercase tracking-wider">
          {dictionary.labels.shareTo}
        </span>
        <a
          href={dictionary.urls.shareToX(post.title, post.permalink)}
          target="_blank"
          className="text-printer-ink-light dark:text-printer-ink-dark/40 hover:text-printer-ink dark:hover:text-printer-ink-dark transition-colors"
        >
          <SiX className="w-4 h-4" />
        </a>
      </div>

      <div className="mt-6">
        <Link
          href={dictionary.urls.life}
          className="inline-flex items-center gap-1 font-mono text-[11px] tracking-wider text-printer-accent dark:text-printer-accent-dark hover:underline"
        >
          ← BACK TO LIFE
        </Link>
      </div>
    </div>
  );
}
