type Status = "pending" | "accepted" | "preparing" | "ready" | "fulfilled" | "cancelled";

const statusConfig: Record<Status, { label: string; className: string }> = {
  pending:   { label: "Pending",   className: "bg-[#F5C842]/20 text-[#8a6c00] border border-[#F5C842]" },
  accepted:  { label: "Accepted",  className: "bg-blue-100 text-blue-800 border border-blue-300" },
  preparing: { label: "Preparing", className: "bg-orange-100 text-orange-800 border border-orange-300" },
  ready:     { label: "Ready",     className: "bg-green-100 text-green-800 border border-green-300" },
  fulfilled: { label: "Fulfilled", className: "bg-gray-100 text-gray-600 border border-gray-300" },
  cancelled: { label: "Cancelled", className: "bg-red-100 text-red-700 border border-red-300" },
};

export function StatusBadge({ status }: { status: string }) {
  const config = statusConfig[status as Status] ?? { label: status, className: "bg-gray-100 text-gray-600 border border-gray-300" };
  return (
    <span className={`inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium font-sans ${config.className}`}>
      {config.label}
    </span>
  );
}
