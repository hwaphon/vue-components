const canvasWidth = 375;
const canvasHeight = 200;

export default {
    props: {
        npv: {
            type: String,
            default: ''
        },
        title: {
            type: Array,
            default () {
                return [];
            }
        },
        colors: {
            type: Array,
            default () {
                return [];
            }
        },
        unit: {
            type: String,
            default: ''
        },
        yAxis: {
            type: Array,
            default () {
                return [];
            }
        },
        xAxis: {
            type: Array,
            default () {
                return [];
            }
        },
        overlayTitle: {
            type: Array,
            default () {
                return [];
            }
        },
        duration: {
            type: Number | String,
            default: 3
        },
        originData: {
            type: Array,
            default () {
                return [];
            }
        },
        skip: {
            type: Boolean,
            default: true
        },
        loadingText: {
            type: String,
            default: '拼命加载中...'
        },
        reload: {
            type: Number | String
        },
        chartStyle: {
            type: Object,
            default () {
                return {};
            }
        },
        dotColors: {
            type: Array,
            default () {
                return [];
            }
        }
    },
    data () {
        return {
            loading: true,
            baseWidth: 0,
            height: 0,
            width: 0,
            canvas: null,
            context: null,
            activeIndex: -1,
            pathData: [],
            timestamp: null,
            chartData: [],
            realTitle: [],
            realColors: []
        }
    },
    mounted () {
        this.canvas = document.getElementById('chart-graph');
        this.drawGraph();
    },
    watch: {
        reload () {
            this.clearGraph();
            this.$nextTick(() => {
                this.drawGraph();
            });
        }
    },
    methods: {
        clearGraph () {
            let canvas = this.canvas;
            canvas.width = 375;
            canvas.height = 200;

            if (this.timestamp) {
                clearTimeout(this.timestamp);
                this.timestamp = null;
            }
        },
        drawGraph () {
            this.loading = true;
            this.activeIndex = -1;
            this.scrollRight();
            this.realTitle = JSON.parse(JSON.stringify(this.title));
            this.realColors = JSON.parse(JSON.stringify(this.colors));
            this.chartData = JSON.parse(JSON.stringify(this.originData));
            this.checkData();
            this.path();
            this.loading = false;
        },
        checkData () {
            let data = this.chartData;
            let flag = false;

            for (let i = 0; i < data.length; i++) {
                flag = this.allZero(data[i]);

                if (flag) {
                    this.dealData(i);
                    i -= 1;
                }
            }
        },
        dealData (index) {
            this.realTitle.splice(index, 1);
            this.realColors.splice(index, 1);
            this.chartData.splice(index, 1);
        },
        allZero (arr) {
            return arr.every((value) => {
                return value === 0;
            });
        },
        path () {
            this.pathData = [];
            let data = this.chartData;
            let { length } = data;
            if (!length || length <= 0) {
                return;
            }

            let canvas = this.canvas;
            let width = canvas.scrollWidth;
            let context = canvas.getContext('2d');
            this.setStyle(context);

            this.width = width;
            this.height = canvas.scrollHeight;
            this.context = context;

            for (let i = 0; i < length; i++) {
                let paths = this.getPathByData(data[i]);
                this.pathData.push(paths);
                let temp = JSON.parse(JSON.stringify(paths));
                let tPaths = this.getTransformData(temp);
                this.drawLine(context, tPaths, this.colors[i]);
            }
        },
        getPathByData (data) {
            let { length } = data;

            if (!length || length <= 0) {
                return;
            }
            let 
                high, 
                low, 
                rate, 
                baseWidth = this.baseWidth,
                baseHeight = this.height,
                array = [],
                yAxis = this.yAxis,
                yLen = yAxis.length,
                x = 0,
                height = 0,
                baseValue = 0;

            try {
                high = Number(this.yAxis[yLen - 1]);
                low = Number(this.yAxis[0]);
                baseValue = Math.abs(high - low + (high - low) / (yLen - 1));

                for (let i = 0; i < length ; i++) {
                    rate = Number(data[i] / baseValue);
                    height = baseHeight - baseHeight * rate;
                    if (i < 1) {
                        x = 0;
                    } else {
                        x = baseWidth * i * 2;
                    }

                    array.push({
                        x: x,
                        y: height
                    });
                }

            } catch (e) {
                throw new Error('纵坐标必须是 Number 类型，或者可以转成 Number 类型');
            }
            return array;
        },
        getTransformData (paths) {
            let width = this.width;
            let baseHeight = this.height;
            let { length } = paths;
            let array = [],
                x = 0,
                y = 0;

            let transform = this.transformPx;

            for (let i = 0; i < length; i++) {
                x = transform(canvasWidth, width, paths[i].x);
                y = transform(canvasHeight, baseHeight, paths[i].y);

                array.push({ x, y });
            }

            return array;
        },
        // 针对 canvas 比例换算单位
        transformPx (cPx, tPx, size) {
            return (cPx * size) / tPx;
        },
        drawLine (context, paths, color) {
            let length = paths.length;
            if (!length || length <= 0) {
                return;
            }

            context.strokeStyle = color;
            context.beginPath();
            context.moveTo(paths[0].x, paths[0].y);

            for (let i =0; i < length; i++) {
                context.lineTo(paths[i].x, paths[i].y);
            }

            context.stroke();
        },
        scrollRight () {
            let $graph = document.querySelector('.chart-left-container');
            let $graphContainer = document.querySelector('.chart-left');
            let width = $graph.scrollWidth;
            let containerWidth = $graphContainer.clientWidth;
            let offset = width - containerWidth;

            // 记录下来整个元素的宽度，用于计算坐标
            this.baseWidth = width * (50 / (this.xAxis.length - 1) / 100);
            $graphContainer.scrollLeft = offset;
        },
        onAxisClick (index) {
            this.activeIndex = index;
            this.controlOverlay();

            if (this.npv) {
                this.sendSoj(this.npv);
            }
        },
        sendSoj (action) {
            this.$soj.trackEvent(action);
        },
        controlOverlay () {
            if (this.duration === 0) { return; }
            if (this.timestamp) {
                clearTimeout(this.timestamp);
            }

            this.timestamp = setTimeout(() => {
                this.activeIndex = -1;
            }, this.duration * 1000);
        },
        setStyle (context) {
            let lineWidth= this.chartStyle.lineWidth;
            if (lineWidth) {
                context.lineWidth = lineWidth;
            }
        }
    }
}