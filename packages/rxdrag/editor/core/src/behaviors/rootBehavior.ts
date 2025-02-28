import { IBehavior, ITreeNode } from "../interfaces";

export const rootBehavior: IBehavior = {
  name: "default.root",
  selector: function (node: ITreeNode): boolean {
    return !node.parentId
  },
  rule: {
    draggable: false,
    droppable: true,
    cloneable: false,
    deletable: false,
  }
}