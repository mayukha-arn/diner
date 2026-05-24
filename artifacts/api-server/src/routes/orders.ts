import { Router } from "express";
import { db } from "@workspace/db";
import { ordersTable, orderItemsTable, menuItemsTable, customersTable } from "@workspace/db";
import { eq, sql, desc, and } from "drizzle-orm";
import {
  CreateOrderBody,
  UpdateOrderBody,
  UpdateOrderStatusBody,
  ListOrdersQueryParams,
} from "@workspace/api-zod";

const router = Router();

const VALID_TRANSITIONS: Record<string, string[]> = {
  pending: ["accepted", "cancelled"],
  accepted: ["preparing", "cancelled"],
  preparing: ["ready", "cancelled"],
  ready: ["fulfilled", "cancelled"],
  fulfilled: [],
  cancelled: [],
};

async function fetchOrdersWithItems(orderIds: number[]) {
  if (orderIds.length === 0) return [];
  const items = await db
    .select()
    .from(orderItemsTable)
    .where(
      sql`${orderItemsTable.orderId} = ANY(ARRAY[${sql.raw(orderIds.join(","))}]::int[])`,
    );
  return items;
}

async function buildOrderResponse(order: typeof ordersTable.$inferSelect, customerName: string | null, items: typeof orderItemsTable.$inferSelect[]) {
  return {
    id: order.id,
    customerId: order.customerId,
    customerName,
    status: order.status,
    total: parseFloat(order.total as string),
    notes: order.notes,
    createdAt: order.createdAt.toISOString(),
    updatedAt: order.updatedAt.toISOString(),
    items: items
      .filter((i) => i.orderId === order.id)
      .map((i) => ({
        menuItemId: i.menuItemId,
        name: i.name,
        quantity: i.quantity,
        unitPrice: parseFloat(i.unitPrice as string),
      })),
  };
}

