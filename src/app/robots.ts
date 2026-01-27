import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://fixora-services.vercel.app";

  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/customer"],
      disallow: ["/admin/", "/provider/", "/api/", "/restricted/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
