<template>
  <section class="view-container">
    <el-form class="hbsx-form" inline ref="dialogForm" :model="dialogForm" label-width="120px" :rules="rules"
             size="small">
      <el-form-item label="空间类型" prop="spaceType">
        <el-select v-model="dialogForm.spaceType" placeholder="请选择空间类型">
          <el-option
            v-for="item in spaceType"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="费用类型" prop="applyType">
        <el-select  v-model="dialogForm.applyType"  placeholder="请选择费用类型">
          <el-option
            v-for="item in feeTypeList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="预约类型" prop="applyWay">
        <el-select v-model="dialogForm.applyWay"  placeholder="请选择预约类型">
          <el-option
            v-for="item in bookWayList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>

      <div class="btns-waper">
        <el-button @click="$router.go(-1)">取 消</el-button>
        <el-button type="primary" @click="sure">提 交</el-button>
      </div>
    </el-form>
  </section>
</template>

<script>
  import { getDicListByTypeCode } from "@/api/config";
  import { getSpaceDetail,setUpSpace } from "@/api/clib/space";
  export default {
        data () {
          return {
            dialogForm:{
              id:'',
              spaceType:'',
              applyType:'',
              applyWay:'',
            },
            rules:{
              applyType:{required:true,message:'请选择费用类型'},
              applyWay:{required:true,message:'请选择费用类型'}
            },

            spaceType:[],//空间类型
            feeTypeList:[],//费用类型
            bookWayList:[],//预约方式
          }
        },
      methods:{
          //确认
        sure(){
          let that = this;
          this.$refs['dialogForm'].validate(validator=>{
            if (validator) {
              setUpSpace(that.dialogForm).then(res=>{
                if (res.code == 200) {
                  that.$message.success("修改成功");
                  that.$router.back();
                }
              });
            }
          })

        },

        getSpaceDetail(id){
          let that = this;
          getSpaceDetail(id).then(res=>{
            if(res.code == 200){
              for (let key in that.dialogForm) {
                that.dialogForm[key] = res.data[key]
              }
              console.log(that.dialogForm)
            }
          })
        },

        //数据词典
        getDicListByTypeCode(code, arr) {
          getDicListByTypeCode(code).then(res => {
            if (res.code == 200) {
              res.data.forEach(item => {
                arr.push({
                  key: item.valueName + item.value,
                  value: item.value,
                  label: item.valueName
                })
              })
            }
          })
        },
      },
      created () {
        if(this.$route.params.id){
          this.dialogForm.id = this.$route.params.id;
          this.getSpaceDetail(this.$route.params.id)
        }
        this.getDicListByTypeCode(this.$dicts.spaceType,this.spaceType); // 空间类型
        this.getDicListByTypeCode(this.$dicts.feeType,this.feeTypeList);//费用类型
        this.getDicListByTypeCode(this.$dicts.bookWay,this.bookWayList);//预约方式
      }
    }
</script>

<style scoped>

</style>
