import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const players = pgTable("players", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  gold: integer("gold").notNull().default(500),
  wood: integer("wood").notNull().default(300),
  food: integer("food").notNull().default(200),
  level: integer("level").notNull().default(1),
  rank: integer("rank").notNull().default(0),
  territorySize: integer("territory_size").notNull().default(0),
});

export const buildings = pgTable("buildings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  playerId: varchar("player_id").notNull(),
  type: text("type").notNull(),
  level: integer("level").notNull().default(1),
  posX: integer("pos_x").notNull(),
  posY: integer("pos_y").notNull(),
  isConstructing: boolean("is_constructing").notNull().default(false),
  constructionEndsAt: timestamp("construction_ends_at"),
});

export const units = pgTable("units", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  playerId: varchar("player_id").notNull(),
  type: text("type").notNull(),
  quantity: integer("quantity").notNull().default(1),
  attack: integer("attack").notNull(),
  defense: integer("defense").notNull(),
  speed: integer("speed").notNull(),
});

export const chatMessages = pgTable("chat_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  playerId: varchar("player_id").notNull(),
  username: text("username").notNull(),
  message: text("message").notNull(),
  timestamp: timestamp("timestamp").notNull().default(sql`now()`),
});

export const battles = pgTable("battles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  attackerId: varchar("attacker_id").notNull(),
  defenderId: varchar("defender_id").notNull(),
  attackerUnits: text("attacker_units").notNull(),
  defenderUnits: text("defender_units").notNull(),
  result: text("result").notNull(),
  timestamp: timestamp("timestamp").notNull().default(sql`now()`),
});

export const insertPlayerSchema = createInsertSchema(players).pick({
  username: true,
});

export const insertBuildingSchema = createInsertSchema(buildings).pick({
  playerId: true,
  type: true,
  posX: true,
  posY: true,
});

export const insertUnitSchema = createInsertSchema(units).pick({
  playerId: true,
  type: true,
  quantity: true,
});

export const insertChatMessageSchema = createInsertSchema(chatMessages).pick({
  playerId: true,
  username: true,
  message: true,
});

export const insertBattleSchema = createInsertSchema(battles).pick({
  attackerId: true,
  defenderId: true,
  attackerUnits: true,
  defenderUnits: true,
  result: true,
});

export type Player = typeof players.$inferSelect;
export type InsertPlayer = z.infer<typeof insertPlayerSchema>;

export type Building = typeof buildings.$inferSelect;
export type InsertBuilding = z.infer<typeof insertBuildingSchema>;

export type Unit = typeof units.$inferSelect;
export type InsertUnit = z.infer<typeof insertUnitSchema>;

export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;

export type Battle = typeof battles.$inferSelect;
export type InsertBattle = z.infer<typeof insertBattleSchema>;

export interface BuildingType {
  id: string;
  name: string;
  description: string;
  goldCost: number;
  woodCost: number;
  foodCost: number;
  buildTime: number;
  produces?: {
    resource: 'gold' | 'wood' | 'food';
    amount: number;
    interval: number;
  };
}

export interface UnitType {
  id: string;
  name: string;
  description: string;
  goldCost: number;
  woodCost: number;
  foodCost: number;
  attack: number;
  defense: number;
  speed: number;
}

export interface MapTile {
  x: number;
  y: number;
  terrain: 'desert' | 'prairie' | 'mountain';
  buildingId?: string;
  playerId?: string;
}

export interface GameState {
  currentPlayer: Player | null;
  buildings: Building[];
  units: Unit[];
  mapTiles: MapTile[];
  leaderboard: Player[];
  chatMessages: ChatMessage[];
}
