import { Router } from "express";
import { db } from "@workspace/db";
import { ordersTable, orderItemsTable, menuItemsTable } from "@workspace/db";
import { sql, eq, gte, desc } from "drizzle-orm";

const router = Router();

router.get("/dashboard/summary", async (req, res) => {
  try {
    const [[totals], [todayTotals], pendingResult, popularResult] = await Promise.all([
      db
        .select({
          totalOrders: sql<number>`count(*)::int`,
          totalRevenue: sql<number>`coalesce(sum(${ordersTable.total}::numeric), 0)::float`,
        })
        .from(ordersTable)
        .where(sql`${ordersTable.status} != 'cancelled'`),
      db
        .select({
          todayOrders: sql<number>`count(*)::int`,
          todayRevenue: sql<number>`coalesce(sum(${ordersTable.total}::numeric), 0)::float`,
        })
        .from(ordersTable)
        .where(
          sql`${ordersTable.status} != 'cancelled' AND DATE(${ordersTable.createdAt}) = CURRENT_DATE`,
        ),
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(ordersTable)
        .where(eq(ordersTable.status, "pending")),
      db
        .select({
          name: menuItemsTable.name,
          count: sql<number>`count(*)::int`,
        })
        .from(orderItemsTable)
        .innerJoin(menuItemsTable, eq(orderItemsTable.menuItemId, menuItemsTable.id))
        .groupBy(menuItemsTable.name)
        .orderBy(desc(sql`count(*)`))
        .limit(1),
    ]);

    res.json({
      totalOrders: totals?.totalOrders ?? 0,
      totalRevenue: totals?.totalRevenue ?? 0,
      pendingOrders: pendingResult[0]?.count ?? 0,
      popularItem: popularResult[0]?.name ?? null,
      todayOrders: todayTotals?.todayOrders ?? 0,
      todayRevenue: todayTotals?.todayRevenue ?? 0,
    });
  } catch (err) {
    req.log.error({ err }, "Failed to get dashboard summary");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/dashboard/recent-orders", async (req, res) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 10, 50);

    const orders = await db
      .select()
      .from(ordersTable)
      .orderBy(desc(ordersTable.createdAt))
      .limit(limit);

    const orderIds = orders.map((o) => o.id);
    const items =
      orderIds.length > 0
        ? await db
            .select()
            .from(orderItemsTable)
            .where(sql`${orderItemsTable.orderId} = ANY(${sql.raw(`ARRAY[${orderIds.join(",")}]`)}::int[])`)
        : [];

    const customers = orders
      .filter((o) => o.customerId)
      .map((o) => o.customerId);

    let customerMap: Record<number, string> = {};
    if (customers.length > 0) {
      const { customersTable } = await import("@workspace/db");
      const rows = await db
        .select({ id: customersTable.id, name: customersTable.name })
        .from(customersTable)
        .where(sql`${customersTable.id} = ANY(${sql.raw(`ARRAY[${[...new Set(customers)].join(",")}]`)}::int[])`);
      customerMap = Object.fromEntries(rows.map((r) => [r.id, r.name]));
    }

    const result = orders.map((o) => ({
      id: o.id,
      customerId: o.customerId,
      customerName: o.customerId ? (customerMap[o.customerId] ?? null) : null,
      status: o.status,
      total: parseFloat(o.total as string),
      notes: o.notes,
      createdAt: o.createdAt.toISOString(),
      updatedAt: o.updatedAt.toISOString(),
      items: items
        .filter((i) => i.orderId === o.id)
        .map((i) => ({
          menuItemId: i.menuItemId,
          name: i.name,
          quantity: i.quantity,
          unitPrice: parseFloat(i.unitPrice as string),
        })),
    }));

    res.json(result);
  } catch (err) {
    req.log.error({ err }, "Failed to get recent orders");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/dashboard/top-items", async (req, res) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 4, 20);
    const { categoriesTable } = await import("@workspace/db");

    const rows = await db
      .select({
        id: menuItemsTable.id,
        name: menuItemsTable.name,
        orderCount: sql<number>`count(${orderItemsTable.id})::int`,
        categoryName: categoriesTable.name,
        price: menuItemsTable.price,
        available: menuItemsTable.available,
        imageKey: menuItemsTable.imageKey,
      })
      .from(menuItemsTable)
      .leftJoin(orderItemsTable, eq(orderItemsTable.menuItemId, menuItemsTable.id))
      .leftJoin(categoriesTable, eq(menuItemsTable.categoryId, categoriesTable.id))
      .groupBy(menuItemsTable.id, categoriesTable.name)
      .orderBy(desc(sql`count(${orderItemsTable.id})`))
      .limit(limit);

    res.json(
      rows.map((r) => ({
        id: r.id,
        name: r.name,
        orderCount: r.orderCount,
        categoryName: r.categoryName ?? "",
        price: parseFloat(r.price as string),
        available: r.available,
        imageKey: r.imageKey,
      })),
    );
  } catch (err) {
    req.log.error({ err }, "Failed to get top items");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/dashboard/order-status-breakdown", async (req, res) => {
  try {
    const rows = await db
      .select({
        status: ordersTable.status,
        count: sql<number>`count(*)::int`,
      })
      .from(ordersTable)
      .groupBy(ordersTable.status);

    res.json(rows);
  } catch (err) {
    req.log.error({ err }, "Failed to get status breakdown");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
