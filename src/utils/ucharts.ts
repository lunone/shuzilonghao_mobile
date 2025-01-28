export function offsetCorrect(event: any, x: number, y: number = 0) {  
    const offset = { x, y };
    // 经过实验生效的是clientX和pageY.好奇怪的组合啊.单不管3721全改了.
    for (let xy in offset) {
        for (let key of ['', 'screen', 'page', 'client']) {
            const name = key + (key.length ? xy.toUpperCase() : xy);
            event.changedTouches[0][name] = event.changedTouches[0][name] + offset[xy];
        }
    }
}