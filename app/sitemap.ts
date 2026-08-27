import type { MetadataRoute } from "next";
import { documentationNavigation } from "@/lib/navigation";
import { siteConfig } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["/", ...documentationNavigation.map((item) => item.href).filter((href) => href !== "/playground")];
  return routes.map((route) => ({ url: `${siteConfig.url}${route}`, changeFrequency: route === "/" ? "weekly" : "monthly", priority: route === "/" ? 1 : route === "/quickstart" || route === "/reference" ? 0.9 : 0.7 }));
}
