import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { fetchCoinData, fetchHistoricalData, type CoinData, type HistoricalDataPoint } from '../services/api';
import { CoinDetailsSkeleton } from '../components/LoadingSkeleton';

type TimeRange = '1' | '7' | '30' | '365';

const timeRangeLabels: Record<TimeRange, string> = {
  '1': '24h',
  '7': '7d',
  '30': '30d',
  '365': '1y'
};

export default function CoinDetails() {
  const { id } = useParams<{ id: string }>();
  const [timeRange, setTimeRange] = useState<TimeRange>('7');
  const [coinData, setCoinData] = useState<CoinData | null>(null);
  const [chartData, setChartData] = useState<HistoricalDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        setError(null);
        const [coin, history] = await Promise.all([
          fetchCoinData(id),
          fetchHistoricalData(id, parseInt(timeRange))
        ]);
        setCoinData(coin);
        setChartData(history);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 60000); // Refresh every minute

    return () => clearInterval(interval);
  }, [id, timeRange]);

  if (loading || !coinData) {
    return <CoinDetailsSkeleton />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500 dark:text-red-400 text-center">
          <p className="text-xl font-semibold">{error}</p>
          <p className="mt-2">Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
        <div className="flex items-center mb-6">
          <img src={coinData.image} alt={coinData.name} className="w-16 h-16 rounded-full mr-4" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{coinData.name}</h1>
            <p className="text-gray-500 dark:text-gray-400">{coinData.symbol.toUpperCase()}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Current Price</h3>
            <p className="text-xl font-semibold text-gray-900 dark:text-white">
              ${coinData.current_price.toLocaleString()}
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">24h High</h3>
            <p className="text-xl font-semibold text-gray-900 dark:text-white">
              ${coinData.high_24h.toLocaleString()}
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">24h Low</h3>
            <p className="text-xl font-semibold text-gray-900 dark:text-white">
              ${coinData.low_24h.toLocaleString()}
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">24h Change</h3>
            <p className={`text-xl font-semibold ${
              coinData.price_change_percentage_24h > 0 
                ? 'text-green-600 dark:text-green-400' 
                : 'text-red-600 dark:text-red-400'
            }`}>
              {coinData.price_change_percentage_24h.toFixed(2)}%
            </p>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Price Chart</h2>
            <div className="flex gap-2">
              {(Object.entries(timeRangeLabels) as [TimeRange, string][]).map(([value, label]) => (
                <button
                  key={value}
                  onClick={() => setTimeRange(value)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    timeRange === value
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis
                  dataKey="timestamp"
                  tickFormatter={(timestamp) => {
                    const date = new Date(timestamp);
                    return timeRange === '1'
                      ? date.toLocaleTimeString()
                      : date.toLocaleDateString();
                  }}
                  stroke="#9CA3AF"
                />
                <YAxis
                  domain={['auto', 'auto']}
                  tickFormatter={(value) => `$${value.toLocaleString()}`}
                  stroke="#9CA3AF"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: 'none',
                    borderRadius: '0.5rem',
                    color: '#E5E7EB'
                  }}
                  formatter={(value: number) => [`$${value.toLocaleString()}`, 'Price']}
                  labelFormatter={(timestamp) => {
                    const date = new Date(timestamp);
                    return timeRange === '1'
                      ? date.toLocaleString()
                      : date.toLocaleDateString();
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}