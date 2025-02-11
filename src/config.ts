export default {
    url: {
        timeout: 30e3,
        api: 'https://app.airlonghao.com/sz2',
        init: '/user/init',
        login: '/login/wx',
        activate: '/login/activate',
        //
        airports: '/airport/code4/',
        aircrafts: '/aircraft/list/',
        flightsDate: '/flight/date/',
        flightsATD: '/flight/atd/',
        meMel: '/me/mel/',
        statCrewFh: '/stat/crew/fh',
        statPeriod: '/stat/period/',
        crewFlights: '/crew/list/',
        smsEvents: '/sms/event/list',
        smsVoluntarys: '/sms/self/list',
        users: '/user/list/',
    },
    page: {
        register: '/pages/public/Public',
    },
    key: { token: 'Authorization', },
    css: { splash: { duration: 5e3, } }
}
