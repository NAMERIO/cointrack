import React from "react";
import { Line } from "react-chartjs-2";

interface CoinCardProps {
  coin: {
    name: string;
    symbol: string;
    current_price: number;
    image: string;
    sparkline_in_7d: { price: number[] };
  };
}

const CoinCard: React.FC<CoinCardProps> = ({ coin }) => {
  const data = {
    labels: coin.sparkline_in_7d.price.map((_, idx) => idx),
    datasets: [
      {
        label: `${coin.name} Price`,
        data: coin.sparkline_in_7d.price,
        fill: false,
        borderColor: "rgba(75,192,192,1)",
        tension: 0.1,
      },
    ],
  };

  return (
    <div style={{ border: "1px solid #ccc", margin: "10px", padding: "10px" }}>
      <img
        src={coin.image}
        alt={coin.name}
        style={{ width: "50px", height: "50px" }}
      />
      <h2>
        {coin.name} ({coin.symbol.toUpperCase()})
      </h2>
      <p>Current Price: ${coin.current_price.toFixed(2)}</p>
      <Line data={data} />
    </div>
  );
};

export default CoinCard;
