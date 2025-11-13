import { BuildingType, UnitType } from "./schema";

export const BUILDING_TYPES: Record<string, BuildingType> = {
  saloon: {
    id: "saloon",
    name: "Saloon",
    description: "Where cowboys gather. Produces gold over time.",
    goldCost: 100,
    woodCost: 50,
    foodCost: 0,
    buildTime: 30,
    produces: {
      resource: "gold",
      amount: 10,
      interval: 60,
    },
  },
  bank: {
    id: "bank",
    name: "Bank",
    description: "Secure vault for storing gold. Increases gold production.",
    goldCost: 200,
    woodCost: 100,
    foodCost: 0,
    buildTime: 60,
    produces: {
      resource: "gold",
      amount: 20,
      interval: 60,
    },
  },
  stable: {
    id: "stable",
    name: "Stable",
    description: "Houses horses and livestock. Produces food.",
    goldCost: 80,
    woodCost: 120,
    foodCost: 0,
    buildTime: 45,
    produces: {
      resource: "food",
      amount: 15,
      interval: 60,
    },
  },
  goldmine: {
    id: "goldmine",
    name: "Gold Mine",
    description: "Extract precious gold from the mountains.",
    goldCost: 150,
    woodCost: 150,
    foodCost: 50,
    buildTime: 90,
    produces: {
      resource: "gold",
      amount: 30,
      interval: 60,
    },
  },
};

export const UNIT_TYPES: Record<string, UnitType> = {
  cowboy: {
    id: "cowboy",
    name: "Cowboy",
    description: "Basic gunslinger with decent attack and defense.",
    goldCost: 50,
    woodCost: 0,
    foodCost: 20,
    attack: 10,
    defense: 8,
    speed: 5,
  },
  bandit: {
    id: "bandit",
    name: "Bandit",
    description: "Ruthless outlaw with high attack but low defense.",
    goldCost: 60,
    woodCost: 10,
    foodCost: 25,
    attack: 15,
    defense: 5,
    speed: 7,
  },
  sheriff: {
    id: "sheriff",
    name: "Sheriff",
    description: "Lawman with balanced stats and strong defense.",
    goldCost: 80,
    woodCost: 20,
    foodCost: 30,
    attack: 12,
    defense: 15,
    speed: 4,
  },
};

export const MAP_SIZE = 20;
export const TILE_SIZE = 60;
