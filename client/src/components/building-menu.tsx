import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Coins, Trees, Drumstick, Clock, Plus } from "lucide-react";
import { BUILDING_TYPES } from "@shared/constants";
import { Player } from "@shared/schema";
import saloonImg from "@assets/generated_images/Western_saloon_building_icon_ea44d5e6.png";
import bankImg from "@assets/generated_images/Western_bank_building_icon_854e007e.png";
import stableImg from "@assets/generated_images/Western_stable_building_icon_c5c43490.png";
import goldmineImg from "@assets/generated_images/Gold_mine_building_icon_f7cbcbde.png";

const BUILDING_IMAGES: Record<string, string> = {
  saloon: saloonImg,
  bank: bankImg,
  stable: stableImg,
  goldmine: goldmineImg,
};

interface BuildingMenuProps {
  player: Player;
  onBuild: (buildingType: string) => void;
}

export function BuildingMenu({ player, onBuild }: BuildingMenuProps) {
  const canAfford = (building: typeof BUILDING_TYPES[string]) => {
    return (
      player.gold >= building.goldCost &&
      player.wood >= building.woodCost &&
      player.food >= building.foodCost
    );
  };

  return (
    <Card className="w-full h-full">
      <CardHeader className="pb-2 md:pb-3">
        <CardTitle className="font-western text-xl md:text-2xl text-primary">Construções</CardTitle>
        <p className="font-ui text-xs md:text-sm text-muted-foreground">
          Clique para construir
        </p>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[calc(100vh-12rem)] md:h-[calc(100vh-14rem)]">
          <div className="space-y-2 md:space-y-3 px-3 md:px-6 pb-4 md:pb-6">
            {Object.values(BUILDING_TYPES).map((building) => {
              const affordable = canAfford(building);
              
              return (
                <Card
                  key={building.id}
                  className={`${!affordable ? 'opacity-50' : 'hover-elevate cursor-pointer'}`}
                  data-testid={`card-building-${building.id}`}
                >
                  <CardContent className="p-3 md:p-4">
                    <div className="flex gap-2 md:gap-4">
                      <div className="w-10 h-10 md:w-12 md:h-12 flex-shrink-0 rounded-md overflow-hidden bg-muted border border-muted-border">
                        <img
                          src={BUILDING_IMAGES[building.id]}
                          alt={building.name}
                          className="w-full h-full object-cover"
                          data-testid={`img-building-${building.id}`}
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-western text-base md:text-lg leading-tight mb-1">
                          {building.name}
                        </h3>
                        <p className="font-ui text-xs text-muted-foreground line-clamp-2 mb-1 md:mb-2 hidden sm:block">
                          {building.description}
                        </p>
                        
                        <div className="flex flex-wrap items-center gap-1.5 md:gap-2 text-xs">
                          {building.goldCost > 0 && (
                            <div className="flex items-center gap-1">
                              <Coins className="w-3 h-3 text-amber-500" />
                              <span className="font-numbers">{building.goldCost}</span>
                            </div>
                          )}
                          {building.woodCost > 0 && (
                            <div className="flex items-center gap-1">
                              <Trees className="w-3 h-3 text-amber-800" />
                              <span className="font-numbers">{building.woodCost}</span>
                            </div>
                          )}
                          {building.foodCost > 0 && (
                            <div className="flex items-center gap-1">
                              <Drumstick className="w-3 h-3 text-red-700" />
                              <span className="font-numbers">{building.foodCost}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            <span className="font-numbers">{building.buildTime}s</span>
                          </div>
                        </div>
                      </div>
                      
                      <Button
                        size="sm"
                        className="h-8 w-8 md:h-9 md:w-9"
                        disabled={!affordable}
                        onClick={() => onBuild(building.id)}
                        data-testid={`button-build-${building.id}`}
                      >
                        <Plus className="w-3 h-3 md:w-4 md:h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
