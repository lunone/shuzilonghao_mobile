## 安装
这是一个uniapp cli项目,记录一下安装过程

* 通过 `npx degit dcloudio/uni-preset-vue#vite-ts my-vue3-project` 安装uniapp,如果下载失败去https://gitee.com/dcloud/uni-preset-vue/repository/archive/vite-ts.zip 下载下来也行

* 可以看出目录和原有的HbuildX的目录结构差不多，只是多了一个`src`目录，里面放的是代码，hbuildX根目录下的文件pages,components,static,manifest.json等文件,排除package.json,其他的都拷贝到src目录下.

* 在现有的package.json为基础添加,原来hbuildX的package.json新增的模块,比如我之前的lodash,dayjs,less,less-loader,pinia.

* 运行 `npm i` 结果爆了一个pinia和vue版本冲突,考虑到uniapp和vue绑定很深,所以只能降级pinia,但是仍然无效.运行dev没有问题.

* 在安装lodash的ts库的时候因为上面的报错一直过不去,所以使用 `npm i --save-dev @types/lodash --force`.就过去了.

* 还要完善tsconfig.json,注释掉了`"extends": "@vue/tsconfig/tsconfig.json",`,在`"compilerOptions"`下增加了`"esModuleInterop": true,`.其他的没动.

* 为了方便在package.json中添加一个命令 `"wx": "uni -p mp-weixin",`,然后就可以使用命令`npm run wx`来运行微信小程序了.

* 根据命令运行指示:运行方式：打开 微信开发者工具, 导入 dist\dev\mp-weixin 运行。运行测试不报错.

* 预览报错,没有太仔细看错误,关闭微信开发者工具项目设置里面的 开启上传自动es6转es5,不报错真机能预览了.

* 到目前为止,旧hbuildX在cli里面就愉快的跑起来了.但是npm run wx运行报错interface里面的type没有export某个type,但是在某个文件里面却import了.尝试修复无果.但是重新开了vscode没有再报错,不知道具体原因.

## 低级错误
* setup里面,也就是<script setup>里面不能使用异步,会报错或者使用那个<Suspense> ,没啥必要的话写到onMounted里面呗.

### 文件结构
现在pages/Index.vue是唯一入口,处理跳转与身份逻辑,后负责跳转到响应功能页面.

### 配色
主色:
#C52305 #943928 #801502 #E2563D #E27C69
辅助色 A:
#C56705 #945F28 #804202 #E2923D #E2A769
辅助色 B:
#085E7B #1B4C5C #023D50 #389CBD #5BA5BD
互补色:
#049033 #1D6C38 #015E21 #36C867 #5DC881


## 修改
1. 引入Wot UI后修改了日历，在node_modules\wot-design-uni\components\wd-calendar-view\month\monuth.vue里面handleDateClick函数里面加入了 

```
// 新加的
const dayClick = inject('dayClick') as Function
// 原来就有的
function handleDateClick(index: number) {
    const date = days.value[index]
    // 新加的
    dayClick && dayClick({ value: getDate(date.date) })
    ……
```