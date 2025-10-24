import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useTabBarStore = defineStore('tabBar', () => {
    // --- STATE ---
    const current = ref(0);
    const isSwitching = ref(false);
    
    const list = ref([
        {
            pagePath: "pages/staff/home",
            text: "主页",
            iconClass: "zl-icon-user"
        },
        {
            pagePath: "pages/staff/workspace",
            text: "工作台",
            iconClass: "zl-icon-analysis"
        },
        {
            pagePath: "pages/staff/office",
            text: "办公",
            iconClass: "zl-icon-duty"
        },
        {
            pagePath: "pages/staff/profile",
            text: "我",
            iconClass: "zl-icon-person"
        }
    ]);

    // --- GETTERS ---
    const currentTab = computed(() => current.value);
    const tabList = computed(() => list.value);
    const switching = computed(() => isSwitching.value);

    // --- ACTIONS ---
    const setCurrent = (index: number) => {
        current.value = index;
    };

    const setSwitching = (switching: boolean) => {
        isSwitching.value = switching;
    };

    const syncCurrent = () => {
        const pages = getCurrentPages();
        if (pages.length === 0) return;
        
        const currentPage = pages[pages.length - 1];
        const route = currentPage.route;

        const currentIndex = list.value.findIndex(item => item.pagePath === route);
        if (currentIndex !== -1) {
            current.value = currentIndex;
        }
    };

    // --- RETURN ---
    return {
        // State & Getters
        current: currentTab,
        list: tabList,
        isSwitching: switching,

        // Actions
        setCurrent,
        setSwitching,
        syncCurrent
    };
});