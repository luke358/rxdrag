import { IDispatchable, ICustomEvent, ISubscribable } from "./event";
import { ID, IRect } from "./types";
export interface IShellPane {
    id: ID;
    getElement(id: ID): HTMLElement | null;
    getContainerRect(): IRect | null;
    getTopRect(nodeId: ID): IRect | null;
    appendChild(child: HTMLElement): void;
    contains(child: HTMLElement): boolean;
    removeChild(child: HTMLElement): void;
    destory(): void;
}
export interface IDriver {
    teardown(): void;
}
export type Canvases = {
    [documentId: ID]: IShellPane | undefined;
};
export interface IDesignerShell extends ISubscribable, IDispatchable<ICustomEvent<any>> {
    dragging: boolean;
    getContainer(): IShellPane | undefined;
    setContainer(container: IShellPane): void;
    getCanvas(documentId: ID): IShellPane | undefined;
    getAllCanvases(): Canvases;
    addCanvas(canvas: IShellPane): void;
    removeCanvas(documentId: ID): void;
    getElement(nodeId: ID): HTMLElement | null;
    getTopRect(nodeId: ID): IRect | null;
    destory(): void;
}
export type IDriverFactory = (shell: IDesignerShell, element: Element | Node | HTMLElement) => IDriver;
