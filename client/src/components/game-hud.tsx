import { Coins, Trees, Drumstick, User, Trophy, Settings } from "lucide-react";
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
}

export function GameHUD({ player, onShowLeaderboard }: GameHUDProps) {
  return (
    <div className="fixed top-0 left-0 right-0 h-16 bg-card border-b border-card-border z-50 px-4">
      <div className="h-full flex items-center justify-between gap-4">
        <div className="flex items-center gap-1">
          <h1 className="font-western text-xl md:text-2xl text-primary mr-4">
            WILD WEST
          </h1>
        </div>

        <div className="flex items-center gap-2 md:gap-4 flex-1 justify-center max-w-2xl">
          <div className="flex items-center gap-1.5 bg-muted px-3 py-1.5 rounded-md border border-muted-border">
            <Coins className="w-4 h-4 text-amber-500" />
            <span className="font-numbers text-base font-bold min-w-[3rem] text-right" data-testid="text-gold">
              {player.gold}
            </span>
          </div>

          <div className="flex items-center gap-1.5 bg-muted px-3 py-1.5 rounded-md border border-muted-border">
            <Trees className="w-4 h-4 text-amber-800" />
            <span className="font-numbers text-base font-bold min-w-[3rem] text-right" data-testid="text-wood">
              {player.wood}
            </span>
          </div>

          <div className="flex items-center gap-1.5 bg-muted px-3 py-1.5 rounded-md border border-muted-border">
            <Drumstick className="w-4 h-4 text-red-700" />
            <span className="font-numbers text-base font-bold min-w-[3rem] text-right" data-testid="text-food">
              {player.food}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-2 bg-muted px-3 py-1.5 rounded-md border border-muted-border mr-2">
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
            onClick={onShowLeaderboard}
            data-testid="button-leaderboard"
          >
            <Trophy className="w-5 h-5" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" data-testid="button-settings">
                <Settings className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
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
