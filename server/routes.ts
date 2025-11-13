import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { BUILDING_TYPES, UNIT_TYPES } from "@shared/constants";
import { insertBuildingSchema, insertChatMessageSchema, insertUnitSchema } from "@shared/schema";
import { z } from "zod";

interface WSMessage {
  type: string;
  data: any;
}

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);
  
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  const connectedClients = new Map<string, WebSocket>();

  wss.on('connection', (ws: WebSocket) => {
    let playerId: string | null = null;

    ws.on('message', async (data: Buffer) => {
      try {
        const message: WSMessage = JSON.parse(data.toString());

        switch (message.type) {
          case 'identify':
            playerId = message.data.playerId;
            if (playerId) {
              connectedClients.set(playerId, ws);
            }
            break;

          case 'chat':
            if (playerId) {
              const player = await storage.getPlayer(playerId);
              if (player) {
                const chatMessage = await storage.createChatMessage({
                  playerId: player.id,
                  username: player.username,
                  message: message.data.message,
                });

                broadcast({
                  type: 'chat',
                  data: chatMessage,
                });
              }
            }
            break;

          case 'resource_update':
            broadcast({
              type: 'resource_update',
              data: message.data,
            });
            break;
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    });

    ws.on('close', () => {
      if (playerId) {
        connectedClients.delete(playerId);
      }
    });
  });

  function broadcast(message: WSMessage) {
    connectedClients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(message));
      }
    });
  }

  app.post('/api/players', async (req, res) => {
    try {
      const { username } = req.body;
      
      const existing = await storage.getPlayerByUsername(username);
      if (existing) {
        return res.json(existing);
      }

      const player = await storage.createPlayer({ username });
      res.json(player);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create player' });
    }
  });

  app.get('/api/players', async (req, res) => {
    try {
      const players = await storage.getAllPlayers();
      res.json(players);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get players' });
    }
  });

  app.get('/api/players/:id', async (req, res) => {
    try {
      const player = await storage.getPlayer(req.params.id);
      if (!player) {
        return res.status(404).json({ error: 'Player not found' });
      }
      res.json(player);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get player' });
    }
  });

  app.post('/api/buildings', async (req, res) => {
    try {
      const data = insertBuildingSchema.parse(req.body);
      
      const player = await storage.getPlayer(data.playerId);
      if (!player) {
        return res.status(404).json({ error: 'Player not found' });
      }

      const buildingType = BUILDING_TYPES[data.type];
      if (!buildingType) {
        return res.status(400).json({ error: 'Invalid building type' });
      }

      if (
        player.gold < buildingType.goldCost ||
        player.wood < buildingType.woodCost ||
        player.food < buildingType.foodCost
      ) {
        return res.status(400).json({ error: 'Insufficient resources' });
      }

      await storage.updatePlayer(player.id, {
        gold: player.gold - buildingType.goldCost,
        wood: player.wood - buildingType.woodCost,
        food: player.food - buildingType.foodCost,
        territorySize: player.territorySize + 1,
      });

      const building = await storage.createBuilding(data);

      setTimeout(async () => {
        const completedBuilding = await storage.updateBuilding(building.id, {
          isConstructing: false,
          constructionEndsAt: null,
        });

        if (completedBuilding) {
          broadcast({
            type: 'building_complete',
            data: { building: completedBuilding, playerId: player.id },
          });
        }
      }, buildingType.buildTime * 1000);

      res.json(building);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: 'Failed to create building' });
    }
  });

  app.get('/api/buildings/:playerId', async (req, res) => {
    try {
      const buildings = await storage.getBuildingsByPlayer(req.params.playerId);
      res.json(buildings);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get buildings' });
    }
  });

  app.post('/api/units', async (req, res) => {
    try {
      const data = insertUnitSchema.parse(req.body);
      
      const player = await storage.getPlayer(data.playerId);
      if (!player) {
        return res.status(404).json({ error: 'Player not found' });
      }

      const unitType = UNIT_TYPES[data.type];
      if (!unitType) {
        return res.status(400).json({ error: 'Invalid unit type' });
      }

      const totalCost = {
        gold: unitType.goldCost * data.quantity,
        wood: unitType.woodCost * data.quantity,
        food: unitType.foodCost * data.quantity,
      };

      if (
        player.gold < totalCost.gold ||
        player.wood < totalCost.wood ||
        player.food < totalCost.food
      ) {
        return res.status(400).json({ error: 'Insufficient resources' });
      }

      await storage.updatePlayer(player.id, {
        gold: player.gold - totalCost.gold,
        wood: player.wood - totalCost.wood,
        food: player.food - totalCost.food,
      });

      const unit = await storage.createUnit(data);

      const updatedUnit = await storage.updateUnit(unit.id, {
        attack: unitType.attack,
        defense: unitType.defense,
        speed: unitType.speed,
      });

      broadcast({
        type: 'unit_recruited',
        data: { unit: updatedUnit, playerId: player.id },
      });

      res.json(updatedUnit);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: 'Failed to create unit' });
    }
  });

  app.get('/api/units/:playerId', async (req, res) => {
    try {
      const units = await storage.getUnitsByPlayer(req.params.playerId);
      res.json(units);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get units' });
    }
  });

  app.get('/api/chat', async (req, res) => {
    try {
      const messages = await storage.getChatMessages(50);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get chat messages' });
    }
  });

  app.get('/api/game/state', async (req, res) => {
    try {
      const playerId = req.query.playerId as string;
      
      let currentPlayer = null;
      let buildings = [];
      let units = [];
      
      if (playerId) {
        currentPlayer = await storage.getPlayer(playerId);
        if (currentPlayer) {
          buildings = await storage.getBuildingsByPlayer(playerId);
          units = await storage.getUnitsByPlayer(playerId);
        }
      }

      const allPlayers = await storage.getAllPlayers();
      const chatMessages = await storage.getChatMessages(50);

      res.json({
        currentPlayer,
        buildings,
        units,
        leaderboard: allPlayers,
        chatMessages,
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to get game state' });
    }
  });

  setInterval(async () => {
    const players = await storage.getAllPlayers();
    
    for (const player of players) {
      const buildings = await storage.getBuildingsByPlayer(player.id);
      let goldProduced = 0;
      let woodProduced = 0;
      let foodProduced = 0;

      for (const building of buildings) {
        if (!building.isConstructing) {
          const buildingType = BUILDING_TYPES[building.type];
          if (buildingType.produces) {
            if (buildingType.produces.resource === 'gold') {
              goldProduced += buildingType.produces.amount;
            } else if (buildingType.produces.resource === 'wood') {
              woodProduced += buildingType.produces.amount;
            } else if (buildingType.produces.resource === 'food') {
              foodProduced += buildingType.produces.amount;
            }
          }
        }
      }

      if (goldProduced > 0 || woodProduced > 0 || foodProduced > 0) {
        const updatedPlayer = await storage.updatePlayer(player.id, {
          gold: player.gold + goldProduced,
          wood: player.wood + woodProduced,
          food: player.food + foodProduced,
        });

        if (updatedPlayer) {
          broadcast({
            type: 'resource_update',
            data: {
              playerId: player.id,
              gold: updatedPlayer.gold,
              wood: updatedPlayer.wood,
              food: updatedPlayer.food,
            },
          });
        }
      }
    }
  }, 60000);

  app.post('/api/battles', async (req, res) => {
    try {
      const { attackerId, defenderId, attackerUnits, defenderUnits } = req.body;
      
      const attacker = await storage.getPlayer(attackerId);
      const defender = await storage.getPlayer(defenderId);
      
      if (!attacker || !defender) {
        return res.status(404).json({ error: 'Player not found' });
      }

      const attackPower = JSON.parse(attackerUnits).reduce((sum: number, u: any) => sum + u.attack * u.quantity, 0);
      const defensePower = JSON.parse(defenderUnits).reduce((sum: number, u: any) => sum + u.defense * u.quantity, 0);
      
      const result = attackPower > defensePower ? 'attacker_wins' : 'defender_wins';
      
      const battle = await storage.createBattle({
        attackerId,
        defenderId,
        attackerUnits,
        defenderUnits,
        result,
      });

      broadcast({
        type: 'battle',
        data: battle,
      });

      res.json(battle);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create battle' });
    }
  });

  app.get('/api/battles/:playerId', async (req, res) => {
    try {
      const battles = await storage.getBattlesByPlayer(req.params.playerId);
      res.json(battles);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get battles' });
    }
  });

  return httpServer;
}
