import { useEffect, useRef, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

interface WSMessage {
  type: string;
  data: any;
}

export function useWebSocket(playerId: string | null, onMessage?: (message: WSMessage) => void) {
  const ws = useRef<WebSocket | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!playerId) return;

    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    
    ws.current = new WebSocket(wsUrl);

    ws.current.onopen = () => {
      console.log('WebSocket connected');
      ws.current?.send(JSON.stringify({
        type: 'identify',
        data: { playerId },
      }));
    };

    ws.current.onmessage = (event) => {
      try {
        const message: WSMessage = JSON.parse(event.data);
        
        if (message.type === 'chat') {
          onMessage?.(message);
        } else if (message.type === 'building_complete') {
          toast({
            title: "Construction Complete",
            description: "Your building is now operational!",
          });
          onMessage?.(message);
        } else if (message.type === 'resource_update') {
          onMessage?.(message);
        } else if (message.type === 'unit_recruited') {
          onMessage?.(message);
        } else if (message.type === 'battle') {
          toast({
            title: "Battle Report",
            description: `Battle result: ${message.data.result}`,
          });
          onMessage?.(message);
        }
      } catch (error) {
        console.error('WebSocket message parse error:', error);
      }
    };

    ws.current.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.current.onclose = () => {
      console.log('WebSocket disconnected');
    };

    return () => {
      ws.current?.close();
    };
  }, [playerId, onMessage, toast]);

  const sendMessage = useCallback((message: WSMessage) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(message));
    }
  }, []);

  return { sendMessage };
}
