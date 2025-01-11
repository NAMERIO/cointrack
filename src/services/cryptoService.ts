import axios from 'axios';

const BASE_URL = 'https://api.coingecko.com/api/v3';

const cache: { [key: string]: any } = {};
const CACHE_DURATION = 5 * 60 * 1000;
let debounceTimer: ReturnType<typeof setTimeout>;

export const fetchMarketData = async () => {
  const cacheKey = 'marketData';
  const now = Date.now();
  if (cache[cacheKey] && now - cache[cacheKey].timestamp < CACHE_DURATION) {
    console.log('Returning cached data...');
    return cache[cacheKey].data;
  }
  return new Promise((resolve, reject) => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(async () => {
      try {
        console.log('Fetching new data from API...');
        const response = await axios.get(`${BASE_URL}/coins/markets`, {
          params: {
            vs_currency: 'usd',
            order: 'market_cap_desc',
            per_page: 10,
            page: 1,
          },
        });
        cache[cacheKey] = {
          data: response.data,
          timestamp: now,
        };

        resolve(response.data);
      } catch (error) {
        console.error('Error fetching market data:', error);
        reject(error);
      }
    }, 1000); // Debounce delay: 1 second
  });
};
