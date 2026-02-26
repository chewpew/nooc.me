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
  showTitleAvatar?: boolean;
}

const COLORS = {
  body: "#F5F0E8",
  paper: "#FFFEF9",
  ink: "#2C2824",
  inkLight: "#8A8078",
  accent: "#FF6B35",
  border: "rgba(44, 40, 36, 0.1)",
  shadow: "rgba(0, 0, 0, 0.06)",
  tape: "#F0EDE6",
};

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

function AvatarSVG({ size, circle }: { size: number; circle?: boolean }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 256 256"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        borderRadius: circle ? "50%" : "12px",
        border: `1px solid ${COLORS.border}`,
        boxShadow: `0 4px 12px ${COLORS.shadow}`,
        overflow: "hidden",
      }}
    >
      <rect width="256" height="256" fill="#2C2C32" />
      <path
        d="M128 68C161.137 68 188 94.8629 188 128C188 144.678 181.194 159.766 170.209 170.641L127.568 128L85.3584 170.209C74.6274 159.369 68 144.459 68 128C68 94.8629 94.8629 68 128 68Z"
        fill="#FB923C"
      />
      <rect
        x="127.569"
        y="128"
        width="182.032"
        height="181.421"
        transform="rotate(45 127.569 128)"
        fill="#2C2C32"
      />
    </svg>
  );
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
  const avatarSize = large ? 56 : 48;
  const nameSize = large ? 20 : 18;
  const taglineSize = large ? 16 : 14;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderTop: `1px dashed ${COLORS.border}`,
        paddingTop: "24px",
        width: "100%",
        marginTop: "auto",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
        }}
      >
        <AvatarSVG size={avatarSize} />
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
              color: COLORS.ink,
              letterSpacing: "0.05em",
              display: "flex",
            }}
          >
            {brandName || "NOOC"}
          </div>
          <div
            style={{
              fontSize: `${taglineSize}px`,
              color: COLORS.inkLight,
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
          color: COLORS.inkLight,
          letterSpacing: "0.05em",
          display: "flex",
          opacity: 0.8,
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
        opacity: 0.04,
        display: "flex",
        backgroundImage: `radial-gradient(circle at center, ${COLORS.ink} 1px, transparent 1px)`,
        backgroundSize: "30px 30px",
      }}
    />
  );
}

function ArticleLayout(options: OgImageOptions) {
  const { title, description, category, date, type, brandName, brandTagline } = options;
  const typeLabel = type === "life" ? "LIFE" : type === "post" ? "TECH" : "";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        flex: 1,
        padding: "50px 60px",
      }}
    >
      {/* Meta tags row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          marginBottom: "32px",
        }}
      >
        {typeLabel && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "6px 14px",
              backgroundColor: COLORS.accent,
              color: COLORS.paper,
              fontSize: "16px",
              fontWeight: 700,
              letterSpacing: "0.1em",
              borderRadius: "4px",
              boxShadow: `0 4px 10px rgba(255, 107, 53, 0.2)`,
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
              padding: "6px 14px",
              border: `1px solid ${COLORS.border}`,
              color: COLORS.inkLight,
              fontSize: "16px",
              fontWeight: 400,
              letterSpacing: "0.05em",
              borderRadius: "4px",
              backgroundColor: "rgba(0,0,0,0.02)",
            }}
          >
            {category}
          </div>
        )}
        {date && (
          <div
            style={{
              display: "flex",
              color: COLORS.inkLight,
              fontSize: "16px",
              fontWeight: 400,
              marginLeft: "8px",
            }}
          >
            {date}
          </div>
        )}
      </div>

      {/* Main Content */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "24px",
          maxWidth: "900px",
        }}
      >
        <div
          style={{
            fontSize: title.length > 30 ? "64px" : "72px",
            fontWeight: 700,
            color: COLORS.ink,
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            display: "flex",
          }}
        >
          {title}
        </div>
        {description && (
          <div
            style={{
              fontSize: "26px",
              color: COLORS.inkLight,
              lineHeight: 1.4,
              display: "flex",
              marginTop: "8px",
            }}
          >
            {description.length > 140
              ? description.slice(0, 140) + "..."
              : description}
          </div>
        )}
      </div>

      <BrandingFooter brandName={brandName} brandTagline={brandTagline} />
    </div>
  );
}

function PageLayout(options: OgImageOptions) {
  const {
    title,
    description,
    emoji,
    subtitle,
    brandName,
    brandTagline,
    showTitleAvatar,
  } = options;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
        padding: "50px 60px",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "32px",
          flex: 1,
          justifyContent: "center",
        }}
      >
        {showTitleAvatar && (
          <div
            style={{
              display: "flex",
              filter: "drop-shadow(0 10px 20px rgba(0,0,0,0.1))",
            }}
          >
            <AvatarSVG size={120} circle />
          </div>
        )}

        {emoji && (
          <div
            style={{
              fontSize: "100px",
              display: "flex",
              lineHeight: 1,
              filter: "drop-shadow(0 10px 20px rgba(0,0,0,0.1))",
            }}
          >
            {emoji}
          </div>
        )}

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <div
            style={{
              fontSize: showTitleAvatar
                ? title.length > 20
                  ? "52px"
                  : "64px"
                : title.length > 20
                  ? "64px"
                  : "80px",
              fontWeight: 700,
              color: COLORS.ink,
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              display: "flex",
              textAlign: "center",
            }}
          >
            {title}
          </div>

          {(subtitle || description) && (
            <div
              style={{
                fontSize: "28px",
                color: COLORS.inkLight,
                lineHeight: 1.4,
                display: "flex",
                textAlign: "center",
                maxWidth: "800px",
              }}
            >
              {subtitle || description}
            </div>
          )}
        </div>
      </div>

      <BrandingFooter large brandName={brandName} brandTagline={brandTagline} />
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
          backgroundColor: COLORS.body,
          padding: "40px",
          position: "relative",
          fontFamily: '"JetBrains Mono", monospace',
        }}
      >
        {/* The Paper Card */}
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            backgroundColor: COLORS.paper,
            borderRadius: "32px",
            boxShadow: `0 20px 50px ${COLORS.shadow}, 0 4px 12px rgba(0,0,0,0.04)`,
            border: `1px solid ${COLORS.border}`,
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Subtle dot pattern inside the paper */}
          <DotPattern />

          {/* Top accent bar */}
          <div
            style={{
              width: "100%",
              height: "8px",
              backgroundColor: COLORS.accent,
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
              {
                name: "JetBrains Mono",
                data: fontBuffer,
                weight: 700,
                style: "normal" as const,
              },
            ],
          }
        : {}),
    },
  );
}
