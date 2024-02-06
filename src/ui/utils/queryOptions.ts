import { useCallback } from "react"
import { FileQueryParams, FileResponse } from "@/types"
import {
  keepPreviousData,
  queryOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query"
import { NavigateOptions, useRouter } from "@tanstack/react-router"

import { useProgress } from "@/ui/components/TopProgress"

import { getExtension } from "./common"
import http from "./http"
import { getPreviewType } from "./previewType"

export const filesQueryOptions = (params: FileQueryParams) => {
  return queryOptions({
    queryKey: ["files", params],
    queryFn: async ({ signal }) => await fetchFiles(params, signal),
    placeholderData: keepPreviousData,
    select: (data) =>
      data.list.map((item) => ({
        id: item.ID,
        name: item.Name,
        mimeType: item.ModTime,
        size: item.Size,
        modDate: item.ModTime,
        path: item.Path,
        isDir: item.IsDir,
        previewType: getPreviewType(getExtension(item.Name), {
          video: item.MimeType.includes("video"),
        }),
      })),
  })
}

export const usePreloadFiles = () => {
  const queryClient = useQueryClient()

  const router = useRouter()

  const { startProgress, stopProgress } = useProgress()

  const preloadFiles = useCallback(
    async (params: FileQueryParams) => {
      const queryState = queryClient.getQueryState(["files", params])

      const nextRoute: NavigateOptions = {
        to: "/*",
        params: {
          "*": `fs/${params.remote}${params.path ? "/" + params.path : ""}`,
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

export const fetchFiles = async (
  params: FileQueryParams,
  signal: AbortSignal
) => {
  if (params.remote === "") {
    const res = await http
      .post("config/listremotes", { signal })
      .json<{ remotes: string[] }>()
    return {
      list: res.remotes.map((remote) => ({
        ID: remote,
        Name: remote,
        Size: -1,
        MimeType: "node/directory",
        ModTime: new Date().toISOString(),
        IsDir: true,
        Path: remote,
      })),
    }
  }

  return await http
    .post("operations/list", {
      json: { fs: params.remote + ":", remote: params.path },
      signal,
    })
    .json<FileResponse>()
}

export const useUpdateFile = (params: FileQueryParams) => {
  const queryKey = ["files", params]
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: { oldName: string; newName: string }) =>
      http.post("operations/movefile", {
        json: {
          srcFs: params.remote + ":",
          dstFs: params.remote + ":",
          srcRemote: `${params.path ? params.path + "/" : ""}${payload.oldName}`,
          dstRemote: `${params.path ? params.path + "/" : ""}${payload.newName}`,
        },
      }),
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

export const useDeleteFile = (params: FileQueryParams) => {
  const queryKey = ["files", params]
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (name: string) =>
      http.post("operations/purge", {
        json: {
          fs: params.remote + ":",
          remote: `${params.path ? params.path + "/" : ""}${name}`,
        },
      }),
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey })
      const previousFiles = queryClient.getQueryData(queryKey)
      queryClient.setQueryData<Partial<FileResponse>>(queryKey, (prev) => ({
        list: prev?.list?.filter((val) => val.Name !== variables),
      }))
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
