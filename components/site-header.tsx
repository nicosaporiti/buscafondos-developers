import Link from "next/link";
import { siteConfig } from "@/lib/site";
import { ExternalIcon } from "./icons";
import { Logo } from "./logo";
import { Search } from "./search";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="header-inner container">
        <Logo />
        <div className="header-search"><Search /></div>
        <nav className="header-actions" aria-label="Enlaces principales">
          <Link className="product-link" href={siteConfig.productUrl}>BuscaFondos <ExternalIcon width={14} height={14} /></Link>
          <Button asChild className="header-key"><Link href={siteConfig.registerUrl}><span>Obtener API key</span></Link></Button>
        </nav>
      </div>
    </header>
  );
}
