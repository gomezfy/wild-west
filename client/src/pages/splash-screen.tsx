import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import heroBackground from "@assets/generated_images/Western_town_panorama_background_dbcbb5a2.png";

interface SplashScreenProps {
  onStart: (username: string) => void;
}

export default function SplashScreen({ onStart }: SplashScreenProps) {
  const [username, setUsername] = useState("");

  const handleStart = () => {
    if (username.trim()) {
      onStart(username.trim());
    }
  };

  return (
    <div className="relative h-screen w-full overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroBackground})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
      </div>
      
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-4">
        <div className="text-center mb-12">
          <h1 className="font-western text-6xl md:text-8xl font-bold text-amber-100 mb-4 drop-shadow-lg tracking-wide">
            WILD WEST
          </h1>
          <h2 className="font-western text-3xl md:text-4xl text-amber-200/90 drop-shadow-md">
            Frontier Strategy
          </h2>
          <p className="font-ui text-lg text-amber-100/80 mt-4 max-w-md mx-auto">
            Build your town, gather resources, and dominate the frontier
          </p>
        </div>

        <Card className="w-full max-w-md p-8 bg-black/40 backdrop-blur-md border-amber-700/50">
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="font-ui text-sm font-semibold text-amber-100 uppercase tracking-wide block mb-2">
                Enter Your Name
              </label>
              <Input
                id="username"
                type="text"
                placeholder="Frontier Pioneer"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleStart()}
                className="bg-black/30 border-amber-700/50 text-amber-100 placeholder:text-amber-100/40 font-ui"
                data-testid="input-username"
              />
            </div>
            
            <Button 
              onClick={handleStart}
              disabled={!username.trim()}
              className="w-full font-ui text-lg font-semibold tracking-wide"
              size="lg"
              data-testid="button-start-game"
            >
              START GAME
            </Button>
          </div>
        </Card>

        <div className="mt-8 text-center">
          <p className="font-ui text-sm text-amber-100/60">
            Tip: Build a saloon first to start generating gold
          </p>
        </div>
      </div>
    </div>
  );
}
