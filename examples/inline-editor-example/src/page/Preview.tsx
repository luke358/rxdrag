import React, { forwardRef, memo } from "react"
import styled from "styled-components"

const PageContainer = styled.div`
  width: 100%;
  height: 100%;
`

export type PageProps = {
  children?: React.ReactNode
}

export const PagePreview = memo(forwardRef<HTMLDivElement, PageProps>((props, ref) => {
  const { children, ...rest } = props;
  return (<PageContainer ref={ref} {...rest}>
    {
      children
    }
  </PageContainer>)
}))