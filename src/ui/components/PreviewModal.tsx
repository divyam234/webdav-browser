import { lazy, memo, Suspense, useCallback, useState } from "react"
import { ModalState, SetValue } from "@/types"
import {
  ChonkyIconFA,
  ColorsLight,
  FileData,
  useIconData,
} from "@bhunter179/chonky"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined"
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore"
import NavigateNextIcon from "@mui/icons-material/NavigateNext"
import { alpha } from "@mui/material"
import Backdrop from "@mui/material/Backdrop"
import Box from "@mui/material/Box"
import IconButton from "@mui/material/IconButton"
import Modal from "@mui/material/Modal"
import Typography from "@mui/material/Typography"

import { preview } from "@/ui/utils/previewType"

import Loader from "./Loader"
import OpenWithMenu from "./menus/OpenWithlMenu"
import DocPreview from "./previews/DocPreview"
import FullScreenIFrame from "./previews/FullScreenIFrame"
import ImagePreview from "./previews/ImagePreview"
import PDFPreview from "./previews/PdfPreview"

const VideoPreview = lazy(() => import("./previews/video/VideoPreview"))

const CodePreview = lazy(() => import("./previews/CodePreview"))

const EpubPreview = lazy(() => import("./previews/EpubPreview"))

const AudioPreview = lazy(() => import("./previews/audio/AudioPreview"))

type PreviewModalProps = {
  currentFile: FileData
  modalState: Partial<ModalState>
  setModalState: SetValue<ModalState>
  files?: FileData[]
  host: string
}

const findNext = (files: FileData[], fileId: string, previewType: string) => {
  let index = -1,
    firstPreviewIndex = -1

  for (let i = 0; i < files.length; i++) {
    const matchPreview =
      (previewType == "all" && files[i].previewType) ||
      files[i].previewType == previewType

    if (index > -1 && matchPreview) {
      return files[i]
    }

    if (firstPreviewIndex === -1 && matchPreview) {
      firstPreviewIndex = i
    }

    if (files[i].id === fileId) {
      index = i
    }
    if (i === files.length - 1) {
      return files[firstPreviewIndex]
    }
  }
}

const findPrev = (files: FileData[], fileId: string, previewType: string) => {
  let index = -1,
    lastPreviewIndex = -1
  for (let i = files.length - 1; i >= 0; i--) {
    const matchPreview =
      (previewType == "all" && files[i].previewType) ||
      files[i].previewType == previewType

    if (index > -1 && matchPreview) {
      return files[i]
    }
    if (lastPreviewIndex === -1 && matchPreview) {
      lastPreviewIndex = i
    }
    if (files[i].id === fileId) {
      index = i
    }

    if (i === 0) {
      return files[lastPreviewIndex]
    }
  }
}

export default memo(function PreviewModal({
  currentFile,
  files,
  modalState,
  setModalState,
  host,
}: PreviewModalProps) {
  const [previewFile, setPreviewFile] = useState(currentFile)

  const { id, name, previewType } = previewFile

  const { icon, colorCode } = useIconData({ id, name, isDir: false })

  const nextItem = useCallback(
    (previewType = "all") => {
      if (files) {
        const nextItem = findNext(files, id, previewType)
        if (nextItem) setPreviewFile(nextItem)
      }
    },
    [id, files]
  )

  const prevItem = useCallback(
    (previewType = "all") => {
      if (files) {
        const prevItem = findPrev(files, id, previewType)
        if (prevItem) setPreviewFile(prevItem)
      }
    },
    [id, files]
  )

  const handleClose = useCallback(() => {
    setModalState((prev) => ({ ...prev, open: false }))
  }, [])

  const mediaUrl = `${host}${previewFile.path}`

  const renderPreview = useCallback(() => {
    if (previewType) {
      switch (previewType) {
        case preview.video:
          return (
            <Suspense fallback={<Loader />}>
              <VideoPreview name={name} mediaUrl={mediaUrl} />
            </Suspense>
          )

        case preview.pdf:
          return (
            <FullScreenIFrame>
              <PDFPreview mediaUrl={mediaUrl} />
            </FullScreenIFrame>
          )

        case preview.office:
          return (
            <FullScreenIFrame>
              <DocPreview mediaUrl={mediaUrl} />
            </FullScreenIFrame>
          )

        case preview.code:
          return (
            <Suspense fallback={<Loader />}>
              <FullScreenIFrame>
                <CodePreview name={name} mediaUrl={mediaUrl} />
              </FullScreenIFrame>
            </Suspense>
          )

        case preview.image:
          return <ImagePreview name={name} mediaUrl={mediaUrl} />

        case preview.epub:
          return (
            <Suspense fallback={<Loader />}>
              <FullScreenIFrame>
                <EpubPreview mediaUrl={mediaUrl} />
              </FullScreenIFrame>
            </Suspense>
          )

        case preview.audio:
          return (
            <Suspense fallback={<Loader />}>
              <AudioPreview
                nextItem={nextItem}
                prevItem={prevItem}
                name={name}
                mediaUrl={mediaUrl}
              />
            </Suspense>
          )

        default:
          return null
      }
    }
  }, [id])

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={modalState.open!}
      sx={{
        display: "flex",
        overflowY: "auto",
        flexDirection: "column",
        gap: "3rem",
        overflow: "hidden",
      }}
      onClose={handleClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
          sx: {
            bgcolor: (theme) => alpha(theme.palette.shadow.main, 0.7),
          },
        },
      }}
    >
      <>
        {id && name && (
          <>
            <IconButton
              sx={{
                position: "absolute",
                left: 32,
                color: "white",
                top: "50%",
                background: "#1F1F1F",
              }}
              color="inherit"
              edge="start"
              onClick={() => prevItem()}
            >
              <NavigateBeforeIcon />
            </IconButton>

            <IconButton
              sx={{
                position: "absolute",
                right: 32,
                color: "white",
                top: "50%",
                background: "#1F1F1F",
              }}
              color="inherit"
              edge="start"
              onClick={() => nextItem()}
            >
              <NavigateNextIcon />
            </IconButton>

            <Box
              sx={{
                position: "absolute",
                height: 64,
                width: "100%",
                top: 0,
                padding: 2,
                color: "white",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  width: "30%",
                  position: "absolute",
                  left: "1rem",
                }}
              >
                <IconButton color="inherit" edge="start" onClick={handleClose}>
                  <ArrowBackIcon />
                </IconButton>
                <ChonkyIconFA
                  icon={icon}
                  style={{ color: ColorsLight[colorCode] }}
                />
                <Typography
                  sx={{
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                    fontSize: "1rem",
                    cursor: "pointer",
                  }}
                  variant="h6"
                  component="h6"
                  title={name}
                >
                  {name}
                </Typography>
              </Box>
              {previewType === preview.video && (
                <Box
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    marginRight: "-50%",
                    transform: "translate(-50%,-50%)",
                  }}
                >
                  <OpenWithMenu videoUrl={mediaUrl} previewType={previewType} />
                </Box>
              )}
              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "1rem",
                  position: "absolute",
                  right: "1rem",
                }}
              >
                <IconButton
                  component={"a"}
                  rel="noopener noreferrer"
                  href={mediaUrl}
                  color="inherit"
                  edge="start"
                >
                  <FileDownloadOutlinedIcon />
                </IconButton>
              </Box>
            </Box>

            {renderPreview()}
          </>
        )}
      </>
    </Modal>
  )
})
