import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { CopyButton } from "./copy-button";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("CopyButton", () => {
  it("confirms a successful copy", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal("navigator", { clipboard: { writeText } });

    render(<CopyButton value="const token = 'bf_test';" />);
    fireEvent.click(screen.getByRole("button", { name: /Copiar: Copiar/i }));

    await waitFor(() => expect(writeText).toHaveBeenCalledWith("const token = 'bf_test';"));
    expect(screen.getByRole("status")).toHaveTextContent("Copiado");
  });

  it("reports a rejected copy and remains available to retry", async () => {
    const writeText = vi.fn().mockRejectedValue(new Error("Permission denied"));
    vi.stubGlobal("navigator", { clipboard: { writeText } });

    render(<CopyButton value="secret" />);
    const button = screen.getByRole("button", { name: /Copiar: Copiar/i });
    fireEvent.click(button);

    await waitFor(() => expect(screen.getByRole("status")).toHaveTextContent("No se pudo copiar. Intenta de nuevo."));
    expect(button).toBeEnabled();
  });
});
