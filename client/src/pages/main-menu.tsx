import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Map, Trophy, Settings, BookOpen } from "lucide-react";
import heroBackground from "@assets/generated_images/Western_town_panorama_background_dbcbb5a2.png";

interface MainMenuProps {
  username: string;
  onEnterWorld: () => void;
}

export default function MainMenu({ username, onEnterWorld }: MainMenuProps) {
  return (
    <div className="relative h-screen w-full overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroBackground})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
      </div>
      
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-4">
        <div className="text-center mb-8">
          <h1 className="font-western text-5xl md:text-6xl font-bold text-amber-100 mb-2 drop-shadow-lg tracking-wide">
            Bem-vindo, {username}!
          </h1>
          <p className="font-ui text-lg text-amber-100/80">
            Escolha uma opção para começar
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
          <Card className="bg-black/40 backdrop-blur-md border-amber-700/50 hover-elevate">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-md bg-amber-700/30">
                  <Map className="h-6 w-6 text-amber-100" />
                </div>
                <div>
                  <CardTitle className="font-western text-2xl text-amber-100">
                    Mundo
                  </CardTitle>
                  <CardDescription className="font-ui text-amber-100/60">
                    Explore e domine a fronteira
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={onEnterWorld}
                className="w-full font-ui font-semibold"
                size="lg"
                data-testid="button-enter-world"
              >
                ENTRAR NO MUNDO
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-black/40 backdrop-blur-md border-amber-700/50 hover-elevate opacity-60">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-md bg-amber-700/30">
                  <Trophy className="h-6 w-6 text-amber-100" />
                </div>
                <div>
                  <CardTitle className="font-western text-2xl text-amber-100">
                    Classificação
                  </CardTitle>
                  <CardDescription className="font-ui text-amber-100/60">
                    Veja os melhores jogadores
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full font-ui font-semibold"
                size="lg"
                variant="secondary"
                disabled
              >
                EM BREVE
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-black/40 backdrop-blur-md border-amber-700/50 hover-elevate opacity-60">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-md bg-amber-700/30">
                  <BookOpen className="h-6 w-6 text-amber-100" />
                </div>
                <div>
                  <CardTitle className="font-western text-2xl text-amber-100">
                    Tutorial
                  </CardTitle>
                  <CardDescription className="font-ui text-amber-100/60">
                    Aprenda a jogar
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full font-ui font-semibold"
                size="lg"
                variant="secondary"
                disabled
              >
                EM BREVE
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-black/40 backdrop-blur-md border-amber-700/50 hover-elevate opacity-60">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-md bg-amber-700/30">
                  <Settings className="h-6 w-6 text-amber-100" />
                </div>
                <div>
                  <CardTitle className="font-western text-2xl text-amber-100">
                    Configurações
                  </CardTitle>
                  <CardDescription className="font-ui text-amber-100/60">
                    Ajuste suas preferências
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full font-ui font-semibold"
                size="lg"
                variant="secondary"
                disabled
              >
                EM BREVE
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center">
          <p className="font-ui text-sm text-amber-100/60">
            Dica: Construa um saloon primeiro para começar a gerar ouro
          </p>
        </div>
      </div>
    </div>
  );
}
