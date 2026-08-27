import Link from "next/link";
import { siteConfig } from "@/lib/site";
import { ExternalIcon, KeyIcon } from "./icons";
import { Logo } from "./logo";
import { Search } from "./search";
import { ThemeToggle } from "./theme-toggle";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="header-inner">
        <Logo />
        <div className="header-search"><Search /></div>
        <nav className="header-actions" aria-label="Enlaces principales">
          <Link className="product-link" href={siteConfig.productUrl}>BuscaFondos <ExternalIcon width={15} /></Link>
          <ThemeToggle />
          <Button asChild className="header-key"><Link href={siteConfig.registerUrl}><KeyIcon width={16} /><span>Obtener API key</span></Link></Button>
        </nav>
      </div>
    </header>
  );
}
