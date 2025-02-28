import { INodeSchema } from "@rxdrag/schema";
import { SchemaOptions, createSchema } from "../../../shared";

const options: SchemaOptions = {
  propSchemas: [
    {
      componentName: "Input",
      "x-field": {
        name: "title",
        label: "$title",
      }
    },
    {
      componentName: "Select",
      "x-field": {
        name: "type",
        label: "$type",
      },
      props: {
        options: [
          {
            value: 'primary',
            label: 'Primary',
          },
          {
            value: 'ghost',
            label: 'Ghost',
          },
          {
            value: 'dashed',
            label: 'Dashed',
          },
          {
            value: 'link',
            label: 'Link',
          },
          {
            value: 'text',
            label: 'Text',
          },
          {
            value: 'default',
            label: 'Default',
          },
        ]
      }
    },
    {
      componentName: "Switch",
      "x-field": {
        name: "disabled",
        label: "$disabled",
      },
    },
  ]
}

export const headerSchema: INodeSchema = createSchema(options)