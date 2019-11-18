<template>
  <section class="view-container">
    <el-form class="search-form" ref="searchForm" :model="searchForm" :inline="true" size="small"
             @submit.native.prevent>

      <el-form-item prop="termCode">
<!--        <el-input v-model.trim="searchForm.name" clearable placeholder="栏目名称"></el-input>-->
        <el-select v-model="searchForm.termCode" placeholder="栏目名称">
          <el-option v-for="item in termOption" :key="item.key" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item prop="integralType">
        <el-select v-model="searchForm.integralType" placeholder="积分类型">
          <el-option :label="item.label" :value="item.value" :key="item.key" v-for="item in typeOptions"></el-option>
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
              type="index"
              label="序号"
              width="50">
            </el-table-column>
            <el-table-column
              prop="termName"
              label="栏目名称">
            </el-table-column>
            <el-table-column
              prop="integralTypeName"
              label="积分类型">
            </el-table-column>
            <el-table-column
              prop="singlePoint"
              label="单次积分">
            </el-table-column>
            <el-table-column
              prop="upperLimit"
              label="单日上限">
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
  import { getConfigPage,getIntegralTypeList,getIntegralTermList } from '@/api/clib/integral'

  export default {
    components:{ PageTemp },
    data () {
      return {
        searchForm: {
          pageNum: 1,
          pageSize: 10,
          hbAppId:'',
          termCode:'',
          integralType:''
        },
        tableData: [],
        total:0,

        typeOptions: [],//积分类型
        termOption:[], //积分项列表
      }
    },
    created() {
      this.searchForm.hbAppId = this.$route.params.id;
      this.getConfigPage();
      this.getIntegralTypeList();
      this.getIntegralTermList();
    },
    methods:{
      querySearchForm(){
        this.searchForm.pageNum = 1;
        this.getConfigPage();
      },
      //重置
      resetSearchForm(){
        this.$refs['searchForm'] && this.$refs['searchForm'].resetFields();
        this.searchForm.pageNum = 1;
        this.getConfigPage();
      },
      goSpecifiedPage(val) {
        this.searchForm.pageNum = val;
        this.getConfigPage();
      },
      getConfigPage(){
        getConfigPage(this.searchForm).then(res => {
            if(res.code == 200) {
              this.tableData = res.data.result;
              this.total = res.data.totalPages;
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
