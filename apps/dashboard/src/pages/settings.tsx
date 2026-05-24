import { useGetSettings, useUpdateSettings, getGetSettingsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Layout } from "@/components/Layout";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function SettingsPage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: settings, isLoading } = useGetSettings();
  const updateSettings = useUpdateSettings({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetSettingsQueryKey() });
        toast({ title: "Settings saved" });
      },
      onError: () => toast({ title: "Failed to save settings", variant: "destructive" }),
    }
  });

  const [form, setForm] = useState({
    restaurantName: "",
    prepTimeMinutes: 15,
    autoAccept: false,
    serviceAvailable: true,
    openingHours: DAYS.map((day) => ({ day, open: "07:00", close: "22:00", closed: false })),
  });

  useEffect(() => {
    if (settings) {
      setForm({
        restaurantName: settings.restaurantName,
        prepTimeMinutes: settings.prepTimeMinutes,
        autoAccept: settings.autoAccept,
        serviceAvailable: settings.serviceAvailable,
        openingHours: (settings.openingHours as any[]) ?? DAYS.map((day) => ({ day, open: "07:00", close: "22:00", closed: false })),
      });
    }
  }, [settings]);

  const handleSave = () => {
    updateSettings.mutate({ data: form as any });
  };

  const updateHours = (day: string, field: string, value: string | boolean) => {
    setForm((f) => ({
      ...f,
      openingHours: f.openingHours.map((h) =>
        h.day === day ? { ...h, [field]: value } : h
      ),
    }));
  };

  return (
    <Layout>
      <div className="p-8 max-w-2xl mx-auto">
        <div className="mb-8">
          <h2 className="font-display text-4xl font-bold text-foreground">Settings</h2>
          <p className="font-sans text-muted-foreground mt-1">Configure your diner.</p>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-16 w-full rounded-2xl" />)}
          </div>
        ) : (
          <div className="space-y-6">
            {/* General */}
            <div className="bg-white rounded-2xl border-2 border-foreground p-6 shadow-[0_8px_24px_rgba(26,16,8,0.08)]">
              <h3 className="font-display text-xl font-bold text-foreground mb-5">General</h3>
              <div className="space-y-4">
                <div>
                  <label className="font-sans text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">Restaurant Name</label>
                  <input
                    data-testid="input-restaurant-name"
                    value={form.restaurantName}
                    onChange={(e) => setForm((f) => ({ ...f, restaurantName: e.target.value }))}
                    className="font-sans text-sm w-full bg-background border-2 border-foreground rounded-xl px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="font-sans text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">Prep Time (minutes)</label>
                  <input
                    data-testid="input-prep-time"
                    type="number"
                    min={1}
                    value={form.prepTimeMinutes}
                    onChange={(e) => setForm((f) => ({ ...f, prepTimeMinutes: parseInt(e.target.value) || 15 }))}
                    className="font-sans text-sm w-40 bg-background border-2 border-foreground rounded-xl px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            </div>

            {/* Operations */}
            <div className="bg-white rounded-2xl border-2 border-foreground p-6 shadow-[0_8px_24px_rgba(26,16,8,0.08)]">
              <h3 className="font-display text-xl font-bold text-foreground mb-5">Operations</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-sans text-sm font-medium text-foreground">Auto-Accept Orders</p>
                    <p className="font-sans text-xs text-muted-foreground mt-0.5">Automatically accept incoming orders without manual review</p>
                  </div>
                  <button
                    data-testid="toggle-auto-accept"
                    onClick={() => setForm((f) => ({ ...f, autoAccept: !f.autoAccept }))}
                    className={`relative inline-flex h-6 w-11 rounded-full border-2 border-foreground/30 transition-colors duration-200 ${form.autoAccept ? "bg-primary" : "bg-foreground/20"}`}
                  >
                    <span className={`inline-block w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 translate-y-px ${form.autoAccept ? "translate-x-5" : "translate-x-0.5"}`} />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-sans text-sm font-medium text-foreground">Service Available</p>
                    <p className="font-sans text-xs text-muted-foreground mt-0.5">Accept new orders when the diner is open for service</p>
                  </div>
                  <button
                    data-testid="toggle-service-available"
                    onClick={() => setForm((f) => ({ ...f, serviceAvailable: !f.serviceAvailable }))}
                    className={`relative inline-flex h-6 w-11 rounded-full border-2 border-foreground/30 transition-colors duration-200 ${form.serviceAvailable ? "bg-primary" : "bg-foreground/20"}`}
                  >
                    <span className={`inline-block w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 translate-y-px ${form.serviceAvailable ? "translate-x-5" : "translate-x-0.5"}`} />
                  </button>
                </div>
              </div>
            </div>

            {/* Opening Hours */}
            <div className="bg-white rounded-2xl border-2 border-foreground p-6 shadow-[0_8px_24px_rgba(26,16,8,0.08)]">
              <h3 className="font-display text-xl font-bold text-foreground mb-5">Opening Hours</h3>
              <div className="space-y-3">
                {form.openingHours.map((h) => (
                  <div key={h.day} className="flex items-center gap-4">
                    <span className="font-sans text-sm font-medium text-foreground w-24 flex-shrink-0">{h.day}</span>
                    <input
                      data-testid={`input-open-${h.day.toLowerCase()}`}
                      type="time"
                      value={h.open}
                      disabled={h.closed}
                      onChange={(e) => updateHours(h.day, "open", e.target.value)}
                      className="font-sans text-sm bg-background border-2 border-foreground rounded-xl px-3 py-1.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-40 w-28"
                    />
                    <span className="font-sans text-xs text-muted-foreground">to</span>
                    <input
                      data-testid={`input-close-${h.day.toLowerCase()}`}
                      type="time"
                      value={h.close}
                      disabled={h.closed}
                      onChange={(e) => updateHours(h.day, "close", e.target.value)}
                      className="font-sans text-sm bg-background border-2 border-foreground rounded-xl px-3 py-1.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-40 w-28"
                    />
                    <div className="flex items-center gap-2 ml-auto">
                      <input
                        data-testid={`checkbox-closed-${h.day.toLowerCase()}`}
                        type="checkbox"
                        checked={h.closed}
                        onChange={(e) => updateHours(h.day, "closed", e.target.checked)}
                        id={`closed-${h.day}`}
                        className="w-4 h-4 accent-primary"
                      />
                      <label htmlFor={`closed-${h.day}`} className="font-sans text-xs text-muted-foreground">Closed</label>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Save */}
            <button
              data-testid="button-save-settings"
              onClick={handleSave}
              disabled={updateSettings.isPending}
              className="w-full font-sans text-sm py-3 rounded-xl bg-primary text-white font-medium shadow-sm hover:bg-primary/90 transition-colors disabled:opacity-50 border-2 border-primary"
            >
              {updateSettings.isPending ? "Saving..." : "Save Settings"}
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
}
