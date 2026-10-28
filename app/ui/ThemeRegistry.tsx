"use client";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { SnackbarProvider } from "./components/Tasks/SnackbarContext";
import { TasksProvider } from "../lib/hooks/TasksProvider";

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

// Client-side providers shared by every page.
export default function ThemeRegistry({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <SnackbarProvider>
          <TasksProvider>{children}</TasksProvider>
        </SnackbarProvider>
      </LocalizationProvider>
    </ThemeProvider>
  );
}
