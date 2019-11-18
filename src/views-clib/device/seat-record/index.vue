<template>
  <section class="view-container">
    <el-form class="search-form" ref="searchForm" :model="searchForm" :inline="true" size="small"
             @submit.native.prevent>

      <el-form-item prop="termCode">
        <el-input v-model="searchForm.termCode" placeholder="姓名"></el-input>
      </el-form-item>

      <el-form-item prop="integralType">
        <el-select v-model="searchForm.integralType" clearable placeholder="场馆名称">
          <!--          <el-option :label="item.label" :value="item.value" v-for="item in typeOptions"
                             :key="item.key"></el-option>-->
        </el-select>
      </el-form-item>

      <el-form-item prop="integralType">
        <el-select v-model="searchForm.integralType" clearable placeholder="开门模式">
          <!--          <el-option :label="item.label" :value="item.value" v-for="item in typeOptions"
                             :key="item.key"></el-option>-->
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="querySearchForm"><i class="fa-fw fa fa-search"></i>查询</el-button>
        <el-button @click="resetSearchForm"><i class="fa-fw fa fa-repeat"></i>重置</el-button>
      </el-form-item>

    </el-form>

    <section class="list-wraper">
      <el-row class="btn-wraper">
        <el-button size="small" type="primary" ><i class="fa-fw fa fa-plus"></i>导出
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
              prop="termCode"
              label="姓名"
              width="120">
            </el-table-column>
            <el-table-column
              prop="name"
              label="空间名称">
            </el-table-column>
            <el-table-column
              prop="integralTypeName"
              label="场馆名称">
            </el-table-column>
            <el-table-column
              prop="integralTypeName"
              label="应用名称">
            </el-table-column>
            <el-table-column
              prop="integralTypeName"
              label="设备序列号">
            </el-table-column>
            <el-table-column
              prop="integralTypeName"
              label="设备名称">
            </el-table-column>
            <el-table-column
              prop="integralTypeName"
              label="操作模式">
            </el-table-column>
            <el-table-column
              prop="integralTypeName"
              label="操作">
            </el-table-column>
            <el-table-column
              prop="integralTypeName"
              label="操作时间">
            </el-table-column>
            <el-table-column
              prop="integralTypeName"
              label="开始供电/停止供电">
            </el-table-column>
            <el-table-column
              prop="integralTypeName"
              label="记录上传时间">
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
    getIntegralTermStatusList,
    getIntegralTypeList,
    getTermConfigPage,addTermConfig,editTermConfig,
    setTermConfigState,getIntegralTermList
  } from '@/api/clib/integral'

  export default {
    components: { PageTemp },
    data () {
      return {
        searchForm: {
          pageNum: 1,
          pageSize: 10,
          termCode:"",//	积分规则编码	是	[string]		查看
          status:"",//	积分状态	是	[string]
          integralType:'',//	积分类型	是	[string]
        },
        tableData: [],
        total: 0,

        currentSelect:{}
      }
    },
    created () {
    },
    methods: {
      // 重置
      resetSearchForm(){
        this.searchForm.pageNum = 1;
        this.$refs.searchForm && this.$refs.searchForm.resetFields();
        // this.getTermConfigPage();
      },
      //查询
      querySearchForm () {
        this.searchForm.pageNum = 1;
        // this.getTermConfigPage();
      },
      //分页
      goSpecifiedPage (val) {
        this.searchForm.pageNum = val;
        // this.getTermConfigPage();
      },
      //新增
      handleAdd () {

      },

      //启用/禁用
      handleEndble(row){
        let that = this;
        setTermConfigState({
          id:row.id,
          status:row.status==1?0:1
        }).then(res => {
          if(res.code == 200){
            that.$message.success("修改成功");
            that.getTermConfigPage();
          }
        })
      },
      termChange(id){
        let obj = this.termOption.find(e => e.value == id);
        if(obj){
          this.queryForm.name = obj.label;
        }
      },

      /*---接口请求-----*/
      //新增积分
      addTermConfig(){
        let that = this;
        addTermConfig(this.queryForm).then(res => {
          if(res.code == 200){
            that.$message.success("新增成功");
            that.searchForm.pageNum = 1;
            that.addDialogShow = false;
            that.getTermConfigPage();
          }
        })
      },

      editTermConfig(){
        let that = this;
        editTermConfig(this.queryForm).then(res => {
          if(res.code == 200){
            that.$message.success("修改成功");
            that.addDialogShow = false;
            that.searchForm.pageNum = 1;
            that.getTermConfigPage();
          }
        })
      },

      //list
      getTermConfigPage() {
        getTermConfigPage(this.searchForm).then(res => {
          if (res.code == 200) {
            this.tableData = res.data.result;
            this.total = res.data.totalPages;
          }

        })
      },
      //  获取积分状态列表
      getIntegralTermStatusList () {
        let that = this;
        getIntegralTermStatusList().then(res => {
          if (res.code == 200) {
            that.statusOptions = res.data.map(e => {
              e.label = e.message;
              e.value = e.code;
              e.key = e.code+e.message;
              return e
            });
          }
        })
      },
      //积分项列表
      getIntegralTermList() {
        let that = this;
        getIntegralTermList().then(res => {
          if(res.code == 200){
            that.termOption = res.data.map(e => {
              e.label = e.message;
              e.value = e.code;
              e.key = e.code + e.message;
              return e;
            })
          }
        })
      },
      //获取积分类型列表
      getIntegralTypeList () {
        let that = this;
        getIntegralTypeList().then(res => {
          if (res.code == 200) {
            that.typeOptions = res.data.map(e => {
              e.label = e.message;
              e.value = e.code;
              e.key = e.code+e.message;
              return e
            });
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .dialog-from{
    .el-select{
      width: 100%;
    }
  }


</style>
