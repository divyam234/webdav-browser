import { DefaultLayout } from "@/ui/layouts/default"
import { QueryClient } from "@tanstack/react-query"
import {
  createRootRouteWithContext,
  createRoute,
  lazyRouteComponent,
  Outlet,
  redirect,
  ScrollRestoration,
} from "@tanstack/react-router"

import ErrorView from "@/ui/components/ErrorView"
import HostForm from "@/ui/components/host-form"
import { extractPathParts } from "@/ui/utils/common"
import { filesQueryOptions } from "@/ui/utils/queryOptions"

const RootComponent = () => {
  return (
    <DefaultLayout>
      <ScrollRestoration />
      <Outlet />
    </DefaultLayout>
  )
}

export const root = createRootRouteWithContext<{
  queryClient: QueryClient
}>()({
  component: RootComponent,
  wrapInSuspense: true,
})

const indexRoute = createRoute({
  getParentRoute: () => root,
  path: "/",
  validateSearch: (search) => search as { redirect?: string },
  beforeLoad: async () => {
    const host = localStorage.getItem("WEBDAV_HOST")
    if (host)
      throw redirect({
        to: "/$",
        params: { _splat: "fs" },
        replace: true,
      })
  },
  component: HostForm,
})

export const filesSplatRoute = createRoute({
  getParentRoute: () => root,
  path: "/$",
  beforeLoad: async ({ location }) => {
    const host = localStorage.getItem("WEBDAV_HOST")
    if (!host)
      throw redirect({
        to: "/",
        replace: true,
        search: {
          redirect: location.href,
        },
      })
  },
  component: lazyRouteComponent(() => import("@/ui/components/FileBrowser")),
  errorComponent: ({ error }) => {
    return <ErrorView error={error as Error} />
  },
  loader: async ({ context: { queryClient }, preload, params }) => {
    if (preload) {
      const path = extractPathParts((params as Record<string, string>)["*"])
      await queryClient.fetchQuery(filesQueryOptions(path))
    }
  },
})

export const routeTree = root.addChildren([indexRoute, filesSplatRoute])
