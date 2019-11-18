<template>
  <section class="view-container">
    <el-form class="search-form" ref="searchForm" :rules="rules" :model="searchForm" :inline="true" size="small" @submit.native.prevent>

      <el-form-item prop="status">
        <el-select v-model="searchForm.status" clearable placeholder="付款状态">
          <el-option :label="item.label" :value="item.value" v-for="item in orderStatus" :key="item.key"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="userName">
        <el-input v-model="searchForm.userName" placeholder="用户名"></el-input>
      </el-form-item>

      <el-form-item prop="phone">
        <el-input v-model="searchForm.phone" placeholder="手机号"></el-input>
      </el-form-item>

      <el-form-item prop="signStatus">
        <el-date-picker
          @change="onTimeChange"
          v-model="times"
          type="daterange"
          value-format="yyyy-MM-dd"
          range-separator="~"
          start-placeholder="开始时间"
          end-placeholder="结束时间">
        </el-date-picker>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="querySearchForm"><i class="fa-fw fa fa-search"></i>查询</el-button>
        <el-button @click="resetSearchForm"><i class="fa-fw fa fa-repeat"></i>重置</el-button>
      </el-form-item>
    </el-form>
    <section class="list-wraper">
      <el-row class="btn-wraper">
        <el-button size="small" type="primary" @click="handleExport" v-if="hasButton('payment-export')"><i class="fa-fw fa fa-plus"></i>导出</el-button>
      </el-row>
      <el-row class="table-wraper">
        <template>
          <el-table
            ref="multipleTable"
            :data="tableData"
            row-key="id"
            style="width: 100%;" stripe border>
            <el-table-column
              prop="orderNum"
              label="订单号">
            </el-table-column>
            <el-table-column
              prop="venueName"
              label="场馆名">
            </el-table-column>
            <el-table-column
              prop="sourceName"
              label="活动名">
            </el-table-column>
            <el-table-column
              prop="userName"
              label="用户名称">
            </el-table-column>
            <el-table-column
              prop="phone"
              label="手机号">
            </el-table-column>
            <el-table-column
              prop="amount"
              label="报名费用（元）">
            </el-table-column>
            <el-table-column
              prop="createTime"
              label="报名时间">
            </el-table-column>
            <el-table-column
              label="订单状态">
              <template slot-scope="scope">
                <el-link :underline="false" type="success" v-if="scope.row.status == 0">{{scope.row.statusName}}</el-link>
                <el-link :underline="false" type="danger" v-else>{{scope.row.statusName}}</el-link>
              </template>
            </el-table-column>
          </el-table>
          <PageTemp :total="total" :pageSize="searchForm.pageSize" :currentPage="searchForm.pageNum" @goSpecifiedPage="goSpecifiedPage" />
        </template>
      </el-row>
    </section>

  </section>
</template>

<script>
  import {getByAttributeDataPage,getOrderStatusEnum ,getOrderExpor} from "@/api/mcc/order";
  import { applicationDictionaryDataByTypeCode } from '@/api/config.js'
  import { fileDetail ,uploadFileUrl, getfiles} from '@/api/file.js'
  import PageTemp from '@/components/PageTemp'
  import { downloading } from "@/utils/common";
  import { checkMobile } from "@/utils/validate";
  export default {
    data(){
      return{
        uploadFileUrl:uploadFileUrl,
        //对话框
        dialogShow:false,
        dialogType:'add',//点击操作按钮改变
        typeBannerList:[],
        orderStatus:[],//付款状态枚举
          times:'',//时间区间
        //预约管理列表 的检索条件
        searchForm:{
          pageNum:1,
          pageSize:10,
          status:'',
          userName:'',
          phone:'',
          startTime:'',
          endTime:''
        },
        rules:{
          phone:[{required: false, message: '请输入正确的手机号'},{ validator:checkMobile}]
        },
        tableData:[],
        total:0,
      }
    },
    components:{PageTemp},
    methods:{
      //导出
      handleExport(){
        const loading = this.$loading({
          lock: true,
          text: '文件生成中',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        let params = JSON.parse(JSON.stringify(this.searchForm));
        delete  params.pageNum;
        delete  params.pageSize;
        getOrderExpor(params).then(res=>{
          downloading(res)
          setTimeout(() => {
            loading.close();
          }, 2000);
        })
      },

      //查询
      querySearchForm(){
        this.getByAttributeDataPage()
      },
      //重置
      resetSearchForm(){
        this.searchForm.pageNum = 1;
        this.searchForm.startTime = '';
        this.searchForm.endTime = '';
        this.times = "";
        this.resetForm('searchForm');
        this.getByAttributeDataPage();
      },
      resetForm(formName) {

        this.$refs[formName] && this.$refs[formName].resetFields();
      },

      //分页
      goSpecifiedPage(val){
        this.searchForm.pageNum = val;
        this.getByAttributeDataPage()
      },

      //获取预约管理列表
      getByAttributeDataPage(){
        getByAttributeDataPage(this.searchForm).then(res=>{
          if (res.code == 200){
            this.tableData = res.data.result;
            this.total = res.data.totalPages;
          };
        })
      },
      //数据词典
      applicationDictionaryDataByTypeCode(code,arr){
        applicationDictionaryDataByTypeCode(code).then(res=>{
          if (res.code == 200){
            res.data.forEach(item=>{
              arr.push({
                key:item.valueName+item.value,
                value:item.value,
                label:item.valueName
              })
            })
          };
        })
      },
      /**
       * 签到状态枚举
       */
      getOrderStatusEnum(){
        getOrderStatusEnum().then(res=>{
            if(res.code == 200){
            this.orderStatus = res.data.map(e=>{
                e.key = 'order'+e.code;
                e.label = e.message;
                e.value = e.code;
                return e
              })
            }
        })
      },
      //时间区间
      onTimeChange(val){
        if(val.length){
          this.searchForm.startTime = val[0] + ' 00:00:00'
          this.searchForm.endTime = val[1] + ' 00:00:00'
        }
      }

    },
    created() {
      //列表
      this.getByAttributeDataPage();

      this.getOrderStatusEnum();
    }
  };
</script>


<style lang="scss" scoped>

</style>
