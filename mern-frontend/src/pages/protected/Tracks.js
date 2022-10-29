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

import { getTracks } from '../../services/api';
import * as styles from '../../styles/styles.module';
import spotify from '../../assets/spotify.png';

const Tracks = () => {
  const [displayedTracks, setDisplayedTracks] = useState([]);
  const [tracks, setTracks] = useState([]);
  const [downloadError, setDownloadError] = useState(false);

  const theme = useTheme();

  useEffect(() => {
    const downloadTracks = async () => {
      try {
        const response = await getTracks();
        if (response.error) {
          setDownloadError({ isHidden: false, errorMessage: response.exception?.response?.data })
        } else {
          setDownloadError({ isHidden: true, errorMessage: "" });
          setTracks(response?.data?.data);
        }
      } catch (err) {
        setDownloadError({ isHidden: false, errorMessage: err.data })
      }
    }
    downloadTracks();
  }, [])

  useEffect(() => {
    let t = [];
    tracks.forEach((track) => {
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
    setDisplayedTracks(t);
  }, [tracks, theme.direction])

  return (
    <Container>
      {displayedTracks}
      <Typography hidden={downloadError.isHidden} style={styles.authError}>
        Error: {downloadError.errorMessage}
      </Typography>
    </Container>
  )
}
export default Tracks