/// <reference path="../shims-uni.d.ts" />

declare const API_BASE_URL: string;

export const CONFIG = {
    url: {
        timeout: 30e3,
        api: API_BASE_URL,
        init: '/user/init',
        login: '/login/wx',
        activate: '/login/activate',
        //
        airports: '/airport/code4',
        //
        aircrafts: '/aircraft/list',
        //
        flightsDate: '/flight/date',
        flightsATD: '/flight/atd',
        flightPlan: '/flight/plan',
        //
        mels: '/me/mel',
        //
        statCrewFh: '/stat/crew/fh',
        statPeriod: '/stat/period',
        statMonth: '/stat/month',
        statByAirline: '/stat/by/airline',
        statByAircraft: '/stat/by/aircraft',
        statByStation: '/stat/by/station',
        crewMate: '/stat/crew/mate',
        crewFatigue: '/stat/crew/fatigue',
        // crewTime: '/stat/crew/time',
        //
        crewFlights: '/crew/list',
        //
        smsStat: '/sms/stat',
        smsEvents: '/sms/event/list',
        smsVoluntarys: '/sms/voluntary/list',
        //
        staff: '/user/staff',
        userProfile: '/user/profile',
        departments: '/department/list',
        dutyToday: '/duty/today',
        //
        pilots: '/pilot/list',
        pilotProfile: '/pilot/profile',
        pilotDuty: '/pilot/duty',
        pilotAbsence: '/pilot/absence',
        pilotTraining: '/pilot/training',
        //
        // 权限管理接口 (新API)
        permissionCreate: '/system/permission/create',
        permissionUpdate: '/system/permission/update',
        permissionDelete: '/system/permission/delete',
        permissionList: '/system/permission/list',
        permissionTree: '/system/permission/tree',

        // 权限操作管理接口 (新增)
        permissionActionCreate: '/system/permission-action/create',
        permissionActionUpdate: '/system/permission-action/update',
        permissionActionDelete: '/system/permission-action/delete',
        permissionActionDetail: '/system/permission-action/detail',
        permissionActionList: '/system/permission-action/list',

        // 角色管理接口 (新API)
        roleCreate: '/system/role/create',
        roleUpdate: '/system/role/update',
        roleDelete: '/system/role/delete',
        roleList: '/system/role/list',
        roleAssignPermissions: '/system/role/assign-permissions',
        rolePermissions: '/system/role/permissions',

        // 用户权限管理接口 (新API)
        userAssignRoles: '/user/assignRoles',
        userRoles: '/user/userRoles',
        userPermissions: '/user/userPermissions',
        userPermissionCodes: '/user/userPermissionCodes',
        userHasPermission: '/user/hasPermission',

        // 资源管理接口
        resourceCreate: '/system/resource/create',
        resourceUpdate: '/system/resource/update',
        resourceDelete: '/system/resource/delete',
        resourceDetail: '/system/resource/detail',
        resourceList: '/system/resource/list',
        resourceTree: '/system/resource/tree',
        resourceBatchCreate: '/system/resource/batchCreate',
        resourceBatchUpdate: '/system/resource/batchUpdate',
        resourceBatchDelete: '/system/resource/batchDelete',

        // 资源权限关联接口
        resourceAssignPermissions: '/system/resource/assignPermissions',
        resourcePermissions: '/system/resource/resourcePermissions',
        resourcePermissionIds: '/system/resource/resourcePermissionIds',
        permissionResources: '/system/permission/resources', // 获取拥有某个权限的资源列表
    },
    page: {
        index: '/pages/index',
        error: '/pages/public/error',
        register: '/pages/public/public'
    },
    key: { token: 'Authorization', },
    css: { splash: { duration: 2e3, } },
    chart: {
        color: {
            ZHCC: '#91CB74',
        }
    }
}
