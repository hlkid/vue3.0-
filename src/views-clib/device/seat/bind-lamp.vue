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

    <el-form class="search-form" ref="searchForm" :model="searchForm" :inline="true" size="small"
             @submit.native.prevent>

      <el-form-item prop="code">
        <el-input v-model="searchForm.code" placeholder="智能灯id"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="querySearchForm"><i class="fa-fw fa fa-search"></i>查询</el-button>
        <el-button @click="resetSearchForm"><i class="fa-fw fa fa-repeat"></i>重置</el-button>
      </el-form-item>

    </el-form>

    <section class="list-wraper">
      <el-row class="btn-wraper">
        <el-button size="small" type="primary" @click="handleClear"><i class="fa-fw fa fa-plus"></i>清空智能灯
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
              prop="code"
              label="智能灯ID">
            </el-table-column>

            <el-table-column
              prop="name"
              label="智能灯名称">
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
              prop="bindStatusName"
              label="绑定状态">
            </el-table-column>

            <el-table-column label="操作" width="200">
              <template slot-scope="scope">
                <el-button size="mini" type="danger" @click="hanldDelete(scope.row)"><i
                  class="fa fa-trash-o fa-fw"></i>解绑
                </el-button>
              </template>
            </el-table-column>
          </el-table>

          <PageTemp :total="total" :pageSize="searchForm.pageSize" :currentPage="searchForm.pageNum"
                    @goSpecifiedPage="goSpecifiedPage"/>
        </template>
      </el-row>
    </section>
  </section>
</template>

<script>
  import PageTemp from '@/components/PageTemp'
  import {
    getInfoDevice,
    getPageByDevice,setEmptyLamp,setUnBindDeviceLamp
  } from '@/api/clib/device'
  export default {
    components:{ PageTemp },
    data () {
      return {
        id:'',
        detail:{},

        searchForm:{
          code:'',
          pageNum:1,
          pageSize:10,
          idDevice:''
        },

        tableData:[],
        total:0,

      }
    },
    created () {
      this.id = this.$route.params.id;
      this.searchForm.idDevice = this.$route.params.id;
      this.getInfoDevice();
      this.getPageByDevice();
    },
    methods: {
      //分页
      goSpecifiedPage(val){
        this.searchForm.pageNum = val;
        this.getPageByDevice();
      },
      //解绑
      hanldDelete(row){
        this.commonDeleteDialog(this.setUnBindDeviceLamp,row,'解绑')
      },
      // 清空智能灯
      handleClear() {
        this.commonDeleteDialog(this.setEmptyLamp,{},' 清空所有智能灯')
      },
      //搜索
      querySearchForm(){
        this.searchForm.pageNum = 1;
        this.getPageByDevice();
      },
      //重置
      resetSearchForm(){
        this.$refs['searchForm'] && this.$refs['searchForm'].resetFields();
        this.searchForm.pageNum = 1;
        this.getPageByDevice();
      },

      /*接口*/
      //清空所有
      setEmptyLamp(){
        setEmptyLamp(this.id).then(res => {
          if(res.code == 200) {
            this.$message.success("清空成功");
            this.getPageByDevice();
          }
        })
      },

      //清空卡
      setUnBindDeviceLamp(row){
        let that = this;
        setUnBindDeviceLamp(row.id).then(res => {
          if(res.code == 200) {
            that.$message.success("解绑成功");
            that.getPageByDevice();
          }
        })
      },

      //详情
      getInfoDevice(){
        getInfoDevice(this.id).then(res => {
          if(res.code == 200) {
            this.detail = res.data;
          }
        })
      },
      // 座位设备绑定智能灯列表（根据设备查询智能灯分页列表）
      getPageByDevice(){
        getPageByDevice(this.searchForm).then(res => {
          if(res.code == 200) {
            this.tableData = res.data && res.data.result ? res.data.result : [];
            this.total = res.data.totalPages;
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
