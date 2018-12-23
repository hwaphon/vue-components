import LineChart from '../../components/linechart/index.vue';

export default {
    components: {
        'c-linechart': LineChart
    },
    data () {
        return {
            chartData: {
                title: [ '上海', '北京' ],
                unit: '℃',
                colors: [ '#3d91f7', '#60bb65' ],
                duration: 3,
                // dotColors: [ '#3d91f7', '#60bb65' ],
                xAxis: [ '1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
                yAxis: [ 40, 30, 20, 10, 0 ],
                originData: [
                    [ 8, 12, 17, 22, 28, 30, 31, 35, 37, 38, 23, 12],
                    [ 2, 8, 20, 17, 16, 34, 34, 36, 39, 32, 20, 5]
                ],
                chartStyle: {
                    lineWidth: 2,
                    gapLineColor: '#E6E6E6'
                }
            }
        }
    }
}