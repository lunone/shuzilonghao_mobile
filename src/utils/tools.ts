import { ListNode, TreeNode } from "@/interface";

export const call = (phoneNumber: string) => {
    uni.makePhoneCall({ phoneNumber });
};


/**
 * 获取部门路径字符串
 * 该函数通过部门ID列表构建部门路径，用于直观展示部门的层级关系
 * 
 * @param departments 部门列表，每个部门包含ID和父ID，形成树状结构
 * @param targetId 目标部门的ID，函数将构建该部门的路径
 * @param str 用于连接部门名称的字符串，默认为 '/'
 * @returns 返回构建的部门路径字符串
 */

export const numberByWan = (num: number | string) => (num + '').replace(/\B(?=(\d{4})+(?!\d))/g, ',')