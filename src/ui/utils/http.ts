import ky from "ky"

const http = ky.create({
  timeout: 5 * 60 * 1000,
  prefixUrl: localStorage.getItem("RCD_HOST") || "",
})

export default http
