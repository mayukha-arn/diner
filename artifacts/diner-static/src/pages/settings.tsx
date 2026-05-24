import { useState } from "react";
import { Layout } from "@/components/Layout";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

type DayHours = { day: string; open: string; close: string; closed: boolean };

const DEFAULT_HOURS: DayHours[] = DAYS.map((day) => ({
  day,
  open: "07:00",
  close: "22:00",
  closed: day === "Sunday",
}));

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    restaurantName: "The Diner",
    prepTimeMinutes: 15,
    autoAccept: false,
    serviceAvailable: true,
    openingHours: DEFAULT_HOURS,
  });

  const updateHours = (day: string, field: string, value: string | boolean) => {
    setForm((f) => ({ ...f, openingHours: f.openingHours.map((h) => h.day === day ? { ...h, [field]: value } : h) }));
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <Layout>
      <div className="p-8 max-w-2xl mx-auto">
        <div className="mb-8">
          <h2 className="font-display text-4xl font-bold text-foreground">Settings</h2>
          <p className="font-sans text-muted-foreground mt-1">Configure your diner.</p>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl border-2 border-foreground p-6 shadow-[0_8px_24px_rgba(26,16,8,0.08)]">
            <h3 className="font-display text-xl font-bold text-foreground mb-5">General</h3>
            <div className="space-y-4">
              <div>
                <label className="font-sans text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">Restaurant Name</label>
                <input value={form.restaurantName} onChange={(e) => setForm((f) => ({ ...f, restaurantName: e.target.value }))} className="font-sans text-sm w-full bg-background border-2 border-foreground rounded-xl px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div>
                <label className="font-sans text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">Prep Time (minutes)</label>
                <input type="number" min={1} value={form.prepTimeMinutes} onChange={(e) => setForm((f) => ({ ...f, prepTimeMinutes: parseInt(e.target.value) || 15 }))} className="font-sans text-sm w-40 bg-background border-2 border-foreground rounded-xl px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border-2 border-foreground p-6 shadow-[0_8px_24px_rgba(26,16,8,0.08)]">
            <h3 className="font-display text-xl font-bold text-foreground mb-5">Operations</h3>
            <div className="space-y-4">
              {[
                { key: "autoAccept", label: "Auto-Accept Orders", desc: "Automatically accept incoming orders without manual review" },
                { key: "serviceAvailable", label: "Service Available", desc: "Accept new orders when the diner is open for service" },
              ].map(({ key, label, desc }) => (
                <div key={key} className="flex items-center justify-between">
                  <div>
                    <p className="font-sans text-sm font-medium text-foreground">{label}</p>
                    <p className="font-sans text-xs text-muted-foreground mt-0.5">{desc}</p>
                  </div>
                  <button
                    onClick={() => setForm((f) => ({ ...f, [key]: !f[key as keyof typeof f] }))}
                    className={`relative inline-flex h-6 w-11 rounded-full border-2 border-foreground/30 transition-colors duration-200 ${form[key as "autoAccept" | "serviceAvailable"] ? "bg-primary" : "bg-foreground/20"}`}
                  >
                    <span className={`inline-block w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 translate-y-px ${form[key as "autoAccept" | "serviceAvailable"] ? "translate-x-5" : "translate-x-0.5"}`} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border-2 border-foreground p-6 shadow-[0_8px_24px_rgba(26,16,8,0.08)]">
            <h3 className="font-display text-xl font-bold text-foreground mb-5">Opening Hours</h3>
            <div className="space-y-3">
              {form.openingHours.map((h) => (
                <div key={h.day} className="flex items-center gap-4">
                  <span className="font-sans text-sm font-medium text-foreground w-24 flex-shrink-0">{h.day}</span>
                  <input type="time" value={h.open} disabled={h.closed} onChange={(e) => updateHours(h.day, "open", e.target.value)} className="font-sans text-sm bg-background border-2 border-foreground rounded-xl px-3 py-1.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-40 w-28" />
                  <span className="font-sans text-xs text-muted-foreground">to</span>
                  <input type="time" value={h.close} disabled={h.closed} onChange={(e) => updateHours(h.day, "close", e.target.value)} className="font-sans text-sm bg-background border-2 border-foreground rounded-xl px-3 py-1.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-40 w-28" />
                  <div className="flex items-center gap-2 ml-auto">
                    <input type="checkbox" checked={h.closed} onChange={(e) => updateHours(h.day, "closed", e.target.checked)} id={`closed-${h.day}`} className="w-4 h-4 accent-primary" />
                    <label htmlFor={`closed-${h.day}`} className="font-sans text-xs text-muted-foreground">Closed</label>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={handleSave}
            className={`w-full font-sans text-sm py-3 rounded-xl font-medium shadow-sm transition-all border-2 ${saved ? "bg-green-600 border-green-600 text-white" : "bg-primary border-primary text-white hover:bg-primary/90"}`}
          >
            {saved ? "Saved!" : "Save Settings"}
          </button>
        </div>
      </div>
    </Layout>
  );
}
