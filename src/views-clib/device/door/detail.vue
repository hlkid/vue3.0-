<template>
  <section class="view-container">
    <section class="tip-top">
      <p class="tip-title">设备信息</p>
      <div class="tip-box">
        <p>应用名称：{{detail.hbAppName}}</p>
        <p>场馆名称：{{detail.venueName}}</p>
        <p>空间名称：{{detail.spaceName}}</p>
        <p>设备ID：{{detail.deviceId}}</p>
        <p>设备名称：{{detail.name}}</p>
        <p>设备MAC地址：{{detail.mac}}</p>
        <p>备注：{{detail.remarks}}</p>
      </div>
    </section>

    <section class="tip-top">
      <p class="tip-title">设备参数</p>
      <div class="tip-box-block">
        <p>轮询周期：{{detail.pollingTime}}</p>
        <p>开门方式：{{detail.openModeName}}</p>
        <p>是否支持灯控：{{detail.lampControl==0?'是':'否'}}</p>
        <p>是否支持蓝牙：{{detail.isSupportBluetooth==0?'是':'否'}}</p>
      </div>
    </section>
  </section>
</template>

<script>
  import { getInfoDevice } from '@/api/clib/device'

  export default {
    data () {
      return {
        id:'',
        detail:{}
      }
    },
    created() {
      this.id = this.$route.params.id;
      this.getInfoDevice();
    },
    methods:{
      //详情
      getInfoDevice(){
        getInfoDevice(this.id).then(res => {
          this.detail = res.data;
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .tip-top{
    background: white;
    margin-top: 15px;
    padding: 20px;
    .tip-title{
      color: #333;
      font-size: 18px;
    }
    .tip-box{
      margin-top: 20px;
      p{
        width: 33%;
        display: inline-block;
        font-size: 14px;
        color: #999;
        margin-bottom: 20px;
      }
    }
    .tip-box-block{
      margin-top: 20px;
      p{
        display: block;
        font-size: 14px;
        color: #999;
        margin-bottom: 20px;
      }
    }
  }
  .dialog-from{
    .el-select{
      width: 100%;
    }
  }

  .hbsx-form{
    .title{
      color: #333;
      font-size: 18px;
      margin-left: 20px;
      margin-bottom: 20px;
      margin-top: -10px;
    }
  }
</style>
