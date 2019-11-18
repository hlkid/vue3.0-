<template>
  <section class="view-container">
    <el-form class="search-form" ref="searchForm" :model="searchForm" :inline="true" size="small"
             @submit.native.prevent>

      <el-form-item prop="name">
        <el-input v-model.trim="searchForm.name" clearable placeholder="应用名称"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="querySearchForm"><i class="fa-fw fa fa-search"></i>查询</el-button>
        <el-button @click="resetSearchForm"><i class="fa-fw fa fa-repeat"></i>重置</el-button>
      </el-form-item>
    </el-form>
    <section class="list-wraper">
      <el-row class="table-wraper">
        <template>
          <el-table
            ref="multipleTable"
            :data="tableData"
            stripe border
            style="width: 100%">
            <el-table-column
              type="index"
              label="编号"
              width="50">
            </el-table-column>
            <el-table-column
              prop="name"
              label="应用名称">
            </el-table-column>
            <el-table-column
              prop="orgTypeName"
              label="应用类型">
            </el-table-column>
            <el-table-column label="操作" width="200">
              <template slot-scope="scope">
                <el-button size="mini" type="success" v-if="hasButton('integral_apply-rule')" @click="handleRule(scope.row)"><i
                  class="fa fa-ravelry fa-fw"></i>积分规则
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
  import { hbApplicationDataPage } from '@/api/config'

  export default {
    components:{ PageTemp },
    data () {
      return {
        searchForm: {
          pageNum: 1,
          pageSize: 10,
          name:''
        },
        tableData: [],
        total:0,
      }
    },
    created() {
      this.hbApplicationDataPage();
    },
    methods:{
      //搜索
      querySearchForm(){
        this.searchForm.pageNum = 1;
        this.hbApplicationDataPage();
      },
      resetSearchForm() {
        this.searchForm.pageNum = 1;
        this.$refs['searchForm'] && this.$refs['searchForm'].resetFields();
        this.hbApplicationDataPage();

      },
      //分页
      goSpecifiedPage(val) {
        this.searchForm.pageNum = val;
        this.hbApplicationDataPage();
      },
      //积分规则
      handleRule(row){
        this.$router.push({
          name:'integral_rule',
          params:{id:row.appId}
        })
      },
      //接口
      //应用列表
      hbApplicationDataPage() {
        let that = this;
        hbApplicationDataPage(this.searchForm).then( res => {
          if (res.code == 200) {
            that.tableData = res.data.result;
            that.total = res.data.total;
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
</style>
