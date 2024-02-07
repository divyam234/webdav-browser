import { Settings } from "@/types"
import axios from "redaxios"
import { AuthType, createClient, WebDAVClientOptions } from "webdav"

export const http = axios.create({
  headers: {
    ...getAuthHeaders(),
  },
})

export const webdav = createClient(...getWebdavConfig())

function getAuthHeaders(): Record<string, string> {
  const settings = localStorage.getItem("settings")
  if (!settings) {
    return {}
  } else {
    const { user, pass } = JSON.parse(settings) as Settings
    if (user && pass) {
      return {
        Authorization: `Basic ${btoa(`${user}:${pass}`)}`,
      }
    }
    return {}
  }
}

type davArgs = [remoteURL: string, options?: WebDAVClientOptions | undefined]

function getWebdavConfig() {
  const settings = localStorage.getItem("settings")
  const config: davArgs = [] as unknown as davArgs

  if (settings) {
    const { host, user, pass } = JSON.parse(settings) as Settings
    config.push(host)
    if (user && pass) {
      config.push({
        authType: AuthType.Password,
        username: user,
        password: pass,
      })
    }
  }
  return config
}
