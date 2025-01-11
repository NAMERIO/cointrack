import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import React, { ReactNode } from "react";

const theme = createTheme({
  palette: {
    primary: {
      main: "#4caf50",
    },
    secondary: {
      main: "#ff5722",
    },
    background: {
      default: "#f5f5f5",
    },
  },
});

interface ThemedAppProps {
  children: ReactNode;
}

const ThemedApp: React.FC<ThemedAppProps> = ({ children }) => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    {children}
  </ThemeProvider>
);

export default ThemedApp;
