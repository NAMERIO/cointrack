import React, { useEffect, useState } from "react";
import { fetchMarketData } from "../services/cryptoService";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";

interface Coin {
  id: string;
  name: string;
  symbol: string;
  current_price: number;
  image: string;
}

const CoinList: React.FC = () => {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const getCoins = async () => {
      try {
        const data = await fetchMarketData();
        setCoins(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    getCoins();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <Grid container spacing={3} style={{ marginTop: "20px" }}>
      {coins.map((coin) => (
        <Grid item xs={12} sm={6} md={4} key={coin.id}>
          <Card>
            <CardContent>
              <Typography variant="h5">
                {coin.name} ({coin.symbol.toUpperCase()})
              </Typography>
              <Typography variant="body2">
                Current Price: ${coin.current_price}
              </Typography>
              <Link to={`/coin/${coin.id}`} style={{ textDecoration: "none" }}>
                <Button
                  variant="contained"
                  color="primary"
                  style={{ marginTop: "10px" }}
                >
                  View Details
                </Button>
              </Link>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default CoinList;
