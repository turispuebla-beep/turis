import { Box, AppBar, Toolbar, Typography, IconButton, Drawer, List, ListItem, ListItemIcon, ListItemText, useTheme, useMediaQuery } from '@mui/material';
import { Menu as MenuIcon, Newspaper, Person, Notifications, Login, Logout, SportsSoccer, BarChart, AdminPanelSettings } from '@mui/icons-material';
import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { NotificationManager } from '../notifications/NotificationManager';
import { GlobalSearch } from '../search/GlobalSearch';
import { useAuth } from '../../hooks/useAuth';
import { usePermissions } from '../../hooks/usePermissions';

export function MainLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  const { isSuperAdmin } = usePermissions();

      const menuItems = [
        { text: 'Noticias', icon: <Newspaper />, path: '/' },
        { text: 'Equipos', icon: <SportsSoccer />, path: '/teams' },
        { text: 'Estadísticas', icon: <BarChart />, path: '/stats' },
        { text: 'Perfil', icon: <Person />, path: '/profile', requiresAuth: true },
        { text: 'Notificaciones', icon: <Notifications />, path: '/notifications', requiresAuth: true },
        { 
          text: 'Gestión de Equipos',
          icon: <AdminPanelSettings />,
          path: '/admin/teams',
          requiresAuth: true,
          requiresSuperAdmin: true
        },
    ];

  const handleNavigation = (path: string) => {
    navigate(path);
    if (isMobile) {
      setDrawerOpen(false);
    }
  };

  const handleAuthAction = () => {
    if (isAuthenticated) {
      logout();
      navigate('/');
    } else {
      navigate('/login');
    }
  };

  const drawerContent = (
    <List>
      {menuItems.map((item) => (
        (!item.requiresAuth || isAuthenticated) && (!item.requiresSuperAdmin || isSuperAdmin()) && (
          <ListItem 
            button 
            key={item.text} 
            onClick={() => handleNavigation(item.path)}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        )
      ))}
    </List>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed">
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={() => setDrawerOpen(!drawerOpen)}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          
          <Typography variant="h6" component="div" sx={{ display: { xs: 'block', sm: 'none' }, mr: 2 }}>
            TURISTEAM
          </Typography>

          <Box sx={{ flexGrow: 1, mx: 2, display: { xs: 'none', sm: 'block' } }}>
            <GlobalSearch />
          </Box>

          <IconButton 
            color="inherit"
            onClick={handleAuthAction}
          >
            {isAuthenticated ? <Logout /> : <Login />}
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer
        variant={isMobile ? 'temporary' : 'permanent'}
        open={isMobile ? drawerOpen : true}
        onClose={() => setDrawerOpen(false)}
        sx={{
          width: 240,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 240,
            boxSizing: 'border-box',
            marginTop: { sm: '64px' },
          },
        }}
      >
        {drawerContent}
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - 240px)` },
          marginTop: '64px',
        }}
      >
        <Outlet />
        {isAuthenticated && <NotificationManager />}
      </Box>
    </Box>
  );
}