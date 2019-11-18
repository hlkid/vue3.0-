<template>
  <section class="echarts-box" :style="styleObj">
    <div class="echarts-line" ref="echartsLine"></div>
  </section>
</template>

<script>
  // 引入 ECharts 主模块
  var echarts = require('echarts/lib/echarts');
  // 折线图
  require('echarts/lib/chart/line');
  // 引入提示框和标题组件
  require('echarts/lib/component/tooltip');
  require('echarts/lib/component/title');
  // 引入legend组件
  require("echarts/lib/component/legend");

  import { getColors} from "../../utils/common";

  export default {
    props:{
      styleObj:{
        type: Object,
        default(){
          return{
            height: '300px',
            width: '100%'
          }
        }
      },
      list:{
        type: Array,
        default:[]
      },
      dataBottom:{
        type:Array,
        default() {
          return [];
        }
      }
    },
    data () {
      return{
        myChart:'',
        xAxisData: [],
        series:[]
      }
    },
    mounted() {
      this.initChart()
    },
    watch:{
      list: {
        handler(newValue, oldValue) {
          this.initData(newValue)
        },
        deep: true
      }
    },
    methods:{
      initData(list){
        let series = [];
        let xAxisData = [];
        for (let i in this.dataBottom) {
          series.push({
            name: this.dataBottom[i],
            type: 'line',
            data:[]
          })
        };

        list.forEach(item=>{
          xAxisData.push(item.name);
          item.value.forEach((e,i)=>{
            series[i].data.push(e)
          })
        });

        this.series = series;
        this.xAxisData = xAxisData;
        this.setOption();
      },
      initChart(){
        // 基于准备好的dom，初始化echarts实例
        this.myChart = echarts.init(this.$refs.echartsLine);
        this.setOption();
      },
      setOption(){
        // 绘制图表
        this.myChart.setOption({
          color: getColors,
          legend: {
            data:this.dataBottom,
            textStyle:{
              color:'#000'
            },
            bottom: '0'
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '8%',
            containLabel: true
          },
          tooltip: {
            trigger: 'axis',
            axisPointer : {            // 坐标轴指示器，坐标轴触发有效
              type : 'line',        // 默认为直线，可选为：'line' | 'shadow'
              shadowStyle:{
                color: '#D3F5F3',
                opacity: 0.5
              }
            },
            //formatter: '{b0}: {c0}<br />{b1}: {c1}'
            formatter: function (params, ticket, callback) {
              if (params.length>1){
                let str = params[0].axisValue
                params.forEach((item,index)=>{
                  str += '<br/>'+item.marker + item.seriesName.replace('\n','')+': '+item.data
                })
                return str
              } else{
                return params[0].marker + params[0].name.replace('\n','')+': '+params[0].data;
              };
            }
          },
          xAxis: {
            type : 'category',
            //data: this.xAxisData,
            data: this.xAxisData.map(function (str) {
              if (str.length>8) {
                let c = str.substr(8,1) ;
                let s = str.replace(c,c+'\n');
                return s
              }else{
                return str
              }
            }),
            axisLine: { show: true },
            axisTick: { show: true },
            axisLabel: {
              interval: 0,
              textStyle: { color: '#666' }
            }
          },
          yAxis: {
            type : 'value',
            splitLine: {lineStyle:{type:'dashed'}},
            axisLine: { show: false },
            axisTick: { show: false },
            axisLabel: {
              textStyle: { color: '#666' }
            }
          },
          series: this.series,
        });
      }
    },
    beforeDestroy() {
      if (!this.myChart) {
        return
      }
      this.myChart.dispose()
      this.myChart = null;
    }
  };
</script>

<style lang="scss" scoped>
  .echarts-box{
    .echarts-line{
      height: 100%;
      width: 100%;
    }
  }
</style>
