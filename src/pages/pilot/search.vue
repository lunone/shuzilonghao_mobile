<template>
    <div class="search-container">
        <div class="search-box">
            <input v-model="searchText" @input="handleInput" placeholder="输入姓名或工号" />
            <!-- <button @click="handleSearch">查询</button> -->
        </div>

        <ul v-show="showSuggestions" class="suggestions">
            <li v-for="user in filteredUsers" :key="user.id" @click="selectUser(user)" class="item">
                {{ user.name }} ({{ user.userId }})
            </li>
        </ul>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { usePilotStore } from '@/store/pilot.store'

const pilotStore = usePilotStore()
const searchText = ref('')
const showSuggestions = ref(false)
const emits = defineEmits(['select'])

const filteredUsers = computed(() => {
    if (!searchText.value) return []

    // 英文或数字需要至少2个字符才显示建议
    const isEnglishOrNumber = /^[a-zA-Z0-9]+$/.test(searchText.value)
    if (isEnglishOrNumber && searchText.value.length < 2) return []
    return (pilotStore.arr || []).filter(user =>
        user?.name?.includes(searchText.value) ||
        user?.userId?.includes(searchText.value) ||
        user?.abbr?.includes(searchText.value)
    ).slice(0, 10) // 限制最多显示10条
})

function handleInput() {
    showSuggestions.value = searchText.value.length > 0
}

function selectUser(user) {
    searchText.value = `${user.name}`
    emits('select', user.pcode);
    showSuggestions.value = false
    // 可以在这里触发选中用户后的操作
}
pilotStore.fetchPilots();
</script>
<style scoped lang="less">
@radius: 8px;

.search-container {
    position: relative;
    padding: 10px;
    background: #f8f8f8;


    .search-box {
        display: flex;
        width: 100%;


        input {
            flex: 1;
            padding: 10px 15px;
            border: 1px solid #ddd;
            border-radius: @radius ;
            outline: none;
            font-size: 14px;
        }

        // button {
        //     padding: 0 15px;
        //     background: #1890ff;
        //     color: white;
        //     border: none;
        //     border-radius: 0 @radius @radius 0;
        //     font-size: 14px;
        //     white-space: nowrap;
        // }
    }

    .suggestions {
        position: absolute;
        left: 10px;
        right: 10px;
        max-height: 200px;
        overflow-y: auto;
        background: white;
        border: 1px solid #ddd;
        border-radius: 0 0 @radius @radius;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); // 新增阴影
        list-style: none;
        padding: 0;
        margin: 5px 0 0;
        z-index: 100;


        .item {
            padding: 12px 16px;
            margin: 0;
            cursor: pointer;
            font-size: 16px;
            line-height: 1.5;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            border-bottom: dashed 1px #ddd;
        }
    }
}
</style>
