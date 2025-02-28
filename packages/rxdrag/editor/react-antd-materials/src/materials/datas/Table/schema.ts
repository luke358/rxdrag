import { INodeSchema } from "@rxdrag/schema";
import { SchemaOptions, createSchema } from "../../../shared";

const options: SchemaOptions = {
  propSchemas: [
    {
      componentName: "Input",
      "x-field": {
        name: "rowKey",
        label: "$rowKey",
      }
    },
    {
      componentName: "Switch",
      "x-field": {
        name: "bordered",
        label: "$bordered",
      }
    },
    {
      componentName: "Radio.Group",
      props: {
        optionType: "button",
        options: [
          {
            label: "$large",
            value: "large"
          },
          {
            label: "$middle",
            value: "middle"
          },
          {
            label: "$small",
            value: "small"
          },
        ],
        defaultValue: "large",
      },
      "x-field": {
        name: "size",
        label: "$size",
      }
    },
    {
      componentName: "Select",
      props: {
        options: [
          {
            label: "$false",
            value: false,
          },
          {
            label: "$topLeft",
            value: "topLeft"
          },
          {
            label: "$topCenter",
            value: "topCenter"
          },
          {
            label: "$topRight",
            value: "topRight"
          },
          {
            label: "$bottomLeft",
            value: "bottomLeft"
          },
          {
            label: "$bottomCenter",
            value: "bottomCenter"
          },
          {
            label: "$bottomRight",
            value: "bottomRight"
          },
        ],
        defaultValue: "bottomRight",
      },
      "x-field": {
        name: "pagination",
        label: "$pagination",
      }
    },
  ],
  slotSchemas: [
    {
      name: "header",
      label: "$header",
    },
    {
      name: "footer",
      label: "$footer",
    },
    {
      name: "summary",
      label: "$summary",
    },
  ],
  canBindField: false,
  events: [
    {
      name: "onPageChange",
      label: "$paginationChange",
    }
  ],
}

export const materialSchema: INodeSchema = createSchema(options)