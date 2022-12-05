import React from 'react'

import { useEffect, useState } from 'react';
import { Grid, Avatar, InputAdornment, TextField, Typography, MenuItem, getCardActionsUtilityClass } from '@mui/material'
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";

import FormControl from "@mui/material/FormControl";

import * as styles from '../../styles/styles.module';
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';

import useAxios from '../../hooks/useAxios';

import SpotifyTrackCard from '../../components/SpotifyTrackCard';
import SpotifyArtistCard from '../../components/SpotifyArtistCard';
import SpotifyAlbumCard from '../../components/SpotifyAlbumCard';

const Local = () => {
  const [searchField, setSearchField] = useState('track')
  const [searchQuery, setSearchQuery] = useState(null)
  const [items, setItems] = useState([])

  let request = {
    url: '/spotify/search',
    method: 'POST',
    body: null,
    config: null
  }
  const { isLoading, error, data, repost } = useAxios(request);

  useEffect(() => {
    const body = {
      searchQuery: searchQuery,
      searchField: searchField
    };
    repost(body);
  }, [searchQuery, searchField])

  useEffect(() => {
    if (!data) {
      setItems([]);
    }
    else if (searchField === 'track') {
      setItems(data.tracks.items);
    }
    else if (searchField === 'artist') {
      setItems(data.artists.items);
    }
    else if (searchField === 'album') {
      setItems(data.albums.items);
    }
    else {
      setItems([]);
    }
  }, [data])

  const handleSearchQueryChange = (event, child) => {
    setSearchQuery(event.target.value);
  };
  const handleSearchFieldChange = (event, child) => {
    setSearchField(event.target.value);
  };

  const getCards = (type, items) => {

    if (!items || (items && items.length <= 0)) {
      return <Typography>No data</Typography>
    }

    if (type === "track") {
      return <Grid container spacing={1} rowSpacing={1}>
        {items.map((item, index) => (
          <Grid key={index} item xs={12} sm={6} md={4}>
            <SpotifyTrackCard
              head={item?.name}
              desc={item?.album?.artists && item?.album?.artists[0].name}
              image={item?.album?.images && item?.album?.images[0].url} />
          </Grid>
        ))}
      </Grid>;
    }

    if (type === "album") {
      return <Grid container spacing={1} rowSpacing={1}>
        {items.map((item, index) => (
          <Grid key={index} item xs={12} sm={6} md={4}>
            <SpotifyAlbumCard
              head={item?.name}
              image={item?.images && item?.images[0]?.url}
              desc={item?.artists && item?.artists[0].name} />
          </Grid>
        ))}
      </Grid>;
    }

    if (type === "artist") {
      return <Grid container spacing={1} rowSpacing={1}>
        {items.map((item, index) => (
          <Grid key={index} item xs={12} sm={6} md={4}>
            <SpotifyArtistCard
              head={item?.name}
              image={item?.images && item?.images[0]?.url}
              desc={item?.genres && item?.genres.map(genre => genre.charAt(0).toUpperCase() + genre.slice(1).toLowerCase()).join(', ')
              } />
          </Grid>
        ))}
      </Grid>;
    }
  }

  return (
    <>
      <Grid container
        direction="column"
        alignItems="center"
        justifyContent="center"
        paddingTop="20px"
        paddingRight="20px"
        paddingLeft="20px"
        marginLeft="auto"
        marginRight="auto"
        maxWidth="1200px"
      >
        <Grid item xs={12}
          style={{
            textAlign: 'center'
          }}
        >
          <Avatar style={styles.avatarStyle}><LibraryMusicIcon /></Avatar>
        </Grid>
        <Grid item xs={12}>
          <h2>Spotify Search</h2>
        </Grid>
        <Grid container spacing={1}>
          <Grid item xs={12} sm={9}
            style={{
              width: "100%",
              textAlign: 'center'
            }}>
            <TextField
              fullWidth
              id="search-text"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LibraryMusicIcon />
                  </InputAdornment>
                ),
              }}

              label="Search"
              onChange={handleSearchQueryChange}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControl sx={{ width: "100%" }}>
              <InputLabel id="field-label">Field</InputLabel>
              <Select
                labelId="field-label"
                id="field-select"

                fullWidth
                value={searchField}
                label="Field"
                onChange={handleSearchFieldChange}
              >
                <MenuItem value={'track'}>Track</MenuItem>
                <MenuItem value={'artist'}>Artist</MenuItem>
                <MenuItem value={'album'}>Album</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          {isLoading && <Typography>Loading</Typography>}
          {!isLoading && error && <Typography>{error}</Typography>}
          {!isLoading && !error && getCards(searchField, items)}
        </Grid>
      </Grid>
    </>
  )
}
export default Local