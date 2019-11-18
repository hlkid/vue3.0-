<template>
  <section class="view-container">
    <el-form class="unified-form" inline ref="dialogForm" :model="dialogForm" label-width="180px" :rules="rules" size="small">
      <h3>统一设置</h3>
      <el-form-item label="所属场馆">
        <el-select placeholder="请选择所属场馆">
          <el-option label="包河区图书馆" value="1"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="所属场馆" class="form-item-100">
        <el-checkbox-group  v-model="checked" >
          <el-checkbox label="周一"></el-checkbox>
          <el-checkbox label="周二"></el-checkbox>
          <el-checkbox label="周三"></el-checkbox>
          <el-checkbox label="周四"></el-checkbox>
        </el-checkbox-group>
      </el-form-item>

      <h4>基本信息</h4>

      <el-form-item label="空间开放时间">
        <el-time-picker
          is-range
          v-model="dialogForm.time"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          placeholder="选择空间开放时间">
        </el-time-picker>
      </el-form-item>

      <el-form-item label="可取消订单最大时长">
        <el-input v-model.number="dialogForm.num" placeholder="可取消订单最大时长"></el-input>
        <span class="tip">请输入1-100以内的整数，建议值24-48以内</span>
      </el-form-item>

      <el-form-item label="可提前签到时间">
        <el-input v-model.number="dialogForm.num" placeholder="可提前签到时间"></el-input>
        <span class="tip">请输入1-60以内的整数，建议值30</span>
      </el-form-item>

      <el-form-item label="取消订单且不会违约时间最大时长">
        <el-input v-model.number="dialogForm.num" placeholder=""></el-input>
        <span class="tip">请输入1-100以内的整数，建议值24-48以内</span>
      </el-form-item>

      <el-form-item label="可提前预约天数">
        <el-input v-model.number="dialogForm.num" placeholder=""></el-input>
        <span class="tip">请输入1-50以内的整数，建议值1-30</span>
      </el-form-item>

      <el-form-item label="订单可签到最大距离">
        <el-input v-model.number="dialogForm.num" placeholder=""></el-input>
        <span class="tip">请输入整数，建议值500</span>
      </el-form-item>

      <el-form-item label="续时签退最短时间">
        <el-input v-model.number="dialogForm.num" placeholder=""></el-input>
        <span class="tip">请输入1-60以内的整数，建议值30</span>
      </el-form-item>

      <el-form-item label="转让订单可接收最大时长">
        <el-input v-model.number="dialogForm.num" placeholder=""></el-input>
        <span class="tip">请输入1-100以内的整数，建议值24-48以内</span>
      </el-form-item>

      <el-form-item label="每人每日可预约次数">
        <el-input-number v-model="dialogForm.num" :min="1" :max="10" label="每人每日可预约次数"></el-input-number>
      </el-form-item>

      <el-form-item label="周期内每人可预约次数">
        <el-input-number v-model="dialogForm.num" :min="1" :max="10" label="周期内每人可预约次数"></el-input-number>
      </el-form-item>

      <h4>场次预约设置</h4>

      <el-form-item label="周期内每人可预约次数">
        <el-input-number v-model="dialogForm.num" :min="1" :max="10" label="周期内每人可预约次数"></el-input-number>
      </el-form-item>

      <h4>时长预约设置</h4>

      <el-form-item label="单次可预约最大时长">
        <el-input v-model.number="dialogForm.num" placeholder=""></el-input>
        <span class="tip">请输入1-100以内的整数，建议以图书馆每日营业时长为准</span>
      </el-form-item>

      <el-form-item label="单次可预约最小时长">
        <el-input v-model.number="dialogForm.num" placeholder=""></el-input>
        <span class="tip">请输入1-100以内的整数，建议以图书馆每日营业时长为准</span>
      </el-form-item>
      <el-form-item label="预约时间间隔">
        <el-select v-model.number="dialogForm.num">
          <el-option label="0.5" value="1"></el-option>
          <el-option label="1" value="2"></el-option>
          <el-option label="1.5" value="3"></el-option>
        </el-select>
      </el-form-item>

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
          dialogForm:{
            num:"",
            time:""
          },
          rules:{},

          checked:[],
        };
      },
      methods:{
        sure(){

        }
      }

    }
</script>

<style lang="scss"  scoped>
  h3,h4{
    margin: 0;
    margin-bottom: 20px;
  }
  .tip{
    font-size: 12px;color: #999;
  }
  .unified-form{
    .form-item-100{
      width: 100%;
      /deep/ .el-form-item__content{
        width: 500px;
      }
    }

    .el-form-item__content{
      width: 300px;
    }
  }
</style>
