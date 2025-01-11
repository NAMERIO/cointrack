import React, { useEffect, useState } from "react";
import axios from "axios";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

const Stats: React.FC = () => {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const fetchGlobalData = async () => {
      const response = await axios.get(
        "https://api.coingecko.com/api/v3/global"
      );
      setStats(response.data.data);
    };
    fetchGlobalData();
  }, []);

  if (!stats) return null;

  return (
    <Grid container spacing={3} style={{ marginTop: "20px" }}>
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Typography variant="h6">Market Cap</Typography>
            <Typography variant="body1">
              ${stats.total_market_cap.usd.toLocaleString()}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Typography variant="h6">24h Volume</Typography>
            <Typography variant="body1">
              ${stats.total_volume.usd.toLocaleString()}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default Stats;
