import * as React from "react"
import { QueryClientProvider } from "@tanstack/react-query"
import { createRouter, RouterProvider } from "@tanstack/react-router"
import ReactDOM from "react-dom/client"

import { queryClient } from "@/ui/utils/queryClient"

import DriveThemeProvider from "./components/DriveThemeProvider"
import { routeTree } from "./routes"

const router = createRouter({
  routeTree,
  context: {
    queryClient,
  },
  defaultPreloadDelay: 300,
  defaultPreload: "intent",
  defaultPreloadStaleTime: 0,
})

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router
  }
}

const rootElement = document.getElementById("root")!

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <QueryClientProvider client={queryClient}>
      <DriveThemeProvider>
        <RouterProvider router={router} />
      </DriveThemeProvider>
    </QueryClientProvider>
  )
}
