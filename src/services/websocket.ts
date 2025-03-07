import { useEffect, useRef, useState } from 'react';

interface WebSocketMessage {
  e: string;  // Event type
  E: number;  // Event time
  s: string;  // Symbol
  p: string;  // Price
  P: string;  // Price change percent
  c: string;  // Last price
  h: string;  // High price
  l: string;  // Low price
  v: string;  // Total traded volume
  q: string;  // Total traded quote asset volume
}

interface CryptoData {
  symbol: string;
  price: number;
  priceChange: number;
  high24h: number;
  low24h: number;
  volume: number;
  lastUpdate: number;
}

const BINANCE_WS_URL = 'wss://stream.binance.com:9443/ws';
const RECONNECT_DELAY = 5000;
const MAX_RETRIES = 5;

export const useWebSocket = (symbols: string[]) => {
  const [data, setData] = useState<Record<string, CryptoData>>({});
  const ws = useRef<WebSocket | null>(null);
  const reconnectTimeout = useRef<NodeJS.Timeout>();
  const retryCount = useRef(0);
  const mounted = useRef(false);

  const connect = () => {
    if (!mounted.current) return;
    if (ws.current?.readyState === WebSocket.OPEN) return;

    try {
      ws.current = new WebSocket(BINANCE_WS_URL);

      ws.current.onopen = () => {
        console.log('WebSocket Connected');
        retryCount.current = 0;
        
        if (ws.current?.readyState === WebSocket.OPEN) {
          const streams = symbols.map(symbol => `${symbol.toLowerCase()}@ticker`);
          ws.current.send(JSON.stringify({
            method: 'SUBSCRIBE',
            params: streams,
            id: 1
          }));
        }
      };

      ws.current.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          
          if (message.s) {
            setData(prev => ({
              ...prev,
              [message.s]: {
                symbol: message.s,
                price: parseFloat(message.c),
                priceChange: parseFloat(message.P),
                high24h: parseFloat(message.h),
                low24h: parseFloat(message.l),
                volume: parseFloat(message.v),
                lastUpdate: message.E
              }
            }));
          }
        } catch (error) {
          console.warn('Error parsing WebSocket message:', error);
        }
      };

      ws.current.onclose = (event) => {
        if (!mounted.current) return;
        
        console.log('WebSocket Disconnected:', event.code, event.reason);
        
        if (retryCount.current < MAX_RETRIES) {
          retryCount.current += 1;
          console.log(`Reconnecting... Attempt ${retryCount.current} of ${MAX_RETRIES}`);
          reconnectTimeout.current = setTimeout(connect, RECONNECT_DELAY);
        } else {
          console.log('Max reconnection attempts reached');
        }
      };

      ws.current.onerror = (error) => {
        console.warn('WebSocket Error:', error);
        if (ws.current?.readyState === WebSocket.OPEN) {
          ws.current.close();
        }
      };
    } catch (error) {
      console.error('Error creating WebSocket connection:', error);
      if (retryCount.current < MAX_RETRIES) {
        retryCount.current += 1;
        reconnectTimeout.current = setTimeout(connect, RECONNECT_DELAY);
      }
    }
  };

  useEffect(() => {
    mounted.current = true;
    connect();

    return () => {
      mounted.current = false;
      if (ws.current) {
        ws.current.close();
      }
      if (reconnectTimeout.current) {
        clearTimeout(reconnectTimeout.current);
      }
    };
  }, []);

  // Reconnect if symbols change
  useEffect(() => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      // Unsubscribe from current streams
      const currentStreams = Object.keys(data).map(symbol => `${symbol.toLowerCase()}@ticker`);
      if (currentStreams.length > 0) {
        ws.current.send(JSON.stringify({
          method: 'UNSUBSCRIBE',
          params: currentStreams,
          id: 2
        }));
      }

      // Subscribe to new streams
      const newStreams = symbols.map(symbol => `${symbol.toLowerCase()}@ticker`);
      ws.current.send(JSON.stringify({
        method: 'SUBSCRIBE',
        params: newStreams,
        id: 3
      }));
    }
  }, [symbols.join(',')]);

  return data;
};

// Cache for historical data
const historicalDataCache = new Map<string, any>();

export const fetchHistoricalData = async (symbol: string, interval: string) => {
  const cacheKey = `${symbol}-${interval}`;
  const cachedData = historicalDataCache.get(cacheKey);
  
  if (cachedData && Date.now() - cachedData.timestamp < 5 * 60 * 1000) { // 5 minutes cache
    return cachedData.data;
  }

  try {
    const response = await fetch(`https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=100`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    
    const processedData = data.map((item: any[]) => ({
      timestamp: item[0],
      price: parseFloat(item[4])
    }));

    historicalDataCache.set(cacheKey, {
      timestamp: Date.now(),
      data: processedData
    });

    return processedData;
  } catch (error) {
    console.error('Error fetching historical data:', error);
    throw error;
  }
};