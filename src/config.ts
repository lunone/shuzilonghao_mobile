export default {
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
