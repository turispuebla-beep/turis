import { Card, CardContent, CardMedia, Typography, Chip, Stack, CardActionArea } from '@mui/material';
import { News } from '../../types/news';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface NewsCardProps {
    news: News;
    onClick: (news: News) => void;
}

export const NewsCard = ({ news, onClick }: NewsCardProps) => {
    return (
        <Card sx={{ maxWidth: '100%', mb: 2 }}>
            <CardActionArea onClick={() => onClick(news)}>
                {news.imageUrl && (
                    <CardMedia
                        component="img"
                        height="200"
                        image={news.imageUrl}
                        alt={news.title}
                        sx={{ objectFit: 'cover' }}
                    />
                )}
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        {news.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {format(new Date(news.publishDate), "dd 'de' MMMM 'de' yyyy, HH:mm", { locale: es })}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {news.content.length > 150 
                            ? `${news.content.substring(0, 150)}...` 
                            : news.content}
                    </Typography>
                    <Stack direction="row" spacing={1}>
                        <Chip 
                            label={news.category} 
                            color="primary" 
                            size="small" 
                        />
                        {news.isImportant && (
                            <Chip 
                                label="Importante" 
                                color="error" 
                                size="small" 
                            />
                        )}
                    </Stack>
                </CardContent>
            </CardActionArea>
        </Card>
    );
};