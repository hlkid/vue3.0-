<template>
  <section class="echarts-box" :style="{width:width,height:height}">
    <div class="echarts-pie" ref="echartsPie"></div>
  </section>
</template>

<script>
  // 引入 ECharts 主模块
  var echarts = require('echarts/lib/echarts');
  // 引入饼状图
  require('echarts/lib/chart/pie');
  // 引入提示框和标题组件
  require('echarts/lib/component/tooltip');
  require('echarts/lib/component/title');
  require("echarts/lib/component/legendScroll");
  import { getColors } from "@/utils/common.js"

  export default {
    props: {
      width: {
        type: String,
        default: '100%'
      },
      height: {
        type: String,
        default: '500px'
      },
      result: {
        type: Array,
        default: []
      },
      title: {
        type: String,
        default: ""
      },
      //0 为空心 1为实心
      type: {
        type: Number,
        default: 0
      }
    },

    data() {
      return {
        legendData: [],
        seriesData: [],
        selected: {},
        myChart: '',
      }
    },
    mounted() {
      this.initChart();
    },
    watch:{
      result: {
        handler(newValue, oldValue) {
          this.getData()
        },
        deep: true
      }
    },
    methods: {
      //处理数据
      getData() {
        let legendData = [];
        let seriesData = [];
        this.result.forEach((e, i) => {
          legendData.push(e.name);
          seriesData.push({
            name: e.name,
            value: e.value
          });
          this.selected[name] = i < 6;
        });
        this.legendData = legendData;
        this.seriesData = seriesData;
        this.setOptions();
      },
      initChart() {
        // 基于准备好的dom，初始化echarts实例
        this.myChart = echarts.init(this.$refs.echartsPie);
        this.setOptions();
      },
      setOptions() {
        // 绘制图表
        let options = {};
        if (this.type == 0) {
          options = {
            color:getColors,
            tooltip: {
              trigger: 'item',
              formatter: function (params, ticket, callback) {
                return params.marker + params.data.name+': '+params.data.value+'('+params.percent+'%)';
              }
              //formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
              left: "center",
              bottom: 0,
              data: this.legendData,
              selected: this.selected
            },
            series: [
              {
                name: this.title,
                type: 'pie',
                radius: ['40%', '60%'],
                avoidLabelOverlap: false,
                data: this.seriesData,
                label: {
                  normal: {
                    show: true,
                    //position: 'center'
                  },
                  emphasis: {
                    show: true,
                    textStyle: {
                      fontSize: '14',
                      fontWeight: 'bold'
                    }
                  }
                },
                labelLine: {
                  normal: {
                    show: true
                  }
                },
              }
            ]
          }
        } else {
          options = {
            color:getColors,
            tooltip: {
              trigger: 'item',
              formatter: function (params, ticket, callback) {
                return params.marker + params.data.name+': '+params.data.value+'('+params.percent+'%)';
              }
              //formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
              left: 'center',
              bottom: 0,
              data: this.legendData,
              selected: this.selected
            },
            series: [
              {
                name: this.title,
                type: 'pie',
                radius: '50%',
                center: ['50%', '50%'],
                data: this.seriesData,
                label: {
                  show:true
                },
                labelLine: {
                  normal: {
                    show: true,
                  }
                },
              },

            ]
          };
        }
        this.myChart.setOption(options);
      }
    },
    beforeDestroy() {
      if (!this.myChart) {
        return
      }
      this.myChart.dispose()
      this.myChart = null;
    }
  }
</script>

<style lang="scss" scoped>
  .echarts-box {
    .echarts-pie {
      height: 100%;
      width: 100%;
    }
  }
</style>
