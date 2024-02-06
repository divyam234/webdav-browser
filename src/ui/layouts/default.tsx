import { Box, Container } from "@mui/material"

import Header from "@/ui/components/Header"

export const DefaultLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <Box sx={{ display: "grid", minHeight: "100vh" }}>
      <Header />
      <Container
        maxWidth="xl"
        sx={{
          pt: 1,
          pb: 1,
          marginTop: "4rem",
        }}
      >
        {children}
      </Container>
    </Box>
  )
}
