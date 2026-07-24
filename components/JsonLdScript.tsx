import { getCmsJsonLd } from "@/lib/cms-fetch";

export default async function JsonLdScript({ path }: { path: string }) {
  const schema = await getCmsJsonLd(path);
  if (!schema) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema),
      }}
    />
  );
}
