"use client";

import { ThemeProvider, createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: { main: "#0F766E" },
    error: { main: "#DC2626" },
    text: { primary: "#0F172A", secondary: "#64748B" },
  },
  shape: { borderRadius: 8 },
  typography: {
    fontFamily: "var(--font-sans), system-ui, sans-serif",
    button: { textTransform: "none" },
  },
});

export default function ThemeRegistry({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}
