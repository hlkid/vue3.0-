<template>
  <section class="view-container">
    <el-form class="search-form" ref="searchForm" :model="searchForm" :inline="true" size="small"
             @submit.native.prevent>

      <el-form-item prop="userName">
        <el-input v-model.trim="searchForm.userName" clearable placeholder="用户名"></el-input>
      </el-form-item>

      <el-form-item prop="termCode">
<!--        <el-input v-model.trim="searchForm.termName" clearable placeholder="积分栏目"></el-input>-->
        <el-select v-model="searchForm.termCode" placeholder="栏目编码">
          <el-option v-for="item in termOption" :key="item.key" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item prop="hbAppId">
        <el-select v-model="searchForm.hbAppId" clearable placeholder="应用名称">
          <el-option v-for="item in hbAppList" :label="item.label" :value="item.value" :key="item.key"></el-option>
        </el-select>
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
              prop="hbAppName"
              label="应用">
            </el-table-column>
            <el-table-column
              prop="userName"
              label="用户名">
            </el-table-column>
            <el-table-column
              prop="termName"
              label="积分栏目">
            </el-table-column>
            <el-table-column
              prop="grade"
              label="积分">
              <template slot-scope="scope">
                <p>{{scope.row.integralType == 1?'+':'-'}}{{scope.row.grade}}</p>
              </template>
            </el-table-column>
            <el-table-column
              prop="describe"
              label="描述">
            </el-table-column>
            <el-table-column
              prop="createTime"
              label="创建时间">
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
  import { hbApplicationData } from '@/api/config'
  import { getRecordPage,getIntegralTermList } from '@/api/clib/integral'
  export default {
    components:{ PageTemp },
    data () {
      return {
        searchForm: {
          pageNum: 1,
          pageSize: 10,
          userName:'',
          termCode:'',
          hbAppId:'',
        },
        tableData: [],
        total:0,
        termOption:[],

        //应用列表
        hbAppList:[],
      }
    },
    created(){
      this.getRecordPage();
      this.hbApplicationData();
      this.getIntegralTermList();
    },
    methods:{
      //分页
      goSpecifiedPage(val) {
        this.searchForm.pageNum = val
        this.getRecordPage();
      },
      //查询
      querySearchForm() {
        this.searchForm.pageNum = 1;
        this.getRecordPage();
      },
      //重置
      resetSearchForm() {
        this.$refs['searchForm'] && this.$refs['searchForm'].resetFields();
        this.searchForm.pageNum = 1;
        this.getRecordPage();
      },

      //接口
      //分页查询用户积分记录
      getRecordPage(){
        getRecordPage(this.searchForm).then(res => {
          if (res.code == 200) {
            this.tableData = res.data.result;
            this.total = res.data.totalPages;
          }
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
    }
  }
</script>

<style lang="scss" scoped>

</style>
