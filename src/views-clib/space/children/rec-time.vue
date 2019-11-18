<template>
  <section class="view-container">
    <section class="tip-top">
      <p class="tip-title">空间信息</p>
      <div class="tip-box">
        <p>空间名称：{{detail.spaceName}}</p>
        <p>场馆名称：{{detail.venueName}}</p>
      </div>
    </section>

    <el-form class="search-form" ref="searchForm" :model="searchForm" :inline="true" size="small"
             @submit.native.prevent>

      <el-form-item prop="hbAppId" >
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="querySearchForm"><i class="fa-fw fa fa-search"></i>查询</el-button>
        <el-button @click="resetSearchForm"><i class="fa-fw fa fa-repeat"></i>重置</el-button>
      </el-form-item>
    </el-form>
    <section class="list-wraper">
      <el-row class="btn-wraper">
        <el-button size="small" type="primary"><i
          class="fa-fw fa fa-plus"></i>新增推荐时段
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
              prop="name"
              label="时段名称">
            </el-table-column>
            <el-table-column
              label="推荐时段">
              <template slot-scope="scope">
                {{scope.row.startTime}}~{{scope.row.endTime}}
              </template>
            </el-table-column>
            <el-table-column
              prop="isValidName"
              label="启用状态">
              <template slot-scope="scope">
                <el-link :underline="false" type="success" v-if="scope.row.isValid == 1">{{scope.row.isValidName}}</el-link>
                <el-link :underline="false" type="danger" v-else>{{scope.row.isValidName}}</el-link>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="200">
              <template slot-scope="scope">
<!--                <el-button size="mini" type="primary" v-if="hasButton('integral_apply_edit')" @click="handleEdit(scope.row)"><i-->
<!--                  class="fa fa-bookmark fa-fw"></i>编辑-->
<!--                </el-button>-->

<!--                <el-button size="mini" type="primary" v-if="hasButton('integral_apply_unty')" @click="handleUnty(scope.row)"><i-->
<!--                  class="fa fa-bookmark fa-fw"></i>解绑-->
<!--                </el-button>-->

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
  import {
    getDataSeatDetail,getRecommendTimeData
  } from '@/api/clib/space'
  import PageTemp from '@/components/PageTemp'

  export default {
    components:{PageTemp},
    data() {
      return {
        id:"",
        detail:{},

        searchForm: {
          pageNum:1,//	当前页数	是	[int]
          pageSize:10,//	页数据量	是	[int]
          name:'',//	时段名称		[string]
          isValid:'',//	启用状态
        },
        rules: {},

        tableData:[],
        total:0,

        checked: [],
      };
    },
    created(){
      this.id = this.$route.params.id
      this.getDataSeatDetail();
      this.getRecommendTimeData();
    },
    methods: {
      //查询
      querySearchForm() {
        this.searchForm.pageNum = 1;
        this.getRecommendTimeData();
      },
      //重置
      resetSearchForm(){

      },
      //分页
      goSpecifiedPage(val){
        this.searchForm.pageNum = val;
        this.getRecommendTimeData();
      },

      /*----*/
      //获取空间设置详情
      getDataSeatDetail(){
        getDataSeatDetail(this.id).then(res => {
          if(res.code == 200) {
            this.detail = res.data;
          }
        })
      },
      //空间推荐时段分页查询
      getRecommendTimeData(){
        getRecommendTimeData(this.searchForm).then(res => {
          if(res.code == 200) {
            this.tableData = res.data && res.data.result ? res.data.result : [];
            this.total = res.data.totalPages;
          }
        })
      },
    }

  }
</script>

<style lang="scss" scoped>
  h3, h4 {
    margin: 0;
    margin-bottom: 20px;
  }

  .tip {
    font-size: 12px;
    color: #999;
  }

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

  .unified-form {
    .venue-info {
      padding: 10px 20px;
      background: #f1f1f1;
      margin-bottom: 20px;

      p {
        line-height: 30px;
      }
    }

    .recommend-list {
      display: block;
      margin-bottom: 20px;
      margin-left: 20px;
    }

    .form-item-100 {
      width: 100%;

      /deep/ .el-form-item__content {
        width: 500px;
      }
    }

    .el-form-item__content {
      width: 300px;
    }
  }

</style>
