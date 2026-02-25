import { getDictionary } from "@/dictionaries";
import {
  generateOgImage,
  OG_IMAGE_SIZE,
  OG_IMAGE_CONTENT_TYPE,
} from "@/lib/og-image";

export const runtime = "edge";

export const alt = "Nooc the Noob";
export const size = OG_IMAGE_SIZE;
export const contentType = OG_IMAGE_CONTENT_TYPE;

export default async function Image({
  params,
}: {
  params: { lang: string };
}) {
  const dictionary = await getDictionary(params.lang);
  return generateOgImage({
    title: dictionary.meta.websiteName,
    description: dictionary.meta.motto,
    type: "page",
    brandName: dictionary.labels.brandName,
    brandTagline: dictionary.labels.brandTagline,
  });
}
