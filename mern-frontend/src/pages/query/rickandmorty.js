import { Grid, Avatar, Typography, Button } from '@mui/material'
import * as styles from '../../styles/styles.module';
import QueryBuilderIcon from '@mui/icons-material/QueryBuilder';
import { useQuery } from 'react-query';
import Character from '../../components/Character';
import { useState } from 'react';

const RickAndMorty = () => {
  const [page, setPage] = useState(1);

  const fetchRickAndMorty = async ({ queryKey }) => {
    console.log(queryKey)
    const response = await fetch(`https://rickandmortyapi.com/api/character?page=${queryKey[1]}`);
    return response.json();
  };

  const prevPage = () => {
    setPage(page - 1);
  }

  const nextPage = () => {
    setPage(page + 1);
  }

  const { data, status } = useQuery(["rm", page], fetchRickAndMorty);

  return (
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
        <Avatar style={styles.avatarStyle}><QueryBuilderIcon /></Avatar>
      </Grid>
      <Grid item xs={12}>
        <Typography component="div" variant="h6">React Query</Typography>
      </Grid>
      <Grid item xs={6}>
        <Button onClick={prevPage}>Prev</Button>
      </Grid>
      <Grid item xs={6}>
        <Button onClick={nextPage}>Next</Button>
      </Grid>
      {status === "error" && <div>Error</div>}
      {status === "loading" && <div>Loading</div>}
      <Grid container>
        {status !== "loading" && status !== "error" &&
          data?.results.map((character, index) => { return <Character key={index} character={character} /> })
        }
      </Grid >
    </Grid >
  )
}
export default RickAndMorty