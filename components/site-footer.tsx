import Link from "next/link";
import { siteConfig } from "@/lib/site";
import { Logo } from "./logo";
import { ThemeToggle } from "./theme-toggle";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-inner container">
        <Logo />
        <div className="footer-meta">
          <span>Datos públicos de la CMF, publicados por BuscaFondos.</span>
          <Link href={siteConfig.repositoryUrl}>Backend en GitHub</Link>
          <ThemeToggle />
        </div>
      </div>
    </footer>
  );
}
