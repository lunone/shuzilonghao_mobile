import { defineStore } from 'pinia';
import { ref, computed, Ref } from 'vue';
import { getPilots } from '@/api/pilot.api';
import _ from 'lodash';
import { PilotItem } from '@/api/user.api';

export const usePilotStore = defineStore('pilot', () => {
    const isLoading = { pilot: false };
    const pilots = ref([]) as Ref<PilotItem[]>;
    const order = ["F0", "FR", "F1", "F2", "F3", "F4", "F5", "F6", "C0", "C1", "C2", "C3", "TA", "TB", "TC"];

    const getTech = computed(() => (userId: string, key = 'userId') => {
        const techs = _.find(pilots.value, item => item[key] == userId)?.techs;
        if (!techs) return [];
        const sorted = [...techs].sort((a, b) => order.indexOf(b.techName) - order.indexOf(a.techName));
        // 去重并保留最高优先级
        const res = [];
        const seen = new Set();
        for (const tech of sorted) {
            const key = tech.acType.slice(0, 2);
            if (!seen.has(key)) {
                seen.add(key);
                res.push({ acType: tech.acType, techName: tech.techName, });
            }
        }
        return res;
    })

    const getPilot = computed(() => (userId: string, key = 'pcode') => {
        // console.log('getPilot', userId,  pilots.value);
        return _.find(pilots.value, item => item[key] == userId);
    })

    const fetchPilots = async () => {
        if (isLoading.pilot) return;
        isLoading.pilot = true;
        if (!pilots.value.length) {
            const response = await getPilots();
            const res = (response as any).list as PilotItem[];
            pilots.value = res.length ? res : [];
        }
        isLoading.pilot = false;
    };

    return {
        arr: computed(() => pilots.value),
        getTech,
        getPilot,
        fetchPilots,
    };
});
