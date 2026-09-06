import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Playground, buildPlaygroundRequest, type PlaygroundEndpoint } from "./playground";

const endpoint: PlaygroundEndpoint = {
  id: "all-funds",
  path: "/api/all-funds",
  summary: "Todos los fondos",
  protected: true,
  pathParameters: [],
  queryParameters: [{ name: "category", required: false }],
};

const requiredQueryEndpoint: PlaygroundEndpoint = {
  ...endpoint,
  id: "agf-evolution",
  path: "/api/agf_stats/evolution",
  protected: false,
  queryParameters: [{ name: "administrator", required: true }],
};

const enumEndpoint: PlaygroundEndpoint = {
  id: "returns",
  path: "/api/real_assets/{asset_id}/returns",
  summary: "Rentabilidades de una serie",
  protected: true,
  pathParameters: [{ name: "asset_id", required: true, description: "ID CRC32 de la serie", numeric: true }],
  queryParameters: [
    { name: "as_of_date", required: false, description: "Corte YYYY-MM-DD" },
    { name: "valuation", required: false, options: ["accounting", "clp", "real_uf"], defaultValue: "accounting", description: "Base de valorización" },
  ],
};

afterEach(() => vi.restoreAllMocks());

describe("playground credential handling", () => {
  it("uses level-two headings for request and response panels", () => {
    const { unmount } = render(<Playground endpoints={[endpoint]} />);

    expect(screen.getByRole("heading", { level: 2, name: "Request" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "Response" })).toBeInTheDocument();
    unmount();
  });

  it("never places the key in the URL", () => {
    const url = buildPlaygroundRequest(endpoint, {}, { category: "money market" });
    expect(url).toBe("https://api.buscafondos.com/api/all-funds?category=money+market");
    expect(url).not.toContain("api_key");
  });

  it("keeps the key in component memory, sends it only as a header and can clear it", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response('{"data":[]}', { status: 200, statusText: "OK", headers: { "Content-Type": "application/json", "X-RateLimit-Remaining": "42" } }));
    vi.stubGlobal("fetch", fetchMock);
    const sessionStorageSpy = vi.spyOn(Storage.prototype, "setItem");

    render(<Playground endpoints={[endpoint]} />);
    const keyInput = screen.getByLabelText(/API key/i);
    fireEvent.change(keyInput, { target: { value: "memory-only-test-secret" } });
    fireEvent.click(screen.getByRole("button", { name: "Enviar request" }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalledOnce());
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).not.toContain("memory-only-test-secret");
    expect(init.headers).toEqual({ "X-Api-Key": "memory-only-test-secret" });
    expect(sessionStorageSpy).not.toHaveBeenCalled();
    expect(await screen.findByText(/200 OK/)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Limpiar credencial/i }));
    expect(keyInput).toHaveValue("");
  });

  it("keeps the request configuration immutable until a pending request settles", async () => {
    let resolveFetch: (response: Response) => void;
    const pendingResponse = new Promise<Response>((resolve) => { resolveFetch = resolve; });
    const fetchMock = vi.fn().mockReturnValue(pendingResponse);
    vi.stubGlobal("fetch", fetchMock);

    const { container } = render(<Playground endpoints={[endpoint]} />);
    const playground = within(container);
    const keyInput = container.querySelector<HTMLInputElement>("#playground-api-key");
    if (!keyInput) throw new Error("API key input was not rendered");
    const clearCredential = playground.getByRole("button", { name: /Limpiar credencial/i });
    fireEvent.change(keyInput, { target: { value: "memory-only-test-secret" } });
    fireEvent.click(playground.getByRole("button", { name: "Enviar request" }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalledOnce());
    expect(keyInput).toBeDisabled();
    expect(clearCredential).toBeDisabled();

    fireEvent.click(clearCredential);
    expect(keyInput).toHaveValue("memory-only-test-secret");

    resolveFetch!(new Response('{"data":[]}', { status: 200, statusText: "OK" }));
    expect(await playground.findByText(/200 OK/)).toBeInTheDocument();
    expect(keyInput).toHaveValue("memory-only-test-secret");
  });
});

describe("playground required parameters", () => {
  it("does not send a request until a required query parameter is completed", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response('{"data":[]}', { status: 200, statusText: "OK" }));
    vi.stubGlobal("fetch", fetchMock);

    const { container } = render(<Playground endpoints={[requiredQueryEndpoint]} />);
    const playground = within(container);
    const submitButton = playground.getByRole("button", { name: "Enviar request" });
    const administratorInput = playground.getByLabelText(/administrator/i);

    expect(submitButton).toBeDisabled();
    expect(administratorInput).toHaveAttribute("aria-invalid", "true");
    expect(playground.getByRole("alert")).toHaveTextContent("Completa los parámetros requeridos: query: administrator.");
    fireEvent.click(submitButton);
    expect(fetchMock).not.toHaveBeenCalled();

    fireEvent.change(administratorInput, { target: { value: "BANCHILE" } });
    expect(submitButton).toBeEnabled();
    expect(administratorInput).toHaveAttribute("aria-invalid", "false");
    fireEvent.click(submitButton);

    await waitFor(() => expect(fetchMock).toHaveBeenCalledOnce());
    expect(fetchMock).toHaveBeenCalledWith("https://api.buscafondos.com/api/agf_stats/evolution?administrator=BANCHILE", expect.objectContaining({ method: "GET" }));
  });
});

describe("playground parameter metadata", () => {
  it("renders enum parameters as a select, numeric hints and contract descriptions", () => {
    const { container } = render(<Playground endpoints={[enumEndpoint]} />);
    const playground = within(container);

    const assetInput = playground.getByLabelText(/asset_id/i);
    expect(assetInput).toHaveAttribute("inputmode", "numeric");
    expect(assetInput).toHaveAccessibleDescription(/ID CRC32 de la serie/);

    const valuation = playground.getByRole("combobox", { name: "valuation" });
    expect(valuation).toHaveTextContent("Por defecto: accounting");
    expect(valuation).toHaveAccessibleDescription(/Base de valorización/);
    expect(container.querySelector("#query-valuation")).toBe(valuation);
    expect(container.querySelector("input#query-valuation")).toBeNull();
  });

  it("omits unset optional parameters from the request URL", () => {
    expect(buildPlaygroundRequest(enumEndpoint, { asset_id: "71452046" }, { valuation: "", as_of_date: "" })).toBe("https://api.buscafondos.com/api/real_assets/71452046/returns");
    expect(buildPlaygroundRequest(enumEndpoint, { asset_id: "71452046" }, { valuation: "clp" })).toBe("https://api.buscafondos.com/api/real_assets/71452046/returns?valuation=clp");
  });
});
