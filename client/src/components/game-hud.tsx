import { Coins, Trees, Drumstick, User, Trophy, Settings, Building2, Map } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Player } from "@shared/schema";

interface GameHUDProps {
  player: Player;
  onShowLeaderboard: () => void;
  viewMode: 'city' | 'map';
  onToggleView: () => void;
}

export function GameHUD({ player, onShowLeaderboard, viewMode, onToggleView }: GameHUDProps) {
  return (
    <div className="fixed top-0 left-0 right-0 h-14 md:h-16 bg-card border-b border-card-border z-50 px-2 md:px-4">
      <div className="h-full flex items-center justify-between gap-2 md:gap-4">
        <div className="flex items-center gap-2 md:gap-3">
          <h1 className="font-western text-base md:text-xl lg:text-2xl text-primary hidden sm:block">
            WILD WEST
          </h1>
          <h1 className="font-western text-base text-primary sm:hidden">
            WW
          </h1>
          
          <Button
            onClick={onToggleView}
            variant="default"
            size="sm"
            className="font-ui font-semibold gap-1 md:gap-2 text-xs md:text-sm"
            data-testid="button-toggle-view"
          >
            {viewMode === 'city' ? (
              <>
                <Map className="w-3 h-3 md:w-4 md:h-4" />
                <span className="hidden xs:inline">MAPA</span>
              </>
            ) : (
              <>
                <Building2 className="w-3 h-3 md:w-4 md:h-4" />
                <span className="hidden xs:inline">CIDADE</span>
              </>
            )}
          </Button>
        </div>

        <div className="flex items-center gap-1 md:gap-2 lg:gap-4 flex-1 justify-center max-w-2xl">
          <div className="flex items-center gap-1 md:gap-1.5 bg-muted px-2 md:px-3 py-1 md:py-1.5 rounded-md border border-muted-border">
            <Coins className="w-3 h-3 md:w-4 md:h-4 text-amber-500" />
            <span className="font-numbers text-xs md:text-base font-bold min-w-[2rem] md:min-w-[3rem] text-right" data-testid="text-gold">
              {player.gold}
            </span>
          </div>

          <div className="flex items-center gap-1 md:gap-1.5 bg-muted px-2 md:px-3 py-1 md:py-1.5 rounded-md border border-muted-border">
            <Trees className="w-3 h-3 md:w-4 md:h-4 text-amber-800" />
            <span className="font-numbers text-xs md:text-base font-bold min-w-[2rem] md:min-w-[3rem] text-right" data-testid="text-wood">
              {player.wood}
            </span>
          </div>

          <div className="flex items-center gap-1 md:gap-1.5 bg-muted px-2 md:px-3 py-1 md:py-1.5 rounded-md border border-muted-border">
            <Drumstick className="w-3 h-3 md:w-4 md:h-4 text-red-700" />
            <span className="font-numbers text-xs md:text-base font-bold min-w-[2rem] md:min-w-[3rem] text-right" data-testid="text-food">
              {player.food}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 md:gap-2">
          <div className="hidden lg:flex items-center gap-2 bg-muted px-3 py-1.5 rounded-md border border-muted-border mr-2">
            <User className="w-4 h-4" />
            <span className="font-ui text-sm font-semibold" data-testid="text-username">
              {player.username}
            </span>
            <span className="font-ui text-xs text-muted-foreground">
              Lvl {player.level}
            </span>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 md:h-9 md:w-9"
            onClick={onShowLeaderboard}
            data-testid="button-leaderboard"
          >
            <Trophy className="w-4 h-4 md:w-5 md:h-5" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 md:h-9 md:w-9" data-testid="button-settings">
                <Settings className="w-4 h-4 md:w-5 md:h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="lg:hidden">
                <User className="w-4 h-4 mr-2" />
                {player.username} (Lvl {player.level})
              </DropdownMenuItem>
              <DropdownMenuItem>Sound: On</DropdownMenuItem>
              <DropdownMenuItem>Music: On</DropdownMenuItem>
              <DropdownMenuItem>Tutorial</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
