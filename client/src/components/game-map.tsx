import { MapTile, Building } from "@shared/schema";
import { MAP_SIZE, TILE_SIZE } from "@shared/constants";
import { Card } from "@/components/ui/card";
import saloonImg from "@assets/generated_images/Western_saloon_building_icon_ea44d5e6.png";
import bankImg from "@assets/generated_images/Western_bank_building_icon_854e007e.png";
import stableImg from "@assets/generated_images/Western_stable_building_icon_c5c43490.png";
import goldmineImg from "@assets/generated_images/Gold_mine_building_icon_f7cbcbde.png";
import desertImg from "@assets/generated_images/Desert_terrain_tile_408e1917.png";
import prairieImg from "@assets/generated_images/Prairie_terrain_tile_873c5880.png";

const BUILDING_IMAGES: Record<string, string> = {
  saloon: saloonImg,
  bank: bankImg,
  stable: stableImg,
  goldmine: goldmineImg,
};

const TERRAIN_IMAGES: Record<string, string> = {
  desert: desertImg,
  prairie: prairieImg,
  mountain: desertImg,
};

interface GameMapProps {
  mapTiles: MapTile[];
  buildings: Building[];
  selectedTile: { x: number; y: number } | null;
  onTileClick: (x: number, y: number) => void;
  placementMode: string | null;
}

export function GameMap({
  mapTiles,
  buildings,
  selectedTile,
  onTileClick,
  placementMode,
}: GameMapProps) {
  const getBuildingAt = (x: number, y: number) => {
    return buildings.find((b) => b.posX === x && b.posY === y);
  };

  const getTileAt = (x: number, y: number) => {
    return mapTiles.find((t) => t.x === x && t.y === y);
  };

  return (
    <Card className="w-full h-full bg-muted/30">
      <div className="p-4 overflow-auto h-full">
        <div
          className="inline-block"
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${MAP_SIZE}, ${TILE_SIZE}px)`,
            gap: "1px",
          }}
        >
          {Array.from({ length: MAP_SIZE * MAP_SIZE }, (_, i) => {
            const x = i % MAP_SIZE;
            const y = Math.floor(i / MAP_SIZE);
            const tile = getTileAt(x, y);
            const building = getBuildingAt(x, y);
            const isSelected = selectedTile?.x === x && selectedTile?.y === y;
            const canPlace = placementMode && !building;

            return (
              <div
                key={`${x}-${y}`}
                onClick={() => onTileClick(x, y)}
                className={`relative border border-border hover-elevate cursor-pointer transition-all ${
                  isSelected ? 'ring-2 ring-primary' : ''
                } ${canPlace ? 'ring-2 ring-green-500' : ''}`}
                style={{
                  width: `${TILE_SIZE}px`,
                  height: `${TILE_SIZE}px`,
                  backgroundImage: tile ? `url(${TERRAIN_IMAGES[tile.terrain]})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
                data-testid={`tile-${x}-${y}`}
              >
                {building && (
                  <div className="absolute inset-0 flex items-center justify-center p-1">
                    <img
                      src={BUILDING_IMAGES[building.type]}
                      alt={building.type}
                      className="w-full h-full object-contain drop-shadow-lg"
                    />
                    {building.isConstructing && (
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-muted">
                        <div className="h-full bg-primary w-1/2 animate-pulse" />
                      </div>
                    )}
                  </div>
                )}

                {placementMode && canPlace && (
                  <div className="absolute inset-0 flex items-center justify-center bg-green-500/20">
                    <img
                      src={BUILDING_IMAGES[placementMode]}
                      alt={placementMode}
                      className="w-full h-full object-contain opacity-50"
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
