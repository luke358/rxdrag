import { inputBaseSchemas } from "../schemas";
import { INodeSchema } from "@rxdrag/schema";
import { SchemaOptions, createSchema } from "../../../shared";

const inputNumberPros = [
  ...inputBaseSchemas,
  {
    componentName: "Switch",
    "x-field": {
      name: "showCount",
      label: "$showCount",
    },
  },
  {
    componentName: "InputNumber",
    "x-field": {
      name: "maxLength",
      label: "$maxLength",
    },
  },
]

const inputSlots = [
  {
    label: "$addonBefore",
    name: "addonBefore",
  },
  {
    label: "$addonAfter",
    name: "addonAfter",
  },
  {
    label: "$prefix",
    name: "prefix",
  },
  {
    label: "$suffix",
    name: "suffix",
  },
]


const options: SchemaOptions = {
  propSchemas: inputNumberPros,
  slotSchemas: inputSlots,
  canBindField: true,
}
export const inputNumberSchema: INodeSchema = createSchema(options)

