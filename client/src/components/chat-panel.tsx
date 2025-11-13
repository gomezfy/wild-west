import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send } from "lucide-react";
import { ChatMessage } from "@shared/schema";

interface ChatPanelProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
}

export function ChatPanel({ messages, onSendMessage }: ChatPanelProps) {
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (input.trim()) {
      onSendMessage(input.trim());
      setInput("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <Card className="w-full h-full flex flex-col">
      <CardHeader className="pb-3 flex-shrink-0">
        <CardTitle className="font-western text-xl text-primary">Frontier Chat</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col p-0 min-h-0">
        <ScrollArea className="flex-1 px-4" ref={scrollRef}>
          <div className="space-y-2 pb-4">
            {messages.length === 0 ? (
              <p className="font-ui text-sm text-muted-foreground text-center py-8">
                No messages yet. Start a conversation!
              </p>
            ) : (
              messages.map((msg) => (
                <div key={msg.id} className="font-ui text-sm" data-testid={`chat-message-${msg.id}`}>
                  <span className="font-semibold text-primary">{msg.username}:</span>{" "}
                  <span className="text-foreground">{msg.message}</span>
                  <span className="text-xs text-muted-foreground ml-2">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
        
        <div className="p-4 border-t border-border flex-shrink-0">
          <div className="flex gap-2">
            <Input
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="font-ui"
              data-testid="input-chat"
            />
            <Button onClick={handleSend} size="icon" data-testid="button-send-chat">
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
