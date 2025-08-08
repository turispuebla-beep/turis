import { useEffect, useState } from 'react';
import { Button, Snackbar, Alert } from '@mui/material';
import {
  requestNotificationPermission,
  registerServiceWorker,
  subscribeToNotifications,
  unsubscribeFromNotifications
} from '../../services/notificationService';

export function NotificationManager() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [notificationStatus, setNotificationStatus] = useState<'default' | 'granted' | 'denied'>('default');

  useEffect(() => {
    checkNotificationStatus();
    registerServiceWorker();
  }, []);

  const checkNotificationStatus = () => {
    if ('Notification' in window) {
      setNotificationStatus(Notification.permission);
      if (Notification.permission === 'default') {
        setShowPrompt(true);
      }
    }
  };

  const handleEnableNotifications = async () => {
    try {
      const granted = await requestNotificationPermission();
      if (granted) {
        await subscribeToNotifications();
        setNotificationStatus('granted');
      } else {
        setNotificationStatus('denied');
      }
    } catch (error) {
      console.error('Error al habilitar notificaciones:', error);
    }
    setShowPrompt(false);
  };

  const handleDisableNotifications = async () => {
    try {
      await unsubscribeFromNotifications();
      setNotificationStatus('default');
    } catch (error) {
      console.error('Error al deshabilitar notificaciones:', error);
    }
  };

  return (
    <>
      <Snackbar
        open={showPrompt}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity="info"
          action={
            <Button
              color="inherit"
              size="small"
              onClick={handleEnableNotifications}
            >
              Activar
            </Button>
          }
        >
          ¿Deseas recibir notificaciones de TURISTEAM?
        </Alert>
      </Snackbar>

      {notificationStatus === 'granted' && (
        <Button
          variant="outlined"
          color="primary"
          onClick={handleDisableNotifications}
        >
          Desactivar Notificaciones
        </Button>
      )}
    </>
  );
}