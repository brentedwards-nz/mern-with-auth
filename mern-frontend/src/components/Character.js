import { Grid, Typography, Box } from "@mui/material"

const Character = (props) => {
  return (
    <Grid item xs={6} sm={3}>
      <Typography>{props.character.name}</Typography>
      <Box
        component="img"
        sx={{
          height: 100,
          width: 100
        }}
        alt="The house from the offer."
        src={props.character.image}
      />
    </Grid>
  )
}
export default Character