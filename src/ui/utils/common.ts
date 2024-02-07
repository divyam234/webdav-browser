export const navigateToExternalUrl = (url: string, shouldOpenNewTab = true) =>
  shouldOpenNewTab ? window.open(url, "_blank") : (window.location.href = url)

export const isMobileDevice = () => {
  const toMatch = [
    /Android/i,
    /webOS/i,
    /iPhone/i,
    /iPad/i,
    /iPod/i,
    /BlackBerry/i,
    /Windows Phone/i,
  ]
  return toMatch.some(function (toMatchItem) {
    return navigator.userAgent.match(toMatchItem)
  })
}

export const chainLinks = (path: string) => {
  const obj: Record<string, string> = { root: "" }
  if (!path) {
    return { root: "" }
  }
  let pathsoFar = "/"
  const paths = path.split("/")
  for (const path of paths) {
    const decodedPath = decodeURIComponent(path)
    obj[decodedPath] = pathsoFar + decodedPath
    pathsoFar = pathsoFar + decodedPath + "/"
  }

  return obj
}

export function getRawExtension(fileName: string | string[]) {
  return fileName.slice(((fileName.lastIndexOf(".") - 1) >>> 0) + 2)
}
export function getExtension(fileName: string) {
  return (getRawExtension(fileName) as string).toLowerCase()
}

export const zeroPad = (num: number | string, places: number) =>
  String(num).padStart(places, "0")

export const getParams = (fullPath: string) => {
  const parts = fullPath.replace(/^\/|\/$/g, "").split("/")

  return { type: parts[0], path: "/" + parts.slice(1).join("/") }
}

export function formatDuration(value: number) {
  const minute = Math.floor(value / 60)
  const secondLeft = Math.floor(value - minute * 60)
  return `${minute}:${secondLeft < 10 ? `0${secondLeft}` : secondLeft}`
}

export function extractPathParts(path: string): string {
  const parts = decodeURIComponent(path).split("/")

  parts.shift()

  const restOfPath = parts.join("/")

  return restOfPath
}

export function encode(str: string) {
  const charMap = {
    "!": "%21",
    "'": "%27",
    "(": "%28",
    ")": "%29",
    "~": "%7E",
    "%20": "+",
    "%00": "\x00",
  } as const
  return encodeURIComponent(str).replace(
    /[!'()~]|%20|%00/g,
    function replacer(match) {
      return charMap[match as keyof typeof charMap]
    }
  )
}

export function omit<T extends Record<string, any>, K extends Array<keyof T>>(
  obj: T,
  ...props: K
): Omit<T, K[number]> {
  const newObj = Object.assign({}, obj)
  for (const prop of props) delete newObj[prop]

  return newObj as Omit<T, K[number]>
}

export const defaultSortState = {
  "my-drive": "-name",
  search: "name",
  starred: "-updatedAt",
  recent: "-updatedAt",
} as const

export function getValue<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key]
}
