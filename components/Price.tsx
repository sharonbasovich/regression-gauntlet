import { formatMoney } from "@/lib/pricing";

export function Price({ cents, compareAt, className = "", testId }: { cents: number; compareAt?: number; className?: string; testId?: string }) {
  return (
    <span className={`inline-flex items-baseline gap-2 ${className}`} data-testid={testId}>
      <span className="font-semibold text-ink">{formatMoney(cents)}</span>
      {compareAt && compareAt > cents ? (
        <span className="text-sm text-muted line-through">
          <span className="sr-only">Was </span>
          {formatMoney(compareAt)}
        </span>
      ) : null}
    </span>
  );
}
