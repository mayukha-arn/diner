import { Router } from "express";
import { db } from "@workspace/db";
import { customersTable, ordersTable, orderItemsTable } from "@workspace/db";
import { eq, desc, sql } from "drizzle-orm";
import {
  CreateCustomerBody,
  UpdateCustomerBody,
  ListCustomersQueryParams,
} from "@workspace/api-zod";

const router = Router();

router.get("/customers", async (req, res) => {
  try {
    const parsed = ListCustomersQueryParams.safeParse(req.query);
    const search = parsed.success ? parsed.data.search : undefined;

    const rows = await db
      .select({
        id: customersTable.id,
        name: customersTable.name,
        email: customersTable.email,
        phone: customersTable.phone,
        createdAt: customersTable.createdAt,
        orderCount: sql<number>`count(${ordersTable.id})::int`,
        totalSpend: sql<number>`coalesce(sum(${ordersTable.total}::numeric), 0)::float`,
        lastOrderDate: sql<string | null>`max(${ordersTable.createdAt})`,
      })
      .from(customersTable)
      .leftJoin(
        ordersTable,
        sql`${ordersTable.customerId} = ${customersTable.id} AND ${ordersTable.status} != 'cancelled'`,
      )
      .where(search ? sql`lower(${customersTable.name}) like ${'%' + search.toLowerCase() + '%'}` : undefined)
      .groupBy(customersTable.id)
      .orderBy(desc(customersTable.createdAt));

    res.json(
      rows.map((r) => ({
        id: r.id,
        name: r.name,
        email: r.email,
        phone: r.phone,
        orderCount: r.orderCount,
        totalSpend: r.totalSpend,
        lastOrderDate: r.lastOrderDate ? new Date(r.lastOrderDate).toISOString() : null,
        createdAt: r.createdAt.toISOString(),
      })),
    );
  } catch (err) {
    req.log.error({ err }, "Failed to list customers");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/customers", async (req, res) => {
  try {
    const parsed = CreateCustomerBody.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "Invalid request body" });

    const [customer] = await db
      .insert(customersTable)
      .values({
        name: parsed.data.name,
        email: parsed.data.email ?? null,
        phone: parsed.data.phone ?? null,
      })
      .returning();

    res.status(201).json({
      id: customer!.id,
      name: customer!.name,
      email: customer!.email,
      phone: customer!.phone,
      createdAt: customer!.createdAt.toISOString(),
    });
  } catch (err) {
    req.log.error({ err }, "Failed to create customer");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/customers/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id!);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid id" });

    const [customer] = await db
      .select()
      .from(customersTable)
      .where(eq(customersTable.id, id));

    if (!customer) return res.status(404).json({ error: "Customer not found" });

    const [stats] = await db
      .select({
        orderCount: sql<number>`count(${ordersTable.id})::int`,
        totalSpend: sql<number>`coalesce(sum(${ordersTable.total}::numeric), 0)::float`,
        lastOrderDate: sql<string | null>`max(${ordersTable.createdAt})`,
      })
      .from(ordersTable)
      .where(sql`${ordersTable.customerId} = ${id} AND ${ordersTable.status} != 'cancelled'`);

    const orders = await db
      .select()
      .from(ordersTable)
      .where(eq(ordersTable.customerId, id))
      .orderBy(desc(ordersTable.createdAt));

    const orderIds = orders.map((o) => o.id);
    let itemsMap: Record<number, typeof orderItemsTable.$inferSelect[]> = {};
    if (orderIds.length > 0) {
      const items = await db
        .select()
        .from(orderItemsTable)
        .where(sql`${orderItemsTable.orderId} = ANY(ARRAY[${sql.raw(orderIds.join(","))}]::int[])`);
      for (const item of items) {
        if (!itemsMap[item.orderId]) itemsMap[item.orderId] = [];
        itemsMap[item.orderId]!.push(item);
      }
    }

    res.json({
      id: customer.id,
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      orderCount: stats?.orderCount ?? 0,
      totalSpend: stats?.totalSpend ?? 0,
      lastOrderDate: stats?.lastOrderDate ? new Date(stats.lastOrderDate).toISOString() : null,
      createdAt: customer.createdAt.toISOString(),
      orders: orders.map((o) => ({
        id: o.id,
        customerId: o.customerId,
        customerName: customer.name,
        status: o.status,
        total: parseFloat(o.total as string),
        notes: o.notes,
        createdAt: o.createdAt.toISOString(),
        updatedAt: o.updatedAt.toISOString(),
        items: (itemsMap[o.id] ?? []).map((i) => ({
          menuItemId: i.menuItemId,
          name: i.name,
          quantity: i.quantity,
          unitPrice: parseFloat(i.unitPrice as string),
        })),
      })),
    });
  } catch (err) {
    req.log.error({ err }, "Failed to get customer");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/customers/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id!);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid id" });

    const parsed = UpdateCustomerBody.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "Invalid request body" });

    const updates: Partial<typeof customersTable.$inferInsert> = {};
    if (parsed.data.name !== undefined) updates.name = parsed.data.name;
    if (parsed.data.email !== undefined) updates.email = parsed.data.email;
    if (parsed.data.phone !== undefined) updates.phone = parsed.data.phone;

    const [customer] = await db
      .update(customersTable)
      .set(updates)
      .where(eq(customersTable.id, id))
      .returning();

    if (!customer) return res.status(404).json({ error: "Customer not found" });

    res.json({
      id: customer.id,
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      createdAt: customer.createdAt.toISOString(),
    });
  } catch (err) {
    req.log.error({ err }, "Failed to update customer");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
