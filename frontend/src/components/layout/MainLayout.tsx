import React from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Box, 
  Container, 
  useTheme, 
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Fab,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon
} from '@mui/material';
import {
  Home as HomeIcon,
  SportsSoccer as TeamsIcon,
  Event as EventsIcon,
  PhotoCamera as MediaIcon,
  People as MembersIcon,
  Settings as SettingsIcon,
  Menu as MenuIcon,
  Add as AddIcon,
  Notifications as NotificationsIcon,
  Chat as ChatIcon
} from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate, useLocation } from 'react-router-dom';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const navigationItems = [
    { label: 'Inicio', icon: <HomeIcon />, path: '/' },
    { label: 'Equipos', icon: <TeamsIcon />, path: '/teams' },
    { label: 'Eventos', icon: <EventsIcon />, path: '/events' },
    { label: 'Medios', icon: <MediaIcon />, path: '/media' },
    { label: 'Miembros', icon: <MembersIcon />, path: '/members' },
  ];

  const speedDialActions = [
    { icon: <AddIcon />, name: 'Nuevo Evento', action: () => navigate('/events/new') },
    { icon: <ChatIcon />, name: 'Chat', action: () => navigate('/chat') },
    { icon: <NotificationsIcon />, name: 'Notificaciones', action: () => navigate('/notifications') },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    if (isMobile) {
      setDrawerOpen(false);
    }
  };

  const drawer = (
    <Box sx={{ width: 250 }}>
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          CDSANABRIACF
        </Typography>
      </Toolbar>
      <List>
        {navigationItems.map((item) => (
          <ListItem 
            button 
            key={item.label}
            onClick={() => handleNavigation(item.path)}
            selected={location.pathname === item.path}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* AppBar */}
      <AppBar 
        position="fixed" 
        sx={{ 
          zIndex: theme.zIndex.drawer + 1,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        }}
      >
        <Toolbar>
          {isMobile && (
            <IconButton
              color="inherit"
              edge="start"
              onClick={() => setDrawerOpen(!drawerOpen)}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            CDSANABRIACF
          </Typography>

          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 2 }}>
              {navigationItems.map((item) => (
                <Typography
                  key={item.label}
                  variant="body2"
                  sx={{ 
                    cursor: 'pointer',
                    opacity: location.pathname === item.path ? 1 : 0.7,
                    '&:hover': { opacity: 1 }
                  }}
                  onClick={() => handleNavigation(item.path)}
                >
                  {item.label}
                </Typography>
              ))}
            </Box>
          )}

          {isAuthenticated && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2">
                {user?.name || 'Usuario'}
              </Typography>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {/* Drawer para móviles */}
      {isMobile && (
        <Drawer
          variant="temporary"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: 250,
              background: 'linear-gradient(180deg, #f8f9fa 0%, #e9ecef 100%)'
            },
          }}
        >
          {drawer}
        </Drawer>
      )}

      {/* Contenido principal */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: { xs: 8, md: 9 },
          pb: { xs: 8, md: 2 },
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
          minHeight: '100vh'
        }}
      >
        <Container maxWidth="lg" sx={{ py: 3 }}>
          {children}
        </Container>
      </Box>

      {/* Speed Dial para acciones rápidas */}
      {isAuthenticated && (
        <SpeedDial
          ariaLabel="Acciones rápidas"
          sx={{ position: 'fixed', bottom: 16, right: 16 }}
          icon={<SpeedDialIcon />}
        >
          {speedDialActions.map((action) => (
            <SpeedDialAction
              key={action.name}
              icon={action.icon}
              tooltipTitle={action.name}
              onClick={action.action}
            />
          ))}
        </SpeedDial>
      )}
    </Box>
  );
};