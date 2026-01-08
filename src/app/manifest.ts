import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Fixora - Home Service Management",
    short_name: "Fixora",
    description: "Book trusted home service professionals.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#000000",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
      {
        src: "/HSM-logo.png",
        sizes: "192x192",
        type: "image/png",
      },
    ],
  };
}
