import { Outlet } from "react-router-dom"
import { Grid } from "@mui/material"
import Footer from "./Footer"
import Header from "./Header"

const Layout = () => {
  return (
    <main className="App">
      <Grid container
        direction="column"
        alignItems="center"
        justifyContent="center"
        marginTop="65px"
        marginBottom="120px"
        paddingRight="20px"
        paddingLeft="20px"
        marginLeft="auto"
        marginRight="auto"
        maxWidth="1200px"
      >
        <Header />
        <Outlet />
        <Footer />
      </Grid>
    </main>
  )
}

export default Layout