router.get("/orders", async (req, res) => {
  try {
    const parsed = ListOrdersQueryParams.safeParse(req.query);
    const params = parsed.success ? parsed.data : {};

    const conditions = [];
    if (params.status) conditions.push(eq(ordersTable.status, params.status));
    if (params.date) conditions.push(sql`DATE(${ordersTable.createdAt}) = ${params.date}`);
    if (params.customerId) conditions.push(eq(ordersTable.customerId, params.customerId));

    const orders = await db
      .select()
      .from(ordersTable)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(ordersTable.createdAt));

    const orderIds = orders.map((o) => o.id);
    const items = orderIds.length > 0 ? await fetchOrdersWithItems(orderIds) : [];

    const customerIds = [...new Set(orders.filter((o) => o.customerId).map((o) => o.customerId!))] ;
    let customerMap: Record<number, string> = {};
    if (customerIds.length > 0) {
      const rows = await db
        .select({ id: customersTable.id, name: customersTable.name })
        .from(customersTable)
        .where(sql`${customersTable.id} = ANY(ARRAY[${sql.raw(customerIds.join(","))}]::int[])`);
      customerMap = Object.fromEntries(rows.map((r) => [r.id, r.name]));
    }

    res.json(
      await Promise.all(
        orders.map((o) =>
          buildOrderResponse(o, o.customerId ? (customerMap[o.customerId] ?? null) : null, items),
        ),
      ),
    );
  } catch (err) {
    req.log.error({ err }, "Failed to list orders");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/orders", async (req, res) => {
  try {
    const parsed = CreateOrderBody.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid request body" });
    }
    const { customerId, notes, items } = parsed.data;

    // Fetch menu items to get prices
    const menuItemIds = items.map((i) => i.menuItemId);
    const menuItems = await db
      .select()
      .from(menuItemsTable)
      .where(sql`${menuItemsTable.id} = ANY(ARRAY[${sql.raw(menuItemIds.join(","))}]::int[])`);

    const menuItemMap = Object.fromEntries(menuItems.map((m) => [m.id, m]));
    const total = items.reduce((sum, item) => {
      const mi = menuItemMap[item.menuItemId];
      return sum + (mi ? parseFloat(mi.price as string) * item.quantity : 0);
    }, 0);

    const [order] = await db
      .insert(ordersTable)
      .values({
        customerId: customerId ?? null,
        notes: notes ?? null,
        total: total.toFixed(2),
        status: "pending",
      })
      .returning();

    if (!order) return res.status(500).json({ error: "Failed to create order" });

    await db.insert(orderItemsTable).values(
      items.map((item) => ({
        orderId: order.id,
        menuItemId: item.menuItemId,
        name: menuItemMap[item.menuItemId]?.name ?? "Unknown",
        quantity: item.quantity,
        unitPrice: (menuItemMap[item.menuItemId]
          ? parseFloat(menuItemMap[item.menuItemId]!.price as string)
          : 0
        ).toFixed(2),
      })),
    );

    const orderItems = await db
      .select()
      .from(orderItemsTable)
      .where(eq(orderItemsTable.orderId, order.id));

    let customerName: string | null = null;
    if (order.customerId) {
      const [cust] = await db
        .select({ name: customersTable.name })
        .from(customersTable)
        .where(eq(customersTable.id, order.customerId));
      customerName = cust?.name ?? null;
    }

    res.status(201).json(await buildOrderResponse(order, customerName, orderItems));
  } catch (err) {
    req.log.error({ err }, "Failed to create order");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/orders/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id!);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid id" });

    const [order] = await db.select().from(ordersTable).where(eq(ordersTable.id, id));
    if (!order) return res.status(404).json({ error: "Order not found" });

    const items = await db
      .select()
      .from(orderItemsTable)
      .where(eq(orderItemsTable.orderId, id));

    let customerName: string | null = null;
    if (order.customerId) {
      const [cust] = await db
        .select({ name: customersTable.name })
        .from(customersTable)
        .where(eq(customersTable.id, order.customerId));
      customerName = cust?.name ?? null;
    }

    res.json(await buildOrderResponse(order, customerName, items));
  } catch (err) {
    req.log.error({ err }, "Failed to get order");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/orders/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id!);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid id" });

    const parsed = UpdateOrderBody.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "Invalid request body" });

    const [order] = await db
      .update(ordersTable)
      .set({ customerId: parsed.data.customerId ?? null, notes: parsed.data.notes ?? null })
      .where(eq(ordersTable.id, id))
      .returning();

    if (!order) return res.status(404).json({ error: "Order not found" });

    const items = await db
      .select()
      .from(orderItemsTable)
      .where(eq(orderItemsTable.orderId, id));

    let customerName: string | null = null;
    if (order.customerId) {
      const [cust] = await db
        .select({ name: customersTable.name })
        .from(customersTable)
        .where(eq(customersTable.id, order.customerId));
      customerName = cust?.name ?? null;
    }

    res.json(await buildOrderResponse(order, customerName, items));
  } catch (err) {
    req.log.error({ err }, "Failed to update order");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/orders/:id/status", async (req, res) => {
  try {
    const id = parseInt(req.params.id!);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid id" });

    const parsed = UpdateOrderStatusBody.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "Invalid request body" });

    const [existing] = await db.select().from(ordersTable).where(eq(ordersTable.id, id));
    if (!existing) return res.status(404).json({ error: "Order not found" });

    const allowed = VALID_TRANSITIONS[existing.status] ?? [];
    if (!allowed.includes(parsed.data.status)) {
      return res.status(400).json({
        error: `Cannot transition from ${existing.status} to ${parsed.data.status}`,
      });
    }

    const [order] = await db
      .update(ordersTable)
      .set({ status: parsed.data.status })
      .where(eq(ordersTable.id, id))
      .returning();

    if (!order) return res.status(404).json({ error: "Order not found" });

    const items = await db
      .select()
      .from(orderItemsTable)
      .where(eq(orderItemsTable.orderId, id));

    let customerName: string | null = null;
    if (order.customerId) {
      const [cust] = await db
        .select({ name: customersTable.name })
        .from(customersTable)
        .where(eq(customersTable.id, order.customerId));
      customerName = cust?.name ?? null;
    }

    res.json(await buildOrderResponse(order, customerName, items));
  } catch (err) {
    req.log.error({ err }, "Failed to update order status");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
