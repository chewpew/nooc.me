import { ImageResponse } from "next/og";

export const OG_IMAGE_SIZE = {
  width: 1200,
  height: 630,
};

export const OG_IMAGE_CONTENT_TYPE = "image/png";

export interface OgImageOptions {
  title: string;
  description?: string;
  category?: string;
  date?: string;
  type?: "post" | "life" | "page";
  emoji?: string;
  subtitle?: string;
  brandName?: string;
  brandTagline?: string;
}

const AVATAR_SRC =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjU2IiBoZWlnaHQ9IjI1NiIgdmlld0JveD0iMCAwIDI1NiAyNTYiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgY2xpcC1wYXRoPSJ1cmwoI2NsaXAwXzExXzcpIj48cmVjdCB3aWR0aD0iMjU2IiBoZWlnaHQ9IjI1NiIgZmlsbD0iIzJDMkMzMiIvPjxnIGZpbHRlcj0idXJsKCNmaWx0ZXIwX2ZfMTFfNykiPjxwYXRoIGQ9Ik0xMjggNjhDMTYxLjEzNyA2OCAxODggOTQuODYyOSAxODggMTI4QzE4OCAxNDQuNjc4IDE4MS4xOTQgMTU5Ljc2NiAxNzAuMjA5IDE3MC42NDFMMTI3LjU2OCAxMjhMODUuMzU4NCAxNzAuMjA5Qzc0LjYyNzQgMTU5LjM2OSA2OCAxNDQuNDU5IDY4IDEyOEM2OCA5NC44NjI5IDk0Ljg2MjkgNjggMTI4IDY4WiIgZmlsbD0iI0ZCOTIzQyIgZmlsbC1vcGFjaXR5PSIwLjYiLz48L2c+PGcgZmlsdGVyPSJ1cmwoI2ZpbHRlcjFfZF8xMV83KSI+PHBhdGggZD0iTTEyOCA2OEMxNjEuMTM3IDY4IDE4OCA5NC44NjI5IDE4OCAxMjhDMTg4IDE0NC42NzggMTgxLjE5NCAxNTkuNzY2IDE3MC4yMDkgMTcwLjY0MUwxMjcuNTY4IDEyOEw4NS4zNTg0IDE3MC4yMDlDNzQuNjI3NCAxNTkuMzY5IDY4IDE0NC40NTkgNjggMTI4QzY4IDk0Ljg2MjkgOTQuODYyOSA2OCAxMjggNjhaIiBmaWxsPSIjRkI5MjNDIi8+PC9nPjxyZWN0IHg9IjEyNy41NjkiIHk9IjEyOCIgd2lkdGg9IjE4Mi4wMzIiIGhlaWdodD0iMTgxLjQyMSIgdHJhbnNmb3JtPSJyb3RhdGUoNDUgMTI3LjU2OSAxMjgpIiBmaWxsPSIjMkMyQzMyIi8+PC9nPjxkZWZzPjxmaWx0ZXIgaWQ9ImZpbHRlcjBfZl8xMV83IiB4PSIxOCIgeT0iMTgiIHdpZHRoPSIyMjAiIGhlaWdodD0iMjAyLjY0MSIgZmlsdGVyVW5pdHM9InVzZXJTcGFjZU9uVXNlIiBjb2xvci1pbnRlcnBvbGF0aW9uLWZpbHRlcnM9InNSR0IiPjxmZUZsb29kIGZsb29kLW9wYWNpdHk9IjAiIHJlc3VsdD0iQmFja2dyb3VuZEltYWdlRml4Ii8+PGZlQmxlbmQgbW9kZT0ibm9ybWFsIiBpbj0iU291cmNlR3JhcGhpYyIgaW4yPSJCYWNrZ3JvdW5kSW1hZ2VGaXgiIHJlc3VsdD0ic2hhcGUiLz48ZmVHYXVzc2lhbkJsdXIgc3RkRGV2aWF0aW9uPSIyNSIgcmVzdWx0PSJlZmZlY3QxX2ZvcmVncm91bmRCbHVyXzExXzciLz48L2ZpbHRlcj48ZmlsdGVyIGlkPSJmaWx0ZXIxX2RfMTFfNyIgeD0iNDgiIHk9IjQ4IiB3aWR0aD0iMTYwIiBoZWlnaHQ9IjE0Mi42NDEiIGZpbHRlclVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgY29sb3ItaW50ZXJwb2xhdGlvbi1maWx0ZXJzPSJzUkdCIj48ZmVGbG9vZCBmbG9vZC1vcGFjaXR5PSIwIiByZXN1bHQ9IkJhY2tncm91bmRJbWFnZUZpeCIvPjxmZUNvbG9yTWF0cml4IGluPSJTb3VyY2VBbHBoYSIgdHlwZT0ibWF0cml4IiB2YWx1ZXM9IjAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDEyNyAwIiByZXN1bHQ9ImhhcmRBbHBoYSIvPjxmZU9mZnNldC8+PGZlR2F1c3NpYW5CbHVyIHN0ZERldmlhdGlvbj0iMTAiLz48ZmVDb21wb3NpdGUgaW4yPSJoYXJkQWxwaGEiIG9wZXJhdG9yPSJvdXQiLz48ZmVDb2xvck1hdHJpeCB0eXBlPSJtYXRyaXgiIHZhbHVlcz0iMCAwIDAgMCAwLjk4NDMxNCAwIDAgMCAwIDAuNTcyNTQ5IDAgMCAwIDAgMC4yMzUyOTQgMCAwIDAgMC42IDAiLz48ZmVCbGVuZCBtb2RlPSJub3JtYWwiIGluMj0iQmFja2dyb3VuZEltYWdlRml4IiByZXN1bHQ9ImVmZmVjdDFfZHJvcFNoYWRvd18xMV83Ii8+PGZlQmxlbmQgbW9kZT0ibm9ybWFsIiBpbj0iU291cmNlR3JhcGhpYyIgaW4yPSJlZmZlY3QxX2Ryb3BTaGFkb3dfMTFfNyIgcmVzdWx0PSJzaGFwZSIvPjwvZmlsdGVyPjxjbGlwUGF0aCBpZD0iY2xpcDBfMTFfNyI+PHJlY3Qgd2lkdGg9IjI1NiIgaGVpZ2h0PSIyNTYiIGZpbGw9IndoaXRlIi8+PC9jbGlwUGF0aD48L2RlZnM+PC9zdmc+";

