import { memo, useCallback, useMemo, useState } from "react"
import styled from "styled-components";
import { Members } from "./Members";
import { PropertyBox } from "./PropertyBox";
import { Logic } from "./Logic";
import { useCreateGraph } from "./hooks/useCreateGraph";
import { ReacionsEditorContext } from "./contexts";
import { Toolbar } from "./components/Toolbar";
import { Toolbox } from "./components/Toolbox/inex";

const SytledContent = styled.div`
  height: calc(100vh - 160px);
  display: flex;
  border: ${props => props.theme.token?.colorBorder} solid 1px;
`
const LeftArea = styled.div`
  width: 180px;
  border-right: ${props => props.theme.token?.colorBorder} solid 1px;
  padding: 8px;
`
const CenterArea = styled.div`
  position: relative;
  flex:1;
  display: flex;
  flex-flow: column;
`

const CanvasArea = styled.div`
  position: relative;
  flex:1;
  display: flex;
`

const CanvasContainer = styled.div`
  position: relative;
  flex: 1;
  background-color: ${props => props.theme.token?.colorBgContainer};
`
const MiniMapContainer = styled.div`
  position: absolute;
  width: 240px;
  height: 160px;
  border: ${props => props.theme.token?.colorBorder} solid 1px;
  background-color: ${props => props.theme.token?.colorBgContainer};
  left: 16px;
  bottom: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 5px 1px rgba(0, 0, 0, 0.06);
  display: flex;
  align-items: center;
  justify-content: center; 
  overflow: hidden;
  .x6-widget-minimap{
    background-color: transparent;
    overflow: visible;
    .x6-graph{
      box-shadow: none;
    }
  }
`

const RightArea = styled.div`
  width: 220px;
  border-left: ${props => props.theme.token?.colorBorder}  solid 1px;
  display: flex;
  flex-flow: column;
`

export const ReactionsEditor = memo(() => {
  const [showMap, setShowMap] = useState(false)
  const graph = useCreateGraph()
  const params = useMemo(() => {
    return {
      graph
    }
  }, [graph])

  const handleToggleMap = useCallback(() => {
    setShowMap((show) => !show)
  }, [])

  return (
    <ReacionsEditorContext.Provider value={params}>
      <SytledContent >
        <LeftArea>
          <Members />
        </LeftArea>
        <CenterArea>
          <Toolbar showMap={showMap} toggleShowMap={handleToggleMap} />
          <CanvasArea>
            <Toolbox />
            <CanvasContainer id="reactions-canvas-container" >
              <Logic />
            </CanvasContainer>
          </CanvasArea>
          <MiniMapContainer
            id="reactions-minimap-container"
            style={{
              display: showMap ? "flex" : "none"
            }}
          />
        </CenterArea>
        <RightArea>
          <PropertyBox />
        </RightArea>
      </SytledContent>
    </ReacionsEditorContext.Provider>
  )
})