"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { documentationNavigation } from "@/lib/navigation";
import { SearchIcon } from "./icons";
import { Button } from "@/components/ui/button";
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";

export function Search() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent): void {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen(true);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <>
      <Button className="search-trigger" variant="outline" type="button" onClick={() => setOpen(true)} aria-haspopup="dialog">
        <SearchIcon /> <span>Buscar documentación</span><kbd>⌘K</kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen} title="Buscar documentación" description="Busca una guía o sección de la referencia" className="search-dialog">
        <CommandInput placeholder="Buscar guía o referencia…" aria-label="Buscar documentación" />
        <CommandList>
          <CommandEmpty>No encontramos resultados.</CommandEmpty>
          <CommandGroup heading="Documentación">
            {documentationNavigation.map((item) => (
              <CommandItem key={item.href} value={`${item.label} ${item.description}`} onSelect={() => { setOpen(false); router.push(item.href); }}>
                <span className="search-result-copy"><strong>{item.label}</strong><small>{item.description}</small></span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
