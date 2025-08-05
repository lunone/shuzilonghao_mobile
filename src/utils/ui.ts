import { getCurrentInstance } from "vue"

// 获取容器宽度
const getContainerWidth = (): Promise<number> => {
    return new Promise((resolve) => {
      // #ifdef MP-WEIXIN
      const query = uni.createSelectorQuery().in((getCurrentInstance() as any).proxy)
      query.select('#gridContainer').boundingClientRect((rect: any) => {
        if (rect) {
        //   containerWidth.value = rect.width
          resolve(rect.width)
        } else {
          resolve(300)
        }
      }).exec()
      // #endif
  
      // #ifdef H5
      const element = document.getElementById('gridContainer')
      if (element) {
        // containerWidth.value = element.offsetWidth
        resolve(element.offsetWidth)
      } else {
        resolve(300)
      }
      // #endif
    })
  }

  export { getContainerWidth }