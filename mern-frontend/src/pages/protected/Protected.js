import React from 'react'
import { Grid, Paper, Avatar, Typography, Link, Button } from '@mui/material'
import useLocalStorage from '../../hooks/useLocalStorage';
import * as styles from '../../styles/styles.module';
import LogoutIcon from '@mui/icons-material/Logout';
import useRefreshToken from '../..//hooks/useRefreshtoken';

function Protected() {
  const [userDetails] = useLocalStorage('userDetails', {})

  const refresh = useRefreshToken();

  return (
    <Grid>
      <Paper elevation={10} style={styles.protectedPage.paperStyle}>
        <Grid align="center">
          <Avatar style={styles.avatarStyle}><LogoutIcon /></Avatar>
          <h2>Protected</h2>
          <h3>Welcome {userDetails?.firstName}</h3>
          <Typography>
            <Link href="/logout" underline="hover" style={styles.linkStyle}>
              Log out
            </Link>
          </Typography>
          <Button
            type='submit'
            sx={{ color: '#117e6a' }}
            fullWidth
            onClick={() => refresh()}
          >
            Refresh
          </Button>
        </Grid>
      </Paper >
    </Grid >
  )
}

export default Protected