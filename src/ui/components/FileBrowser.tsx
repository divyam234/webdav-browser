import { useEffect, useMemo, useRef, useState } from "react"
import { ModalState } from "@/types"
import {
  ChonkyActions,
  FileBrowser,
  FileContextMenu,
  FileList,
  FileNavbar,
  FileToolbar,
} from "@bhunter179/chonky"
import { Box } from "@mui/material"
import { useQuery } from "@tanstack/react-query"
import { getRouteApi } from "@tanstack/react-router"
import {
  type StateSnapshot,
  type VirtuosoGridHandle,
  type VirtuosoHandle,
} from "react-virtuoso"

import { CustomActions, useFileAction } from "@/ui/hooks/useFileAction"
import { chainLinks, extractPathParts } from "@/ui/utils/common"
import { filesQueryOptions } from "@/ui/utils/queryOptions"

import DeleteDialog from "./dialogs/DeleteDialog"
import FileModal from "./dialogs/FileModal"
import PreviewModal from "./PreviewModal"

let firstRender = true

const route = getRouteApi("/$")

function isVirtuosoList(value: any): value is VirtuosoHandle {
  return (value as VirtuosoHandle).getState !== undefined
}

const MyFileBrowser = () => {
  const positions = useRef<Map<string, StateSnapshot>>(new Map()).current

  const params = route.useParams()

  const path = extractPathParts(params._splat)

  const { data: files } = useQuery(filesQueryOptions(path))

  const listRef = useRef<VirtuosoHandle | VirtuosoGridHandle>(null)

  const folderChain = useMemo(() => {
    return Object.entries(chainLinks(path)).map(([key, value]) => ({
      id: key,
      name: key,
      path: value,
      isDir: true,
      chain: true,
    }))
  }, [path])

  const [modalState, setModalState] = useState<ModalState>({
    open: false,
  })

  const { chonkyActionHandler } = useFileAction(setModalState, path)

  useEffect(() => {
    if (firstRender) {
      firstRender = false
      return
    }

    setTimeout(() => {
      listRef.current?.scrollTo({
        top: positions.get(path)?.scrollTop ?? 0,
        left: 0,
      })
    }, 0)

    return () => {
      if (listRef.current && isVirtuosoList(listRef.current))
        listRef.current?.getState((state) => positions.set(path, state))
    }
  }, [path])

  const actions = useMemo(
    () =>
      Object.keys(CustomActions).map(
        (x) => CustomActions[x as keyof typeof CustomActions]
      ),
    []
  )

  return (
    <Box sx={{ height: "100%", width: "100%", margin: "auto" }}>
      <FileBrowser
        files={files as any}
        folderChain={folderChain}
        onFileAction={chonkyActionHandler}
        fileActions={actions}
        disableDragAndDropProvider={true}
        useStoreProvider={true}
        useThemeProvider={false}
      >
        <FileNavbar />
        <FileToolbar />
        <FileList ref={listRef} />
        <FileContextMenu />
      </FileBrowser>
      {CustomActions.RenameFile.id === modalState.operation &&
        modalState.open && (
          <FileModal
            path={path}
            modalState={modalState}
            setModalState={setModalState}
          />
        )}
      {modalState.operation === ChonkyActions.OpenFiles.id &&
        modalState.open && (
          <PreviewModal
            files={files}
            currentFile={modalState.file!}
            modalState={modalState}
            setModalState={setModalState}
          />
        )}
      {modalState.operation === CustomActions.DeleteFile.id &&
        modalState.open && (
          <DeleteDialog
            path={path}
            modalState={modalState}
            setModalState={setModalState}
          />
        )}
    </Box>
  )
}

export default MyFileBrowser
