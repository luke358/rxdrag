import { NodeType } from "@rxdrag/minions-schema";
import { createUuid } from "@rxdrag/shared";
import { DEFAULT_INPUT_NAME } from "@rxdrag/minions-runtime";
import { IQueryActivityMaterial } from "../types";
import { postDataIcon } from "../icons";
import { postDataSchema } from "./schema";
import { PostData } from "../../activities";

export const postDataMaterial: IQueryActivityMaterial = {
  activityName: PostData.NAME,
  icon: postDataIcon,
  label: "$postData",
  activityType: NodeType.Activity,
  defaultPorts: {
    inPorts: [
      {
        id: createUuid(),
        name: DEFAULT_INPUT_NAME,
        label: "",
      },
    ],
    outPorts: [
      {
        id: createUuid(),
        name: PostData.OUTPUT_NAME_DATA,
        label: "$dataOut",
      },
      {
        id: createUuid(),
        name: PostData.OUTPUT_NAME_POSTING,
        label: "$posting",
      },
      {
        id: createUuid(),
        name: PostData.OUTPUT_NAME_ERROR,
        label: "$error",
      },
    ],
  },
  schema: postDataSchema
}