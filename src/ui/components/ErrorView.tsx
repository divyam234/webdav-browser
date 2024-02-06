import * as React from "react"
import { ErrorOutline } from "@mui/icons-material"
import { Box, Button, Typography } from "@mui/material"

const ErrorView = ({ error }: { error: Error }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "10px",
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      }}
    >
      <ErrorOutline sx={{ fontSize: 100, color: "red" }} />
      <Typography variant="h4" gutterBottom>
        {error.message}
      </Typography>
      <Button
        variant="contained"
        color="primary"
        title="Go to main directory"
        onClick={() => (window.location.href = "/")}
      >
        Go to main directory
      </Button>
    </Box>
  )
}

export default ErrorView
