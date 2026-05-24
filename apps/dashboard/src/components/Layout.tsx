import { Link, useLocation } from "wouter";
import { LayoutDashboard, ShoppingBag, Users, UtensilsCrossed, Settings, Palette } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/orders", label: "Orders", icon: ShoppingBag },
  { href: "/crm", label: "Customers", icon: Users },
  { href: "/menu", label: "Menu", icon: UtensilsCrossed },
  { href: "/settings", label: "Settings", icon: Settings },
  { href: "/design-system", label: "Design System", icon: Palette },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-60 flex-shrink-0 bg-foreground text-background flex flex-col border-r-2 border-foreground shadow-[4px_0_24px_rgba(26,16,8,0.15)]">
        {/* Logo */}
        <div className="px-6 py-6 border-b-2 border-background/20">
          <h1 className="font-display text-3xl font-bold text-primary tracking-tight leading-none">
            The Diner
          </h1>
          <p className="font-sans text-xs text-background/50 mt-1 uppercase tracking-widest">Operations HQ</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive = href === "/" ? location === "/" : location.startsWith(href);
            return (
              <Link key={href} href={href}>
                <div
                  data-testid={`nav-${label.toLowerCase().replace(" ", "-")}`}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-150 group",
                    isActive
                      ? "bg-primary text-white shadow-[0_2px_8px_rgba(232,64,28,0.4)]"
                      : "text-background/70 hover:bg-background/10 hover:text-background",
                  )}
                >
                  <Icon size={18} className="flex-shrink-0" />
                  <span className="font-sans text-sm font-medium">{label}</span>
                  {isActive && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white/70" />
                  )}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-6 py-4 border-t-2 border-background/20">
          <p className="font-sans text-xs text-background/40">Est. Since Day One</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
