import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ApiReference } from "./api-reference";

describe("API reference rendering", () => {
  it("renders real tags, endpoints and models from the snapshot", () => {
    render(<ApiReference />);
    expect(screen.getAllByText("Market Summary").length).toBeGreaterThan(0);
    expect(screen.getByText("/api/market-summary")).toBeInTheDocument();
    expect(screen.getAllByText("Modelos").length).toBeGreaterThan(0);
    expect(screen.getByText("Article107DetailResponse")).toBeInTheDocument();
  });

  it("renders request body details from the real OpenAPI snapshot", () => {
    render(<ApiReference />);
    const watchlistEndpoint = screen.getAllByText("/api/me/watchlist").find((element) => element.closest("article")?.querySelector('[data-method="post"]'));
    const operation = watchlistEndpoint?.closest("article");
    if (!operation) throw new Error("Missing expected POST /api/me/watchlist operation");

    const requestBody = within(operation);
    expect(requestBody.getByRole("heading", { name: "Cuerpo del request", level: 4 })).toBeInTheDocument();
    expect(requestBody.getByText("application/json")).toBeInTheDocument();
    expect(requestBody.getByText("requerido")).toBeInTheDocument();
    expect(requestBody.getByText(/WatchlistRequest/)).toBeInTheDocument();
  });

  it("keeps response statuses below their section while models remain top-level accordions", () => {
    render(<ApiReference />);
    const watchlistEndpoint = screen.getAllByText("/api/me/watchlist").find((element) => element.closest("article")?.querySelector('[data-method="post"]'));
    const operation = watchlistEndpoint?.closest("article");
    if (!operation) throw new Error("Missing expected POST /api/me/watchlist operation");

    expect(within(operation).getByRole("heading", { name: "200 Successful Response", level: 5 })).toBeInTheDocument();
    expect(screen.getAllByRole("heading", { name: "Article107DetailResponse", level: 3 })).not.toHaveLength(0);
  });
});
