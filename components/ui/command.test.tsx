import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { CommandDialog, CommandInput } from "./command";

describe("CommandDialog", () => {
  it("provides command context to its input", () => {
    render(
      <CommandDialog open title="Buscar documentación">
        <CommandInput aria-label="Buscar documentación" />
      </CommandDialog>,
    );

    expect(
      screen.getByRole("combobox", { name: "Buscar documentación" }),
    ).toBeInTheDocument();
  });
});
