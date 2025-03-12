import { ListNode, TreeNode } from "@/interface";

export const call = (phoneNumber: string) => {
    uni.makePhoneCall({ phoneNumber });
};
/**
 * 将数字格式化为以万为单位的逗号分隔字符串（每4位分隔）
 * 
 * @param num - 需要格式化的数字，支持数字类型或字符串类型的数字
 * @returns 格式化后的字符串，从右往左每4位用逗号分隔。例如：
 *          - 输入123456789 => "12,3456,789"
 *          - 输入"1234"   => "1234"
 * 
 * @summary 实现原理：
 * 1. 将输入强制转换为字符串格式
 * 2. 使用正则表达式查找需要插入逗号的位置：
 *    - \B 匹配非单词边界（避免在开头加逗号）
 *    - (?=(\d{4})+(?!\d)) 正向预查，确保当前位置后面存在若干组4位数字，
 *      且这些4位组后面没有更多数字（保证从右往左按4位分组）
 */
export const numberByWan = (num: number | string) => 
  // 强制类型转换并执行正则替换
  (num + '').replace(/\B(?=(\d{4})+(?!\d))/g, ',')