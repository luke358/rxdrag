import { ICanvasProxy } from "@rxdrag/react-core"
import { IReactComponents } from "@rxdrag/react-shared"
import { memo } from "react"
import { IFrameCanvasInner } from "./IFrameCanvasInner"

export const IFrameCanvas = memo((
  props: {
    designers: IReactComponents
  }
) => {
  const { designers } = props
  return (
    <ICanvasProxy components={designers}>
      <IFrameCanvasInner />
    </ICanvasProxy>
  )
})