import { useDocumentViewTypeState, useActivedDocumentIdState, useActions, useSettersTranslate } from "@rxdrag/react-core"
import { Button, Space, Tooltip } from "antd"
import { memo, useCallback, useEffect } from "react"
import { SvgIcon } from "../layouts/CanvasToolbar/SvgIcon"
import { designIcon, jsonIcon, playIcon } from "../../icons"

export const ViewButtons = memo(() => {
  const [viewType, setViewType] = useDocumentViewTypeState()
  const [activedDocumentId] = useActivedDocumentIdState()
  const actions = useActions()
  const t = useSettersTranslate()

  useEffect(() => {
    actions?.selectNodes([], activedDocumentId || "")
  }, [actions, activedDocumentId, viewType])

  const handleDesign = useCallback(() => {
    setViewType("design")
  }, [setViewType])

  const handleJson = useCallback(() => {
    setViewType("json")
  }, [setViewType])

  const handlePreview = useCallback(() => {
    setViewType("preview")
  }, [setViewType])
  return (
    <Space>
      <Tooltip title={t("design")}>
        <Button
          size="small"
          type={viewType === "design" ? "default" : "text"}
          icon={
            <SvgIcon>
              {designIcon}
            </SvgIcon>
          }

          onClick={handleDesign}
        />
      </Tooltip>
      <Tooltip title={t("jsonCode")}>
        <Button
          size="small"
          type={viewType === "json" ? "default" : "text"}
          icon={
            <SvgIcon>
              {jsonIcon}
            </SvgIcon>
          }
          onClick={handleJson}
        />
      </Tooltip>
      <Tooltip title={t("preview")}>
        <Button
          size="small"
          type={viewType === "preview" ? "default" : "text"}
          icon={
            <SvgIcon>
              {playIcon}
            </SvgIcon>
          }
          onClick={handlePreview}
        />
      </Tooltip>
    </Space>
  )
})