const ACCENT = "#FF6B35";
const PAPER = "#FFFEF9";
const INK = "#2C2824";
const INK_LIGHT = "#8A8078";
const INK_BORDER = "#2C282426";

async function loadFont(): Promise<ArrayBuffer | undefined> {
  try {
    const fontData = await fetch(
      new URL(
        "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap",
      ),
    ).then((res) => res.text());

    const fontUrl = fontData.match(
      /src:\s*url\(([^)]+)\)\s*format\('woff2'\)/,
    )?.[1];

    if (fontUrl) {
      return await fetch(fontUrl).then((res) => res.arrayBuffer());
    }
  } catch {
    // Font loading failed — fall back to system fonts
  }
  return undefined;
}

function BrandingFooter({
  large,
  brandName,
  brandTagline,
}: {
  large?: boolean;
  brandName?: string;
  brandTagline?: string;
}) {
  const avatarSize = large ? 48 : 44;
  const nameSize = large ? 18 : 16;
  const taglineSize = large ? 14 : 13;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderTop: `1px dashed ${INK_BORDER}`,
        paddingTop: "20px",
        width: "100%",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "14px",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={AVATAR_SRC}
          alt={brandName || "Nooc"}
          width={avatarSize}
          height={avatarSize}
          style={{
            borderRadius: "50%",
          }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              fontSize: `${nameSize}px`,
              fontWeight: 700,
              color: INK,
              letterSpacing: "0.05em",
              display: "flex",
            }}
          >
            {brandName || "NOOC"}
          </div>
          <div
            style={{
              fontSize: `${taglineSize}px`,
              color: INK_LIGHT,
              display: "flex",
            }}
          >
            nooc.me
          </div>
        </div>
      </div>

      <div
        style={{
          fontSize: `${taglineSize}px`,
          color: INK_LIGHT,
          letterSpacing: "0.05em",
          display: "flex",
        }}
      >
        {brandTagline || "Nooc the Noob"}
      </div>
    </div>
  );
}

function DotPattern() {
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: "flex",
        flexWrap: "wrap",
        opacity: 0.06,
      }}
    >
      {Array.from({ length: 30 }).map((_, row) =>
        Array.from({ length: 30 }).map((_, col) => (
          <div
            key={`${row}-${col}`}
            style={{
              width: "40px",
              height: "21px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: "2px",
                height: "2px",
                borderRadius: "50%",
                backgroundColor: INK,
                display: "flex",
              }}
            />
          </div>
        )),
      )}
    </div>
  );
}

