import { useCallback } from "react"
import { Box, TextField } from "@mui/material"
import Button from "@mui/material/Button"
import Container from "@mui/material/Container"
import Paper from "@mui/material/Paper"
import Typography from "@mui/material/Typography"
import { getRouteApi } from "@tanstack/react-router"

const routeApi = getRouteApi("/settings")

export default function HostForm() {
  const { redirect } = routeApi.useSearch()

  const context = routeApi.useRouteContext()

  const [settings, setSettings] = context.settings

  const onSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      const target = e.target as typeof e.target & {
        url: { value: string }
        user: { value: string }
        password: { value: string }
      }
      setSettings({
        host: target.url.value,
        user: target.user.value,
        pass: target.password.value,
      })
      window.location.href = redirect || "/fs"
    },
    [redirect, setSettings]
  )

  return (
    <Container component="main" maxWidth="sm">
      <Paper
        sx={{
          borderRadius: 2,
          px: 4,
          py: 6,
          marginTop: 3,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "2rem",
        }}
      >
        <Typography component="h1" variant="h5">
          WebDav Url
        </Typography>
        <Box
          component="form"
          autoComplete="off"
          sx={{
            width: "90%",
            gap: "1rem",
            display: "flex",
            flexDirection: "column",
          }}
          onSubmit={onSubmit}
        >
          <TextField
            margin="normal"
            required
            defaultValue={settings.host}
            fullWidth
            type="text"
            placeholder="http://127.0.0.1:8080"
            name="url"
          />
          <TextField
            margin="normal"
            fullWidth
            type="text"
            defaultValue={settings.user}
            placeholder="User"
            name="user"
          />
          <TextField
            margin="normal"
            fullWidth
            defaultValue={settings.pass}
            placeholder="Password"
            name="password"
          />
          <Button type="submit" fullWidth variant="tonal" sx={{ mt: 3, mb: 2 }}>
            Set
          </Button>
        </Box>
      </Paper>
    </Container>
  )
}
