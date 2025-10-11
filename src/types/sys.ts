export type TreeNode = Record<string, any> & {
    id: number,
    name?: string,
    parentId: number,
    children?: TreeNode[],
}
export type ListNode = Record<string, any> & {
    id: number,
    name?: string,
    parentId: number,
}
export type TableColumnItem = {
    key?: string, name: string, width?: string | number, component?: string,
    show?: Boolean, filter?: Boolean, sort?: Boolean,
    expand?: boolean, slot?: boolean, fixed?: boolean,
    resizable?: boolean, formatter?: Function, header?: boolean,
    order?: number,
}
