"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import Snackbar from "@mui/material/Snackbar";
import { Alert } from "@mui/material";

type MessageOptions = {
  severity?: "success" | "error";
  action?: { label: string; onClick: () => void };
};

interface SnackbarContextType {
  showMessage: (content: ReactNode, options?: MessageOptions) => void;
  showError: (content: ReactNode) => void;
}

const SnackbarContext = createContext<SnackbarContextType | undefined>(undefined);

export const useSnackbar = () => {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error("useSnackbar must be used within a SnackbarProvider");
  }
  return context;
};

export const SnackbarProvider = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState<{
    key: number;
    content: ReactNode;
    options: MessageOptions;
  }>({ key: 0, content: "", options: {} });

  const showMessage = useCallback((content: ReactNode, options: MessageOptions = {}) => {
    // A new key restarts the auto-hide timer when messages follow each other.
    setMessage({ key: Date.now(), content, options });
    setOpen(true);
  }, []);

  const showError = useCallback(
    (content: ReactNode) => showMessage(content, { severity: "error" }),
    [showMessage]
  );

  const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const { severity = "success", action } = message.options;

  return (
    <SnackbarContext.Provider value={{ showMessage, showError }}>
      {children}
      <Snackbar
        key={message.key}
        open={open}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        onClose={handleClose}
        autoHideDuration={action ? 5000 : 4000}
        // Above the floating "Create a task" button.
        sx={{ bottom: { xs: 88, sm: 88 } }}
      >
        <Alert
          severity={severity}
          role={severity === "error" ? "alert" : "status"}
          action={
            action && (
              <button
                type="button"
                className="px-3 py-1.5 rounded-md font-semibold text-primary hover:bg-primary-soft transition-colors"
                onClick={() => {
                  action.onClick();
                  setOpen(false);
                }}
              >
                {action.label}
              </button>
            )
          }
          sx={{
            backgroundColor: "white",
            color: "#0F172A",
            border: "1px solid #E2E8F0",
            borderRadius: "12px",
            boxShadow: "0 8px 24px rgba(15, 23, 42, 0.08)",
            alignItems: "center",
            "& .MuiAlert-icon": { color: severity === "error" ? "#DC2626" : "#0F766E" },
            "& .MuiAlert-action": { pt: 0 },
          }}
        >
          {message.content}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
};
