import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Chip,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip,
  Avatar,
  Badge,
  Skeleton
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  SportsSoccer,
  People,
  LocationOn,
  CalendarToday,
  Edit,
  Delete,
  Visibility,
  Star
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { usePermissions } from '../../hooks/usePermissions';

interface Team {
  id: string;
  name: string;
  category: string;
  logo?: string;
  description: string;
  location: string;
  founded: number;
  playersCount: number;
  isActive: boolean;
  achievements: string[];
}

const categories = [
  'Prebenjamín',
  'Benjamín', 
  'Alevín',
  'Infantil',
  'Aficionado'
];

export const TeamList: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [filteredTeams, setFilteredTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [showTeamDialog, setShowTeamDialog] = useState(false);

  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { isSuperAdmin, canManageTeam } = usePermissions();

  // Simular carga de datos
  useEffect(() => {
    const mockTeams: Team[] = [
      {
        id: '1',
        name: 'CDSANABRIACF Prebenjamín',
        category: 'Prebenjamín',
        logo: '/logo-cdsanabriacf.jpeg',
        description: 'Equipo de fútbol base para niños de 6-7 años',
        location: 'Sanabria, Zamora',
        founded: 2020,
        playersCount: 15,
        isActive: true,
        achievements: ['Liga Local 2023', 'Torneo de Verano 2023']
      },
      {
        id: '2',
        name: 'CDSANABRIACF Benjamín',
        category: 'Benjamín',
        logo: '/logo-cdsanabriacf.jpeg',
        description: 'Equipo de fútbol para niños de 8-9 años',
        location: 'Sanabria, Zamora',
        founded: 2019,
        playersCount: 18,
        isActive: true,
        achievements: ['Campeón Provincial 2023', 'Liga Regional 2022']
      },
      {
        id: '3',
        name: 'CDSANABRIACF Alevín',
        category: 'Alevín',
        logo: '/logo-cdsanabriacf.jpeg',
        description: 'Equipo de fútbol para niños de 10-11 años',
        location: 'Sanabria, Zamora',
        founded: 2018,
        playersCount: 20,
        isActive: true,
        achievements: ['Subcampeón Regional 2023', 'Torneo Internacional 2022']
      },
      {
        id: '4',
        name: 'CDSANABRIACF Infantil',
        category: 'Infantil',
        logo: '/logo-cdsanabriacf.jpeg',
        description: 'Equipo de fútbol para niños de 12-13 años',
        location: 'Sanabria, Zamora',
        founded: 2017,
        playersCount: 22,
        isActive: true,
        achievements: ['Campeón Regional 2023', 'Liga Nacional 2022']
      },
      {
        id: '5',
        name: 'CDSANABRIACF Aficionado',
        category: 'Aficionado',
        logo: '/logo-cdsanabriacf.jpeg',
        description: 'Equipo de fútbol para adultos aficionados',
        location: 'Sanabria, Zamora',
        founded: 2015,
        playersCount: 25,
        isActive: true,
        achievements: ['Liga Comarcal 2023', 'Copa del Pueblo 2022']
      }
    ];

    setTimeout(() => {
      setTeams(mockTeams);
      setFilteredTeams(mockTeams);
      setLoading(false);
    }, 1000);
  }, []);

  // Filtrar equipos
  useEffect(() => {
    let filtered = teams;

    if (searchTerm) {
      filtered = filtered.filter(team =>
        team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        team.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(team => team.category === selectedCategory);
    }

    setFilteredTeams(filtered);
  }, [teams, searchTerm, selectedCategory]);

  const handleTeamClick = (team: Team) => {
    setSelectedTeam(team);
    setShowTeamDialog(true);
  };

  const handleEditTeam = (teamId: string) => {
    navigate(`/teams/${teamId}/edit`);
  };

  const handleDeleteTeam = (teamId: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este equipo?')) {
      setTeams(prev => prev.filter(team => team.id !== teamId));
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Prebenjamín': '#FF6B6B',
      'Benjamín': '#4ECDC4',
      'Alevín': '#45B7D1',
      'Infantil': '#96CEB4',
      'Aficionado': '#FFEAA7'
    };
    return colors[category] || '#95A5A6';
  };

  if (loading) {
    return (
      <Box>
        <Grid container spacing={3}>
          {[1, 2, 3, 4, 5].map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item}>
              <Card>
                <Skeleton variant="rectangular" height={200} />
                <CardContent>
                  <Skeleton variant="text" height={32} />
                  <Skeleton variant="text" height={24} />
                  <Skeleton variant="text" height={20} />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1">
          Equipos CDSANABRIACF
        </Typography>
        
        {(isSuperAdmin() || canManageTeam()) && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/teams/new')}
            sx={{
              background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
              '&:hover': {
                background: 'linear-gradient(45deg, #5a6fd8 30%, #6a4190 90%)',
              }
            }}
          >
            Nuevo Equipo
          </Button>
        )}
      </Box>

      {/* Filtros */}
      <Box sx={{ mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Buscar equipos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Categoría</InputLabel>
              <Select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                label="Categoría"
              >
                <MenuItem value="">Todas las categorías</MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={2}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<FilterIcon />}
              onClick={() => setShowFilters(!showFilters)}
            >
              Filtros
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* Lista de equipos */}
      <Grid container spacing={3}>
        {filteredTeams.map((team) => (
          <Grid item xs={12} sm={6} md={4} key={team.id}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 8,
                  cursor: 'pointer'
                }
              }}
              onClick={() => handleTeamClick(team)}
            >
              <CardMedia
                component="img"
                height="200"
                image={team.logo || '/logo-cdsanabriacf.jpeg'}
                alt={team.name}
                sx={{ objectFit: 'cover' }}
              />
              
              <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                  <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
                    {team.name}
                  </Typography>
                  <Chip
                    label={team.category}
                    size="small"
                    sx={{
                      backgroundColor: getCategoryColor(team.category),
                      color: 'white',
                      fontWeight: 'bold'
                    }}
                  />
                </Box>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1 }}>
                  {team.description}
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <LocationOn sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    {team.location}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <People sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    {team.playersCount} jugadores
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <CalendarToday sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    Fundado en {team.founded}
                  </Typography>
                </Box>
                
                {/* Logros */}
                {team.achievements.length > 0 && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="caption" color="text.secondary" display="block">
                      Logros recientes:
                    </Typography>
                    {team.achievements.slice(0, 2).map((achievement, index) => (
                      <Chip
                        key={index}
                        label={achievement}
                        size="small"
                        icon={<Star sx={{ fontSize: 12 }} />}
                        sx={{ mr: 0.5, mb: 0.5, fontSize: '0.7rem' }}
                      />
                    ))}
                  </Box>
                )}
                
                {/* Acciones */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Button
                    size="small"
                    startIcon={<Visibility />}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/teams/${team.id}`);
                    }}
                  >
                    Ver
                  </Button>
                  
                  {(isSuperAdmin() || canManageTeam()) && (
                    <Box>
                      <Tooltip title="Editar">
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditTeam(team.id);
                          }}
                        >
                          <Edit />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Eliminar">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteTeam(team.id);
                          }}
                        >
                          <Delete />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Diálogo de detalles del equipo */}
      <Dialog
        open={showTeamDialog}
        onClose={() => setShowTeamDialog(false)}
        maxWidth="md"
        fullWidth
      >
        {selectedTeam && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar src={selectedTeam.logo} sx={{ width: 40, height: 40 }} />
                {selectedTeam.name}
              </Box>
            </DialogTitle>
            <DialogContent>
              <Typography variant="body1" paragraph>
                {selectedTeam.description}
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Categoría
                  </Typography>
                  <Typography variant="body1">
                    {selectedTeam.category}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Jugadores
                  </Typography>
                  <Typography variant="body1">
                    {selectedTeam.playersCount}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Ubicación
                  </Typography>
                  <Typography variant="body1">
                    {selectedTeam.location}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Fundado
                  </Typography>
                  <Typography variant="body1">
                    {selectedTeam.founded}
                  </Typography>
                </Grid>
              </Grid>
              
              {selectedTeam.achievements.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Logros
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {selectedTeam.achievements.map((achievement, index) => (
                      <Chip
                        key={index}
                        label={achievement}
                        icon={<Star />}
                        color="primary"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </Box>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setShowTeamDialog(false)}>
                Cerrar
              </Button>
              <Button
                variant="contained"
                onClick={() => {
                  setShowTeamDialog(false);
                  navigate(`/teams/${selectedTeam.id}`);
                }}
              >
                Ver Detalles Completos
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};