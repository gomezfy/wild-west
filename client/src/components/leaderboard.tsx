import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trophy, Coins } from "lucide-react";
import { Player } from "@shared/schema";

interface LeaderboardProps {
  open: boolean;
  onClose: () => void;
  players: Player[];
  currentPlayerId?: string;
}

export function Leaderboard({ open, onClose, players, currentPlayerId }: LeaderboardProps) {
  const sortedPlayers = [...players].sort((a, b) => {
    const scoreA = a.gold + a.wood + a.food + a.territorySize * 100;
    const scoreB = b.gold + b.wood + b.food + b.territorySize * 100;
    return scoreB - scoreA;
  });

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-western text-3xl text-primary flex items-center gap-2">
            <Trophy className="w-8 h-8" />
            Leaderboard
          </DialogTitle>
        </DialogHeader>
        
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-ui font-semibold w-16">Rank</TableHead>
              <TableHead className="font-ui font-semibold">Player</TableHead>
              <TableHead className="font-ui font-semibold">Level</TableHead>
              <TableHead className="font-ui font-semibold">Territory</TableHead>
              <TableHead className="font-ui font-semibold text-right">Total Resources</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedPlayers.map((player, index) => {
              const totalResources = player.gold + player.wood + player.food;
              const isCurrentPlayer = player.id === currentPlayerId;
              
              return (
                <TableRow
                  key={player.id}
                  className={isCurrentPlayer ? 'bg-primary/10' : ''}
                  data-testid={`leaderboard-row-${index}`}
                >
                  <TableCell className="font-numbers font-bold">
                    {index === 0 && <Trophy className="w-4 h-4 inline text-amber-500 mr-1" />}
                    {index + 1}
                  </TableCell>
                  <TableCell className="font-ui font-semibold">
                    {player.username}
                    {isCurrentPlayer && (
                      <span className="ml-2 text-xs text-primary">(You)</span>
                    )}
                  </TableCell>
                  <TableCell className="font-numbers">{player.level}</TableCell>
                  <TableCell className="font-numbers">{player.territorySize}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Coins className="w-4 h-4 text-amber-500" />
                      <span className="font-numbers font-bold">{totalResources}</span>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </DialogContent>
    </Dialog>
  );
}
