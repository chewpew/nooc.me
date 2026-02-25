import "../../styles/globals.css";

import { Metadata } from "next";
import { getDictionary } from "../../dictionaries";
import { getAlternateLanguages } from "@/lib/metadata";
import Script from "next/script";
import PrinterShell from "../../components/printer-shell";

export const runtime = "edge";

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}): Promise<Metadata> {
  const dictionary = await getDictionary(params.lang);

  return {
    metadataBase: new URL(dictionary.meta.baseUrl),
    title: dictionary.meta.websiteName,
    description: dictionary.meta.motto,
    keywords: dictionary.meta.fillKeywords([]),
    openGraph: {
      type: "website",
      url: new URL(dictionary.urls.home, dictionary.meta.baseUrl).href,
      title: dictionary.meta.websiteName,
      description: dictionary.meta.motto,
      siteName: dictionary.meta.websiteName,
      images: "/static/banner.png",
    },
    twitter: {
      title: dictionary.meta.websiteName,
      description: dictionary.meta.motto,
      site: "@noobnooc",
      card: "summary_large_image",
      images: "/static/banner.png",
    },
    alternates: {
      languages: await getAlternateLanguages(
        (dictionary) => dictionary.urls.home,
      ),
    },
  };
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: {
    lang: string;
  };
}) {
  const dictionary = await getDictionary(params.lang);

  const printerShellProps = {
    labels: {
      home: dictionary.labels.home,
      posts: dictionary.labels.posts,
      life: dictionary.labels.life,
      works: dictionary.labels.works,
      about: dictionary.labels.about,
      brandName: dictionary.labels.brandName,
      brandTagline: dictionary.labels.brandTagline,
    },
    urls: {
      home: dictionary.urls.home,
      posts: dictionary.urls.posts,
      life: dictionary.urls.life,
      works: dictionary.urls.works,
      about: dictionary.urls.about,
    },
  };

  return (
    <html lang={params.lang}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var mode = localStorage.getItem('color-mode');
                  var dark = mode === 'dark' || (!mode || mode === 'system') && window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (dark) document.documentElement.classList.add('dark');
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body>
        <PrinterShell dictionary={printerShellProps} lang={params.lang}>
          {children}
        </PrinterShell>
      </body>
      <Script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3512386112816826"
        strategy="lazyOnload"
        crossOrigin="anonymous"
      ></Script>
    </html>
  );
}
