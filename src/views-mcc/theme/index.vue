<template>
  <section class="view-container">
    <el-form class="search-form" ref="searchForm" :model="searchForm" :inline="true" size="small" @submit.native.prevent>
      <el-form-item prop="name">
        <el-input v-model="searchForm.name" clearable placeholder="主题名称"></el-input>
      </el-form-item>
      <el-form-item prop="type">
        <el-select v-model="searchForm.type" clearable placeholder="主题分类">
          <el-option :label="item.label" :value="item.value" v-for="item in typeSubjectList"
                     :key="item.key"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="examineStatus">
        <el-select v-model="searchForm.examineStatus" clearable placeholder="审核状态">
          <el-option :label="item.label" :value="item.value" v-for="item in examineStatusList"
                     :key="item.key"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="publishStatus">
        <el-select v-model="searchForm.publishStatus" clearable placeholder="发布状态">
          <el-option :label="item.label" :value="item.value" v-for="item in publishStatusList"
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
        <el-button size="small" type="primary" @click="handleAdd" v-if="hasButton('theme_add')"><i class="fa-fw fa fa-plus"></i>新增主题</el-button>
      </el-row>
      <el-row class="table-wraper">
        <template>
          <el-table
            ref="multipleTable"
            :data="tableData"
            row-key="id"
            style="width: 100%;" stripe border>
            <el-table-column
              show-overflow-tooltip
              prop="name"
              label="名称">
            </el-table-column>
            <el-table-column
              prop="typeName"
              label="分类">
            </el-table-column>
            <el-table-column
              sortable
              prop="startTime"
              label="开始时间"
              width="130">
              <template slot-scope="scope">
                {{scope.row.startTime?scope.row.startTime.substr(0,10):'--'}}
              </template>
            </el-table-column>
            <el-table-column
              sortable
              prop="endTime"
              label="结束时间"
              width="130">
              <template slot-scope="scope">
                {{scope.row.endTime?scope.row.endTime.substr(0,10):'--'}}
              </template>
            </el-table-column>
            <el-table-column
              prop="examineStatusName"
              label="审核状态"
              width="100">
              <template slot-scope="scope">
                <el-link :underline="false" type="success" v-if="scope.row.examineStatus == 1">{{scope.row.examineStatusName}}</el-link>
                <el-link :underline="false" type="danger" v-else>{{scope.row.examineStatusName}}</el-link>
              </template>
            </el-table-column>
            <el-table-column
              prop="publishStatusName"
              label="发布状态"
              width="80">
              <template slot-scope="scope">
                <el-link :underline="false" type="success" v-if="scope.row.publishStatus == 1">{{scope.row.publishStatusName}}</el-link>
                <el-link :underline="false" type="danger" v-else>{{scope.row.publishStatusName}}</el-link>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="300">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  @click="handleAudit(scope.row)" v-if="scope.row.examineStatus !=1 && hasButton('theme_audit')"><i class="fa fa-pencil fa-fw"></i>审核</el-button>
                <el-button
                  size="mini"
                  type="primary"
                  @click.stop="handleRelease(scope.row)"
                  v-if="scope.row.examineStatus==1 && hasButton('theme_release')"
                ><i class="fa fa-pencil fa-fw"></i>{{ scope.row.publishStatus == 0 ? '发布' : '撤销'}}</el-button>
                <el-button
                  size="mini"
                  @click="handleEdit(scope.row)" v-if="hasButton('theme_edit')"><i class="fa fa-pencil fa-fw"></i>编辑</el-button>
                <el-button
                  size="mini"
                  type="danger"
                  @click="handleDelete(scope.row)" v-if="hasButton('theme_delete')"><i class="fa fa-trash-o fa-fw"></i>删除</el-button>
                <el-button
                  size="mini"
                  type="info"
                  @click="handleView(scope.row)" v-if="hasButton('theme_view')"><i class="fa fa-eye fa-fw"></i>查看</el-button>
              </template>
            </el-table-column>
          </el-table>
          <page-temp :total="total" :pageSize="searchForm.pageSize" :currentPage="searchForm.pageNum" @goSpecifiedPage="goSpecifiedPage" />
        </template>
      </el-row>
    </section>


    <!--审核-->
    <AuditDialog :show.sync="dialogAuditShow" :id="dialogAuditId" @sure="handleAuditSure"></AuditDialog>
  </section>
