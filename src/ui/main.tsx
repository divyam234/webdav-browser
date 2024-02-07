import { Settings } from "@/types"
import { QueryClientProvider } from "@tanstack/react-query"
import { createRouter, RouterProvider } from "@tanstack/react-router"
import ReactDOM from "react-dom/client"
import { useLocalStorage } from "usehooks-ts"

import { queryClient } from "@/ui/utils/queryClient"

import DriveThemeProvider from "./components/DriveThemeProvider"
import { routeTree } from "./routes"

const router = createRouter({
  routeTree,
  context: {
    queryClient,
    settings: undefined!,
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

function AppRouter() {
  const settings = useLocalStorage<Settings>("settings", {
    host: "",
  })
  return (
    <RouterProvider
      router={router}
      context={{
        settings,
      }}
    />
  )
}

const rootElement = document.getElementById("root")!

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)

  root.render(
    <QueryClientProvider client={queryClient}>
      <DriveThemeProvider>
        <AppRouter />
      </DriveThemeProvider>
    </QueryClientProvider>
  )
}
