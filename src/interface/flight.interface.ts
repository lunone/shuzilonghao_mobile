// 服务器接口
export type FlightItem = {
    id?: number,
    date: string,
    bay: string,
    bayarr?: string,
    lineId?: number,
    flightNo?: string,
    carrier?: string,
    abroad?: boolean,
    acReg?: string,
    acType?: string,
    acLinkLine: number,
    flightKind?: string,
    flightType?: string,
    std?: string,
    etd?: string,
    atd?: string,
    sta?: string,
    eta?: string,
    ata?: string,
    cobt?: string,
    arr?: string,
    arrName?: string,
    dep: string,
    depName?: string,
    isAltn: Boolean
    isCancle: Boolean,
    isDelay: Boolean,
    isNoRelease: Boolean,
    isPatch: Boolean,
    isPrint: Boolean,
    isRelease: Boolean,
    isReturn: Boolean,
    isTelegram: Boolean,
    cancleType?: string,
    netWeightCargo?: number,
}


type multi = { total: number, avg?: number, max?: number, min?: number };


export type StatSingle = {
    name?: string,
    acRegs?: string[],
    hour?: number
    counter: number
    netWeightCargo: number
};
export type StatMulti = {
    name?: string,
    acRegs?: string[],
    hour: multi
    counter: multi,
    netWeightCargo: multi,
};