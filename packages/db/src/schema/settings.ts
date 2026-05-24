import { pgTable, serial, text, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const settingsTable = pgTable("settings", {
  id: serial("id").primaryKey(),
  restaurantName: text("restaurant_name").notNull().default("The Diner"),
  prepTimeMinutes: integer("prep_time_minutes").notNull().default(15),
  autoAccept: boolean("auto_accept").notNull().default(false),
  serviceAvailable: boolean("service_available").notNull().default(true),
  openingHours: jsonb("opening_hours").notNull().default([
    { day: "Monday", open: "07:00", close: "22:00", closed: false },
    { day: "Tuesday", open: "07:00", close: "22:00", closed: false },
    { day: "Wednesday", open: "07:00", close: "22:00", closed: false },
    { day: "Thursday", open: "07:00", close: "22:00", closed: false },
    { day: "Friday", open: "07:00", close: "23:00", closed: false },
    { day: "Saturday", open: "08:00", close: "23:00", closed: false },
    { day: "Sunday", open: "08:00", close: "21:00", closed: false },
  ]),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertSettingsSchema = createInsertSchema(settingsTable).omit({
  id: true,
  updatedAt: true,
});
export type InsertSettings = z.infer<typeof insertSettingsSchema>;
export type Settings = typeof settingsTable.$inferSelect;
