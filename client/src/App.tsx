import { useState } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import SplashScreen from "@/pages/splash-screen";
import MainMenu from "@/pages/main-menu";
import Game from "@/pages/game";

function App() {
  const [username, setUsername] = useState<string | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  const handleStart = (name: string) => {
    setUsername(name);
    setShowMenu(true);
  };

  const handleEnterWorld = () => {
    setGameStarted(true);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        {!username || !showMenu ? (
          <SplashScreen onStart={handleStart} />
        ) : !gameStarted ? (
          <MainMenu username={username} onEnterWorld={handleEnterWorld} />
        ) : (
          <Game username={username} />
        )}
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
