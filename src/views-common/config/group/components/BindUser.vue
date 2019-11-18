<template>
  <el-dialog title="绑定用户" :visible.sync="_show" width="500px" :close-on-click-modal="false" :append-to-body='true' @open="open">
    <el-form class="dialog-form" ref="dataForm" :model="dataForm" label-width="100px" :rules="formRules">
      <el-form-item label="用户" prop="idSysUsers">
        <el-select v-model="dataForm.idSysUsers" multiple placeholder="用户">
          <el-option :label="item.userAccount" :value="item.id" v-for="item in allOperatorList"
                     :key="item.id">
            <span style="float: left">{{ item.userAccount }}</span>
            <span style="float: right; color: #8492a6; font-size: 12px;">{{item.userRealName}}</span>
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
  import { getAttributeUser, groupUserByGroupId, groupUserCreate } from '@/api/config.js'
  export default {
    data() {
      return {
        allOperatorList: [],
        // 审核
        dataForm: {
          idSysGroup: '',
          idSysUsers: []
        },
        formRules:{
          idSysUsers: [{required: true, message: '请选择用户'}],
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
        this.groupUserByGroupId(n)
      }
    },*/
    computed: {
      _show: {
        get: function () {
          if (this.show) {
            this.dataForm.idSysGroup = this.idSysGroup;
            this.groupUserByGroupId(this.idSysGroup)
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
      getAttributeUser(){
        getAttributeUser().then(res=>{
          if (res.code == 200){
            this.allOperatorList = res.data;
          };
        })
      },
      // 已绑定的所有运营总分馆馆方账户
      groupUserByGroupId(idSysGroup){
        groupUserByGroupId(idSysGroup).then(res=>{
          if (res.code == 200){
            this.dataForm.idSysUsers = res.data.length ? res.data.map(i=>{
              return i.id
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
            groupUserCreate(this.dataForm).then(res=>{
              if (res.code == 200){
                this._show = false;
                this.$message.success('绑定用户成功')
              }
            })
          }
        })
      }
    },
    created() {
      this.getAttributeUser()
    }
  }
</script>

<style lang="scss" scoped>

</style>
