import { Router } from "express";
import { db } from "@workspace/db";
import { settingsTable } from "@workspace/db";
import { UpdateSettingsBody } from "@workspace/api-zod";

const router = Router();

async function ensureSettings() {
  const rows = await db.select().from(settingsTable).limit(1);
  if (rows.length > 0) return rows[0]!;
  const [row] = await db.insert(settingsTable).values({}).returning();
  return row!;
}

router.get("/settings", async (req, res) => {
  try {
    const settings = await ensureSettings();
    res.json({
      id: settings.id,
      restaurantName: settings.restaurantName,
      prepTimeMinutes: settings.prepTimeMinutes,
      autoAccept: settings.autoAccept,
      serviceAvailable: settings.serviceAvailable,
      openingHours: settings.openingHours,
    });
  } catch (err) {
    req.log.error({ err }, "Failed to get settings");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/settings", async (req, res) => {
  try {
    const parsed = UpdateSettingsBody.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "Invalid request body" });

    const settings = await ensureSettings();

    const updates: Partial<typeof settingsTable.$inferInsert> = {};
    if (parsed.data.restaurantName !== undefined) updates.restaurantName = parsed.data.restaurantName;
    if (parsed.data.prepTimeMinutes !== undefined) updates.prepTimeMinutes = parsed.data.prepTimeMinutes;
    if (parsed.data.autoAccept !== undefined) updates.autoAccept = parsed.data.autoAccept;
    if (parsed.data.serviceAvailable !== undefined) updates.serviceAvailable = parsed.data.serviceAvailable;
    if (parsed.data.openingHours !== undefined) updates.openingHours = parsed.data.openingHours;

    const { eq } = await import("drizzle-orm");
    const [updated] = await db
      .update(settingsTable)
      .set(updates)
      .where(eq(settingsTable.id, settings.id))
      .returning();

    res.json({
      id: updated!.id,
      restaurantName: updated!.restaurantName,
      prepTimeMinutes: updated!.prepTimeMinutes,
      autoAccept: updated!.autoAccept,
      serviceAvailable: updated!.serviceAvailable,
      openingHours: updated!.openingHours,
    });
  } catch (err) {
    req.log.error({ err }, "Failed to update settings");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
