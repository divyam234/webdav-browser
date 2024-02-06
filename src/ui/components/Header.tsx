import { useContext } from "react"
import ColorModeContext from "@/ui/contexts/colorModeContext"
import DarkIcon from "@mui/icons-material/DarkModeOutlined"
import LightIcon from "@mui/icons-material/LightModeOutlined"
import RestartIcon from "@mui/icons-material/RefreshOutlined"
import { Grid, Tooltip, Typography } from "@mui/material"
import AppBar from "@mui/material/AppBar"
import IconButton from "@mui/material/IconButton"
import { useTheme } from "@mui/material/styles"
import Toolbar from "@mui/material/Toolbar"
import { Link } from "@tanstack/react-router"

import ColorMenu from "@/ui/components/menus/ColorMenu"

export default function Header() {
  const { palette } = useTheme()

  const { toggleColorMode, resetTheme } = useContext(ColorModeContext)

  return (
    <AppBar
      sx={{
        flexGrow: 1,
        backgroundColor: "background.default",
        maxHeight: 64,
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
      color="default"
      position="fixed"
    >
      <Toolbar sx={{ margin: "auto 0 auto 0" }}>
        <Grid container spacing={1} alignItems="center">
          <Grid item>
            <Link to="/*" params={{ "*": "fs" }}>
              <Typography
                color="inherit"
                sx={{
                  fontWeight: 500,
                  letterSpacing: 0.5,
                  fontSize: 20,
                  textDecoration: "none",
                }}
              >
                Rclone Browser
              </Typography>
            </Link>
          </Grid>
          <Grid
            item
            xs
            sx={{
              display: "flex",
              alignItems: "baseline",
              justifyContent: "flex-end",
            }}
          ></Grid>
          <Grid item>
            <ColorMenu />
          </Grid>
          <Grid item>
            <Tooltip title="Switch Theme">
              <IconButton
                size="large"
                color="inherit"
                onClick={toggleColorMode}
              >
                {palette.mode == "light" ? <DarkIcon /> : <LightIcon />}
              </IconButton>
            </Tooltip>
          </Grid>
          <Grid item>
            <Tooltip title="Reset">
              <IconButton size="large" color="inherit" onClick={resetTheme}>
                <RestartIcon />
              </IconButton>
            </Tooltip>
          </Grid>
          <Grid item></Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  )
}
