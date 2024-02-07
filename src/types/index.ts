import { Dispatch, SetStateAction } from "react"
import type { FileData } from "@bhunter179/chonky"

export interface SingleFile {
  Path: string
  Name: string
  Size: number
  MimeType: string
  ModTime: string
  IsDir: boolean
  ID: string
}

export interface FileResponse {
  list: SingleFile[]
}

export interface ModalState {
  open: boolean
  operation?: string
  type?: string
  file?: FileData
  selectedFiles?: FileData[]
  newName?: string
}

export interface AudioMetadata {
  artist: string
  title: string
  cover: string
}
export type Tags = {
  artist: string
  title: string
  picture: Blob
}
export interface FileQueryParams {
  remote: string
  path: string
}
export type SetValue<T> = Dispatch<SetStateAction<T>>

export type JsonObject = Record<string, unknown>

export interface Settings {
  host: string
  user?: string
  pass?: string
}
