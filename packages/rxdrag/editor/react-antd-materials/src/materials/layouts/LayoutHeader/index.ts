import { Header } from "@rxdrag/react-antd-components";
import { IComponentMaterial } from "@rxdrag/react-core";
import { headerLocales } from "./locales";
import { headerSchema } from "./schema";

export const LayoutHeaderMaterial: IComponentMaterial = {
  componentName: "Layout.Header",
  component: Header,
  designer: Header,
  designerLocales: headerLocales,
  propsSchema: headerSchema,
  designerProps: {
    disableTrigger: true,
  },
  behaviorRule: {
    draggable: false,
    droppable: true,
    deletable: false,
    cloneable: false,
    noPlaceholder: true,
  },
  resource: {
    name: "Layout.Header",
    elements: [
      {
        componentName: "Layout.Header",
        props: {
        }
      }
    ]
  },
}
