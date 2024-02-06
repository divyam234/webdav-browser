import React from "react"

export default React.createContext({
  toggleColorMode: () => {},
  resetTheme: () => {},
  setSchemeColor: (color: string) => {},
  schemeColor: "",
})
