import { useGetDashboardSummary, useGetDashboardTopItems, useGetDashboardRecentOrders, useGetDashboardOrderStatusBreakdown } from "@workspace/api-client-react";
import { Layout } from "@/components/Layout";
import { StatusBadge } from "@/components/StatusBadge";
import { SmashBurger } from "@/components/food-svgs/SmashBurger";
import { SeasonedFries } from "@/components/food-svgs/SeasonedFries";
import { StrawberrySundae } from "@/components/food-svgs/StrawberrySundae";
import { HomemadeCola } from "@/components/food-svgs/HomemadeCola";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, ShoppingBag, Clock, Star } from "lucide-react";

const FOOD_SVG_MAP: Record<string, React.ReactNode> = {
  "Smash Burger": <SmashBurger />,
  "Seasoned Fries": <SeasonedFries />,
  "Strawberry Sundae": <StrawberrySundae />,
  "Homemade Cola": <HomemadeCola />,
};

const DEFAULT_SVGS = [<SmashBurger />, <SeasonedFries />, <StrawberrySundae />, <HomemadeCola />];

export default function HomePage() {
  const { data: summary, isLoading: summaryLoading } = useGetDashboardSummary();
  const { data: topItems, isLoading: topLoading } = useGetDashboardTopItems({ limit: 4 });
  const { data: recentOrders, isLoading: ordersLoading } = useGetDashboardRecentOrders({ limit: 8 });

  const kpis = [
    {
      label: "Total Orders",
      value: summaryLoading ? null : summary?.totalOrders ?? 0,
      icon: ShoppingBag,
      color: "bg-primary",
      textColor: "text-white",
    },
    {
      label: "Revenue",
      value: summaryLoading ? null : `$${(summary?.totalRevenue ?? 0).toFixed(2)}`,
      icon: TrendingUp,
      color: "bg-[#F5C842]",
      textColor: "text-foreground",
    },
    {
      label: "Pending Orders",
      value: summaryLoading ? null : summary?.pendingOrders ?? 0,
      icon: Clock,
      color: "bg-foreground",
      textColor: "text-background",
    },
    {
      label: "Popular Item",
      value: summaryLoading ? null : summary?.popularItem ?? "—",
      icon: Star,
      color: "bg-white",
      textColor: "text-foreground",
    },
  ];

  return (
    <Layout>
      <div className="p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h2 className="font-display text-4xl font-bold text-foreground">Good day, Chef</h2>
          <p className="font-sans text-muted-foreground mt-1">Here's what's cooking today.</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {kpis.map(({ label, value, icon: Icon, color, textColor }) => (
            <div
              key={label}
              data-testid={`kpi-${label.toLowerCase().replace(/ /g, "-")}`}
              className={`${color} ${textColor} rounded-2xl p-5 border-2 border-foreground shadow-[0_8px_24px_rgba(26,16,8,0.08)] flex flex-col gap-3`}
            >
              <div className="flex items-center justify-between">
                <span className="font-sans text-xs font-medium uppercase tracking-wider opacity-70">{label}</span>
                <Icon size={18} className="opacity-70" />
              </div>
              {value === null ? (
                <Skeleton className="h-8 w-24 bg-current/20" />
              ) : (
                <span className="font-display text-3xl font-bold leading-none">{value}</span>
              )}
            </div>
          ))}
        </div>

        {/* Chef's Picks */}
        <div className="mb-10">
          <h3 className="font-display text-2xl font-bold text-foreground mb-4">Chef's Picks</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {topLoading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-48 rounded-2xl" />
                ))
              : (topItems ?? []).slice(0, 4).map((item, i) => (
                  <div
                    key={item.id}
                    data-testid={`top-item-${item.id}`}
                    className="bg-white rounded-2xl border-2 border-foreground p-5 flex flex-col items-center gap-3 shadow-[0_8px_24px_rgba(26,16,8,0.08)] hover:shadow-[0_12px_32px_rgba(26,16,8,0.14)] transition-shadow duration-200"
                  >
                    <div className="[animation:float_3s_ease-in-out_infinite]" style={{ animationDelay: `${i * 0.4}s` }}>
                      {FOOD_SVG_MAP[item.name] ?? DEFAULT_SVGS[i % 4]}
                    </div>
                    <div className="text-center">
                      <p className="font-display text-lg font-bold text-foreground leading-tight">{item.name}</p>
                      <p className="font-sans text-xs text-muted-foreground mt-0.5">{item.categoryName}</p>
                    </div>
                    <div className="flex items-center justify-between w-full">
                      <span className="font-sans text-sm font-semibold text-primary">${item.price.toFixed(2)}</span>
                      <span className="font-sans text-xs text-muted-foreground">{item.orderCount} orders</span>
                    </div>
                  </div>
                ))}
          </div>
        </div>

        {/* Recent Orders */}
        <div>
          <h3 className="font-display text-2xl font-bold text-foreground mb-4">Recent Orders</h3>
          <div className="bg-white rounded-2xl border-2 border-foreground overflow-hidden shadow-[0_8px_24px_rgba(26,16,8,0.08)]">
            {ordersLoading ? (
              <div className="p-6 space-y-3">
                {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-10 w-full rounded-xl" />)}
              </div>
            ) : (
              <table className="w-full" data-testid="recent-orders-table">
                <thead>
                  <tr className="border-b-2 border-foreground/10 bg-background/50">
                    <th className="font-sans text-xs font-semibold text-muted-foreground uppercase tracking-wider px-6 py-3 text-left">Order</th>
                    <th className="font-sans text-xs font-semibold text-muted-foreground uppercase tracking-wider px-6 py-3 text-left">Customer</th>
                    <th className="font-sans text-xs font-semibold text-muted-foreground uppercase tracking-wider px-6 py-3 text-left">Status</th>
                    <th className="font-sans text-xs font-semibold text-muted-foreground uppercase tracking-wider px-6 py-3 text-right">Total</th>
                    <th className="font-sans text-xs font-semibold text-muted-foreground uppercase tracking-wider px-6 py-3 text-right">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {(recentOrders ?? []).map((order, i) => (
                    <tr
                      key={order.id}
                      data-testid={`order-row-${order.id}`}
                      className="border-b border-foreground/5 hover:bg-background/50 transition-colors duration-100"
                    >
                      <td className="px-6 py-3 font-display text-foreground font-bold">#{order.id}</td>
                      <td className="px-6 py-3 font-sans text-sm text-foreground">{order.customerName ?? "Walk-in"}</td>
                      <td className="px-6 py-3"><StatusBadge status={order.status} /></td>
                      <td className="px-6 py-3 font-sans text-sm font-semibold text-foreground text-right">${order.total.toFixed(2)}</td>
                      <td className="px-6 py-3 font-sans text-xs text-muted-foreground text-right">
                        {new Date(order.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
