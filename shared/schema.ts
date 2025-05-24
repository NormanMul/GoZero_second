import { pgTable, text, serial, integer, timestamp, json, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name"),
  email: text("email"),
  impactScore: integer("impact_score").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  fullName: true,
  email: true,
});

export const wasteCategories = pgTable("waste_categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  recyclable: integer("recyclable").default(1),
  reusable: integer("reusable").default(0),
  disposalInstructions: text("disposal_instructions"),
});

export const insertWasteCategorySchema = createInsertSchema(wasteCategories).pick({
  name: true,
  description: true,
  recyclable: true,
  reusable: true,
  disposalInstructions: true,
});

export const scans = pgTable("scans", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  imageUrl: text("image_url"),
  itemName: text("item_name").notNull(),
  categoryId: integer("category_id").references(() => wasteCategories.id),
  co2Saved: real("co2_saved").default(0),
  waterSaved: real("water_saved").default(0),
  energySaved: real("energy_saved").default(0),
  recyclable: integer("recyclable").default(1),
  reusable: integer("reusable").default(0),
  aiResponse: json("ai_response"),
  status: text("status").default("scanned"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertScanSchema = createInsertSchema(scans).pick({
  userId: true,
  imageUrl: true,
  itemName: true,
  categoryId: true,
  co2Saved: true,
  waterSaved: true,
  energySaved: true,
  recyclable: true,
  reusable: true,
  aiResponse: true,
  status: true,
});

export const recyclingCenters = pgTable("recycling_centers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  address: text("address"),
  latitude: real("latitude").notNull(),
  longitude: real("longitude").notNull(),
  openingHours: text("opening_hours"),
  acceptedMaterials: json("accepted_materials"),
  imageUrl: text("image_url"),
  distance: real("distance"),
});

export const insertRecyclingCenterSchema = createInsertSchema(recyclingCenters).pick({
  name: true,
  address: true,
  latitude: true,
  longitude: true,
  openingHours: true,
  acceptedMaterials: true,
  imageUrl: true,
});

export const pickups = pgTable("pickups", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  scanIds: json("scan_ids"),
  pickupDate: text("pickup_date").notNull(),
  pickupTimeSlot: text("pickup_time_slot").notNull(),
  address: text("address").notNull(),
  notes: text("notes"),
  status: text("status").default("scheduled"),
  driverName: text("driver_name"),
  driverRating: real("driver_rating"),
  orderCode: text("order_code"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertPickupSchema = createInsertSchema(pickups).pick({
  userId: true,
  scanIds: true,
  pickupDate: true,
  pickupTimeSlot: true,
  address: true,
  notes: true,
  status: true,
  driverName: true,
  driverRating: true,
  orderCode: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertWasteCategory = z.infer<typeof insertWasteCategorySchema>;
export type WasteCategory = typeof wasteCategories.$inferSelect;

export type InsertScan = z.infer<typeof insertScanSchema>;
export type Scan = typeof scans.$inferSelect;

export type InsertRecyclingCenter = z.infer<typeof insertRecyclingCenterSchema>;
export type RecyclingCenter = typeof recyclingCenters.$inferSelect;

export type InsertPickup = z.infer<typeof insertPickupSchema>;
export type Pickup = typeof pickups.$inferSelect;
