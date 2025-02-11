export default {
    url: {
        timeout: 30e3,
        api: 'https://app.airlonghao.com/sz2',
        init: '/user/init',
        login: '/login/wx',
        activate: '/login/activate',
        ariports: '/airport/list',
        airportsCode4: '/airport/code4/',
        flightDate: '/flight/date/',
        flightATD: '/flight/atd/',
        meMel: '/me/mel/',
        statCrewFh: '/stat/crew/fh',
        statPeriod: '/stat/period/',
        crewList: '/crew/list/',
        smsEventList: '/sms/event/list',
        smsVoluntaryList: '/sms/self/list',
        aircrafts: '/aircraft/list/',
        users: '/user/list/',
    },
    page: {
        register: '/pages/public/Public',
    },
    key: { token: 'Authorization', },
    css: { splash: { duration: 5e3, } }
}
