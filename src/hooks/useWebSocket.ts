import { useState, useEffect, useRef, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface WebSocketMessage {
  type: string;
  data: any;
  timestamp: number;
}

interface UseWebSocketProps {
  url: string;
  onMessage?: (message: WebSocketMessage) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Event) => void;
  reconnectAttempts?: number;
  reconnectInterval?: number;
}

export function useWebSocket({
  url,
  onMessage,
  onConnect,
  onDisconnect,
  onError,
  reconnectAttempts = 5,
  reconnectInterval = 3000
}: UseWebSocketProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [latency, setLatency] = useState<number | null>(null);
  
  const ws = useRef<WebSocket | null>(null);
  const reconnectCount = useRef(0);
  const reconnectTimer = useRef<NodeJS.Timeout | null>(null);
  const pingTimer = useRef<NodeJS.Timeout | null>(null);
  const lastPingTime = useRef<number>(0);
  
  const { toast } = useToast();

  const connect = useCallback(() => {
    if (ws.current?.readyState === WebSocket.CONNECTING || 
        ws.current?.readyState === WebSocket.OPEN) {
      return;
    }

    setIsConnecting(true);
    setConnectionError(null);

    try {
      ws.current = new WebSocket(url);

      ws.current.onopen = () => {
        setIsConnected(true);
        setIsConnecting(false);
        setConnectionError(null);
        reconnectCount.current = 0;
        onConnect?.();
        
        // Start ping/pong for latency monitoring
        startPingPong();
        
        toast({
          title: "Connected",
          description: "Successfully connected to multiplayer server",
        });
      };

      ws.current.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          
          // Handle pong messages for latency calculation
          if (message.type === 'pong') {
            const currentTime = Date.now();
            setLatency(currentTime - lastPingTime.current);
            return;
          }
          
          onMessage?.(message);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      ws.current.onclose = () => {
        setIsConnected(false);
        setIsConnecting(false);
        onDisconnect?.();
        stopPingPong();
        
        // Attempt reconnection
        if (reconnectCount.current < reconnectAttempts) {
          reconnectCount.current++;
          reconnectTimer.current = setTimeout(() => {
            connect();
          }, reconnectInterval);
          
          toast({
            title: "Connection Lost",
            description: `Reconnecting... (${reconnectCount.current}/${reconnectAttempts})`,
            variant: "destructive",
          });
        } else {
          setConnectionError('Failed to reconnect after multiple attempts');
          toast({
            title: "Connection Failed",
            description: "Unable to connect to multiplayer server",
            variant: "destructive",
          });
        }
      };

      ws.current.onerror = (error) => {
        setConnectionError('Connection error occurred');
        onError?.(error);
      };

    } catch (error) {
      setIsConnecting(false);
      setConnectionError('Failed to create WebSocket connection');
    }
  }, [url, onMessage, onConnect, onDisconnect, onError, reconnectAttempts, reconnectInterval, toast]);

  const disconnect = useCallback(() => {
    if (reconnectTimer.current) {
      clearTimeout(reconnectTimer.current);
      reconnectTimer.current = null;
    }
    
    stopPingPong();
    
    if (ws.current) {
      ws.current.close();
      ws.current = null;
    }
    
    setIsConnected(false);
    setIsConnecting(false);
    setConnectionError(null);
    reconnectCount.current = 0;
  }, []);

  const sendMessage = useCallback((type: string, data: any) => {
    if (!ws.current || ws.current.readyState !== WebSocket.OPEN) {
      toast({
        title: "Connection Error",
        description: "Not connected to server",
        variant: "destructive",
      });
      return false;
    }

    try {
      const message: WebSocketMessage = {
        type,
        data,
        timestamp: Date.now()
      };
      
      ws.current.send(JSON.stringify(message));
      return true;
    } catch (error) {
      console.error('Error sending WebSocket message:', error);
      return false;
    }
  }, [toast]);

  const startPingPong = useCallback(() => {
    pingTimer.current = setInterval(() => {
      if (isConnected) {
        lastPingTime.current = Date.now();
        sendMessage('ping', {});
      }
    }, 30000); // Ping every 30 seconds
  }, [isConnected, sendMessage]);

  const stopPingPong = useCallback(() => {
    if (pingTimer.current) {
      clearInterval(pingTimer.current);
      pingTimer.current = null;
    }
  }, []);

  useEffect(() => {
    connect();
    
    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return {
    isConnected,
    isConnecting,
    connectionError,
    latency,
    connect,
    disconnect,
    sendMessage
  };
}