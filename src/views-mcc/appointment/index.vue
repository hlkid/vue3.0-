<template>
  <section class="view-container">
    <el-form class="search-form" ref="searchForm" :model="searchForm" :inline="true" size="small" @submit.native.prevent>
      <el-form-item prop="userName">
        <el-input v-model="searchForm.userName" placeholder="用户名" clearable></el-input>
      </el-form-item>

      <el-form-item prop="phone">
        <el-input v-model="searchForm.phone" placeholder="手机号" clearable></el-input>
      </el-form-item>

      <el-form-item prop="signStatus">
        <el-select v-model="searchForm.signStatus" clearable placeholder="签到状态">
          <el-option :label="item.label" :value="item.value" v-for="item in statusList" :key="item.key"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item prop="signStatus">
        <el-select v-model="searchForm.status" clearable placeholder="报名状态">
          <el-option :label="item.label" :value="item.value" v-for="item in appointmentStatusList" :key="item.key"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="querySearchForm"><i class="fa-fw fa fa-search"></i>查询</el-button>
        <el-button @click="resetSearchForm"><i class="fa-fw fa fa-repeat"></i>重置</el-button>
      </el-form-item>
    </el-form>
    <section class="list-wraper">
      <el-row class="btn-wraper">
        <el-button size="small" type="primary" @click="handleExport" v-if="hasButton('appointment-export')"><i class="fa-fw fa fa-plus"></i>导出</el-button>
      </el-row>
      <el-row class="table-wraper">
        <template>
          <el-table
            ref="multipleTable"
            :data="tableData"
            row-key="id"
            style="width: 100%;" stripe border>
            <el-table-column
              prop="activityName"
              label="活动名">
            </el-table-column>
            <el-table-column
              prop="userName"
              label="用户名称">
            </el-table-column>

            <el-table-column
              prop="orderNum"
              label="订单号">
            </el-table-column>

            <el-table-column
              prop="phone"
              label="手机号">
            </el-table-column>

<!--            <el-table-column-->
<!--              prop="venueName"-->
<!--              label="场馆名">-->
<!--            </el-table-column>-->
            <el-table-column
              prop="amount"
              label="报名费用（元）">
            </el-table-column>
            <el-table-column
              prop="orderTime"
              label="报名时间">
            </el-table-column>
            <el-table-column
              label="报名状态">
              <template slot-scope="scope">
                <el-link :underline="false" type="success" v-if="scope.row.status == 0">{{scope.row.statusName}}</el-link>
                <el-link :underline="false" type="danger" v-else>{{scope.row.statusName}}</el-link>
              </template>
            </el-table-column>
            <el-table-column
              prop="signStatusName"
              label="签到状态">
              <template slot-scope="scope">
                <el-link :underline="false" type="success" v-if="scope.row.signStatus == 1">{{scope.row.signStatusName}}</el-link>
                <el-link :underline="false" type="danger" v-else>{{scope.row.signStatusName}}</el-link>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="100">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="danger"
                  :disabled="scope.row.orderStatus != 1"
                  @click="handleEdit(scope.row)" v-if="scope.row.signStatus == 0 && hasButton('appointment-sign')"><i class="fa fa-pencil fa-fw"></i> 签到</el-button>
                <span v-else-if="hasButton('appointment-sign')">已签到</span>
