import { ComponentResourceWidget } from "@rxdrag/react-antd-shell"
import { useSettersTranslate, useRegisterComponentMaterials } from "@rxdrag/react-core"
import { memo, useEffect } from "react"
import { FieldMaterial } from "@rxdrag/react-antd-materials"
import { ResourceCollapsePanel } from "./ResourceCollapsePanel"
import { resources } from "example-common"
import styled from "styled-components"

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-flow: column;
`

export const ResourceWidget = memo(() => {
  const t = useSettersTranslate()
  const registerMaterial = useRegisterComponentMaterials()
  //注册通用物料
  useEffect(() => {
    registerMaterial(FieldMaterial)
  }, [registerMaterial])

  return (
    <Container>
      {
        resources.map((group => {
          return (
            <ResourceCollapsePanel key={group.titleKey} title={t(group.titleKey)} defaultExpand>
              {
                group.items.map((name => {
                  return (
                    <ComponentResourceWidget key={name} name={name} />
                  )
                }))
              }
            </ResourceCollapsePanel>
          )
        }))
      }
    </Container>
  )
})