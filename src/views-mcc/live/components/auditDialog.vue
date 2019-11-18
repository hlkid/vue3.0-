<template>
  <el-dialog title="审核" :visible.sync="_show" width="500px" :close-on-click-modal="false" :append-to-body='true' @open="open">
    <el-form class="dialog-form" ref="dialogAuditForm" :model="dialogAuditForm" label-width="100px" :rules="dialogAuditRules">
      <el-form-item label="是否通过" prop="status">
        <el-radio-group v-model="dialogAuditForm.status">
          <el-radio :label=1>通过</el-radio>
          <el-radio :label=2>不通过</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="审核原因" prop="reason" v-if="dialogAuditForm.status == 2">
        <el-input v-model="dialogAuditForm.reason" placeholder="审核原因"></el-input>
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
  import download from 'ly-downloader'

  export default {
    data() {
      return {
        // 审核
        dialogAuditForm: {
          idSource: '',
          status: 1,
          reason: ''
        },
        dialogAuditRules:{
          status: [{required: true, message: '请选择审核状态'}],
          reason: [{required: true, message: '请输入审核原因'}],
        }
      }
    },
    props: {
      show: {
        type: Boolean,
        default: false
      },
      id: {
        type: String,
        default: ""
      }
    },
    computed: {
      _show: {
        get: function () {
          return this.show
        },
        set: function (newVal) {
          this.$emit('update:show', newVal)
        }
      }
    },
    methods: {
      open(){
        this.$nextTick(()=>{
          this.$refs['dialogAuditForm'].resetFields();
          setTimeout(()=>{
            this.$refs['dialogAuditForm'].clearValidate
          })
        })
      },
      sure(){
        this.$refs['dialogAuditForm'].validate((valid) => {
          if (valid) {
            this.dialogAuditForm.idSource = this.id;
            if (this.dialogAuditForm.status == 1 && !this.dialogAuditForm.reason){
              this.dialogAuditForm.reason = '通过'
            }
            this.$emit('sure', this.dialogAuditForm)
          }
        })
      }
    },

  }
</script>

<style lang="scss" scoped>
  .download{
    color: #0079fe;
    cursor: pointer;
  }

</style>
