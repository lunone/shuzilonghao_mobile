<template>
    <div class="flight-table">
        <div class="flight-header">
            <span class="col">航班号</span>
            <span class="col">出发地</span>
            <span class="col">目的地</span>
            <span class="col">状态</span>
        </div>
        <div class="flight-row" v-for="flight in flights" :key="flight.id">
            <span class="col">{{ flight.flightNumber }}</span>
            <span class="col">{{ flight.depName }}</span>
            <span class="col">{{ flight.arrName }}</span>
            <span class="col">{{ flightStatus(flight) }}</span>
        </div>
    </div>
</template>