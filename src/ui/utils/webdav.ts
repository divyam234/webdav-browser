import { AuthType, createClient } from "webdav"

export const webdav = createClient(
  localStorage.getItem("WEBDAV_HOST") || "http://127.0.0.1:8080",
  localStorage.getItem("PASS")
    ? {
        authType: AuthType.Password,
        username: localStorage.getItem("USER") || "",
        password: localStorage.getItem("PASS") || "",
      }
    : {}
)
