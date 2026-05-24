import { useState } from "react";
import { useListCategories, useListMenuItems, useToggleMenuItemAvailability, useCreateMenuItem, useUpdateMenuItem, useDeleteMenuItem, getListMenuItemsQueryKey, getListCategoriesQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Layout } from "@/components/Layout";
import { Skeleton } from "@/components/ui/skeleton";
import { SmashBurger } from "@/components/food-svgs/SmashBurger";
import { SeasonedFries } from "@/components/food-svgs/SeasonedFries";
import { StrawberrySundae } from "@/components/food-svgs/StrawberrySundae";
import { HomemadeCola } from "@/components/food-svgs/HomemadeCola";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const FOOD_SVG_MAP: Record<string, React.ReactNode> = {
  "Smash Burger": <SmashBurger />,
  "Seasoned Fries": <SeasonedFries />,
  "Strawberry Sundae": <StrawberrySundae />,
  "Homemade Cola": <HomemadeCola />,
};

const itemSchema = z.object({
  categoryId: z.coerce.number().min(1, "Required"),
  name: z.string().min(1, "Required"),
  description: z.string().optional(),
  price: z.coerce.number().min(0, "Must be positive"),
  available: z.boolean().default(true),
});
type ItemForm = z.infer<typeof itemSchema>;

