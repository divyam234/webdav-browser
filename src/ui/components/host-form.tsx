import { useCallback } from "react"
import { Box, TextField } from "@mui/material"
import Button from "@mui/material/Button"
import Container from "@mui/material/Container"
import Paper from "@mui/material/Paper"
import Typography from "@mui/material/Typography"
import { useSearch } from "@tanstack/react-router"

export default function HostForm() {
  const { redirect } = useSearch({ from: "/" })

  const onSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      const target = e.target as typeof e.target & {
        url: { value: string }
      }
      localStorage.setItem("WEBDAV_HOST", target.url.value)
      window.location.href = redirect || "/fs"
    },
    [redirect]
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
            defaultValue={"http://127.0.0.1:8080"}
            fullWidth
            type="text"
            placeholder="http://127.0.0.1:8080"
            name="url"
          />
          <Button type="submit" fullWidth variant="tonal" sx={{ mt: 3, mb: 2 }}>
            Set
          </Button>
        </Box>
      </Paper>
    </Container>
  )
}
