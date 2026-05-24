import { cn } from "@/lib/utils";

type Status = "pending" | "accepted" | "preparing" | "ready" | "fulfilled" | "cancelled";

const statusConfig: Record<Status, { label: string; className: string }> = {
  pending: { label: "Pending", className: "bg-[#F5C842]/20 text-[#8a6c00] border border-[#F5C842]" },
  accepted: { label: "Accepted", className: "bg-blue-100 text-blue-800 border border-blue-300" },
  preparing: { label: "Preparing", className: "bg-orange-100 text-orange-800 border border-orange-300" },
  ready: { label: "Ready", className: "bg-green-100 text-green-800 border border-green-300" },
  fulfilled: { label: "Fulfilled", className: "bg-gray-100 text-gray-600 border border-gray-300" },
  cancelled: { label: "Cancelled", className: "bg-red-100 text-red-700 border border-red-300" },
};

export function StatusBadge({ status }: { status: string }) {
  const config = statusConfig[status as Status] ?? { label: status, className: "bg-gray-100 text-gray-600 border border-gray-300" };
  return (
    <span
      data-testid={`status-badge-${status}`}
      className={cn("inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium font-sans", config.className)}
    >
      {config.label}
    </span>
  );
}

const NEXT_STATUS: Record<string, { next: string; label: string } | null> = {
  pending: { next: "accepted", label: "Accept" },
  accepted: { next: "preparing", label: "Start Prep" },
  preparing: { next: "ready", label: "Mark Ready" },
  ready: { next: "fulfilled", label: "Fulfill" },
  fulfilled: null,
  cancelled: null,
};

export function StatusActions({
  status,
  onAdvance,
  onCancel,
  isPending,
}: {
  status: string;
  onAdvance: (next: string) => void;
  onCancel: () => void;
  isPending: boolean;
}) {
  const advance = NEXT_STATUS[status];
  if (!advance && status === "fulfilled") return null;
  if (status === "cancelled") return null;

  return (
    <div className="flex gap-2 flex-wrap">
      {advance && (
        <button
          data-testid={`button-advance-${status}`}
          onClick={() => onAdvance(advance.next)}
          disabled={isPending}
          className="px-3 py-1.5 rounded-full bg-primary text-white text-xs font-medium font-sans transition-all hover:bg-primary/90 disabled:opacity-50 shadow-sm"
        >
          {advance.label}
        </button>
      )}
      {status !== "cancelled" && status !== "fulfilled" && (
        <button
          data-testid="button-cancel-order"
          onClick={onCancel}
          disabled={isPending}
          className="px-3 py-1.5 rounded-full border-2 border-destructive text-destructive text-xs font-medium font-sans transition-all hover:bg-destructive hover:text-white disabled:opacity-50"
        >
          Cancel
        </button>
      )}
    </div>
  );
}
