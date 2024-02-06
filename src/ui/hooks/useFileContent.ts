import { useEffect, useState } from "react"

export default function useFileContent(url: string) {
  const [response, setResponse] = useState("")
  const [validating, setValidating] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url)
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }

        const data = await response.text()
        setResponse(data)
      } catch (error) {
        setError((error as Error).message)
      } finally {
        setValidating(false)
      }
    }

    fetchData()
  }, [url])
  return { response, error, validating }
}
