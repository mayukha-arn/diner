import { useState } from "react";
import { Layout } from "@/components/Layout";
import { SmashBurger } from "@/components/food-svgs/SmashBurger";
import { SeasonedFries } from "@/components/food-svgs/SeasonedFries";
import { StrawberrySundae } from "@/components/food-svgs/StrawberrySundae";
import { HomemadeCola } from "@/components/food-svgs/HomemadeCola";
import { MENU_ITEMS, CATEGORIES, MenuItem } from "@/data";
import { Pencil, Trash2, Plus, X } from "lucide-react";

const FOOD_SVG_MAP: Record<string, React.ReactNode> = {
  "Smash Burger": <SmashBurger />,
  "Seasoned Fries": <SeasonedFries />,
  "Ice Cream Sundae": <StrawberrySundae />,
  "Strawberry Sundae": <StrawberrySundae />,
  "Homemade Cola": <HomemadeCola />,
};

export default function MenuPage() {
  const [categoryFilter, setCategoryFilter] = useState<number | null>(null);
  const [items, setItems] = useState<MenuItem[]>(MENU_ITEMS);
  const [editItem, setEditItem] = useState<MenuItem | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", price: "", categoryId: 1, available: true });

  const filtered = categoryFilter ? items.filter((i) => i.categoryId === categoryFilter) : items;

  const openNew = () => {
    setEditItem(null);
    setForm({ name: "", description: "", price: "", categoryId: CATEGORIES[0].id, available: true });
    setShowModal(true);
  };

  const openEdit = (item: MenuItem) => {
    setEditItem(item);
    setForm({ name: item.name, description: item.description ?? "", price: String(item.price), categoryId: item.categoryId, available: item.available });
    setShowModal(true);
  };

  const save = () => {
    const cat = CATEGORIES.find((c) => c.id === form.categoryId)!;
    if (editItem) {
      setItems((prev) => prev.map((i) => i.id === editItem.id ? { ...i, ...form, price: parseFloat(form.price), categoryName: cat.name } : i));
    } else {
      const newId = Math.max(...items.map((i) => i.id)) + 1;
      setItems((prev) => [...prev, { id: newId, ...form, price: parseFloat(form.price) || 0, categoryName: cat.name }]);
    }
    setShowModal(false);
  };

  const remove = (id: number) => setItems((prev) => prev.filter((i) => i.id !== id));

  const toggle = (id: number) => setItems((prev) => prev.map((i) => i.id === id ? { ...i, available: !i.available } : i));

  return (
    <Layout>
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl border-2 border-foreground shadow-[0_16px_48px_rgba(26,16,8,0.2)] w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display text-2xl font-bold text-foreground">{editItem ? "Edit Item" : "New Item"}</h3>
              <button onClick={() => setShowModal(false)}><X size={20} className="text-muted-foreground" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="font-sans text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">Category</label>
                <select
                  value={form.categoryId}
                  onChange={(e) => setForm((f) => ({ ...f, categoryId: parseInt(e.target.value) }))}
                  className="font-sans text-sm w-full bg-background border-2 border-foreground rounded-xl px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="font-sans text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">Name</label>
                <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="font-sans text-sm w-full bg-background border-2 border-foreground rounded-xl px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Item name" />
              </div>
              <div>
                <label className="font-sans text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">Description</label>
                <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} rows={2} className="font-sans text-sm w-full bg-background border-2 border-foreground rounded-xl px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none" />
              </div>
              <div>
                <label className="font-sans text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">Price ($)</label>
                <input type="number" step="0.01" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} className="font-sans text-sm w-full bg-background border-2 border-foreground rounded-xl px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary" placeholder="0.00" />
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" checked={form.available} onChange={(e) => setForm((f) => ({ ...f, available: e.target.checked }))} id="avail" className="w-4 h-4 accent-primary" />
                <label htmlFor="avail" className="font-sans text-sm text-foreground">Available</label>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowModal(false)} className="flex-1 font-sans text-sm py-2.5 rounded-xl border-2 border-foreground/30 text-muted-foreground hover:border-foreground transition-colors">Cancel</button>
                <button onClick={save} className="flex-1 font-sans text-sm py-2.5 rounded-xl bg-primary text-white font-medium hover:bg-primary/90 transition-colors shadow-sm">{editItem ? "Save Changes" : "Add Item"}</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="p-8 max-w-7xl mx-auto">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h2 className="font-display text-4xl font-bold text-foreground">Menu</h2>
            <p className="font-sans text-muted-foreground mt-1">Manage your offerings.</p>
          </div>
          <button onClick={openNew} className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl font-sans text-sm font-medium shadow-sm hover:bg-primary/90 transition-colors border-2 border-primary">
            <Plus size={16} /> Add Item
          </button>
        </div>

        <div className="flex gap-2 mb-6 flex-wrap">
          <button onClick={() => setCategoryFilter(null)} className={`font-sans text-sm px-4 py-2 rounded-full border-2 border-foreground transition-all font-medium ${categoryFilter === null ? "bg-foreground text-background" : "bg-white text-foreground hover:bg-foreground/5"}`}>All</button>
          {CATEGORIES.map((cat) => (
            <button key={cat.id} onClick={() => setCategoryFilter(cat.id)} className={`font-sans text-sm px-4 py-2 rounded-full border-2 border-foreground transition-all font-medium ${categoryFilter === cat.id ? "bg-foreground text-background" : "bg-white text-foreground hover:bg-foreground/5"}`}>{cat.name}</button>
          ))}
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((item) => (
            <div key={item.id} className={`bg-white rounded-2xl border-2 border-foreground p-5 flex flex-col gap-3 shadow-[0_8px_24px_rgba(26,16,8,0.08)] transition-all duration-200 ${!item.available ? "opacity-60" : ""}`}>
              <div className="flex justify-center">
                <div className="[animation:float_3s_ease-in-out_infinite]">
                  {FOOD_SVG_MAP[item.name] ?? (
                    <div className="w-20 h-20 rounded-xl bg-background/50 border-2 border-foreground/10 flex items-center justify-center">
                      <span className="font-display text-3xl font-bold text-muted-foreground/40">{item.name.charAt(0)}</span>
                    </div>
                  )}
                </div>
              </div>
              <div>
                <p className="font-display text-lg font-bold text-foreground leading-tight">{item.name}</p>
                <p className="font-sans text-xs text-muted-foreground mt-0.5">{item.categoryName}</p>
                {item.description && <p className="font-sans text-xs text-muted-foreground mt-1 line-clamp-2">{item.description}</p>}
              </div>
              <div className="flex items-center justify-between mt-auto">
                <span className="font-display text-xl font-bold text-primary">${item.price.toFixed(2)}</span>
                <div className="flex items-center gap-1">
                  <button onClick={() => openEdit(item)} className="p-1.5 rounded-lg hover:bg-background/70 text-muted-foreground hover:text-foreground transition-colors"><Pencil size={14} /></button>
                  <button onClick={() => remove(item.id)} className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"><Trash2 size={14} /></button>
                </div>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-foreground/10">
                <span className="font-sans text-xs text-muted-foreground">{item.available ? "Available" : "Unavailable"}</span>
                <button onClick={() => toggle(item.id)} className={`relative inline-flex h-5 w-9 rounded-full border-2 border-foreground/30 transition-colors duration-200 ${item.available ? "bg-primary" : "bg-foreground/20"}`}>
                  <span className={`inline-block w-3 h-3 rounded-full bg-white shadow transition-transform duration-200 translate-y-px ${item.available ? "translate-x-4" : "translate-x-0.5"}`} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
