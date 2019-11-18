<template>
  <section class="view-container">
    <section class="tip-top">
      <p class="tip-title">座位设备信息</p>
      <div class="tip-box">
        <p>设备MAC地址：{{detail.mac}}</p>
        <p>设备ID：{{detail.deviceId}}</p>
        <p>设备名称：{{detail.name}}</p>
        <p>场馆名称：{{detail.venueName}}</p>
      </div>
    </section>

    <el-form class="hbsx-form" ref="dataForm"
             :model="dataForm"
             :rules="rules"
             inline
             label-width="120px"
             size="small" @submit.native.prevent>

      <p class="title">门禁设备设置</p>

      <el-form-item label="轮询周期" prop="pollingTime">
        <el-input v-model.number="dataForm.pollingTime" placeholder="轮询周期">
          <template slot="append">秒</template>
        </el-input>
      </el-form-item>


      <el-form-item label="是否支持灯控" prop="lampControl" class="block">
        <el-radio-group v-model="dataForm.lampControl">
          <el-radio :label="0">是</el-radio>
          <el-radio :label="1">否</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="是否支持蓝牙" prop="isSupportBluetooth" class="block">
        <el-radio-group v-model="dataForm.isSupportBluetooth">
          <el-radio :label="0">是</el-radio>
          <el-radio :label="1">否</el-radio>
        </el-radio-group>
      </el-form-item>

      <div class="btns-waper">
        <el-button size="small" @click="$router.back()">返回</el-button>
        <el-button size="small" type="primary" :disabled="vloading" @click="sure">提 交</el-button>
      </div>
    </el-form>

  </section>
</template>

<script>
  import PageTemp from '@/components/PageTemp'
  import { applicationDictionaryDataByTypeCode } from '@/api/config'
  import { checkNumber } from '@/utils/validate'
  import {
    getInfoDevice,settingDevice
  } from '@/api/clib/device'

  export default {
    components:{ PageTemp },
    data () {
      return {
        id:'',
        detail:{},

        dataForm:{
          "id":'',//设备主键
          "pollingTime":'',//轮询周期
          "openMode":[],//开门方式（从数据字典中获取，保存的时候以逗号分隔的形式多选）
          "lampControl":"",//是否支持灯控
          "isSupportBluetooth":""//是否支持蓝牙
        },

        rules:{
          pollingTime:[{ required: true, message: '请输入轮询周期'},{validator:checkNumber}],
          openMode:[{ required: true, message: '请输选择开门方式'}],
          lampControl:[{ required: true, message: '请选择是否灯控'}],
          isSupportBluetooth:[{ required: true, message: '请选择是否蓝牙'}],
        },

        openModeOption:[],//开门方式
      }
    },
    created () {
      this.id = this.$route.params.id;
      this.getInfoDevice();
    },
    methods: {

      sure() {
        this.$refs.dataForm.validate(valid => {
          if (valid) {
            this.settingDevice();
          }
        })
      },


      //详情
      getInfoDevice(){
        getInfoDevice(this.id).then(res => {
          if(res.code == 200) {
            this.detail = res.data;

            Object.keys(this.dataForm).forEach(key => {
              this.dataForm[key] = res.data[key]
            });
            if (res.data.openMode) {
              this.dataForm.openMode = res.data.openMode.split(',');
            }else{
              this.dataForm.openMode = []
            }

          }
        })
      },
      //设置
      settingDevice(){
        let data = JSON.parse(JSON.stringify(this.dataForm));
        data.openMode = data.openMode.join(',');
        settingDevice(data).then(res => {
          if(res.code == 200) {
            this.$message.success("设置成功");
            this.$router.back();
          }
        })
      },

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
      margin-top: 10px;
      p{
        width: 33%;
        display: inline-block;
        font-size: 14px;
        color: #999;
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
