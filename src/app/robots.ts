import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL || "https://HomHelpers-services.vercel.app";

  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/customer/", "/provider/"],
      disallow: ["/admin/", "/api/", "/restricted/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
