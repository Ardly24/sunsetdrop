
import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "SunsetDrop",
    short_name: "SunsetDrop",
    description: "Your favourite food. Better prices.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#FFF9F0",
    theme_color: "#173D32",
    orientation: "portrait",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
