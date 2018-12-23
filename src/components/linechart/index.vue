<template>
    <section class="line-chart">
        <section v-if="loading" class="line-chart-loading">
            <span>
                <i class="icon icon-loading"></i>
                {{ loadingText }}
            </span>
        </section>
        <header class="line-chart-header">
            <span
                class="line-title"
                v-for="(t, index) in realTitle"
                :key="t">
                <i :style="{ backgroundColor: realColors[index] }"></i>
                {{ t }}
            </span>
            <p class="line-unit" v-if="unit">（{{ unit }}）</p>
        </header>

        <div class="line-chart-container">
            <div class="chart-left">
                <div 
                    class="chart-left-container" 
                    :style="{ width: xAxis.length > 11 ? ((xAxis.length - 1) * 10) + '%' : '100%' }">
                    <div 
                        class="tips-overlay" 
                        v-if="activeIndex !== -1"
                        :style="{ 
                            left: pathData[0][activeIndex].x + 'px', 
                            transform: 
                                activeIndex < Math.floor(xAxis.length / 2) ? 
                                'translateY(-50%) translateX(15%)': 
                                'translateY(-50%) translateX(-115%)'
                        }"
                    >
                        <span>{{ overlayTitle[activeIndex] || xAxis[activeIndex] }}</span>
                        <p 
                            v-for="(t, index) in realTitle"
                            :key="t">
                            {{ t }}: {{ chartData[index][activeIndex] }} {{ unit }}
                        </p>
                    </div>
                    <template v-if="activeIndex !== -1 && activeIndex !== 0 && activeIndex !== xAxis.length - 1">
                        <span
                            class="chart-select-dot"
                            v-for="(t, index) in realTitle"
                            :key="index"
                            :style="{ 
                                top: pathData[index][activeIndex].y + 'px', 
                                left: pathData[index][activeIndex].x + 'px',
                                backgroundColor: dotColors[index] ? dotColors[index] : colors[index]
                            }">
                        </span>
                    </template>
                    <div class="chart-yaxis">
                        <span v-for="y in yAxis" :key="y"></span>
                    </div>
                    <div class="chart-xaxis">
                        <span
                            :style="{  width: index === 0 || index === xAxis.length - 1 ? (50 / (xAxis.length - 1)) + '%' : (50 / (xAxis.length - 1)) * 2 + '%'}"
                            v-for="(x, index) in xAxis"
                            :key="x">
                            {{ skip ? (index % 2 === 0 ? x : '') : x }}
                        </span>
                    </div>
                    <div class="chart-xaxis-line">
                        <span
                            :style="{  
                                width: index === 0 || index === xAxis.length - 1 ? (50 / (xAxis.length - 1)) + '%' : (50 / (xAxis.length - 1)) * 2 + '%',
                                color: chartStyle.gapLineColor ? chartStyle.gapLineColor : '#34bb4a'
                            }"
                            :class="[ index === activeIndex ? 'active' : '']"
                            v-for="(x, index) in xAxis"
                            :key="x"
                            @click="onAxisClick(index)">
                        </span>
                    </div>
                    <canvas id="chart-graph" width="375" height="200"></canvas>
                </div>
            </div>
            <div class="chart-right">
                <span 
                    v-for="y in yAxis"
                    :key="y">
                    {{ y }}
                </span>
            </div>
        </div>
    </section>
</template>
<script src="./index.js"></script>
<style lang="scss" scoped>
    @import "./index.scss";
</style>