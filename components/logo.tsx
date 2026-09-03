import Link from "next/link";

export function Logo() {
  return (
    <Link className="wordmark" href="/" aria-label="BuscaFondos Developers, inicio">
      <strong>BuscaFondos</strong>
      <span aria-hidden="true">/</span>
      <em>Developers</em>
    </Link>
  );
}
