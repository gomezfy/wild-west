import { useState } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import SplashScreen from "@/pages/splash-screen";
import Game from "@/pages/game";

function App() {
  const [username, setUsername] = useState<string | null>(null);
  const [gameStarted, setGameStarted] = useState(false);

  const handleStart = (name: string) => {
    setUsername(name);
    setGameStarted(true);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        {!gameStarted ? (
          <SplashScreen onStart={handleStart} />
        ) : (
          <Game username={username!} />
        )}
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
