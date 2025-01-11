import React from "react";
import Header from "./components/Header";
import Stats from "./components/Stats";
import CoinList from "./components/CoinList";
import Container from "@mui/material/Container";

const App: React.FC = () => {
  return (
    <div>
      <Header />
      <Container>
        <Stats />
        <CoinList />
      </Container>
    </div>
  );
};

export default App;
