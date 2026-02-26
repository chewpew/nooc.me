import classNames from "classnames";

interface PostContentProps {
  html: string;
}

export function PostContent({ html }: PostContentProps) {
  return (
    <div
      className={classNames(
        "prose dark:prose-invert mx-auto max-w-[70ch] font-serif",
        "prose-base sm:prose-lg",
        "prose-headings:font-serif prose-headings:text-printer-ink dark:prose-headings:text-printer-ink-dark",
        "prose-headings:tracking-tight prose-headings:scroll-mt-24",
        "prose-h1:text-2xl sm:prose-h1:text-3xl prose-h1:mb-4",
        "prose-h2:text-xl sm:prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-4",
        "prose-h3:text-lg sm:prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3",
        "prose-p:my-5 prose-p:text-printer-ink/85 dark:prose-p:text-printer-ink-dark/85 prose-p:leading-8",
        "prose-a:text-printer-accent dark:prose-a:text-printer-accent-dark prose-a:underline prose-a:underline-offset-4",
        "prose-a:decoration-printer-accent/40 dark:prose-a:decoration-printer-accent-dark/40 hover:prose-a:decoration-current",
        "prose-strong:text-printer-ink dark:prose-strong:text-printer-ink-dark",
        "prose-ul:my-5 prose-ol:my-5 prose-li:my-1.5 prose-li:leading-7 prose-li:text-printer-ink/80 dark:prose-li:text-printer-ink-dark/80",
        "prose-blockquote:font-normal prose-blockquote:border-l-2 prose-blockquote:border-printer-ink/20 dark:prose-blockquote:border-printer-ink-dark/20",
        "prose-blockquote:text-printer-ink/75 dark:prose-blockquote:text-printer-ink-dark/75 prose-blockquote:py-1",
        "prose-pre:border prose-pre:border-printer-ink/10 dark:prose-pre:border-printer-ink-dark/10",
        "prose-pre:rounded-lg prose-pre:bg-printer-ink/3 dark:prose-pre:bg-printer-ink-dark/5 prose-pre:px-4 prose-pre:py-3",
        "prose-code:text-printer-accent dark:prose-code:text-printer-accent-dark prose-code:before:content-none prose-code:after:content-none",
        "prose-code:bg-printer-ink/5 dark:prose-code:bg-printer-ink-dark/10 prose-code:px-1 prose-code:py-0.5 prose-code:rounded",
        "prose-img:my-6 prose-img:rounded-lg prose-img:border prose-img:border-printer-ink/10",
        "prose-hr:border-printer-ink/10 dark:prose-hr:border-printer-ink-dark/10",
        "before:prose-p:content-none after:prose-p:content-none",
      )}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
