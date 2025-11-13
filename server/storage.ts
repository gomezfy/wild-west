import {
  type Player,
  type InsertPlayer,
  type Building,
  type InsertBuilding,
  type Unit,
  type InsertUnit,
  type ChatMessage,
  type InsertChatMessage,
  type Battle,
  type InsertBattle,
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getPlayer(id: string): Promise<Player | undefined>;
  getPlayerByUsername(username: string): Promise<Player | undefined>;
  createPlayer(player: InsertPlayer): Promise<Player>;
  updatePlayer(id: string, updates: Partial<Player>): Promise<Player | undefined>;
  getAllPlayers(): Promise<Player[]>;

  getBuilding(id: string): Promise<Building | undefined>;
  getBuildingsByPlayer(playerId: string): Promise<Building[]>;
  createBuilding(building: InsertBuilding): Promise<Building>;
  updateBuilding(id: string, updates: Partial<Building>): Promise<Building | undefined>;
  deleteBuilding(id: string): Promise<boolean>;

  getUnit(id: string): Promise<Unit | undefined>;
  getUnitsByPlayer(playerId: string): Promise<Unit[]>;
  createUnit(unit: InsertUnit): Promise<Unit>;
  updateUnit(id: string, updates: Partial<Unit>): Promise<Unit | undefined>;

  getChatMessages(limit?: number): Promise<ChatMessage[]>;
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;

  createBattle(battle: InsertBattle): Promise<Battle>;
  getBattlesByPlayer(playerId: string): Promise<Battle[]>;
}

export class MemStorage implements IStorage {
  private players: Map<string, Player>;
  private buildings: Map<string, Building>;
  private units: Map<string, Unit>;
  private chatMessages: ChatMessage[];
  private battles: Map<string, Battle>;

  constructor() {
    this.players = new Map();
    this.buildings = new Map();
    this.units = new Map();
    this.chatMessages = [];
    this.battles = new Map();
  }

  async getPlayer(id: string): Promise<Player | undefined> {
    return this.players.get(id);
  }

  async getPlayerByUsername(username: string): Promise<Player | undefined> {
    return Array.from(this.players.values()).find(
      (player) => player.username === username,
    );
  }

  async createPlayer(insertPlayer: InsertPlayer): Promise<Player> {
    const id = randomUUID();
    const player: Player = {
      id,
      username: insertPlayer.username,
      gold: 500,
      wood: 300,
      food: 200,
      level: 1,
      rank: 0,
      territorySize: 0,
    };
    this.players.set(id, player);
    return player;
  }

  async updatePlayer(id: string, updates: Partial<Player>): Promise<Player | undefined> {
    const player = this.players.get(id);
    if (!player) return undefined;
    
    const updated = { ...player, ...updates };
    this.players.set(id, updated);
    return updated;
  }

  async getAllPlayers(): Promise<Player[]> {
    return Array.from(this.players.values());
  }

  async getBuilding(id: string): Promise<Building | undefined> {
    return this.buildings.get(id);
  }

  async getBuildingsByPlayer(playerId: string): Promise<Building[]> {
    return Array.from(this.buildings.values()).filter(
      (building) => building.playerId === playerId,
    );
  }

  async createBuilding(insertBuilding: InsertBuilding): Promise<Building> {
    const id = randomUUID();
    const building: Building = {
      id,
      playerId: insertBuilding.playerId,
      type: insertBuilding.type,
      level: 1,
      posX: insertBuilding.posX,
      posY: insertBuilding.posY,
      isConstructing: true,
      constructionEndsAt: new Date(Date.now() + 30000),
    };
    this.buildings.set(id, building);
    return building;
  }

  async updateBuilding(id: string, updates: Partial<Building>): Promise<Building | undefined> {
    const building = this.buildings.get(id);
    if (!building) return undefined;
    
    const updated = { ...building, ...updates };
    this.buildings.set(id, updated);
    return updated;
  }

  async deleteBuilding(id: string): Promise<boolean> {
    return this.buildings.delete(id);
  }

  async getUnit(id: string): Promise<Unit | undefined> {
    return this.units.get(id);
  }

  async getUnitsByPlayer(playerId: string): Promise<Unit[]> {
    return Array.from(this.units.values()).filter(
      (unit) => unit.playerId === playerId,
    );
  }

  async createUnit(insertUnit: InsertUnit): Promise<Unit> {
    const existing = Array.from(this.units.values()).find(
      (u) => u.playerId === insertUnit.playerId && u.type === insertUnit.type,
    );

    if (existing) {
      const updated = {
        ...existing,
        quantity: existing.quantity + insertUnit.quantity,
      };
      this.units.set(existing.id, updated);
      return updated;
    }

    const id = randomUUID();
    const unit: Unit = {
      id,
      playerId: insertUnit.playerId,
      type: insertUnit.type,
      quantity: insertUnit.quantity,
      attack: 0,
      defense: 0,
      speed: 0,
    };
    this.units.set(id, unit);
    return unit;
  }

  async updateUnit(id: string, updates: Partial<Unit>): Promise<Unit | undefined> {
    const unit = this.units.get(id);
    if (!unit) return undefined;
    
    const updated = { ...unit, ...updates };
    this.units.set(id, updated);
    return updated;
  }

  async getChatMessages(limit: number = 50): Promise<ChatMessage[]> {
    return this.chatMessages.slice(-limit);
  }

  async createChatMessage(insertMessage: InsertChatMessage): Promise<ChatMessage> {
    const id = randomUUID();
    const message: ChatMessage = {
      id,
      playerId: insertMessage.playerId,
      username: insertMessage.username,
      message: insertMessage.message,
      timestamp: new Date(),
    };
    this.chatMessages.push(message);
    return message;
  }

  async createBattle(insertBattle: InsertBattle): Promise<Battle> {
    const id = randomUUID();
    const battle: Battle = {
      id,
      attackerId: insertBattle.attackerId,
      defenderId: insertBattle.defenderId,
      attackerUnits: insertBattle.attackerUnits,
      defenderUnits: insertBattle.defenderUnits,
      result: insertBattle.result,
      timestamp: new Date(),
    };
    this.battles.set(id, battle);
    return battle;
  }

  async getBattlesByPlayer(playerId: string): Promise<Battle[]> {
    return Array.from(this.battles.values()).filter(
      (battle) => battle.attackerId === playerId || battle.defenderId === playerId,
    );
  }
}

export const storage = new MemStorage();
