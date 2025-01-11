import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend
);

interface CoinDetailsData {
  name: string;
  symbol: string;
  market_data: { current_price: { usd: number } };
  description: { en: string };
  image: { large: string };
  market_chart: { prices: number[][] };
}

const CoinDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [coin, setCoin] = useState<CoinDetailsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCoinDetails = async () => {
      try {
        const [coinData, chartData] = await Promise.all([
          axios.get(`https://api.coingecko.com/api/v3/coins/${id}`),
          axios.get(
            `https://api.coingecko.com/api/v3/coins/${id}/market_chart`,
            {
              params: { vs_currency: "usd", days: "7" },
            }
          ),
        ]);

        setCoin({
          ...coinData.data,
          market_chart: chartData.data,
        });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCoinDetails();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!coin) return <p>Coin not found</p>;

  const graphData = {
    labels: coin.market_chart.prices.map(([timestamp]) =>
      new Date(timestamp).toLocaleDateString()
    ),
    datasets: [
      {
        label: `${coin.name} Price (Last 7 Days)`,
        data: coin.market_chart.prices.map(([_, price]) => price),
        borderColor: "#4CAF50",
        backgroundColor: "rgba(76, 175, 80, 0.2)",
        pointRadius: 3,
        pointBackgroundColor: "#4CAF50",
        tension: 0.1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: `${coin.name} Price Trend`,
      },
    },
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>
        {coin.name} ({coin.symbol.toUpperCase()})
      </h1>
      <img src={coin.image.large} alt={coin.name} style={{ width: "100px" }} />
      <p>
        <strong>Current Price:</strong> ${coin.market_data.current_price.usd}
      </p>
      <p>
        <strong>Description:</strong> {coin.description.en}
      </p>
      <h2>Price Graph</h2>
      <Line data={graphData} options={options} />
    </div>
  );
};

export default CoinDetails;