function ArticleLayout({
  title,
  description,
  category,
  date,
  type,
  brandName,
  brandTagline,
}: OgImageOptions) {
  const typeLabel = type === "life" ? "LIFE" : type === "post" ? "TECH" : "";

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "48px 64px 40px",
      }}
    >
      {/* Top section: category + type badge */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}
      >
        {typeLabel && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "4px 12px",
              backgroundColor: ACCENT,
              color: PAPER,
              fontSize: "14px",
              fontWeight: 700,
              letterSpacing: "0.1em",
              borderRadius: "2px",
            }}
          >
            {typeLabel}
          </div>
        )}
        {category && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "4px 12px",
              border: `1px solid ${INK_BORDER}`,
              color: INK_LIGHT,
              fontSize: "14px",
              fontWeight: 400,
              letterSpacing: "0.05em",
              borderRadius: "2px",
            }}
          >
            {category}
          </div>
        )}
        {date && (
          <div
            style={{
              display: "flex",
              color: INK_LIGHT,
              fontSize: "14px",
              fontWeight: 400,
              letterSpacing: "0.02em",
            }}
          >
            {date}
          </div>
        )}
      </div>

      {/* Middle: Title + Description */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          flex: 1,
          justifyContent: "center",
          maxWidth: "1000px",
        }}
      >
        <div
          style={{
            fontSize: title.length > 40 ? "42px" : "52px",
            fontWeight: 700,
            color: INK,
            lineHeight: 1.2,
            letterSpacing: "-0.01em",
            display: "flex",
          }}
        >
          {title}
        </div>
        {description && (
          <div
            style={{
              fontSize: "20px",
              color: INK_LIGHT,
              lineHeight: 1.5,
              display: "flex",
            }}
          >
            {description.length > 120
              ? description.slice(0, 120) + "..."
              : description}
          </div>
        )}
      </div>

      {/* Bottom: branding */}
      <BrandingFooter brandName={brandName} brandTagline={brandTagline} />
    </div>
  );
}

function PageLayout({
  title,
  description,
  emoji,
  subtitle,
  brandName,
  brandTagline,
}: OgImageOptions) {
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "48px 64px 40px",
        gap: "0",
      }}
    >
      {/* Top spacer for centering content */}
      <div style={{ display: "flex", flex: 1 }} />

      {/* Center: Avatar + Emoji + Title + Subtitle */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "20px",
        }}
      >
        {/* Avatar */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={AVATAR_SRC}
          alt="Nooc"
          width={88}
          height={88}
          style={{
            borderRadius: "50%",
            border: `3px solid ${ACCENT}`,
          }}
        />

        {/* Emoji */}
        {emoji && (
          <div
            style={{
              fontSize: "56px",
              display: "flex",
              lineHeight: 1,
            }}
          >
            {emoji}
          </div>
        )}

        {/* Title */}
        <div
          style={{
            fontSize: title.length > 30 ? "44px" : "56px",
            fontWeight: 700,
            color: INK,
            lineHeight: 1.2,
            letterSpacing: "-0.01em",
            display: "flex",
            textAlign: "center",
          }}
        >
          {title}
        </div>

        {/* Subtitle or description */}
        {(subtitle || description) && (
          <div
            style={{
              fontSize: "22px",
              color: INK_LIGHT,
              lineHeight: 1.5,
              display: "flex",
              textAlign: "center",
              maxWidth: "800px",
            }}
          >
            {subtitle || description}
          </div>
        )}
      </div>

      {/* Bottom spacer + branding */}
      <div
        style={{
          display: "flex",
          flex: 1,
          width: "100%",
          alignItems: "flex-end",
        }}
      >
        <div style={{ display: "flex", width: "100%" }}>
          <BrandingFooter large brandName={brandName} brandTagline={brandTagline} />
        </div>
      </div>
    </div>
  );
}

export async function generateOgImage(
  options: OgImageOptions,
): Promise<ImageResponse> {
  const fontBuffer = await loadFont();
  const { type = "post" } = options;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: PAPER,
          fontFamily: '"JetBrains Mono", monospace',
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Subtle dot pattern */}
        <DotPattern />

        {/* Top accent bar */}
        <div
          style={{
            width: "100%",
            height: "6px",
            backgroundColor: ACCENT,
            display: "flex",
          }}
        />

        {/* Content */}
        {type === "page" ? (
          <PageLayout {...options} />
        ) : (
          <ArticleLayout {...options} />
        )}
      </div>
    ),
    {
      ...OG_IMAGE_SIZE,
      ...(fontBuffer
        ? {
            fonts: [
              {
                name: "JetBrains Mono",
                data: fontBuffer,
                weight: 400,
                style: "normal" as const,
              },
            ],
          }
        : {}),
    },
  );
}
