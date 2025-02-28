import { memo } from "react"
import Editor from '@monaco-editor/react';
import { useThemeMode, useDocument } from "../hooks";

export const JsonView = memo(() => {
  const doc = useDocument()
  const themeMode = useThemeMode()
  const jsonStr = JSON.stringify(doc?.getSchemaTree() || {}, null, 2)

  return (
    <Editor
      height="100%"
      language="json"
      theme={themeMode === "dark" ? "vs-dark" : "vs-light"}
      value={jsonStr}
    />
  )
})