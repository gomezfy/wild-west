import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, X } from "lucide-react";

const TUTORIAL_STEPS = [
  {
    title: "Welcome to the Wild West!",
    content: "Build your frontier town, gather resources, and become the most powerful pioneer in the west.",
  },
  {
    title: "Gather Resources",
    content: "Your resources are shown at the top: Gold, Wood, and Food. You'll need them to build and recruit.",
  },
  {
    title: "Build Structures",
    content: "Click on buildings in the left menu, then place them on the map. Start with a Saloon to generate gold!",
  },
  {
    title: "Expand Your Territory",
    content: "Build more structures to increase your territory size and resource production over time.",
  },
  {
    title: "Chat with Others",
    content: "Use the chat panel at the bottom to communicate with other players and form alliances.",
  },
  {
    title: "Climb the Leaderboard",
    content: "Check your ranking by clicking the trophy icon. Compete to become the top frontier leader!",
  },
];

interface TutorialOverlayProps {
  onComplete: () => void;
}

export function TutorialOverlay({ onComplete }: TutorialOverlayProps) {
  const [step, setStep] = useState(0);

  const handleNext = () => {
    if (step < TUTORIAL_STEPS.length - 1) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  const currentStep = TUTORIAL_STEPS[step];

  return (
    <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <Card className="max-w-lg w-full">
        <CardHeader className="relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSkip}
            className="absolute top-2 right-2"
            data-testid="button-skip-tutorial"
          >
            <X className="w-4 h-4" />
          </Button>
          <CardTitle className="font-western text-2xl text-primary pr-8">
            {currentStep.title}
          </CardTitle>
          <p className="font-ui text-sm text-muted-foreground">
            Step {step + 1} of {TUTORIAL_STEPS.length}
          </p>
        </CardHeader>
        <CardContent>
          <p className="font-ui text-base leading-relaxed">
            {currentStep.content}
          </p>
        </CardContent>
        <CardFooter className="flex justify-between items-center gap-4">
          <div className="flex gap-1">
            {TUTORIAL_STEPS.map((_, i) => (
              <div
                key={i}
                className={`h-2 w-2 rounded-full ${
                  i === step ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={handleSkip}>
              Skip
            </Button>
            <Button onClick={handleNext} data-testid="button-next-tutorial">
              {step < TUTORIAL_STEPS.length - 1 ? (
                <>
                  Next <ArrowRight className="w-4 h-4 ml-2" />
                </>
              ) : (
                'Get Started'
              )}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
