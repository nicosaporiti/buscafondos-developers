import Link from "next/link";

export function Logo() {
  return (
    <Link className="logo" href="/" aria-label="BuscaFondos Developers, inicio">
      <span className="logo-wordmark"><span>Busca</span><strong>Fondos</strong><i>.dev</i></span>
      <span className="logo-subtitle">API para fondos mutuos chilenos</span>
    </Link>
  );
}
