import { Router } from "express";
import { db } from "@workspace/db";
import { categoriesTable, menuItemsTable } from "@workspace/db";
import { eq, and, sql } from "drizzle-orm";
import {
  CreateCategoryBody,
  UpdateCategoryBody,
  CreateMenuItemBody,
  UpdateMenuItemBody,
  ToggleMenuItemAvailabilityBody,
  ListMenuItemsQueryParams,
} from "@workspace/api-zod";

const router = Router();

// ── Categories ────────────────────────────────────────────────────

router.get("/menu/categories", async (req, res) => {
  try {
    const categories = await db
      .select()
      .from(categoriesTable)
      .orderBy(categoriesTable.sortOrder, categoriesTable.name);
    res.json(
      categories.map((c) => ({ id: c.id, name: c.name, sortOrder: c.sortOrder })),
    );
  } catch (err) {
    req.log.error({ err }, "Failed to list categories");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/menu/categories", async (req, res) => {
  try {
    const parsed = CreateCategoryBody.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "Invalid request body" });

    const [cat] = await db
      .insert(categoriesTable)
      .values({ name: parsed.data.name, sortOrder: parsed.data.sortOrder ?? 0 })
      .returning();

    res.status(201).json({ id: cat!.id, name: cat!.name, sortOrder: cat!.sortOrder });
  } catch (err) {
    req.log.error({ err }, "Failed to create category");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/menu/categories/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id!);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid id" });

    const parsed = UpdateCategoryBody.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "Invalid request body" });

    const updates: Partial<typeof categoriesTable.$inferInsert> = {};
    if (parsed.data.name !== undefined) updates.name = parsed.data.name;
    if (parsed.data.sortOrder !== undefined) updates.sortOrder = parsed.data.sortOrder;

    const [cat] = await db
      .update(categoriesTable)
      .set(updates)
      .where(eq(categoriesTable.id, id))
      .returning();

    if (!cat) return res.status(404).json({ error: "Category not found" });
    res.json({ id: cat.id, name: cat.name, sortOrder: cat.sortOrder });
  } catch (err) {
    req.log.error({ err }, "Failed to update category");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/menu/categories/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id!);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid id" });

    await db.delete(categoriesTable).where(eq(categoriesTable.id, id));
    res.status(204).send();
  } catch (err) {
    req.log.error({ err }, "Failed to delete category");
    res.status(500).json({ error: "Internal server error" });
  }
});

// ── Menu Items ────────────────────────────────────────────────────

function formatMenuItem(item: typeof menuItemsTable.$inferSelect, categoryName: string | null) {
  return {
    id: item.id,
    categoryId: item.categoryId,
    categoryName,
    name: item.name,
    description: item.description,
    price: parseFloat(item.price as string),
    available: item.available,
    imageKey: item.imageKey,
    createdAt: item.createdAt.toISOString(),
  };
}

router.get("/menu/items", async (req, res) => {
  try {
    const parsed = ListMenuItemsQueryParams.safeParse(req.query);
    const params = parsed.success ? parsed.data : {};

    const conditions = [];
    if (params.categoryId !== undefined) conditions.push(eq(menuItemsTable.categoryId, params.categoryId));
    if (params.available !== undefined) conditions.push(eq(menuItemsTable.available, params.available));

    const rows = await db
      .select({
        item: menuItemsTable,
        categoryName: categoriesTable.name,
      })
      .from(menuItemsTable)
      .leftJoin(categoriesTable, eq(menuItemsTable.categoryId, categoriesTable.id))
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(categoriesTable.sortOrder, menuItemsTable.name);

    res.json(rows.map((r) => formatMenuItem(r.item, r.categoryName ?? null)));
  } catch (err) {
    req.log.error({ err }, "Failed to list menu items");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/menu/items", async (req, res) => {
  try {
    const parsed = CreateMenuItemBody.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "Invalid request body" });

    const [item] = await db
      .insert(menuItemsTable)
      .values({
        categoryId: parsed.data.categoryId,
        name: parsed.data.name,
        description: parsed.data.description ?? null,
        price: parsed.data.price.toFixed(2),
        available: parsed.data.available ?? true,
        imageKey: parsed.data.imageKey ?? null,
      })
      .returning();

    if (!item) return res.status(500).json({ error: "Failed to create item" });

    const [cat] = await db
      .select({ name: categoriesTable.name })
      .from(categoriesTable)
      .where(eq(categoriesTable.id, item.categoryId));

    res.status(201).json(formatMenuItem(item, cat?.name ?? null));
  } catch (err) {
    req.log.error({ err }, "Failed to create menu item");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/menu/items/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id!);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid id" });

    const [row] = await db
      .select({ item: menuItemsTable, categoryName: categoriesTable.name })
      .from(menuItemsTable)
      .leftJoin(categoriesTable, eq(menuItemsTable.categoryId, categoriesTable.id))
      .where(eq(menuItemsTable.id, id));

    if (!row) return res.status(404).json({ error: "Menu item not found" });
    res.json(formatMenuItem(row.item, row.categoryName ?? null));
  } catch (err) {
    req.log.error({ err }, "Failed to get menu item");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/menu/items/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id!);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid id" });

    const parsed = UpdateMenuItemBody.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "Invalid request body" });

    const updates: Partial<typeof menuItemsTable.$inferInsert> = {};
    if (parsed.data.categoryId !== undefined) updates.categoryId = parsed.data.categoryId;
    if (parsed.data.name !== undefined) updates.name = parsed.data.name;
    if (parsed.data.description !== undefined) updates.description = parsed.data.description;
    if (parsed.data.price !== undefined) updates.price = parsed.data.price.toFixed(2);
    if (parsed.data.available !== undefined) updates.available = parsed.data.available;
    if (parsed.data.imageKey !== undefined) updates.imageKey = parsed.data.imageKey;

    const [item] = await db
      .update(menuItemsTable)
      .set(updates)
      .where(eq(menuItemsTable.id, id))
      .returning();

    if (!item) return res.status(404).json({ error: "Menu item not found" });

    const [cat] = await db
      .select({ name: categoriesTable.name })
      .from(categoriesTable)
      .where(eq(categoriesTable.id, item.categoryId));

    res.json(formatMenuItem(item, cat?.name ?? null));
  } catch (err) {
    req.log.error({ err }, "Failed to update menu item");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/menu/items/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id!);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid id" });

    await db.delete(menuItemsTable).where(eq(menuItemsTable.id, id));
    res.status(204).send();
  } catch (err) {
    req.log.error({ err }, "Failed to delete menu item");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/menu/items/:id/availability", async (req, res) => {
  try {
    const id = parseInt(req.params.id!);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid id" });

    const parsed = ToggleMenuItemAvailabilityBody.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "Invalid request body" });

    const [item] = await db
      .update(menuItemsTable)
      .set({ available: parsed.data.available })
      .where(eq(menuItemsTable.id, id))
      .returning();

    if (!item) return res.status(404).json({ error: "Menu item not found" });

    const [cat] = await db
      .select({ name: categoriesTable.name })
      .from(categoriesTable)
      .where(eq(categoriesTable.id, item.categoryId));

    res.json(formatMenuItem(item, cat?.name ?? null));
  } catch (err) {
    req.log.error({ err }, "Failed to toggle availability");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
