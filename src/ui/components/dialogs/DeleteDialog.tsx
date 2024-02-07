import { useCallback } from "react"
import { ModalState, SetValue } from "@/types"
import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import DialogTitle from "@mui/material/DialogTitle"
import type { WebDAVClient } from "webdav"

import { useDeleteFile } from "@/ui/utils/queryOptions"

type DeleteDialogProps = {
  modalState: ModalState
  setModalState: SetValue<ModalState>
  path: string
  webdav: WebDAVClient
}
export default function DeleteDialog({
  webdav,
  modalState,
  setModalState,
  path,
}: DeleteDialogProps) {
  const deleteFiles = useDeleteFile(webdav, path)

  const handleClose = useCallback((denyDelete = true) => {
    if (!denyDelete) {
      deleteFiles.mutate(modalState.selectedFiles?.at(0)?.path)
    }
    setModalState((prev) => ({ ...prev, open: false }))
  }, [])

  return (
    <Dialog
      open={modalState.open!}
      onClose={() => handleClose()}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      PaperProps={{ elevation: 0 }}
    >
      <DialogTitle id="alert-dialog-title">{"Delete Files"}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Do you want to remove selected files?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => handleClose()}>No</Button>
        <Button onClick={() => handleClose(false)}>Yes</Button>
      </DialogActions>
    </Dialog>
  )
}
