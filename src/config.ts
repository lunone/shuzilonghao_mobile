export const CONFIG = {
    url: {
        timeout: 30e3,
        api: 'https://app.airlonghao.com/sz2',
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
        //
        pilots: '/pilot/list',
        pilotProfile: '/pilot/profile',
        pilotDuty: '/pilot/duty',
        pilotAbsence: '/pilot/absence',
        pilotTraining: '/pilot/training',
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
