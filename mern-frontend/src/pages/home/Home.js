import React from 'react'
import { Grid, Paper, Avatar, Typography, Link } from '@mui/material'
import useLocalStorage from '../../hooks/useLocalStorage';
import * as styles from '../../styles/styles.module';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';

function Home() {
  const [userDetails] = useLocalStorage('userDetails', {})
  return (
    <Grid>
      <Paper elevation={10} style={styles.protectedPage.paperStyle}>
        <Grid align="center">
          <Avatar style={styles.avatarStyle}><HomeOutlinedIcon /></Avatar>
          <h2>Home</h2>
          <h3>Welcome {userDetails?.firstName}</h3>
          <Typography>
            <Link href="/logout" underline="hover" style={styles.linkStyle}>
              Log out
            </Link>
          </Typography>
        </Grid>
      </Paper >
    </Grid >
  )
}

export default Home