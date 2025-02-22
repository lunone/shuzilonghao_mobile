<template>
    <!-- <ucharts :option="pieOption" @select="showTip" :height="200" /> -->
</template>
<script setup lang="ts">
// const getOption = (res) => {
//     months.value = Object.keys(res);
//     const events2 = [];
//     const voluntarys2 = [];
//     let last = { events: 0, voluntarys: 0 }
//     for (let month of months.value) {
//         events2.push(res[month].events);
//         voluntarys2.push(res[month].voluntarys);
//         last = { events: res[month].events, voluntarys: res[month].voluntarys }
//     }
//     select.value = last
//     events.value = events2;
//     voluntarys.value = voluntarys2;
//     // console.log(events2, voluntarys2);
//     const step = 2;
//     return {
//         type: "mix",
//         categories: months,
//         color: ["#91CB74", "#FAC858", "#EE6666", "#73C0DE", "#3CA272", "#FC8452", "#9A60B4", "#ea7ccc"],
//         series: [
//             {
//                 color: "#aaaaaa",
//                 name: "安全事件", type: "column",
//                 data: events2
//                 //  yData.map(value => {
//                 //     // 超过平均值20%的颜色红色，低于平均值20%的颜色暗绿色，其他的颜色为蓝色
//                 //     const diff = (value - avgDay) / avgDay;
//                 //     const color = diff > 0.2 ? '#d48264' : (diff < -0.2) ? '#c4ccd3' : "#91c7ae";
//                 //     return { color, value }
//                 // })
//             }, {
//                 name: '主动报告', type: "line",
//                 // 默认太高了,裁掉一节
//                 data: voluntarys2.map((value, index) => value - 30),
//                 formatter: val => val + 30
//             },
//             // { name: '班次', type: "column", data: counters }
//         ],
//         animation: false,
//         // background: "#FFFFFF",
//         padding: [15, 0, 10, 0],
//         legend: { show: false, },
//         xAxis: {
//             disableGrid: true,
//             // labelCount: 8,// 这个确实会自动控制显示标签数量,但是不显示的标签的val就是''了,没办法formatter
//             formatter: (val, index) => index % step != 0 ? '' : val,
//         },
//         yAxis: {
//             disabled: true,
//             // disableGrid: true,
//             data: [{
//                 min: 0,
//                 // disabled: true,
//             }, {
//                 disabled: false,
//                 min: 10, max: 50
//             }]
//         },
//         extra: {
//             mix: {
//                 column: {
//                     width: 16
//                 }
//             }
//         }
//     }
// }
</script>