import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";

const Header: React.FC = () => {
  return (
    <AppBar position="static" color="default">
      <Container>
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Cryptocurrency Tracker
          </Typography>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
