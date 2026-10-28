import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import Snackbar from '@mui/material/Snackbar';
import { Alert } from '@mui/material';

interface SnackbarContextType {
  showMessage: (content: ReactNode) => void; // Notez le type ReactNode ici
}

const SnackbarContext = createContext<SnackbarContextType | undefined>(undefined);

export const useSnackbar = () => {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error('useSnackbar must be used within a SnackbarProvider');
  }
  return context;
};

export const SnackbarProvider = ({ children }: {children: React.ReactNode}) => {
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState<ReactNode>(''); 

  const showMessage = useCallback((newContent: ReactNode) => {
    setContent(newContent); 
    setOpen(true);
  }, []);

  const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  return (
    <SnackbarContext.Provider value={{ showMessage }}>
      {children}
      <Snackbar
        open={open}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        onClose={handleClose}
        autoHideDuration={6000}

      >
        <Alert 
        sx={{
            backgroundColor: 'white',
            color: '#0F172A',
            border: '1px solid #E2E8F0',
            borderRadius: '12px',
            boxShadow: '0 8px 24px rgba(15, 23, 42, 0.08)',
            alignItems: 'center',
            '& .MuiAlert-icon': { color: '#0F766E' },
        }}
        >{content}</Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
};