<!--                <el-button-->
<!--                  size="mini"-->
<!--                  v-else><i class="fa fa-pencil fa-fw"></i>已签到</el-button>-->
<!--                <el-button-->
<!--                  size="mini"-->
<!--                  type="danger"-->
<!--                  @click="(scope.handleDeleterow)"><i class="fa fa-trash-o fa-fw"></i>取消预约</el-button>-->
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
  import { getAppointmentDataPage,cancelAppointment,appointmentSigned,getAppointmentSignStatusEnum ,ExportAppointment,getAppointmentStatusEnum} from '@/api/mcc/activity'
  import { applicationDictionaryDataByTypeCode } from '@/api/config.js'
  import { fileDetail ,uploadFileUrl, getfiles} from '@/api/file.js'
  import PageTemp from '@/components/PageTemp'
  import { checkNumber } from '@/utils/validate.js'
  import { downloading } from "@/utils/common";
  export default {
    data(){
      return{
        uploadFileUrl:uploadFileUrl,
        //对话框
        dialogShow:false,
        dialogType:'add',//点击操作按钮改变
        typeBannerList:[],
        positionBannerList:[],
        statusList:[],//签到状态枚举
        appointmentStatusList:[],// 预约状态枚举
        //新增编辑
        idFile:'',
        dialogForm:{
            id:'',name:'',sequence:'',type:'',urlPath:'',idFile:'',position:''
        },
        rules:{
          name:[{ required: true, message: '请输入名称'}],
          sequence:[{ required: true, message: '请输入顺序'},{ validator:checkNumber}],
          type:[{ required: true, message: '请选择类型'}],
          position:[{ required: true, message: '请选择位置'}],
          idFile:[{ required: true, message: '请上传图片'}]
        },

        //预约管理列表 的检索条件
        searchForm:{
          pageNum:1,
          pageSize:10,
          userName:'',
          phone:'',
          signStatus:'',
          status: '',
          idActivity:''
        },
        tableData:[],
        total:0,
      }
    },
    components:{PageTemp},
    methods:{
      //签到
      handleEdit(row){
        this.commonDeleteDialog(this.appointmentSigned,row.id,'签到')
      },
      //取消预约
      handleDelete(row){
        this.commonDeleteDialog(this.cancelAppointment,row.idActivity,'取消')
      },
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
        ExportAppointment(params).then(res=>{
          downloading(res)
          setTimeout(() => {
            loading.close();
          }, 2000);
        })
      },

      //查询
      querySearchForm(){
        this.getAppointmentDataPage()
      },
      //重置
      resetSearchForm(){
        this.searchForm.pageNum = 1;
        this.searchForm.status = '';
        this.resetForm('searchForm');
        this.getAppointmentDataPage();
      },
      resetForm(formName) {
        this.$refs[formName] && this.$refs[formName].resetFields();
      },
      //取消预约
      cancelAppointment(id){
        cancelAppointment(id).then(res=>{
          if (res.code == 200){
            this.$message.success('取消成功')
            this.getAppointmentDataPage()
          }
        })
      },

      //签到
      appointmentSigned(id){
        appointmentSigned(id).then(res=>{
          if (res.code == 200){
            this.$message.success('签到成功')
            this.getAppointmentDataPage()
          }
        })
      },
      //分页
      goSpecifiedPage(val){
        this.searchForm.pageNum = val;
        this.getAppointmentDataPage()
      },

      //获取预约管理列表
      getAppointmentDataPage(){
        getAppointmentDataPage(this.searchForm).then(res=>{
          if (res.code == 200){
            this.tableData = res.data.result;
            this.total = res.data.totalPages;
          };
        })
      },
      //获取预约管理详情
      getBannerDetail(id){
        getBannerDetail(id).then(res=>{
          if (res.code == 200){
            for (let key in this.dialogForm){
              this.dialogForm[key] = res.data[key];
            };
            this.fileDetail(res.data.idFile,'idFile');
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
      getAppointmentSignStatusEnum(){
        getAppointmentSignStatusEnum().then(res=>{
          if(res.code == 200){
            this.statusList = res.data.map(e=>{
              e.key = 'status' + e.code;
              e.value = e.code;
              e.label = e.message;
              return e;
            })
          }
        });
      },
      /**
       * 预约状态枚举
       */
      getAppointmentStatusEnum(){
        getAppointmentStatusEnum().then(res=>{
          if(res.code == 200){
            this.appointmentStatusList = res.data.map(e=>{
              e.key = 'appointment' + e.code;
              e.value = e.code;
              e.label = e.message;
              return e;
            })
          }
        })
      }
    },
    created() {
      this.searchForm.idActivity = this.$route.query.idActivity
      //列表
      this.getAppointmentDataPage();

      this.getAppointmentSignStatusEnum();

      this.getAppointmentStatusEnum();
    }
  };
</script>


<style lang="scss" scoped>

</style>
