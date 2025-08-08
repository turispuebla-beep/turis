import { useState, useEffect } from 'react';
import {
    Box,
    TextField,
    InputAdornment,
    IconButton,
    Paper,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Typography,
    Divider,
    Popper,
    Fade,
    CircularProgress
} from '@mui/material';
import {
    Search as SearchIcon,
    Clear as ClearIcon,
    SportsSoccer,
    Person,
    Event,
    Article
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { Team, Player, Match, Event as TeamEvent } from '../../types/team';
import { News } from '../../types/news';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface SearchResult {
    type: 'team' | 'player' | 'match' | 'event' | 'news';
    id: string;
    title: string;
    subtitle?: string;
    link: string;
}

export function GlobalSearch() {
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<SearchResult[]>([]);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (searchTerm.length < 2) {
            setResults([]);
            return;
        }

        const timer = setTimeout(() => {
            performSearch();
        }, 300);

        return () => clearTimeout(timer);
    }, [searchTerm]);

    const performSearch = async () => {
        setLoading(true);
        try {
            // TODO: Implementar búsqueda en el backend
            // Por ahora, usamos datos de ejemplo
            const mockResults: SearchResult[] = [
                {
                    type: 'team',
                    id: '1',
                    title: 'Equipo A',
                    subtitle: '20 jugadores',
                    link: '/teams/1'
                },
                {
                    type: 'player',
                    id: '2',
                    title: 'Juan Pérez',
                    subtitle: 'Delantero - Equipo A',
                    link: '/teams/1/players/2'
                },
                {
                    type: 'match',
                    id: '3',
                    title: 'Equipo A vs Equipo B',
                    subtitle: format(new Date(), "dd 'de' MMMM 'de' yyyy", { locale: es }),
                    link: '/teams/1/matches/3'
                },
                {
                    type: 'news',
                    id: '4',
                    title: 'Nueva victoria del equipo',
                    subtitle: 'Últimas noticias',
                    link: '/news/4'
                }
            ];

            setResults(mockResults);
        } catch (error) {
            console.error('Error al realizar la búsqueda:', error);
            setResults([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSearchFocus = (event: React.FocusEvent<HTMLInputElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleSearchBlur = () => {
        // Pequeño delay para permitir que se detecte el clic en los resultados
        setTimeout(() => {
            setAnchorEl(null);
        }, 200);
    };

    const handleResultClick = (link: string) => {
        navigate(link);
        setSearchTerm('');
        setAnchorEl(null);
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'team':
                return <SportsSoccer />;
            case 'player':
                return <Person />;
            case 'match':
            case 'event':
                return <Event />;
            case 'news':
                return <Article />;
            default:
                return <SearchIcon />;
        }
    };

    const open = Boolean(anchorEl);

    return (
        <Box sx={{ position: 'relative', width: '100%', maxWidth: 600 }}>
            <TextField
                fullWidth
                placeholder="Buscar equipos, jugadores, partidos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={handleSearchFocus}
                onBlur={handleSearchBlur}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon />
                        </InputAdornment>
                    ),
                    endAdornment: searchTerm && (
                        <InputAdornment position="end">
                            {loading ? (
                                <CircularProgress size={20} />
                            ) : (
                                <IconButton
                                    size="small"
                                    onClick={() => setSearchTerm('')}
                                >
                                    <ClearIcon />
                                </IconButton>
                            )}
                        </InputAdornment>
                    )
                }}
                sx={{
                    '& .MuiOutlinedInput-root': {
                        backgroundColor: 'background.paper',
                        '&.Mui-focused': {
                            backgroundColor: 'background.paper'
                        }
                    }
                }}
            />

            <Popper
                open={open && results.length > 0}
                anchorEl={anchorEl}
                placement="bottom-start"
                transition
                style={{ width: anchorEl?.clientWidth }}
            >
                {({ TransitionProps }) => (
                    <Fade {...TransitionProps} timeout={350}>
                        <Paper
                            elevation={3}
                            sx={{
                                mt: 1,
                                maxHeight: 400,
                                overflow: 'auto'
                            }}
                        >
                            <List>
                                {results.map((result, index) => (
                                    <Box key={result.id}>
                                        {index > 0 && <Divider />}
                                        <ListItem
                                            button
                                            onClick={() => handleResultClick(result.link)}
                                        >
                                            <ListItemIcon>
                                                {getIcon(result.type)}
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={result.title}
                                                secondary={result.subtitle}
                                            />
                                        </ListItem>
                                    </Box>
                                ))}
                            </List>
                        </Paper>
                    </Fade>
                )}
            </Popper>
        </Box>
    );
}