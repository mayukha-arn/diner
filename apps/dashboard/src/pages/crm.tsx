import { useState } from "react";
import { useListCustomers, useGetCustomer, getGetCustomerQueryKey } from "@workspace/api-client-react";
import { Layout } from "@/components/Layout";
import { StatusBadge } from "@/components/StatusBadge";
import { Skeleton } from "@/components/ui/skeleton";
import { X, Search } from "lucide-react";

export default function CRMPage() {
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const { data: customers, isLoading } = useListCustomers({ search: search || undefined });

  const { data: customer, isLoading: detailLoading } = useGetCustomer(
    selectedId!,
    { query: { enabled: !!selectedId, queryKey: getGetCustomerQueryKey(selectedId!) } }
  );

  return (
    <Layout>
      <div className="p-8 max-w-7xl mx-auto">
        <div className="mb-8">
          <h2 className="font-display text-4xl font-bold text-foreground">Customers</h2>
          <p className="font-sans text-muted-foreground mt-1">Know your regulars.</p>
        </div>

        {/* Search */}
        <div className="relative mb-6 max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            data-testid="input-customer-search"
            type="search"
            placeholder="Search customers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="font-sans text-sm w-full bg-white border-2 border-foreground rounded-xl pl-9 pr-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
          />
        </div>

        <div className="flex gap-6">
          {/* Customer List */}
          <div className="flex-1 bg-white rounded-2xl border-2 border-foreground overflow-hidden shadow-[0_8px_24px_rgba(26,16,8,0.08)]">
            {isLoading ? (
              <div className="p-6 space-y-3">
                {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-14 w-full rounded-xl" />)}
              </div>
            ) : (
              <table className="w-full" data-testid="customers-table">
                <thead>
                  <tr className="border-b-2 border-foreground/10 bg-background/50">
                    <th className="font-sans text-xs font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3 text-left">Name</th>
                    <th className="font-sans text-xs font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3 text-left">Email</th>
                    <th className="font-sans text-xs font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3 text-right">Orders</th>
                    <th className="font-sans text-xs font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3 text-right">Total Spend</th>
                    <th className="font-sans text-xs font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3 text-right">Last Order</th>
                  </tr>
                </thead>
                <tbody>
                  {(customers ?? []).length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-5 py-12 text-center font-sans text-muted-foreground">No customers found.</td>
                    </tr>
                  ) : (customers ?? []).map((cust) => (
                    <tr
                      key={cust.id}
                      data-testid={`customer-row-${cust.id}`}
                      onClick={() => setSelectedId(cust.id === selectedId ? null : cust.id)}
                      className={`border-b border-foreground/5 cursor-pointer transition-colors duration-100 ${selectedId === cust.id ? "bg-primary/5" : "hover:bg-background/50"}`}
                    >
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center flex-shrink-0">
                            <span className="font-display text-sm font-bold text-primary">{cust.name.charAt(0)}</span>
                          </div>
                          <span className="font-sans text-sm font-medium text-foreground">{cust.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3 font-sans text-sm text-muted-foreground">{cust.email ?? "—"}</td>
                      <td className="px-5 py-3 font-sans text-sm text-foreground text-right">{cust.orderCount}</td>
                      <td className="px-5 py-3 font-sans text-sm font-semibold text-foreground text-right">${cust.totalSpend.toFixed(2)}</td>
                      <td className="px-5 py-3 font-sans text-xs text-muted-foreground text-right">
                        {cust.lastOrderDate ? new Date(cust.lastOrderDate).toLocaleDateString() : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Customer Detail Panel */}
          {selectedId && (
            <div className="w-80 flex-shrink-0 bg-white rounded-2xl border-2 border-foreground shadow-[0_8px_24px_rgba(26,16,8,0.08)] overflow-hidden" data-testid="customer-detail-panel">
              <div className="flex items-center justify-between px-5 py-4 border-b-2 border-foreground/10">
                <span className="font-display text-xl font-bold text-foreground">Customer</span>
                <button data-testid="button-close-customer" onClick={() => setSelectedId(null)}>
                  <X size={18} className="text-muted-foreground hover:text-foreground transition-colors" />
                </button>
              </div>

              {detailLoading ? (
                <div className="p-5 space-y-3">
                  <Skeleton className="h-6 w-40" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
              ) : customer ? (
                <div className="p-5 space-y-5">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center">
                      <span className="font-display text-2xl font-bold text-primary">{customer.name.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="font-display text-xl font-bold text-foreground">{customer.name}</p>
                      <p className="font-sans text-xs text-muted-foreground">{customer.email ?? "No email"}</p>
                      {customer.phone && <p className="font-sans text-xs text-muted-foreground">{customer.phone}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-background/50 rounded-xl p-3 border border-foreground/10">
                      <p className="font-sans text-xs text-muted-foreground mb-1">Orders</p>
                      <p className="font-display text-xl font-bold text-foreground">{customer.orderCount}</p>
                    </div>
                    <div className="bg-background/50 rounded-xl p-3 border border-foreground/10">
                      <p className="font-sans text-xs text-muted-foreground mb-1">Total Spend</p>
                      <p className="font-display text-xl font-bold text-primary">${customer.totalSpend.toFixed(2)}</p>
                    </div>
                  </div>

                  <div>
                    <p className="font-sans text-xs text-muted-foreground uppercase tracking-wider mb-3">Order History</p>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {(customer.orders ?? []).length === 0 ? (
                        <p className="font-sans text-sm text-muted-foreground">No orders yet.</p>
                      ) : (customer.orders ?? []).map((order) => (
                        <div key={order.id} data-testid={`customer-order-${order.id}`} className="flex items-center justify-between bg-background/50 rounded-xl px-3 py-2 border border-foreground/10">
                          <div>
                            <span className="font-display text-sm font-bold text-foreground">#{order.id}</span>
                            <p className="font-sans text-xs text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <StatusBadge status={order.status} />
                            <span className="font-sans text-xs font-semibold text-foreground">${order.total.toFixed(2)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
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
