import { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useWebSocket } from "@/hooks/use-websocket";
import { useToast } from "@/hooks/use-toast";
import { GameHUD } from "@/components/game-hud";
import { BuildingMenu } from "@/components/building-menu";
import { GameMap } from "@/components/game-map";
import { ChatPanel } from "@/components/chat-panel";
import { Leaderboard } from "@/components/leaderboard";
import { TutorialOverlay } from "@/components/tutorial-overlay";
import { TroopPanel } from "@/components/troop-panel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Player, MapTile, Building, Unit, ChatMessage } from "@shared/schema";
import { MAP_SIZE } from "@shared/constants";

interface GameProps {
  username: string;
}

export default function Game({ username }: GameProps) {
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [showTutorial, setShowTutorial] = useState(true);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [selectedTile, setSelectedTile] = useState<{ x: number; y: number } | null>(null);
  const [placementMode, setPlacementMode] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'city' | 'map'>('city');
  const { toast } = useToast();

  const createPlayerMutation = useMutation({
    mutationFn: async (username: string) => {
      return await apiRequest('POST', '/api/players', { username });
    },
    onSuccess: (data: Player) => {
      setPlayerId(data.id);
    },
  });

  useEffect(() => {
    if (username && !playerId && !createPlayerMutation.isPending) {
      createPlayerMutation.mutate(username);
    }
  }, [username]);

  const { data: gameState, refetch } = useQuery({
    queryKey: ['/api/game/state', playerId],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (playerId) params.append('playerId', playerId);
      return await fetch(`/api/game/state?${params}`).then(res => res.json());
    },
    enabled: !!playerId,
    refetchInterval: false,
  });

  const handleWSMessage = useCallback(() => {
    refetch();
  }, []);

  const { sendMessage } = useWebSocket(playerId, handleWSMessage);

  const currentPlayer: Player | undefined = gameState?.currentPlayer;
  const buildings: Building[] = gameState?.buildings || [];
  const units: Unit[] = gameState?.units || [];
  const chatMessages: ChatMessage[] = gameState?.chatMessages || [];
  const leaderboard: Player[] = gameState?.leaderboard || [];

  const [mapTiles, setMapTiles] = useState<MapTile[]>([]);

  useEffect(() => {
    const tiles: MapTile[] = [];
    for (let y = 0; y < MAP_SIZE; y++) {
      for (let x = 0; x < MAP_SIZE; x++) {
        const terrainTypes = ['desert', 'prairie', 'mountain'] as const;
        const terrain = terrainTypes[Math.floor(Math.random() * terrainTypes.length)];
        tiles.push({ x, y, terrain });
      }
    }
    setMapTiles(tiles);
  }, []);

  const buildMutation = useMutation({
    mutationFn: async (data: { playerId: string; type: string; posX: number; posY: number }) => {
      return await apiRequest('POST', '/api/buildings', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/game/state'] });
      toast({
        title: "Building Started",
        description: "Your building is under construction!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Build Failed",
        description: error.message || "Insufficient resources or invalid location",
        variant: "destructive",
      });
    },
  });

  const recruitMutation = useMutation({
    mutationFn: async (data: { playerId: string; type: string; quantity: number }) => {
      return await apiRequest('POST', '/api/units', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/game/state'] });
      toast({
        title: "Unit Recruited",
        description: "New unit added to your forces!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Recruitment Failed",
        description: error.message || "Insufficient resources",
        variant: "destructive",
      });
    },
  });

  const handleBuild = (buildingType: string) => {
    setPlacementMode(buildingType);
  };

  const handleTileClick = (x: number, y: number) => {
    setSelectedTile({ x, y });
    
    if (placementMode && playerId) {
      const existingBuilding = buildings.find(b => b.posX === x && b.posY === y);
      if (!existingBuilding) {
        buildMutation.mutate({
          playerId,
          type: placementMode,
          posX: x,
          posY: y,
        });
      }
      setPlacementMode(null);
    }
  };

  const handleRecruit = (unitType: string) => {
    if (playerId) {
      recruitMutation.mutate({
        playerId,
        type: unitType,
        quantity: 1,
      });
    }
  };

  const handleSendMessage = (message: string) => {
    if (playerId && currentPlayer) {
      sendMessage({
        type: 'chat',
        data: {
          playerId: currentPlayer.id,
          username: currentPlayer.username,
          message,
        },
      });
    }
  };

  if (!currentPlayer) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="font-ui text-muted-foreground">Loading game...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      {showTutorial && <TutorialOverlay onComplete={() => setShowTutorial(false)} />}
      
      <GameHUD
        player={currentPlayer}
        onShowLeaderboard={() => setShowLeaderboard(true)}
        viewMode={viewMode}
        onToggleView={() => setViewMode(viewMode === 'city' ? 'map' : 'city')}
      />

      {viewMode === 'city' ? (
        <div className="flex-1 flex gap-4 p-2 md:p-4 pt-16 md:pt-20 overflow-hidden">
          <div className="flex-1">
            <Tabs defaultValue="buildings" className="h-full flex flex-col">
              <TabsList className="grid w-full grid-cols-3 md:grid-cols-2 md:max-w-md">
                <TabsTrigger value="buildings" className="font-ui text-xs md:text-sm">Construções</TabsTrigger>
                <TabsTrigger value="troops" className="font-ui text-xs md:text-sm">Tropas</TabsTrigger>
                <TabsTrigger value="chat" className="font-ui text-xs md:text-sm md:hidden">Chat</TabsTrigger>
              </TabsList>
              <TabsContent value="buildings" className="flex-1 mt-2 md:mt-4 overflow-auto">
                <BuildingMenu player={currentPlayer} onBuild={handleBuild} />
              </TabsContent>
              <TabsContent value="troops" className="flex-1 mt-2 md:mt-4 overflow-auto">
                <TroopPanel player={currentPlayer} units={units} onRecruit={handleRecruit} />
              </TabsContent>
              <TabsContent value="chat" className="flex-1 mt-2 md:mt-4 overflow-auto md:hidden">
                <ChatPanel messages={chatMessages} onSendMessage={handleSendMessage} />
              </TabsContent>
            </Tabs>
          </div>

          <div className="w-80 flex-shrink-0 hidden md:block">
            <ChatPanel messages={chatMessages} onSendMessage={handleSendMessage} />
          </div>
        </div>
      ) : (
        <div className="flex-1 p-2 md:p-4 pt-16 md:pt-20 overflow-hidden">
          <GameMap
            mapTiles={mapTiles}
            buildings={buildings}
            selectedTile={selectedTile}
            onTileClick={handleTileClick}
            placementMode={placementMode}
          />
        </div>
      )}

      <Leaderboard
        open={showLeaderboard}
        onClose={() => setShowLeaderboard(false)}
        players={leaderboard}
        currentPlayerId={currentPlayer.id}
      />
    </div>
  );
}
