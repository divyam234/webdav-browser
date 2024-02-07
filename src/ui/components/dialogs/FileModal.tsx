import { memo, useCallback } from "react"
import { ModalState, SetValue } from "@/types"
import Backdrop from "@mui/material/Backdrop"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Fade from "@mui/material/Fade"
import Modal from "@mui/material/Modal"
import Paper from "@mui/material/Paper"
import { styled } from "@mui/material/styles"
import TextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography"

import { useUpdateFile } from "@/ui/utils/queryOptions"

const StyledPaper = styled(Paper)({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
  padding: 24,
  "@media (max-width: 480px)": {
    width: 300,
  },
})

type FileModalProps = {
  path: string
  modalState: ModalState
  setModalState: SetValue<ModalState>
}

export default memo(function FileModal({
  path,
  modalState,
  setModalState,
}: FileModalProps) {
  const handleClose = useCallback(
    () => setModalState((prev) => ({ ...prev, open: false })),
    []
  )
  const updateFile = useUpdateFile(path)

  const { file, open } = modalState

  const onUpdate = useCallback(() => {
    updateFile.mutate({
      oldName: file?.name as string,
      newName: modalState.newName as string,
    })
    handleClose()
  }, [modalState.newName, file, handleClose])

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={!!open}
      onClose={handleClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
        },
      }}
    >
      <Fade in={open}>
        <StyledPaper elevation={3}>
          <Typography id="transition-modal-title" variant="h6" component="h2">
            Rename
          </Typography>
          <TextField
            fullWidth
            focused
            value={modalState.newName || file?.name}
            variant="outlined"
            inputProps={{ autoComplete: "off" }}
            onChange={(e) =>
              setModalState((prev) => ({
                ...prev,
                newName: e.target.value,
              }))
            }
          />
          <Box
            sx={{
              display: "inline-flex",
              justifyContent: "flex-end",
              gap: "1.2rem",
            }}
          >
            <Button
              sx={{ fontWeight: "normal" }}
              variant="text"
              onClick={handleClose}
              disableElevation
            >
              Cancel
            </Button>
            <Button
              disabled={!file?.name}
              sx={{ fontWeight: "normal" }}
              variant="contained"
              onClick={onUpdate}
              disableElevation
            >
              OK
            </Button>
          </Box>
        </StyledPaper>
      </Fade>
    </Modal>
  )
})