</template>

<script>
  import { deleteSubject,getSubjectDataPage,auditSubject,releaseSubject } from '@/api/mcc/theme.js'
  import { applicationDictionaryDataByTypeCode } from '@/api/config.js'
  import PageTemp from '@/components/PageTemp'
  import AuditDialog from '@/views-mcc/components/AuditDialog.vue'
  export default {
    data(){
      return{
        //检索条件
        searchForm:{
          pageNum:1,
          pageSize:10,
          name:'',
          type:'',
          examineStatus:'',
          publishStatus:'',
        },
        typeSubjectList:[],
        examineStatusList:[],
        publishStatusList:[],
        tableData:[],
        total:0,

        // 审核
        dialogAuditId: '',
        dialogAuditShow: false,
      }
    },
    components:{PageTemp, AuditDialog},
    created() {
      this.getSubjectDataPage();
      this.applicationDictionaryDataByTypeCode(this.$dicts.typeSubject,this.typeSubjectList);
      this.applicationDictionaryDataByTypeCode(this.$dicts.examineStatus,this.examineStatusList);
      this.applicationDictionaryDataByTypeCode(this.$dicts.publishStatus,this.publishStatusList);
    },
    methods:{
      //操作按钮
      handleAdd(){
        this.$router.push({
          name:'theme_add'
        })
      },
      handleEdit(row){
        this.$router.push({
          params:{
            id:row.id
          },
          name:'theme_edit'
        })

      },
      handleDelete(row){
        this.commonDeleteDialog(this.deleteSubject,row.id,'删除')
      },
      handleView(row){
        this.$router.push({
          params:{
            id:row.id
          },
          name:'theme_detail'
        })
      },
      //审核
      handleAudit(row){
        this.dialogAuditId = row.id;
        this.dialogAuditShow = true;
        /*this.commonDeleteDialog(this.auditSubject,{
          id:row.id,
          examineStatus:1
        },'审核')*/
      },
      handleAuditSure(data){
        this.auditSubject(data)
      },
      //发布
      handleRelease(row){
        let _this = this;
        let params = {};
        let text = "";
        params.id = row.id;
        params.publishStatus = row.publishStatus == 1 ? 0 : 1;
        text = row.publishStatus == 1 ? "撤销" : "发布";

        this.commonDeleteDialog(function(data){
          releaseSubject(data).then(res=>{
            if (res.code == 200){
              _this.$message.success(text+'成功')
              _this.getSubjectDataPage()
            }
          })
        }, params ,text)
      },
      //审核
      auditSubject(data){
        auditSubject(data).then(res=>{
          if (res.code == 200){
            this.dialogAuditShow = false;
            this.$message.success('审核成功')
            this.getSubjectDataPage()
          }
        })
      },
      //发布
      releaseSubject(data){
        releaseSubject(data).then(res=>{
          if (res.code == 200){
            this.$message.success('发布成功')
            this.getSubjectDataPage()
          }
        })
      },
      //查询
      querySearchForm(){
        this.getSubjectDataPage()
      },
      //重置
      resetSearchForm(){
        this.searchForm.pageNum = 1;
        this.resetForm('searchForm');
        this.getSubjectDataPage();
      },
      resetForm(formName) {
        this.$refs[formName] && this.$refs[formName].resetFields();
      },

      //列表

      //删除
      deleteSubject(dicNum){
        deleteSubject(dicNum).then(res=>{
          if (res.code == 200){
            this.$message.success('删除成功')
            this.getSubjectDataPage()
          }
        })
      },

      //分页
      goSpecifiedPage(val){
        this.searchForm.pageNum = val;
        this.getSubjectDataPage()
      },

      //获取主题列表
      getSubjectDataPage(){
        getSubjectDataPage(this.searchForm).then(res=>{
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
      }
    }
  };
</script>

<style lang="scss" scoped>
  .print-dialog{
    .el-dialog__body{
      padding: 20px;
    }
  }
  .native-table{
    text-align: center;
    border-collapse: collapse;
    th{
      height: 50px;
    }
    td{
      height: 40px;
    }
    td,th{
      border: 1px solid #ccc;
    }
  }
</style>
