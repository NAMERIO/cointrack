import axios from 'axios';

const COINGECKO_API = 'https://api.coingecko.com/api/v3';

export interface CoinData {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
  high_24h: number;
  low_24h: number;
  total_volume: number;
  market_cap: number;
  market_cap_rank: number;
  circulating_supply: number;
  total_supply: number;
  image: string;
}

export interface SupportedCurrency {
  id: string;
  name: string;
  symbol: string;
}

export interface HistoricalDataPoint {
  timestamp: number;
  price: number;
}

export const fetchMarketData = async (
  currency: string = 'usd',
  orderBy: string = 'market_cap_desc',
  perPage: number = 20,
  page: number = 1
): Promise<CoinData[]> => {
  try {
    const response = await axios.get(`${COINGECKO_API}/coins/markets`, {
      params: {
        vs_currency: currency,
        order: orderBy,
        per_page: perPage,
        page,
        sparkline: false,
        price_change_percentage: '24h'
      }
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Failed to fetch market data: ${error.message}`);
    }
    throw new Error('Failed to fetch market data');
  }
};

export const fetchCoinData = async (id: string, currency: string = 'usd'): Promise<CoinData> => {
  try {
    const response = await axios.get(`${COINGECKO_API}/coins/${id}`);
    return {
      id: response.data.id,
      symbol: response.data.symbol,
      name: response.data.name,
      current_price: response.data.market_data.current_price[currency],
      price_change_percentage_24h: response.data.market_data.price_change_percentage_24h,
      high_24h: response.data.market_data.high_24h[currency],
      low_24h: response.data.market_data.low_24h[currency],
      total_volume: response.data.market_data.total_volume[currency],
      market_cap: response.data.market_data.market_cap[currency],
      market_cap_rank: response.data.market_cap_rank,
      circulating_supply: response.data.market_data.circulating_supply,
      total_supply: response.data.market_data.total_supply,
      image: response.data.image.large
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Failed to fetch coin data: ${error.message}`);
    }
    throw new Error('Failed to fetch coin data');
  }
};

export const fetchHistoricalData = async (
  id: string,
  days: number = 7,
  currency: string = 'usd'
): Promise<HistoricalDataPoint[]> => {
  try {
    const response = await axios.get(`${COINGECKO_API}/coins/${id}/market_chart`, {
      params: {
        vs_currency: currency,
        days: days,
        interval: days <= 1 ? 'hourly' : 'daily'
      }
    });
    
    if (!Array.isArray(response.data.prices)) {
      throw new Error('Invalid historical data format');
    }

    return response.data.prices.map((item: [number, number]) => ({
      timestamp: item[0],
      price: item[1]
    }));
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Failed to fetch historical data: ${error.message}`);
    }
    throw new Error('Failed to fetch historical data');
  }
};

export const fetchSupportedCurrencies = async (): Promise<SupportedCurrency[]> => {
  try {
    const response = await axios.get(`${COINGECKO_API}/simple/supported_vs_currencies`);
    return response.data.map((currency: string) => ({
      id: currency,
      name: currency.toUpperCase(),
      symbol: currency.toUpperCase()
    }));
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Failed to fetch supported currencies: ${error.message}`);
    }
    throw new Error('Failed to fetch supported currencies');
  }
};