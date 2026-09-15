function parseCalendlyPayload(raw: unknown): Record<string, unknown> | null {
  let data = raw;
  if (typeof data === "string") {
    try {
      data = JSON.parse(data);
    } catch {
      return null;
    }
  }
  if (!data || typeof data !== "object") return null;
  return data as Record<string, unknown>;
}

export function calendlyEventName(raw: unknown): string {
  const data = parseCalendlyPayload(raw);
  const event = data?.event;
  return typeof event === "string" ? event : "";
}

export function calendlyPageHeight(raw: unknown): number {
  const data = parseCalendlyPayload(raw);
  if (!data || calendlyEventName(data) !== "calendly.page_height") return 0;
  const payload = data.payload;
  const height =
    typeof payload === "number"
      ? payload
      : payload && typeof payload === "object"
        ? (payload as { height?: unknown }).height
        : undefined;
  const value = typeof height === "string" ? Number.parseFloat(height) : Number(height);
  return Number.isFinite(value) && value > 0 ? value : 0;
}
