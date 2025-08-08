import { ThemeProvider, CssBaseline, Snackbar, Alert } from '@mui/material';
import { Router } from './router';
import { theme } from './theme';
import { useDeviceSync } from './hooks/useDeviceSync';
import { useDeviceNotifications } from './hooks/useDeviceNotifications';
import { useState } from 'react';

function App() {
  const [syncError, setSyncError] = useState<string | null>(null);
  const [notificationMessage, setNotificationMessage] = useState<string | null>(null);

  const { isSyncing } = useDeviceSync({
    onSyncError: (error) => {
      setSyncError(error.message);
    }
  });

  useDeviceNotifications({
    onNewNotification: (notification) => {
      setNotificationMessage(notification.title);
    },
    onError: (error) => {
      setSyncError(error.message);
    }
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router />
      
      {/* Error de sincronización */}
      <Snackbar
        open={!!syncError}
        autoHideDuration={6000}
        onClose={() => setSyncError(null)}
      >
        <Alert severity="error" onClose={() => setSyncError(null)}>
          {syncError}
        </Alert>
      </Snackbar>

      {/* Nueva notificación */}
      <Snackbar
        open={!!notificationMessage}
        autoHideDuration={4000}
        onClose={() => setNotificationMessage(null)}
      >
        <Alert severity="info" onClose={() => setNotificationMessage(null)}>
          {notificationMessage}
        </Alert>
      </Snackbar>

      {/* Indicador de sincronización */}
      <Snackbar
        open={isSyncing}
        message="Sincronizando..."
      />
    </ThemeProvider>
  );
}

export default App;