import { Layout } from "@/components/Layout";
import { StatusBadge } from "@/components/StatusBadge";
import { Skeleton } from "@/components/ui/skeleton";
import { SmashBurger } from "@/components/food-svgs/SmashBurger";
import { SeasonedFries } from "@/components/food-svgs/SeasonedFries";
import { StrawberrySundae } from "@/components/food-svgs/StrawberrySundae";
import { HomemadeCola } from "@/components/food-svgs/HomemadeCola";

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="mb-10">
    <h3 className="font-display text-2xl font-bold text-foreground mb-5 border-b-2 border-foreground/10 pb-3">{title}</h3>
    {children}
  </div>
);

const Swatch = ({ name, bg, text }: { name: string; bg: string; text: string }) => (
  <div className="flex flex-col gap-1.5">
    <div className={`${bg} ${text} h-14 rounded-xl border-2 border-foreground/10 flex items-end p-2`} />
    <p className="font-sans text-xs text-muted-foreground">{name}</p>
  </div>
);

export default function DesignSystemPage() {
  return (
    <Layout>
      <div className="p-8 max-w-4xl mx-auto">
        <div className="mb-10">
          <h2 className="font-display text-4xl font-bold text-foreground">Design System</h2>
          <p className="font-sans text-muted-foreground mt-1">The tokens, typography, and components that make The Diner.</p>
        </div>

        {/* Color Tokens */}
        <Section title="Color Tokens">
          <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-4">
            <Swatch name="Background" bg="bg-background" text="text-foreground" />
            <Swatch name="Foreground" bg="bg-foreground" text="text-background" />
            <Swatch name="Card" bg="bg-card" text="text-foreground" />
            <Swatch name="Primary" bg="bg-primary" text="text-white" />
            <Swatch name="Secondary" bg="bg-secondary" text="text-secondary-foreground" />
            <Swatch name="Accent" bg="bg-accent" text="text-accent-foreground" />
            <Swatch name="Muted" bg="bg-muted" text="text-muted-foreground" />
            <Swatch name="Destructive" bg="bg-destructive" text="text-white" />
          </div>
        </Section>

        {/* Typography */}
        <Section title="Typography">
          <div className="space-y-4 bg-white rounded-2xl border-2 border-foreground p-6">
            <div>
              <p className="font-sans text-xs text-muted-foreground uppercase tracking-wider mb-1">Caveat — Display / Headings</p>
              <p className="font-display text-5xl font-bold text-foreground">The Diner</p>
              <p className="font-display text-3xl font-bold text-foreground">Order #42</p>
              <p className="font-display text-xl font-bold text-foreground">Smash Burger</p>
            </div>
            <div className="border-t border-foreground/10 pt-4">
              <p className="font-sans text-xs text-muted-foreground uppercase tracking-wider mb-1">DM Sans — Body / UI</p>
              <p className="font-sans text-lg font-semibold text-foreground">Section Header</p>
              <p className="font-sans text-sm text-foreground">Regular body text for descriptions and labels in the interface.</p>
              <p className="font-sans text-xs text-muted-foreground">Small / muted text for secondary information and metadata.</p>
            </div>
          </div>
        </Section>

        {/* Spacing */}
        <Section title="Spacing Scale">
          <div className="flex items-end gap-3 flex-wrap bg-white rounded-2xl border-2 border-foreground p-6">
            {[1, 2, 3, 4, 6, 8, 10, 12, 16].map((size) => (
              <div key={size} className="flex flex-col items-center gap-1">
                <div className={`bg-primary rounded`} style={{ width: size * 4, height: size * 4 }} />
                <p className="font-sans text-xs text-muted-foreground">{size * 4}px</p>
              </div>
            ))}
          </div>
        </Section>

        {/* Buttons */}
        <Section title="Buttons">
          <div className="bg-white rounded-2xl border-2 border-foreground p-6 space-y-4">
            <div className="flex flex-wrap gap-3">
              <button data-testid="ds-button-primary" className="px-5 py-2.5 bg-primary text-white rounded-xl font-sans text-sm font-medium border-2 border-primary hover:bg-primary/90 transition-colors shadow-sm">Primary</button>
              <button data-testid="ds-button-secondary" className="px-5 py-2.5 bg-secondary text-secondary-foreground rounded-xl font-sans text-sm font-medium border-2 border-foreground hover:bg-secondary/90 transition-colors shadow-sm">Secondary</button>
              <button data-testid="ds-button-ghost" className="px-5 py-2.5 text-foreground rounded-xl font-sans text-sm font-medium border-2 border-foreground/30 hover:border-foreground transition-colors">Ghost</button>
              <button data-testid="ds-button-destructive" className="px-5 py-2.5 bg-destructive text-white rounded-xl font-sans text-sm font-medium border-2 border-destructive hover:bg-destructive/90 transition-colors shadow-sm">Destructive</button>
              <button data-testid="ds-button-disabled" disabled className="px-5 py-2.5 bg-primary text-white rounded-xl font-sans text-sm font-medium border-2 border-primary opacity-50 cursor-not-allowed">Disabled</button>
            </div>
            <div className="flex flex-wrap gap-3">
              <button className="px-3 py-1.5 bg-primary text-white rounded-full font-sans text-xs font-medium border-2 border-primary hover:bg-primary/90 transition-colors">Small Pill</button>
              <button className="px-5 py-2.5 bg-primary text-white rounded-full font-sans text-sm font-medium border-2 border-primary hover:bg-primary/90 transition-colors">Medium Pill</button>
              <button className="px-7 py-3.5 bg-primary text-white rounded-full font-sans text-base font-medium border-2 border-primary hover:bg-primary/90 transition-colors">Large Pill</button>
            </div>
          </div>
        </Section>

        {/* Badges */}
        <Section title="Status Badges">
          <div className="flex flex-wrap gap-3">
            {["pending", "accepted", "preparing", "ready", "fulfilled", "cancelled"].map((s) => (
              <StatusBadge key={s} status={s} />
            ))}
          </div>
        </Section>

        {/* Inputs */}
        <Section title="Inputs">
          <div className="bg-white rounded-2xl border-2 border-foreground p-6 grid grid-cols-2 gap-4">
            <div>
              <label className="font-sans text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">Text Input</label>
              <input data-testid="ds-input-text" placeholder="Enter value..." className="font-sans text-sm w-full bg-background border-2 border-foreground rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div>
              <label className="font-sans text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">Select</label>
              <select data-testid="ds-select" className="font-sans text-sm w-full bg-background border-2 border-foreground rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary">
                <option>Option 1</option>
                <option>Option 2</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="font-sans text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">Textarea</label>
              <textarea data-testid="ds-textarea" rows={3} placeholder="Enter notes..." className="font-sans text-sm w-full bg-background border-2 border-foreground rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary resize-none" />
            </div>
            <div className="flex items-center gap-3">
              <input data-testid="ds-checkbox" type="checkbox" id="ds-cb" className="w-4 h-4 accent-primary" defaultChecked />
              <label htmlFor="ds-cb" className="font-sans text-sm text-foreground">Checkbox (checked)</label>
            </div>
            <div className="flex items-center gap-3">
              <button data-testid="ds-toggle" className="relative inline-flex h-6 w-11 rounded-full border-2 border-foreground/30 bg-primary">
                <span className="inline-block w-4 h-4 rounded-full bg-white shadow translate-y-px translate-x-5" />
              </button>
              <span className="font-sans text-sm text-foreground">Toggle (on)</span>
            </div>
          </div>
        </Section>

        {/* Cards */}
        <Section title="Cards / Surfaces">
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl border-2 border-foreground p-5 shadow-[0_8px_24px_rgba(26,16,8,0.08)]">
              <p className="font-display text-lg font-bold text-foreground">Standard Card</p>
              <p className="font-sans text-xs text-muted-foreground mt-1">White surface, 2px border, 16px radius</p>
            </div>
            <div className="bg-primary text-white rounded-2xl border-2 border-primary p-5 shadow-[0_8px_24px_rgba(232,64,28,0.25)]">
              <p className="font-display text-lg font-bold">Primary Card</p>
              <p className="font-sans text-xs text-white/70 mt-1">Used for KPI highlights</p>
            </div>
            <div className="bg-secondary text-secondary-foreground rounded-2xl border-2 border-foreground p-5 shadow-[0_8px_24px_rgba(26,16,8,0.08)]">
              <p className="font-display text-lg font-bold">Accent Card</p>
              <p className="font-sans text-xs text-secondary-foreground/70 mt-1">Golden yellow surface</p>
            </div>
          </div>
        </Section>

        {/* Skeleton Loaders */}
        <Section title="Skeleton Loaders">
          <div className="bg-white rounded-2xl border-2 border-foreground p-6 space-y-3">
            <Skeleton className="h-8 w-48 rounded-xl" />
            <Skeleton className="h-4 w-full rounded-xl" />
            <Skeleton className="h-4 w-3/4 rounded-xl" />
            <div className="grid grid-cols-4 gap-3 pt-2">
              <Skeleton className="h-24 rounded-xl" />
              <Skeleton className="h-24 rounded-xl" />
              <Skeleton className="h-24 rounded-xl" />
              <Skeleton className="h-24 rounded-xl" />
            </div>
          </div>
        </Section>

        {/* Food SVGs */}
        <Section title="Food Illustrations">
          <div className="grid grid-cols-4 gap-6">
            {[
              { name: "Smash Burger", component: <SmashBurger /> },
              { name: "Seasoned Fries", component: <SeasonedFries /> },
              { name: "Strawberry Sundae", component: <StrawberrySundae /> },
              { name: "Homemade Cola", component: <HomemadeCola /> },
            ].map(({ name, component }) => (
              <div key={name} className="bg-white rounded-2xl border-2 border-foreground p-5 flex flex-col items-center gap-3 shadow-[0_8px_24px_rgba(26,16,8,0.08)]">
                <div className="[animation:float_3s_ease-in-out_infinite]">{component}</div>
                <p className="font-display text-sm font-bold text-foreground text-center">{name}</p>
              </div>
            ))}
          </div>
        </Section>
      </div>
    </Layout>
  );
}
