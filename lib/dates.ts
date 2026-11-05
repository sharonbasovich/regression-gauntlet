const DAY = 86_400_000;

export const DELIVERY_DAYS: Record<"standard" | "express", number> = {
  standard: 5,
  express: 2,
};

export function deliveryDate(method: "standard" | "express", from: Date = new Date()): Date {
  return new Date(from.getTime() + DELIVERY_DAYS[method] * DAY);
}

export function formatDeliveryDate(d: Date): string {
  return new Intl.DateTimeFormat("en-US", { weekday: "short", month: "short", day: "numeric" }).format(d);
}

export function deliveryEstimate(method: "standard" | "express", from?: Date): string {
  return formatDeliveryDate(deliveryDate(method, from));
}
