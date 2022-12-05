import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SkipNextIcon from '@mui/icons-material/SkipNext';

const SpotifyArtistCard = (props) => {
  const theme = useTheme();

  return (
    <Card sx={{ display: 'flex' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', width: "60%" }}>
        <CardContent sx={{ flex: '1 0 auto' }}>
          <Typography noWrap={true} component="div" variant="h6" sx={{ textOverflow: "ellipsis" }}>
            {props.head}
          </Typography>
          <Typography noWrap variant="subtitle1" color="text.secondary" component="div">
            {props.desc}
          </Typography>
        </CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', pl: 1, pb: 1 }}>
          <IconButton aria-label="previous">
            {theme.direction === 'rtl' ? <SkipNextIcon /> : <SkipPreviousIcon />}
          </IconButton>
          <IconButton aria-label="play/pause">
            <PlayArrowIcon sx={{ height: 38, width: 38 }} />
          </IconButton>
          <IconButton aria-label="next">
            {theme.direction === 'rtl' ? <SkipPreviousIcon /> : <SkipNextIcon />}
          </IconButton>
        </Box>
      </Box>
      {props.image ? <CardMedia
        component="img"
        sx={{ width: 150, height: 150 }}
        image={props.image}
        alt="Live from space album cover"
      /> : null
      }
    </Card>
  );
}

export default SpotifyArtistCard;