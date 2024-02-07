import { Settings } from "@/types"
import { QueryClientProvider } from "@tanstack/react-query"
import { createRouter, RouterProvider } from "@tanstack/react-router"
import ReactDOM from "react-dom/client"
import { useLocalStorage } from "usehooks-ts"
import { AuthType, createClient } from "webdav"

import { queryClient } from "@/ui/utils/queryClient"

import DriveThemeProvider from "./components/DriveThemeProvider"
import { routeTree } from "./routes"

const router = createRouter({
  routeTree,
  context: {
    queryClient,
    settings: undefined!,
    webdav: undefined!,
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
        webdav: createClient(
          settings[0].host,
          settings[0].pass
            ? {
                authType: AuthType.Password,
                username: settings[0].user,
                password: settings[0].pass,
              }
            : {}
        ),
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
