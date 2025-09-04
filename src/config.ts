export const CONFIG = {
    url: {
        timeout: 30e3,
        api: 'https://app.airlonghao.com/sz',
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
        // 权限相关接口（通过用户信息API统一获取，无需单独接口）
        // userPermissions: '/user/permissions', // 已移除，权限数据包含在用户信息中
        // roles: '/role/list', // 可选，用于后台管理
        // permissions: '/permission/list', // 可选，用于后台管理
        // 注意：所有接口都通过POST方法调用，符合项目现有的api.ts设计
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
