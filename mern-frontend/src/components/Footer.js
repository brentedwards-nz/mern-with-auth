import { AppBar, Typography, Grid } from '@mui/material';
import { showHightLight } from '../styles/styles.module';

const Footer = () => {
  return (
    <AppBar position="fixed" color="primary" sx={{ top: 'auto', bottom: 0 }}>
      <Grid container sx={{ padding: "20px" }}>
        <Grid item xs={12} sm={6} md={4}>
          <Typography>Brent Edwards</Typography>
          <Typography>3c/83 New North Road</Typography>
          <Typography>Eden Terrace</Typography>
        </Grid>
      </Grid>
    </AppBar>
  )
}
export default Footer