function ItemModal({
  open,
  onClose,
  editItem,
  categories,
}: {
  open: boolean;
  onClose: () => void;
  editItem?: { id: number; categoryId: number; name: string; description?: string | null; price: number; available: boolean } | null;
  categories: { id: number; name: string }[];
}) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const createMutation = useCreateMenuItem({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListMenuItemsQueryKey() });
        toast({ title: "Item created" });
        onClose();
      },
      onError: () => toast({ title: "Failed to create item", variant: "destructive" }),
    }
  });

  const updateMutation = useUpdateMenuItem({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListMenuItemsQueryKey() });
        toast({ title: "Item updated" });
        onClose();
      },
      onError: () => toast({ title: "Failed to update item", variant: "destructive" }),
    }
  });

  const form = useForm<ItemForm>({
    resolver: zodResolver(itemSchema),
    defaultValues: {
      categoryId: editItem?.categoryId ?? (categories[0]?.id ?? 1),
      name: editItem?.name ?? "",
      description: editItem?.description ?? "",
      price: editItem?.price ?? 0,
      available: editItem?.available ?? true,
    },
  });

  if (!open) return null;

  const onSubmit = (data: ItemForm) => {
    if (editItem) {
      updateMutation.mutate({ id: editItem.id, data: { ...data, description: data.description || null } });
    } else {
      createMutation.mutate({ data: { ...data, description: data.description || undefined } });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl border-2 border-foreground shadow-[0_16px_48px_rgba(26,16,8,0.2)] w-full max-w-md p-6" data-testid="item-modal">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-display text-2xl font-bold text-foreground">{editItem ? "Edit Item" : "New Item"}</h3>
          <button data-testid="button-close-modal" onClick={onClose}><X size={20} className="text-muted-foreground" /></button>
        </div>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="font-sans text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">Category</label>
            <select
              data-testid="select-item-category"
              {...form.register("categoryId")}
              className="font-sans text-sm w-full bg-background border-2 border-foreground rounded-xl px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="font-sans text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">Name</label>
            <input
              data-testid="input-item-name"
              {...form.register("name")}
              className="font-sans text-sm w-full bg-background border-2 border-foreground rounded-xl px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Smash Burger"
            />
          </div>
          <div>
            <label className="font-sans text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">Description</label>
            <textarea
              data-testid="input-item-description"
              {...form.register("description")}
              rows={2}
              className="font-sans text-sm w-full bg-background border-2 border-foreground rounded-xl px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              placeholder="Optional description"
            />
          </div>
          <div>
            <label className="font-sans text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">Price ($)</label>
            <input
              data-testid="input-item-price"
              type="number"
              step="0.01"
              {...form.register("price")}
              className="font-sans text-sm w-full bg-background border-2 border-foreground rounded-xl px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="0.00"
            />
          </div>
          <div className="flex items-center gap-3">
            <input data-testid="checkbox-item-available" type="checkbox" {...form.register("available")} id="available" className="w-4 h-4 accent-primary rounded" />
            <label htmlFor="available" className="font-sans text-sm text-foreground">Available</label>
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              data-testid="button-cancel-item"
              onClick={onClose}
              className="flex-1 font-sans text-sm py-2.5 rounded-xl border-2 border-foreground/30 text-muted-foreground hover:border-foreground transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              data-testid="button-save-item"
              disabled={createMutation.isPending || updateMutation.isPending}
              className="flex-1 font-sans text-sm py-2.5 rounded-xl bg-primary text-white font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 shadow-sm"
            >
              {editItem ? "Save Changes" : "Add Item"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function MenuPage() {
  const [categoryFilter, setCategoryFilter] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: categories, isLoading: catsLoading } = useListCategories();
  const { data: items, isLoading: itemsLoading } = useListMenuItems({
    categoryId: categoryFilter ?? undefined,
  });

  const toggleAvailability = useToggleMenuItemAvailability({
    mutation: {
      onSuccess: () => queryClient.invalidateQueries({ queryKey: getListMenuItemsQueryKey() }),
      onError: () => toast({ title: "Failed to update availability", variant: "destructive" }),
    }
  });

  const deleteItem = useDeleteMenuItem({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListMenuItemsQueryKey() });
        toast({ title: "Item deleted" });
      },
      onError: () => toast({ title: "Failed to delete item", variant: "destructive" }),
    }
  });

  return (
    <Layout>
      <ItemModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditItem(null); }}
        editItem={editItem}
        categories={categories ?? []}
      />
      <div className="p-8 max-w-7xl mx-auto">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h2 className="font-display text-4xl font-bold text-foreground">Menu</h2>
            <p className="font-sans text-muted-foreground mt-1">Manage your offerings.</p>
          </div>
          <button
            data-testid="button-add-item"
            onClick={() => { setEditItem(null); setModalOpen(true); }}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl font-sans text-sm font-medium shadow-sm hover:bg-primary/90 transition-colors border-2 border-primary"
          >
            <Plus size={16} />
            Add Item
          </button>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          <button
            data-testid="button-cat-all"
            onClick={() => setCategoryFilter(null)}
            className={`font-sans text-sm px-4 py-2 rounded-full border-2 border-foreground transition-all font-medium ${categoryFilter === null ? "bg-foreground text-background" : "bg-white text-foreground hover:bg-foreground/5"}`}
          >
            All
          </button>
          {(categories ?? []).map((cat) => (
            <button
              key={cat.id}
              data-testid={`button-cat-${cat.id}`}
              onClick={() => setCategoryFilter(cat.id)}
              className={`font-sans text-sm px-4 py-2 rounded-full border-2 border-foreground transition-all font-medium ${categoryFilter === cat.id ? "bg-foreground text-background" : "bg-white text-foreground hover:bg-foreground/5"}`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Items Grid */}
        {itemsLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-52 rounded-2xl" />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {(items ?? []).map((item) => (
              <div
                key={item.id}
                data-testid={`menu-item-${item.id}`}
                className={`bg-white rounded-2xl border-2 border-foreground p-5 flex flex-col gap-3 shadow-[0_8px_24px_rgba(26,16,8,0.08)] transition-all duration-200 ${!item.available ? "opacity-60" : ""}`}
              >
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
                  {item.description && (
                    <p className="font-sans text-xs text-muted-foreground mt-1 line-clamp-2">{item.description}</p>
                  )}
                </div>
                <div className="flex items-center justify-between mt-auto">
                  <span className="font-display text-xl font-bold text-primary">${item.price.toFixed(2)}</span>
                  <div className="flex items-center gap-1">
                    <button
                      data-testid={`button-edit-item-${item.id}`}
                      onClick={() => { setEditItem(item); setModalOpen(true); }}
                      className="p-1.5 rounded-lg hover:bg-background/70 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      data-testid={`button-delete-item-${item.id}`}
                      onClick={() => deleteItem.mutate({ id: item.id })}
                      className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                {/* Availability toggle */}
                <div className="flex items-center justify-between pt-2 border-t border-foreground/10">
                  <span className="font-sans text-xs text-muted-foreground">{item.available ? "Available" : "Unavailable"}</span>
                  <button
                    data-testid={`toggle-availability-${item.id}`}
                    onClick={() => toggleAvailability.mutate({ id: item.id, data: { available: !item.available } })}
                    className={`relative inline-flex h-5 w-9 rounded-full border-2 border-foreground/30 transition-colors duration-200 ${item.available ? "bg-primary" : "bg-foreground/20"}`}
                  >
                    <span className={`inline-block w-3 h-3 rounded-full bg-white shadow transition-transform duration-200 translate-y-px ${item.available ? "translate-x-4" : "translate-x-0.5"}`} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
