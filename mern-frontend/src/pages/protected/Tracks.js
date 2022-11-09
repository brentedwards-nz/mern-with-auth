import { useEffect, useState } from "react"

import { useTheme } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SkipNextIcon from '@mui/icons-material/SkipNext';

import * as styles from '../../styles/styles.module';
import spotify from '../../assets/spotify.png';
import useAxios from "../../hooks/useAxios";

const Tracks = () => {
  const [displayedTracks, setDisplayedTracks] = useState([]);

  const theme = useTheme();

  const request = {
    url: '/data/tracks',
    method: 'GET',
    // requestConfig: {  // Need useCallback to use this object
    //   headers: {},
    //   data: {}
    // }
  }
  const [isLoading, downloadError, tracks] = useAxios(request);

  useEffect(() => {
    let t = [];
    if (isLoading) {
      t.push(
        <Typography key={1} style={styles.authMessage}>
          Loading...
        </Typography>
      )
    }
    else if(!isLoading && (tracks === null)) {
      t.push(
        <Typography key={1} style={styles.authMessage}>
          Empty...
        </Typography>
      )
    }
    else {
      tracks?.randomTracks.forEach((track) => {
        t.push(
          <Card key={track.id} sx={{ display: 'flex' }}>
            <CardMedia
              component="img"
              sx={{ width: 160 }}
              image={spotify}
              alt={track.album}
            />
            <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              width: '50%'
            }}>
              <CardContent
                sx={{ flex: '1 0 auto' }}>
                <Typography component="div" variant="h5">
                  {track.title}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary" component="div">
                  {track.artist}
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

          </Card>
        );
      });
    }
    setDisplayedTracks(t);
  }, [downloadError, isLoading, tracks, theme.direction])

  return (
    <Container>
      {displayedTracks}
      <Typography hidden={isLoading && downloadError} style={styles.authError}>
        Error: {downloadError}
      </Typography>
    </Container>
  )
}
export default Tracks