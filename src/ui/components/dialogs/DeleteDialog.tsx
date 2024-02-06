import { useCallback } from "react"
import { FileQueryParams, ModalState, SetValue } from "@/types"
import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import DialogTitle from "@mui/material/DialogTitle"

import { useDeleteFile } from "@/ui/utils/queryOptions"

type DeleteDialogProps = {
  modalState: ModalState
  setModalState: SetValue<ModalState>
  filequeryParams: FileQueryParams
}
export default function DeleteDialog({
  modalState,
  setModalState,
  filequeryParams,
}: DeleteDialogProps) {
  const deleteFiles = useDeleteFile(filequeryParams)

  const handleClose = useCallback((denyDelete = true) => {
    if (!denyDelete) {
      deleteFiles.mutate(modalState.selectedFiles?.at(0)?.name!)
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
        <Button onClick={() => handleClose(false)} autoFocus>
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  )
}
