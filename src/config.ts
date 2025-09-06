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
        // 权限管理接口
        permissionCreate: '/system/permission/create',
        permissionUpdate: '/system/permission/update',
        permissionDelete: '/system/permission/delete',
        permissionDetail: '/system/permission/detail',
        permissionList: '/system/permission/list',
        permissionTree: '/system/permission/tree',
        permissionBatchCreate: '/system/permission/batchCreate',
        permissionBatchUpdate: '/system/permission/batchUpdate',
        permissionBatchDelete: '/system/permission/batchDelete',

        // 角色管理接口
        roleCreate: '/system/role/create',
        roleUpdate: '/system/role/update',
        roleDelete: '/system/role/delete',
        roleDetail: '/system/role/detail',
        roleDetailByCode: '/system/role/detailByCode',
        roleList: '/system/role/list',
        roleAssignPermissions: '/system/role/assignPermissions',
        rolePermissions: '/system/role/rolePermissions',
        rolePermissionIds: '/system/role/rolePermissionIds',
        roleEnabledRoles: '/system/role/enabledRoles',
        roleCheckCode: '/system/role/checkCode',

        // 用户角色管理接口
        userAssignRoles: '/user/assignRoles',
        userRoles: '/user/userRoles',
        userPermissions: '/user/userPermissions',
        userPermissionCodes: '/user/userPermissionCodes',
        userHasPermission: '/user/hasPermission',
        userHasRole: '/user/hasRole',
        userAddUserRole: '/user/addUserRole',
        userRemoveUserRole: '/user/removeUserRole',
        userClearUserRoles: '/user/clearUserRoles',
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
