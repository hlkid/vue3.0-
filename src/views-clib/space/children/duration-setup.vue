<template>
  <section class="view-container">
    <el-form class="unified-form" inline ref="dialogForm" :model="dialogForm" label-width="180px" :rules="rules"
             size="small">
      <h4>空间信息</h4>
      <div class="venue-info">
        <p>空间名称：主题阅览室</p>
        <p>所属场馆：包河区图书馆</p>
      </div>

      <h4>推荐时段设置</h4>
      <div class="recommend-list"  v-for="(item,index) in dateList">
        <el-time-picker
          is-range
          size="small"
          v-model="item.dateTime"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          placeholder="选择空间开放时间">
        </el-time-picker>
        <el-button size="mini" icon="el-icon-remove-outline" circle @click="subTime(index)"></el-button>
        <el-button type="danger" size="mini" icon="el-icon-circle-plus-outline" circle @click="addTime" v-if="index == 0"></el-button>
      </div>

      <h4>循环开放时间设置</h4>

      <el-checkbox-group v-model="dialogForm.btn" size="small" style="margin-bottom: 20px">
        <el-checkbox label="星期一" border></el-checkbox>
        <el-checkbox label="星期二" border></el-checkbox>
        <el-checkbox label="星期三" border></el-checkbox>
        <el-checkbox label="星期四" border></el-checkbox>
        <el-checkbox label="星期五" border></el-checkbox>
        <el-button type="primary" size="small" style="margin-left: 20px">关闭</el-button>
        <el-button type="primary" size="small" style="margin-left: 20px">开放</el-button>
        <el-button type="primary" size="small" style="margin-left: 20px">全部开放</el-button>
      </el-checkbox-group>

      <h4>空间日历设置</h4>

      <div class="btns-waper">
        <el-button @click="$router.go(-1)">取 消</el-button>
        <el-button type="primary" :disabled="vloading" @click="sure">确 定</el-button>
      </div>
    </el-form>

  </section>
</template>

<script>
  export default {
    data() {
      return {
        dialogForm: {
          num: "",
          time: "",
          btn: []
        },
        rules: {},

        checked: [],
        dateList:[
          {
            dateTime:''
          }
        ]
      };
    },
    methods: {
      sure() {

      },
      //加
      addTime(){
        this.dateList.push({ dateTime:''})
      },
      //减
      subTime(index){
        if(this.dateList.length == 1){
          return
        }
        this.dateList.splice(index,1);
      }
    }

  }
</script>

<style lang="scss" scoped>
  h3, h4 {
    margin: 0;
    margin-bottom: 20px;
  }

  .tip {
    font-size: 12px;
    color: #999;
  }

  .unified-form {
    .venue-info {
      padding: 10px 20px;
      background: #f1f1f1;
      margin-bottom: 20px;

      p {
        line-height: 30px;
      }
    }

    .recommend-list {
      display: block;
      margin-bottom: 20px;
      margin-left: 20px;
    }

    .form-item-100 {
      width: 100%;

      /deep/ .el-form-item__content {
        width: 500px;
      }
    }

    .el-form-item__content {
      width: 300px;
    }
  }

</style>
