import { useState } from "react";
import { Layout } from "@/components/Layout";
import { StatusBadge } from "@/components/StatusBadge";
import { ORDERS, Order, OrderStatus } from "@/data";
import { X, ChevronRight } from "lucide-react";

const STATUSES: OrderStatus[] = ["pending", "accepted", "preparing", "ready", "fulfilled", "cancelled"];

const NEXT: Record<string, { next: OrderStatus; label: string } | null> = {
  pending:   { next: "accepted",  label: "Accept" },
  accepted:  { next: "preparing", label: "Start Prep" },
  preparing: { next: "ready",     label: "Mark Ready" },
  ready:     { next: "fulfilled", label: "Fulfill" },
  fulfilled: null,
  cancelled: null,
};

export default function OrdersPage() {
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [orders, setOrders] = useState<Order[]>(ORDERS);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const filtered = statusFilter ? orders.filter((o) => o.status === statusFilter) : orders;
  const selected = orders.find((o) => o.id === selectedId) ?? null;

  const advance = (id: number, next: OrderStatus) => {
    setOrders((prev) => prev.map((o) => o.id === id ? { ...o, status: next } : o));
  };

  return (
    <Layout>
      <div className="p-8 max-w-7xl mx-auto">
        <div className="mb-8">
          <h2 className="font-display text-4xl font-bold text-foreground">Orders</h2>
          <p className="font-sans text-muted-foreground mt-1">Track and manage every ticket.</p>
        </div>

        <div className="flex gap-3 mb-6 flex-wrap">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="font-sans text-sm bg-white border-2 border-foreground rounded-xl px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
          >
            <option value="">All Statuses</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
            ))}
          </select>
          {statusFilter && (
            <button onClick={() => setStatusFilter("")} className="font-sans text-sm px-4 py-2 rounded-xl border-2 border-foreground/30 text-muted-foreground hover:border-foreground transition-colors">
              Clear
            </button>
          )}
        </div>

        <div className="flex gap-6">
          <div className="flex-1 bg-white rounded-2xl border-2 border-foreground overflow-hidden shadow-[0_8px_24px_rgba(26,16,8,0.08)]">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-foreground/10 bg-background/50">
                  <th className="font-sans text-xs font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3 text-left">Order</th>
                  <th className="font-sans text-xs font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3 text-left">Customer</th>
                  <th className="font-sans text-xs font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3 text-left">Items</th>
                  <th className="font-sans text-xs font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3 text-left">Status</th>
                  <th className="font-sans text-xs font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3 text-right">Total</th>
                  <th className="px-5 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={6} className="px-5 py-12 text-center font-sans text-muted-foreground">No orders found.</td></tr>
                ) : filtered.map((order) => (
                  <tr
                    key={order.id}
                    onClick={() => setSelectedId(order.id === selectedId ? null : order.id)}
                    className={`border-b border-foreground/5 cursor-pointer transition-colors duration-100 ${selectedId === order.id ? "bg-primary/5" : "hover:bg-background/50"}`}
                  >
                    <td className="px-5 py-3 font-display text-foreground font-bold">#{order.id}</td>
                    <td className="px-5 py-3 font-sans text-sm text-foreground">{order.customerName ?? "Walk-in"}</td>
                    <td className="px-5 py-3 font-sans text-xs text-muted-foreground">{order.items.length} item{order.items.length !== 1 ? "s" : ""}</td>
                    <td className="px-5 py-3"><StatusBadge status={order.status} /></td>
                    <td className="px-5 py-3 font-sans text-sm font-semibold text-right">${order.total.toFixed(2)}</td>
                    <td className="px-5 py-3 text-muted-foreground"><ChevronRight size={16} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {selectedId && selected && (
            <div className="w-80 flex-shrink-0 bg-white rounded-2xl border-2 border-foreground shadow-[0_8px_24px_rgba(26,16,8,0.08)] overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b-2 border-foreground/10">
                <span className="font-display text-xl font-bold text-foreground">Order #{selectedId}</span>
                <button onClick={() => setSelectedId(null)}><X size={18} className="text-muted-foreground hover:text-foreground" /></button>
              </div>
              <div className="p-5 space-y-5">
                <div>
                  <p className="font-sans text-xs text-muted-foreground uppercase tracking-wider mb-1">Customer</p>
                  <p className="font-sans text-sm font-medium text-foreground">{selected.customerName ?? "Walk-in"}</p>
                </div>
                <div>
                  <p className="font-sans text-xs text-muted-foreground uppercase tracking-wider mb-1">Status</p>
                  <StatusBadge status={selected.status} />
                </div>
                {selected.notes && (
                  <div>
                    <p className="font-sans text-xs text-muted-foreground uppercase tracking-wider mb-1">Notes</p>
                    <p className="font-sans text-sm text-foreground bg-background/50 rounded-xl px-3 py-2">{selected.notes}</p>
                  </div>
                )}
                <div>
                  <p className="font-sans text-xs text-muted-foreground uppercase tracking-wider mb-2">Items</p>
                  <div className="space-y-1.5">
                    {selected.items.map((item, i) => (
                      <div key={i} className="flex justify-between items-center">
                        <span className="font-sans text-sm text-foreground">{item.quantity}x {item.name}</span>
                        <span className="font-sans text-xs text-muted-foreground">${(item.unitPrice * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t-2 border-foreground/10 mt-3 pt-3 flex justify-between">
                    <span className="font-sans text-sm font-semibold text-foreground">Total</span>
                    <span className="font-display text-lg font-bold text-primary">${selected.total.toFixed(2)}</span>
                  </div>
                </div>
                {NEXT[selected.status] && (
                  <div>
                    <p className="font-sans text-xs text-muted-foreground uppercase tracking-wider mb-2">Actions</p>
                    <div className="flex gap-2 flex-wrap">
                      <button
                        onClick={() => advance(selected.id, NEXT[selected.status]!.next)}
                        className="px-3 py-1.5 rounded-full bg-primary text-white text-xs font-medium font-sans hover:bg-primary/90 shadow-sm"
                      >
                        {NEXT[selected.status]!.label}
                      </button>
                      <button
                        onClick={() => advance(selected.id, "cancelled")}
                        className="px-3 py-1.5 rounded-full border-2 border-destructive text-destructive text-xs font-medium font-sans hover:bg-destructive hover:text-white"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
