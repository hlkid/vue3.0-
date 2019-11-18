<template>
  <el-dialog title="绑定应用" :visible.sync="_show" width="500px" :close-on-click-modal="false" :append-to-body='true' @open="open">
    <el-form class="dialog-form" ref="dialogForm" :model="dialogForm" label-width="100px" :rules="dialogRules">
      <el-form-item label="应用名称" prop="hbAppIds">
        <el-select v-model="dialogForm.hbAppIds" multiple>
          <el-option :label="item.name" :value="item.appId" v-for="item in appList"
                     :key="item.appId"></el-option>
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
  import {fileDetail, uploadFileUrl, getfiles} from '@/api/file.js'
  import {roleApplicationList, roleBindApplication, userApplicationList, userBindApplication, hbApplicationData} from '@/api/config.js'
  import download from 'ly-downloader'

  export default {
    data() {
      return {
        dialogForm:{
          id: '',
          hbAppIds: []
        },
        dialogRules:{
          hbAppIds: [{required: true, message: '请选择应用'}],
        },
        appList: []
      }
    },
    props: {
      type:{
        type: String,
        default: ''
      },
      show: {
        type: Boolean,
        default: false
      },
      id: {
        type: String,
        default: ''
      },
    },
    computed: {
      _show: {
        get: function () {
          return this.show
        },
        set: function (newVal) {
          this.$emit('update:show', newVal)
        }
      },
    },
    watch:{
      id(n,o){
        this.dialogForm.id = n;
        this.type == 'role' && this.roleApplicationList()
        this.type == 'user' && this.userApplicationList()
      }
    },
    methods: {
      hbApplicationData(){
        hbApplicationData().then(res=>{
          this.appList = res.data;
        })
      },
      // 角色
      roleApplicationList(){
        this.dialogForm.hbAppIds = []
        roleApplicationList(this.dialogForm.id).then(res=>{
          res.data.forEach(i=>{
            this.dialogForm.hbAppIds.push(i.appId)
          })
        })
      },
      roleBindApplication(){
        roleBindApplication(this.dialogForm).then(res=>{
          this._show = false
          this.$message.success('绑定成功')
        })
      },
      // 用户
      userApplicationList(){
        this.dialogForm.hbAppIds = []
        userApplicationList(this.dialogForm.id).then(res=>{
          res.data.forEach(i=>{
            this.dialogForm.hbAppIds.push(i.appId)
          })
        })
      },
      userBindApplication(){
        userBindApplication(this.dialogForm).then(res=>{
          this._show = false
          this.$message.success('绑定成功')
        })
      },
      open(){
        this.$nextTick(()=>{
          this.$refs['dialogForm'].clearValidate()
        })
      },
      sure(){
        this.$refs['dialogForm'].validate((valid) => {
          if (valid) {
            this.type == 'role' && this.roleBindApplication()
            this.type == 'user' && this.userBindApplication()
          }
        })
      }
    },
    created () {
      this.hbApplicationData()
    }

  }
</script>

<style lang="scss" scoped>
  .download{
    color: #0079fe;
    cursor: pointer;
  }

</style>
