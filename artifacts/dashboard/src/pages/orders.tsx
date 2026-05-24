import { useState } from "react";
import { useListOrders, useUpdateOrderStatus, useGetOrder, getListOrdersQueryKey, getGetOrderQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Layout } from "@/components/Layout";
import { StatusBadge, StatusActions } from "@/components/StatusBadge";
import { Skeleton } from "@/components/ui/skeleton";
import { X, ChevronRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const STATUSES = ["pending", "accepted", "preparing", "ready", "fulfilled", "cancelled"];

export default function OrdersPage() {
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [dateFilter, setDateFilter] = useState<string>("");
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: orders, isLoading } = useListOrders({
    status: statusFilter as any || undefined,
    date: dateFilter || undefined,
  });

  const { data: selectedOrder, isLoading: detailLoading } = useGetOrder(
    selectedId!,
    { query: { enabled: !!selectedId, queryKey: getGetOrderQueryKey(selectedId!) } }
  );

  const updateStatus = useUpdateOrderStatus({
    mutation: {
      onSuccess: (order) => {
        queryClient.invalidateQueries({ queryKey: getListOrdersQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetOrderQueryKey(order.id) });
        toast({ title: `Order #${order.id} updated to ${order.status}` });
      },
      onError: () => toast({ title: "Failed to update status", variant: "destructive" }),
    }
  });

  const handleAdvance = (id: number, status: string) => {
    updateStatus.mutate({ id, data: { status: status as any } });
  };

  return (
    <Layout>
      <div className="p-8 max-w-7xl mx-auto">
        <div className="mb-8">
          <h2 className="font-display text-4xl font-bold text-foreground">Orders</h2>
          <p className="font-sans text-muted-foreground mt-1">Track and manage every ticket.</p>
        </div>

        {/* Filters */}
        <div className="flex gap-3 mb-6 flex-wrap">
          <select
            data-testid="select-status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="font-sans text-sm bg-white border-2 border-foreground rounded-xl px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
          >
            <option value="">All Statuses</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
            ))}
          </select>
          <input
            data-testid="input-date-filter"
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="font-sans text-sm bg-white border-2 border-foreground rounded-xl px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
          />
          {(statusFilter || dateFilter) && (
            <button
              data-testid="button-clear-filters"
              onClick={() => { setStatusFilter(""); setDateFilter(""); }}
              className="font-sans text-sm px-4 py-2 rounded-xl border-2 border-foreground/30 text-muted-foreground hover:border-foreground transition-colors"
            >
              Clear
            </button>
          )}
        </div>

        <div className="flex gap-6">
          {/* Order List */}
          <div className="flex-1 bg-white rounded-2xl border-2 border-foreground overflow-hidden shadow-[0_8px_24px_rgba(26,16,8,0.08)]">
            {isLoading ? (
              <div className="p-6 space-y-3">
                {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-14 w-full rounded-xl" />)}
              </div>
            ) : (
              <table className="w-full" data-testid="orders-table">
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
                  {(orders ?? []).length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-5 py-12 text-center font-sans text-muted-foreground">No orders found.</td>
                    </tr>
                  ) : (orders ?? []).map((order) => (
                    <tr
                      key={order.id}
                      data-testid={`order-row-${order.id}`}
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
            )}
          </div>

          {/* Order Detail Panel */}
          {selectedId && (
            <div className="w-80 flex-shrink-0 bg-white rounded-2xl border-2 border-foreground shadow-[0_8px_24px_rgba(26,16,8,0.08)] overflow-hidden" data-testid="order-detail-panel">
              <div className="flex items-center justify-between px-5 py-4 border-b-2 border-foreground/10">
                <span className="font-display text-xl font-bold text-foreground">Order #{selectedId}</span>
                <button data-testid="button-close-detail" onClick={() => setSelectedId(null)}>
                  <X size={18} className="text-muted-foreground hover:text-foreground transition-colors" />
                </button>
              </div>

              {detailLoading ? (
                <div className="p-5 space-y-3">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
              ) : selectedOrder ? (
                <div className="p-5 space-y-5">
                  <div>
                    <p className="font-sans text-xs text-muted-foreground uppercase tracking-wider mb-1">Customer</p>
                    <p className="font-sans text-sm font-medium text-foreground">{selectedOrder.customerName ?? "Walk-in"}</p>
                  </div>
                  <div>
                    <p className="font-sans text-xs text-muted-foreground uppercase tracking-wider mb-1">Status</p>
                    <StatusBadge status={selectedOrder.status} />
                  </div>
                  {selectedOrder.notes && (
                    <div>
                      <p className="font-sans text-xs text-muted-foreground uppercase tracking-wider mb-1">Notes</p>
                      <p className="font-sans text-sm text-foreground bg-background/50 rounded-xl px-3 py-2">{selectedOrder.notes}</p>
                    </div>
                  )}
                  <div>
                    <p className="font-sans text-xs text-muted-foreground uppercase tracking-wider mb-2">Items</p>
                    <div className="space-y-1.5">
                      {selectedOrder.items.map((item, i) => (
                        <div key={i} className="flex justify-between items-center">
                          <span className="font-sans text-sm text-foreground">{item.quantity}x {item.name}</span>
                          <span className="font-sans text-xs text-muted-foreground">${(item.unitPrice * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="border-t-2 border-foreground/10 mt-3 pt-3 flex justify-between">
                      <span className="font-sans text-sm font-semibold text-foreground">Total</span>
                      <span className="font-display text-lg font-bold text-primary">${selectedOrder.total.toFixed(2)}</span>
                    </div>
                  </div>
                  <div>
                    <p className="font-sans text-xs text-muted-foreground uppercase tracking-wider mb-2">Actions</p>
                    <StatusActions
                      status={selectedOrder.status}
                      onAdvance={(next) => handleAdvance(selectedOrder.id, next)}
                      onCancel={() => handleAdvance(selectedOrder.id, "cancelled")}
                      isPending={updateStatus.isPending}
                    />
                  </div>
                  <div>
                    <p className="font-sans text-xs text-muted-foreground uppercase tracking-wider mb-1">Placed</p>
                    <p className="font-sans text-xs text-muted-foreground">{new Date(selectedOrder.createdAt).toLocaleString()}</p>
                  </div>
                </div>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
