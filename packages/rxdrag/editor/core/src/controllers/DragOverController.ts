import { DragMoveEvent } from "../shell/events";
import { AcceptType, DragOverOptions } from "../interfaces/action";
import { IPlugin } from "../interfaces/plugin";
import { IDropPosition, PositionJudger, RelativePosition } from "../utils/coordinate";
import { DragOverState } from "../reducers/dragOver";
import { ID, IDesignerEngine, Unsubscribe } from "../interfaces";

export class DragOverControllerImpl implements IPlugin {
  name = "default.drag-over-controller";

  dragover: DragOverOptions | null = null
  unsubscribe: Unsubscribe
  subscribeNodeChange: Unsubscribe
  constructor(protected engine: IDesignerEngine) {
    this.unsubscribe = engine.getShell().subscribeTo<DragMoveEvent>(DragMoveEvent.Name, this.handleDragMove)
    this.subscribeNodeChange = engine.getMonitor().subscribeToDragOver(this.handleDragoverChange)
  }

  handleDragoverChange = (dragover: DragOverState | null) => {
    if (!dragover) {
      this.dragover = null
    }
  }

  handleDragMove = (e: DragMoveEvent) => {
    const { rxId } = e.data.targetRx || {}
    if (rxId) {
      if (this.engine.getMonitor().isDragging()) {
        this.handleDragOver(rxId, e)
      }
    } else if (this.dragover) {
      this.engine.getActions().dragover(null)
      this.dragover = null
    }
  }

  private handleDragOver(targetId: ID, e: DragMoveEvent) {
    const node = this.engine.getMonitor().getNode(targetId)
    if (node) {
      const judger = new PositionJudger(node, this.engine)
      const relativePosition = judger.judgePosition(e.data)
      const dragover = relativePosition ? {
        type: this.canAccept(relativePosition),
        ...relativePosition,
      } : null
      if (this.dragover?.targetId !== dragover?.targetId || this.dragover?.type !== dragover?.type ||
        this.dragover?.position !== dragover?.position
      ) {
        this.engine.getActions().dragover(dragover)
        this.dragover = dragover
      }
    } else {
      this.dragover = null
    }
  }

  private canAccept(position: IDropPosition): AcceptType {
    if (this.engine.getMonitor().getState().draggingNodes) {
      return this.canAcceptNodes(position)
    }
    if (this.engine.getMonitor().getState().draggingResource) {
      return this.canAcceptResource(position)
    }

    return AcceptType.Reject
  }
  private canAcceptNodes(position: IDropPosition) {
    const sourceIds = this.engine.getMonitor().getState().draggingNodes?.nodeIds || []
    for (const sourceId of sourceIds) {
      const node = this.engine.getMonitor().getNode(sourceId)
      if (position.position === RelativePosition.In && node) {
        const beheavior = this.engine.getNodeBehavior(position.targetId)
        if (beheavior?.isDroppable() && !node.meta.locked) {
          return AcceptType.Accept
        }
      } else {
        const parentId = this.engine.getMonitor().getNode(position.targetId)?.parentId
        if (parentId) {
          const beheavior = this.engine.getNodeBehavior(parentId)
          if (beheavior?.isDroppable()) {
            return AcceptType.Accept
          }
        }
      }
    }

    return AcceptType.Reject
  }

  private canAcceptResource(position: IDropPosition): AcceptType {
    const resourceId = this.engine.getMonitor().getState().draggingResource?.resource
    const resource = this.engine.getResourceManager().getResource(resourceId || "")
    if (!resource) {
      console.error("no resource to drop")
      return AcceptType.Reject
    }
    if (position.position === RelativePosition.In) {
      const behavior = this.engine.getNodeBehavior(position.targetId)
      const node = this.engine.getMonitor().getNode(position.targetId)
      if (behavior?.isDroppable() && !node?.meta.locked) {
        return AcceptType.Accept
      }
      // if (isArr(resource.elements)) {
      //   for (const element of resource.elements) {

      //   }
      // }

    } else {
      const parentId = this.engine.getMonitor().getNode(position.targetId)?.parentId
      if (parentId) {
        const behavior = this.engine.getNodeBehavior(parentId)
        if (behavior?.isDroppable()) {
          return AcceptType.Accept
        }
      }
    }

    return AcceptType.Reject
  }


  destroy(): void {
    this.unsubscribe()
  }
}

export const DragOverController = (engine: IDesignerEngine) => {
  return new DragOverControllerImpl(engine)
}