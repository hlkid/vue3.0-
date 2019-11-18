<template>
  <el-dialog title="关联账号" :visible.sync="_show" width="500px" :close-on-click-modal="false" :append-to-body='true' @open="open">
    <el-form class="dialog-form" ref="dataForm" :model="dataForm" label-width="100px" :rules="formRules">
      <el-form-item label="关联账号" prop="idWechatAccount">
        <el-select popper-class="select-accout" v-model="dataForm.wechatAccountIds" multiple placeholder="关联账号" @visible-change="visibleChange" @change="linkAccountChange">
          <el-option :label="item.name" :value="item.id" v-for="item in filterWechatAccountData"
                     :key="item.id">
            <span style="float: left">{{ item.name }}</span>
            <span style="float: right; color: #8492a6; font-size: 12px;">{{item.typeName}}</span>
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
  import {getWechatAccountData, getAccountByIdVenue, venueAccountCreate} from '@/api/mcc/venue.js'
  export default {
    data() {
      return {
        filterWechatAccountData: [],
        wechatAccountData: [],
        // 审核
        dataForm: {
          idVenue: '',
          wechatAccountIds: []
        },
        formRules:{
          wechatAccountIds: [{required: true, message: '请选择关联账号'}],
        }
      }
    },
    props: {
      show: {
        type: Boolean,
        default: false
      },
      idVenue: {
        type: String,
        default: ''
      }
    },
    watch:{
      idVenue(n,o){
        this.dataForm.idVenue = n;
        this.getAccountByIdVenue(n)
        this.getWechatAccountData();
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
      // 下拉执行
      visibleChange(){
        let wechatAccountIds = this.dataForm.wechatAccountIds;
        let arr = []; // 已选择
        let types = [];
        this.filterWechatAccountData.forEach(e=>{
          if(wechatAccountIds.indexOf(e.id) > -1 && types.indexOf(e.type) === -1){
            types.push(e.type)
            arr.push(e)
          }
        });
        // 可选择
        let arr2 =  this.filterWechatAccountData.filter((e,i) =>{
          if(types.indexOf(e.type) === -1){
            return e
          }
        });
        this.filterWechatAccountData = arr.concat(arr2)
      },
      // 选择变化执行
      linkAccountChange(val){
        // console.log(row)
        let types = [];
        let arr = []; // 已选择
        this.filterWechatAccountData.forEach(e=>{
          if(val.indexOf(e.id) > -1 && types.indexOf(e.type) === -1){
            types.push(e.type);
            arr.push(e);
          }
        })
        // 可选择
        let arr2 =  this.filterWechatAccountData.filter((e,i) =>{
          if(types.indexOf(e.type) === -1){
            return e
          }
        });
        this.filterWechatAccountData = arr.concat(arr2)

      },
      /**
       * 微信关联账号的list
       */
      getWechatAccountData(){
        getWechatAccountData().then(res=>{
          if(res.code == 200){
            this.wechatAccountData = res.data.length ? res.data : [];
            this.filterWechatAccountData = res.data.length ? res.data : [];
          }
        })
      },
      // 场馆键查询已绑定的关系
      getAccountByIdVenue(id){
        getAccountByIdVenue(id).then(res=>{
          if (res.code == 200){
            this.dataForm.wechatAccountIds = res.data.length ? res.data.map(i=>{
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
            venueAccountCreate(this.dataForm).then(res=>{
              if (res.code == 200){
                this._show = false;
                this.$message.success('关联账号成功')
              }
            })
          }
        })
      }
    },
    created() {
    }
  }
</script>

<style lang="scss" scoped>

</style>
