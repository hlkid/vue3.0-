<template>
  <el-dialog title="绑定应用" :visible.sync="_show" width="500px" :close-on-click-modal="false" :append-to-body='true' @open="open">
    <el-form class="dialog-form" ref="dataForm" :model="dataForm" label-width="100px" :rules="formRules">
      <el-form-item label="应用" prop="hbAppIds">
        <el-select v-model="dataForm.hbAppIds" multiple placeholder="应用">
          <el-option :label="item.name" :value="item.appId" v-for="item in hbAppList"
                     :key="item.id">
            <!--<span style="float: left">{{ item.userAccount }}</span>
            <span style="float: right; color: #8492a6; font-size: 12px;">{{item.userRealName}}</span>-->
          </el-option>
        </el-select>
      </el-form-item>

    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="_show = false">取 消</el-button>
      <el-button type="primary" :disabled="vloading" @click="sure">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import { hbApplicationData, groupAppByGroupId, groupAppCreate } from '@/api/config.js'
  export default {
    data() {
      return {
        hbAppList: [],
        // 审核
        dataForm: {
          idSysGroup: '',
          hbAppIds: []
        },
        formRules:{
          hbAppIds: [{required: true, message: '请选择应用'}],
        }
      }
    },
    props: {
      show: {
        type: Boolean,
        default: false
      },
      idSysGroup: {
        type: String,
        default: ''
      }
    },
    /*watch:{
      idSysGroup(n,o){
        debugger
        console.log(n,o)
        this.dataForm.idSysGroup = n;
        this.groupAppByGroupId(n)
      }
    },*/
    computed: {
      _show: {
        get: function () {
          if (this.show){
            this.dataForm.idSysGroup = this.idSysGroup;
            this.groupAppByGroupId(this.idSysGroup)
          }
          return this.show
        },
        set: function (newVal) {
          this.$emit('update:show', newVal)
        }
      }
    },
    methods: {
      // 所有运营总分馆馆方账户
      hbApplicationData(){
        hbApplicationData().then(res=>{
          if (res.code == 200){
            this.hbAppList = res.data;
          };
        })
      },
      // 已绑定的所有运营总分馆馆方账户
      groupAppByGroupId(idSysGroup){
        groupAppByGroupId(idSysGroup).then(res=>{
          if (res.code == 200){
            this.dataForm.hbAppIds = res.data.length ? res.data.map(i=>{
              return i.appId
            }) : []
          };
        })
      },
      open(){
        this.$nextTick(()=>{
          this.$refs['dataForm'].resetFields();
          setTimeout(()=>{
            this.$refs['dataForm'].clearValidate
          })
        })
      },
      sure(){
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            groupAppCreate(this.dataForm).then(res=>{
              if (res.code == 200){
                this._show = false;
                this.$message.success('绑定应用成功')
              }
            })
          }
        })
      }
    },
    created() {
      this.hbApplicationData()
    }
  }
</script>

<style lang="scss" scoped>

</style>
