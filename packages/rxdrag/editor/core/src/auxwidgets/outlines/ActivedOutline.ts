import { CanvasScrollEvent, DragStartEvent, DragStopEvent } from "../../shell/events";
import { IPlugin } from "../../interfaces/plugin";
import { AUX_BACKGROUND_COLOR } from "../constants";
import { numbToPx } from "../utils/numbToPx";
import { getMaxZIndex } from "./getMaxZIndex";
import { ID, IDesignerEngine, Unsubscribe } from "../../interfaces";

//悬停轮廓线
export class ActivedOutlineImpl implements IPlugin {
  name = "default.actived-outline";
  resizeObserver: ResizeObserver
  private outline: HTMLElement | null = null;
  private nodeChangeUnsubscribe: Unsubscribe;
  private currentId: ID | null = null
  private unActive: Unsubscribe
  private unCanvasScroll: Unsubscribe
  private starDragOff: Unsubscribe
  private stopDragOff: Unsubscribe
  private dragging = false;

  constructor(protected engine: IDesignerEngine) {
    if (!engine.getShell().getContainer) {
      console.error("Html 5 driver rootElement is undefined")
    }
    this.resizeObserver = new ResizeObserver(this.onResize)
    this.nodeChangeUnsubscribe = engine.getMonitor().subscribeToHasNodeChanged(this.refresh)
    this.unActive = engine.getMonitor().subscribeToActiveChanged(this.handleActivedChange)
    this.unCanvasScroll = this.engine.getShell().subscribeTo<CanvasScrollEvent>(CanvasScrollEvent.Name, this.refresh)
    this.starDragOff = engine.getShell().subscribeTo<DragStartEvent>(DragStartEvent.Name, this.handleStartDrag)
    this.stopDragOff = engine.getShell().subscribeTo<DragStopEvent>(DragStopEvent.Name, this.handleDragStop)
  }

  onResize = () => {
    this.refresh()
  }

  handleStartDrag = () => {
    this.dragging = true;
    this.clearLine()
  }

  handleDragStop = () => {
    this.dragging = false;
  }

  handleActivedChange = (activedId: ID | undefined | null): void => {
    this.resizeObserver.disconnect()
    this.clearLine()
    if (activedId) {
      this.currentId = activedId
      if (!this.dragging) {
        this.renderLine(activedId)
      }
    }
  }
  onViewportChange = () => {
    this.refresh()
  }
  refresh = () => {
    if (!this.currentId) {
      return
    }
    this.renderLine(this.currentId)
  }

  handleOutNode = (): void => {
    this.clearLine()
    this.currentId = null
  }

  destroy(): void {
    this.clearLine()
    this.nodeChangeUnsubscribe()
    this.unActive()
    this.unCanvasScroll()
    this.starDragOff()
    this.stopDragOff()
  }

  private renderLine(id: ID) {
    this.clearLine()
    const shell = this.engine.getShell()
    const elements = shell.getElements(id)
    const canvas = shell.getCanvas(this.engine.getMonitor().getNodeDocumentId(id) || "")
    const containerRect = canvas?.getDocumentBodyRect()
    const rect = shell.getNodeRect(id)
    if (elements && containerRect && rect) {
      const htmlDiv = document.createElement('div')
      htmlDiv.style.backgroundColor = "transparent"
      htmlDiv.style.position = "fixed"
      htmlDiv.style.border = `dashed 1px ${AUX_BACKGROUND_COLOR}`
      htmlDiv.style.pointerEvents = "none"
      htmlDiv.style.left = numbToPx(rect.x - containerRect.x)
      htmlDiv.style.top = numbToPx(rect.y - containerRect.y)
      htmlDiv.style.height = numbToPx(rect.height - 2)
      htmlDiv.style.width = numbToPx(rect.width - 2)
      htmlDiv.style.zIndex = (getMaxZIndex(elements?.[elements.length - 1]) + 1).toString()
      canvas?.appendAux(htmlDiv)
      this.outline = htmlDiv
      for (const element of elements) {
        this.resizeObserver.observe(element)
      }
    }
  }

  private clearLine() {
    if (this.outline) {
      this.outline.remove()
    }
    this.outline = null
  }
}

export const ActivedOutline = (engine: IDesignerEngine) => {
  return new ActivedOutlineImpl(engine)
}
