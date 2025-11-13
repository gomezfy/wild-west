import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Coins, Trees, Drumstick, Sword, Shield, Zap, Plus } from "lucide-react";
import { UNIT_TYPES } from "@shared/constants";
import { Player, Unit } from "@shared/schema";
import cowboyImg from "@assets/generated_images/Cowboy_unit_portrait_7ee1595a.png";
import banditImg from "@assets/generated_images/Bandit_unit_portrait_be18a33d.png";
import sheriffImg from "@assets/generated_images/Sheriff_unit_portrait_25472617.png";

const UNIT_IMAGES: Record<string, string> = {
  cowboy: cowboyImg,
  bandit: banditImg,
  sheriff: sheriffImg,
};

interface TroopPanelProps {
  player: Player;
  units: Unit[];
  onRecruit: (unitType: string) => void;
}

export function TroopPanel({ player, units, onRecruit }: TroopPanelProps) {
  const canAfford = (unit: typeof UNIT_TYPES[string]) => {
    return (
      player.gold >= unit.goldCost &&
      player.wood >= unit.woodCost &&
      player.food >= unit.foodCost
    );
  };

  const getUnitCount = (unitType: string) => {
    const unit = units.find((u) => u.type === unitType);
    return unit?.quantity || 0;
  };

  return (
    <Card className="w-full h-full">
      <CardHeader className="pb-3">
        <CardTitle className="font-western text-2xl text-primary">Troops</CardTitle>
        <p className="font-ui text-sm text-muted-foreground">
          Recruit units for defense and attack
        </p>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[calc(100vh-14rem)]">
          <div className="space-y-3 px-6 pb-6">
            {Object.values(UNIT_TYPES).map((unit) => {
              const affordable = canAfford(unit);
              const count = getUnitCount(unit.id);
              
              return (
                <Card
                  key={unit.id}
                  className={`${!affordable ? 'opacity-50' : 'hover-elevate'}`}
                  data-testid={`card-unit-${unit.id}`}
                >
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <div className="w-16 h-16 flex-shrink-0 rounded-md overflow-hidden bg-muted border border-muted-border">
                        <img
                          src={UNIT_IMAGES[unit.id]}
                          alt={unit.name}
                          className="w-full h-full object-cover"
                          data-testid={`img-unit-${unit.id}`}
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-western text-lg leading-tight">
                            {unit.name}
                          </h3>
                          {count > 0 && (
                            <span className="font-numbers text-sm font-bold bg-primary/20 px-2 py-0.5 rounded-md" data-testid={`text-unit-count-${unit.id}`}>
                              x{count}
                            </span>
                          )}
                        </div>
                        <p className="font-ui text-xs text-muted-foreground mb-2">
                          {unit.description}
                        </p>
                        
                        <div className="flex items-center gap-3 text-xs mb-2">
                          <div className="flex items-center gap-1">
                            <Sword className="w-3 h-3 text-red-500" />
                            <span className="font-numbers">{unit.attack}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Shield className="w-3 h-3 text-blue-500" />
                            <span className="font-numbers">{unit.defense}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Zap className="w-3 h-3 text-yellow-500" />
                            <span className="font-numbers">{unit.speed}</span>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-2 text-xs">
                          {unit.goldCost > 0 && (
                            <div className="flex items-center gap-1">
                              <Coins className="w-3 h-3 text-amber-500" />
                              <span className="font-numbers">{unit.goldCost}</span>
                            </div>
                          )}
                          {unit.woodCost > 0 && (
                            <div className="flex items-center gap-1">
                              <Trees className="w-3 h-3 text-amber-800" />
                              <span className="font-numbers">{unit.woodCost}</span>
                            </div>
                          )}
                          {unit.foodCost > 0 && (
                            <div className="flex items-center gap-1">
                              <Drumstick className="w-3 h-3 text-red-700" />
                              <span className="font-numbers">{unit.foodCost}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <Button
                        size="icon"
                        disabled={!affordable}
                        onClick={() => onRecruit(unit.id)}
                        data-testid={`button-recruit-${unit.id}`}
                      >
                        <Plus className="w-4 h-4" />
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
