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
          <a href={`mailto:${siteConfig.supportEmail}`}>{siteConfig.supportEmail}</a>
          <ThemeToggle />
        </div>
      </div>
    </footer>
  );
}
