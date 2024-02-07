import { useCallback } from "react"
import { FileResponse } from "@/types"
import {
  keepPreviousData,
  queryOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query"
import { NavigateOptions, useRouter } from "@tanstack/react-router"
import { FileStat, WebDAVClient } from "webdav"

import { useProgress } from "@/ui/components/TopProgress"

import { getExtension } from "./common"
import { getPreviewType } from "./previewType"

export const filesQueryOptions = (webdav: WebDAVClient, path: string) => {
  return queryOptions({
    queryKey: ["files", path],
    queryFn: async () =>
      (await webdav.getDirectoryContents(path)) as FileStat[],
    placeholderData: keepPreviousData,
    select: (data) =>
      data.map((item) => ({
        id: item.basename,
        name: item.basename,
        mimeType: item.mime,
        size: item.size,
        modDate: item.lastmod,
        path: item.filename,
        isDir: item.type !== "file",
        previewType: getPreviewType(getExtension(item.filename), {
          video: item.mime?.includes("video"),
        }),
      })),
  })
}

export const usePreloadFiles = () => {
  const queryClient = useQueryClient()

  const router = useRouter()

  const { startProgress, stopProgress } = useProgress()

  const preloadFiles = useCallback(
    async (path: string) => {
      const queryState = queryClient.getQueryState(["files", path])

      const nextRoute: NavigateOptions = {
        to: "/$",
        params: {
          _splat: `fs${path ? "/" : ""}${path}`,
        },
      }
      if (!queryState?.data) {
        try {
          startProgress()
          await router.preloadRoute(nextRoute)
          router.navigate(nextRoute)
        } finally {
          stopProgress()
        }
      } else router.navigate(nextRoute)
    },
    [queryClient]
  )

  return preloadFiles
}

export const useUpdateFile = (webdav: WebDAVClient, path: string) => {
  const queryKey = ["files", path]
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: { oldName: string; newName: string }) =>
      webdav.moveFile(
        path + "/" + payload.oldName,
        path + "/" + payload.newName
      ),
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey })
      const previousFiles = queryClient.getQueryData<FileResponse>(queryKey)
      if (previousFiles) {
        queryClient.setQueryData<FileResponse>(queryKey, (prev) => {
          return <FileResponse>{
            list: prev?.list.map((val) =>
              val.Name === variables.oldName
                ? { ...val, Name: variables.newName }
                : val
            ),
          }
        })
      }
      return { previousFiles }
    },
    onError: (err, variables, context) => {
      if (context?.previousFiles) {
        queryClient.setQueryData(queryKey, context?.previousFiles)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey })
    },
  })
}

export const useDeleteFile = (webdav: WebDAVClient, path: string) => {
  const queryKey = ["files", path]
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (path: string) => webdav.deleteFile(path),
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey })
      const previousFiles = queryClient.getQueryData(queryKey)
      queryClient.setQueryData<FileStat[]>(queryKey, (prev) =>
        prev?.filter((val) => val.filename !== variables)
      )
      return { previousFiles }
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(queryKey, context?.previousFiles)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey })
    },
  })
}
