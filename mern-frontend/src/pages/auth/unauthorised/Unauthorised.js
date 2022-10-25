import React from 'react'
import { Grid, Paper, Avatar, Typography, Link } from '@mui/material'
import * as styles from '../../../styles/styles.module';
import LogoutIcon from '@mui/icons-material/Logout';

function Unauthorised() {
  return (
    <Grid>
      <Paper elevation={10} style={styles.unauthorisedPage.paperStyle}>
        <Grid align="center">
          <Avatar style={styles.avatarStyle}><LogoutIcon /></Avatar>
          <h2>Unauthorised</h2>
          <Typography>
            <Link href="/login" underline="hover" style={styles.linkStyle}>
              Log in
            </Link>
          </Typography>
        </Grid>
      </Paper >
    </Grid >
  )
}

export default Unauthorised