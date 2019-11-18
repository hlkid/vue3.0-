<template>
  <section class="view-container">
    <section class="tip-top">
      <p class="tip-title">门禁设备信息</p>
      <div class="tip-box">
        <p>设备MAC地址：{{detail.mac}}</p>
        <p>设备ID：{{detail.deviceId}}</p>
        <p>设备名称：{{detail.name}}</p>
        <p>场馆名称：{{detail.venueName}}</p>
      </div>
    </section>

    <section class="list-wraper">
      <el-row class="btn-wraper">
        <el-button size="small" type="primary"  @click="handleAddReader"><i class="fa-fw fa fa-plus"></i>授权读者证
        </el-button>

        <el-button size="small" type="primary" @click="handleAddIDCard"><i class="fa-fw fa fa-plus"></i>授权ID卡
        </el-button>

        <el-button size="small" type="primary" @click="handleClear"><i class="fa-fw fa fa-plus"></i>清空卡
        </el-button>

      </el-row>
      <el-row class="table-wraper">
        <template>
          <el-table
            ref="multipleTable"
            :data="tableData"
            stripe border
            style="width: 100%">

            <el-table-column
              type="index"
              label="序号"
              width="50">
            </el-table-column>

            <el-table-column
              prop="cardNo"
              label="卡号">
            </el-table-column>

            <el-table-column
              prop="cardTypeName"
              label="卡类型">
            </el-table-column>

            <el-table-column
              prop="hbAppName"
              label="应用名称">
            </el-table-column>

            <el-table-column
              prop="authTypeName"
              label="授权类型">
            </el-table-column>

            <el-table-column
              prop="authStatusName"
              label="卡授权状态">
            </el-table-column>

            <el-table-column label="操作" width="200">
              <template slot-scope="scope">
                <el-button size="mini" type="danger" @click="hanldDelete(scope.row)"><i
                  class="fa fa-trash-o fa-fw"></i>取消授权
                </el-button>
              </template>
            </el-table-column>
          </el-table>

          <PageTemp :total="total" :pageSize="searchForm.pageSize" :currentPage="searchForm.pageNum"
                    @goSpecifiedPage="goSpecifiedPage"/>
        </template>
      </el-row>
    </section>
    <!--授权读者证-->
    <el-dialog title="授权读者证" :visible.sync="readerDialogShow" width="400px">
      <el-form class="dialog-form" ref="readerFrom" :model="readerFrom" label-width="100px" :rules="readerRule">
        <el-form-item label="读者证" prop="cardNo">
          <el-input v-model="readerFrom.cardNo" placeholder="读者证号"></el-input>
        </el-form-item>
        <el-form-item label="授权类型" prop="authType" class="block">
          <el-radio-group v-model="readerFrom.authType">
            <el-radio :label="item.value" v-for="item in authTypeOption" :key="item.key">{{item.label}}</el-radio>
          </el-radio-group>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="readerDialogShow = false" size="small">取 消</el-button>
        <el-button type="primary" :disabled="vloading" @click="readerSure" size="small">确 定</el-button>
      </div>
    </el-dialog>

    <!--授权ID卡-->
    <el-dialog title="授权ID卡" :visible.sync="IdCradDialogShow" width="400px">
      <el-form class="dialog-form" ref="IdCradFrom" :model="IdCradFrom" label-width="100px" :rules="IdCradRule">
        <el-form-item label="ID卡号" prop="cardNo">
          <el-select v-model="IdCradFrom.cardNo">
            <el-option v-for="item in cardList" :key="item.key" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="授权类型" prop="authType" class="block">
          <el-radio-group v-model="IdCradFrom.authType">
            <el-radio :label="item.value" v-for="item in authTypeOption" :key="item.key">{{item.label}}</el-radio>
          </el-radio-group>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="IdCradDialogShow = false" size="small">取 消</el-button>
        <el-button type="primary" :disabled="vloading" @click="IdCradSure" size="small">确 定</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
  import PageTemp from '@/components/PageTemp'
  import { isReaderNum,isCardNum } from '@/utils/validate'
  import {
    getInfoDevice,getPageDeviceAccessCard,
    addDeviceAccessCard,deleteDeviceAccessCard,
    addReaderCardDevice,getDeviceAuthTypeList,
    setEmptyDeviceAccessCard,getAccessCardList
  } from '@/api/clib/device'
  export default {
    components:{ PageTemp },
    data () {
      return {
        id:'',
        detail:{},

        searchForm:{
          pageNum:1,
          pageSize:10,
          idDevice:''
        },

        tableData:[],
        total:0,

        //读者证
        readerDialogShow:false,
        readerFrom:{
          idDevice:"",//设备主键ID
          cardNo:"",//卡号
          authType:""//授权类型（见枚举）
        },
        readerRule:{
          cardNo:[{ required: true, message: '请输入读者证号'},{validator:isReaderNum}],//卡号
          authType:[{ required: true, message: '请选择授权类型'}]//授权类型（见枚举）
        },
        //ID卡
        IdCradDialogShow:false,
        IdCradFrom:{
          idDevice:"",//设备主键ID
          cardNo:"",//卡号
          authType:""//授权类型（见枚举）
        },
        IdCradRule:{
          cardNo:[{ required: true, message: '请输入卡号'},{validator:isCardNum}],//卡号
          authType:[{ required: true, message: '请选择授权类型'}]//授权类型（见枚举）
        },

        authTypeOption:[],//授权类型
        cardList:[],//卡

      }
    },
    created () {
      this.id = this.$route.params.id;
      this.searchForm.idDevice = this.$route.params.id;
      this.readerFrom.idDevice = this.$route.params.id;
      this.IdCradFrom.idDevice = this.$route.params.id;
      this.getInfoDevice();
      this.getPageDeviceAccessCard();
      this.getDeviceAuthTypeList()
    },
    methods: {
      //分页
      goSpecifiedPage(val){
        this.searchForm.pageNum = val;
        this.getPageDeviceAccessCard();
      },
      //取消授权
      hanldDelete(row){
        this.commonDeleteDialog(this.deleteDeviceAccessCard,row,'取消授权')
      },
      //添加读者证
      handleAddReader(){
        this.readerDialogShow = true;
      },
      //添加ID卡
      handleAddIDCard(){
        this.IdCradDialogShow = true;
      },
      //清空卡
      handleClear() {
        this.commonDeleteDialog(this.setEmptyDeviceAccessCard,{},'清空所有卡')
      },

      //授权ID卡
      IdCradSure(){
        let that = this;
        this.$refs.IdCradFrom.validate(valid => {
          if(valid) {
            addDeviceAccessCard(that.IdCradFrom).then(res => {
              if(res.code == 200) {
                that.$message.success("添加成功");
                that.getPageDeviceAccessCard();
                that.IdCradDialogShow = false;
              }
            })
          }
        })
      },
      //授权读者证
      readerSure(){
        let that = this;
        this.$refs.readerFrom.validate(valid => {
          if(valid) {
            addReaderCardDevice(that.readerFrom).then(res => {
              if(res.code == 200) {
                that.$message.success("添加成功");
                that.getPageDeviceAccessCard();
                that.readerDialogShow = false;
              }
            })
          }
        })
      },
    //清空卡
      setEmptyDeviceAccessCard(){
        let that = this;
        setEmptyDeviceAccessCard(this.id).then(res => {
          if(res.code == 200) {
            that.$message.success("清空成功");
            that.getPageDeviceAccessCard();
          }
        })
      },

      /*接口*/
      deleteDeviceAccessCard(row){
        deleteDeviceAccessCard(row.idDevice,row.cardNo).then(res => {
          if(res.code == 200) {
            this.$message.success("取消授权成功");
            this.getPageDeviceAccessCard();
          }
        })
      },

      //详情
      getInfoDevice(){
        getInfoDevice(this.id).then(res => {
          if(res.code == 200) {
            this.detail = res.data;
            res.data.idVenue && this.getAccessCardList(res.data.idVenue);
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
      //设备授权门禁卡列表（通过设备主键查询）
      getPageDeviceAccessCard(){
        getPageDeviceAccessCard(this.searchForm).then(res => {
          if(res.code == 200) {
            this.tableData = res.data && res.data.result ? res.data.result : [];
            this.total = res.data.totalPages;
          }
        })
      },
    //获取授权类型列表
      getDeviceAuthTypeList(){
        getDeviceAuthTypeList().then(res => {
          if( res.code == 200){
              this.authTypeOption = res.data.map(e  => {
                e.label = e.message
                e.value = e.code
                e.key = e.message+e.label
                return e
              })
          }
        })
      },
      //根据场馆主键获取门禁卡列表
      getAccessCardList(idVenue){
        getAccessCardList({idVenue:idVenue}).then(res => {
          if(res.code == 200) {
            this.cardList = res.data.map(e => {
              e.label = e.cardNo
              e.value = e.cardNo
              e.key = e.id
              return e
            })
          }
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
