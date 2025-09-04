export type PilotItem = {
    name: string,
    userId: number,
    pcode: string,
    techs: { acType: string, techNo: string, techName: string }[],
}
export type CrewItem = {
    id?: string,
    flightId?: number,
    flightDate?: string,
    userId?: string,
    name?: string,
    level?: string,
}


export type DepartmenItem = {
    id: number,
    name: string,
    abbr?: string,
    order?: number,
    parentId: number,
}
export type WatchUser = {
    [x: string]: any;
    // 添加watch的User
    id?: number,
    userId: string,
    station: string,
    startDate?: Date | string,
    endDate?: Date | string,
    remark?: string,
    state?: number,
}
//
export type UserItem = {
    id: string,
    userId: string,
    name?: string,
    avatar?: string,
    gender?: number,
    position: string,
    department: number,
    // departmentName?: string,
    // topDepartmentId?: number,
    // topDepartmentName?: string,
    hireDate?: string,
    mobile?: string,
    contract?: string,
    contractMobile?: string,
    idCard?: string,
    district?: string,
    address?: string,
    status: number,
    // 角色和权限相关字段
    roles?: string[], // 角色代码数组
    permissions?: string[] // 权限代码数组
}
