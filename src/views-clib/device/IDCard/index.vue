<template>
  <section class="view-container">
    <el-form class="search-form" ref="searchForm" :model="searchForm" :inline="true" size="small"
             @submit.native.prevent>

      <el-form-item prop="cardNo">
        <el-input v-model="searchForm.cardNo" placeholder="ID卡号"></el-input>
      </el-form-item>

      <el-form-item prop="idVenue">
        <el-select v-model="searchForm.idVenue" clearable placeholder="场馆名称">
          <el-option :label="item.label" :value="item.value" v-for="item in venueOption"
                     :key="item.key"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item prop="status">
        <el-select v-model="searchForm.status" clearable placeholder="启用状态">
          <el-option :label="item.label" :value="item.value" v-for="item in statusOption"
                     :key="item.key"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="querySearchForm"><i class="fa-fw fa fa-search"></i>查询</el-button>
        <el-button @click="resetSearchForm"><i class="fa-fw fa fa-repeat"></i>重置</el-button>
      </el-form-item>

    </el-form>

    <section class="list-wraper">
      <el-row class="btn-wraper">
        <el-button size="small" type="primary" v-if="hasButton('device_IDCard_add')" @click="handleAdd"><i class="fa-fw fa fa-plus"></i>新增
        </el-button>

        <el-button size="small" type="primary" v-if="hasButton('device_IDCard_excel')" @click="handleExcel"><i class="fa-fw fa fa-pencil-square-o"></i>导出
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
              width="55">
            </el-table-column>
            <el-table-column
              prop="cardNo"
              label="ID卡号">
            </el-table-column>
            <el-table-column
              prop="venueName"
              label="场馆名称">
            </el-table-column>
            <el-table-column
              prop="hbAppName"
              label="应用名称">
            </el-table-column>
            <el-table-column
              prop="statusName"
              label="ID卡状态">
              <template slot-scope="scope">
                <el-link :underline="false" type="success" v-if="scope.row.status == 0">{{scope.row.statusName}}
                </el-link>
                <el-link :underline="false" type="danger" v-else>{{scope.row.statusName}}</el-link>
              </template>
            </el-table-column>
            <el-table-column
              prop="createTime"
              label="创建时间">
            </el-table-column>
            <el-table-column label="操作" width="300">
              <template slot-scope="scope">

                <el-button size="mini" v-if="hasButton('device_IDCard_status')"  :type="scope.row.status === 1?'primary':'info'" @click="handleEndble(scope.row)"><i
                  class="fa fa-ban fa-fw"></i>{{scope.row.status === 1?'启用':'禁用'}}
                </el-button>

                <el-button size="mini" type="success" v-if="scope.row.status == 0 && hasButton('device_IDCard_auto')" @click="handleAuto(scope.row)"><i
                  class="fa fa-telegram fa-fw"></i>授权
                </el-button>

                <el-button size="mini" type="danger" v-if="scope.row.status == 1 && hasButton('device_IDCard_delete')" @click="handleDelete(scope.row)"><i
                  class="fa fa-trash-o fa-fw"></i>删除
                </el-button>

              </template>
            </el-table-column>
          </el-table>
          <PageTemp :total="total" :pageSize="searchForm.pageSize" :currentPage="searchForm.pageNum"
                    @goSpecifiedPage="goSpecifiedPage"/>
        </template>
      </el-row>
    </section>
    <el-dialog :title="dialogType=='add'?'新增':'修改'" :visible.sync="addDialogShow" width="400px">
      <el-form ref="queryForm" :model="queryForm" class="dialog-from" :rules="rules" size="small" label-position="right" label-width="80px">
        <el-form-item label="场馆" prop="idVenue">
          <el-select v-model="queryForm.idVenue" placeholder="场馆名称" @change="venueChange">
            <el-option v-for="item in venueOption" :key="item.key" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="卡号" prop="cardNo">
          <el-input v-model="queryForm.cardNo" placeholder="卡号"></el-input>
        </el-form-item>

        <el-form-item label="应用" prop="hbAppId">
          <el-select v-model="queryForm.hbAppId" placeholder="应用">
            <el-option v-for="item in hbAppList" :key="item.key" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="备注" prop="remark">
          <el-input v-model="queryForm.remark" placeholder="备注" type="textarea" ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogShow = false">取 消</el-button>
        <el-button type="primary" @click="dialogSure">确 定</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
  import PageTemp from '@/components/PageTemp'
  import { downloading } from '@/utils/common'
  import { getVenueData } from '@/api/mcc/venue.js'
  import { hbApplicationData } from '@/api/config'
  import { isCardNum } from '@/utils/validate'
  import {
    getAccessCardPage,addAccessCard,
    getAccessCardExport,getCardStatusList,
    getAccessCardEnable,disableDeviceAccessCard,
    deleteAccessCard
  } from '@/api/clib/device'

  export default {
    components: { PageTemp },
    data () {
      return {
        dialogType:'add',
        addDialogShow:false,

        queryForm:{
          "cardNo":"",//卡号
          "idVenue":'',//场馆主键ID
          venueName:'',
          "remark":"",//备注
          "hbAppId":""//应用ID
        },
        rules:{
          cardNo:[{required: true, message: '请输入卡号'},{validator:isCardNum}],
          idVenue:[{required: true, message: '请选择场馆'}],
          remark:[{required: true, message: '请输入备注'}],
          hbAppId:[{required: true, message: '请选择应用'}]
        },

        searchForm: {
          pageNum: 1,
          pageSize: 10,
          cardNo: '',    //	卡号	是	[string]		查看
          venueName: '', //	场馆名称	是	[string]		查看
          status: ''    //	状态编码	是	[string]		查看
        },
        tableData: [],
        total: 0,

        venueOption: [],//场馆列表
        statusOption: [],//状态
        hbAppList:[],//应用列表
      }
    },
    created () {
      this.getAccessCardPage()
      this.getVenueData()
      this.hbApplicationData()
      this.getCardStatusList()
    },
    methods: {
      // 重置
      resetSearchForm () {
        this.searchForm.pageNum = 1
        this.$refs.searchForm && this.$refs.searchForm.resetFields()
        this.getAccessCardPage();
      },
      //查询
      querySearchForm () {
        this.searchForm.pageNum = 1
        this.getAccessCardPage();
      },
      //分页
      goSpecifiedPage (val) {
        this.searchForm.pageNum = val
        this.getAccessCardPage();
      },
      //新增
      handleAdd () {
        this.addDialogShow = true;
      },
      //删除
      handleDelete(row){
        this.commonDeleteDialog(this.deleteAccessCard,row.id,"删除")
      },
      handleAuto(row){
        this.$router.push({
          name:'device-IDCard_auto',
          params:{id:row.id}
        })
      },
      //dialog 确定
      dialogSure(){
        this.dialogType == 'add' && this.addAccessCard();
      },

      //启用/禁用
      handleEndble (row) {
        row.status == 1 && this.getAccessCardEnable(row.id);
        row.status == 0 && this.disableDeviceAccessCard(row.id);
      },
      //导出
      handleExcel () {
        const loading = this.$loading({
          lock: true,
          text: '文件生成中',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        let params = JSON.parse(JSON.stringify(this.searchForm));
        delete  params.pageNum;
        delete  params.pageSize;
        getAccessCardExport(params).then(res=>{
          downloading(res)
          setTimeout(() => {
            loading.close();
          }, 2000);
        })
      },

      venueChange(id) {
        let obj = this.venueOption.find(e => e.id == id);
        console.log(obj)
        if(obj){
          this.queryForm.venueName = obj.name;
        }
      },


      /*---接口请求-----*/
      //list
      getAccessCardPage () {
        getAccessCardPage(this.searchForm).then(res => {
          if (res.code == 200) {
            this.tableData = res.data.result
            this.total = res.data.totalPages
          }
        })
      },
      //新增id卡
      addAccessCard () {
        let that = this;
        addAccessCard(this.queryForm).then(res => {
          if (res.code == 200) {
            that.addDialogShow = false;
            that.getAccessCardPage();
          }
        })
      },
      //删除
      deleteAccessCard(id) {
        deleteAccessCard(id).then(res => {
          if(res.code == 200){
            this.$message.success("删除成功")
            this.getAccessCardPage();
          }
        })
      },

      //启用
      getAccessCardEnable(id){
        let that = this;
        getAccessCardEnable(id).then(res => {
          if (res.code == 200) {
            this.$message.success("启用成功")
            that.getAccessCardPage();
          }
        })
      },
      //禁用
      disableDeviceAccessCard(id){
        let that = this;
        disableDeviceAccessCard(id).then(res => {
          if (res.code == 200) {
            this.$message.success("禁用成功")
            that.getAccessCardPage();
          }
        })
      },

      //场馆list
      getVenueData () {
        let that = this
        getVenueData().then(res => {
          that.venueOption = res.data.map(e => {
            e.label = e.name
            e.value = e.id
            e.key = e.name + e.id
            return e
          })
        })
      },
      //应用不分页查询
      hbApplicationData(){
        let that = this;
        hbApplicationData().then(res => {
          that.hbAppList = res.data.map(e => {
            e.label = e.name;
            e.value = e.appId
            e.key = e.id;
            return e;
          })
          console.log(that.hbAppList)
        })
      },
      //获取ID卡使用状态列表
      getCardStatusList(){
        let that = this;
        getCardStatusList().then(res => {
          if (res.code == 200) {
            that.statusOption = res.data.map( e => {
              e.label = e.message;
              e.value = e.code;
              e.key = e.code+e.message;
              return e;
            })
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .dialog-from {
    .el-select {
      width: 100%;
    }
  }


</style>
