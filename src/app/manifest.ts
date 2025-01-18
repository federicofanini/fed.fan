import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "fed.fan",
    short_name: "fed.fan",
    description:
      "Redefines personal branding. It’s where the builders of tomorrow turn connections into collaborations and admirers into advocates. This isn’t just another profile—it’s your story, and the world is watching.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#000000",
    icons: [
      {
        src: "/icons/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
