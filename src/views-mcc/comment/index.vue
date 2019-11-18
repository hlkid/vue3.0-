<template>
  <section class="view-container">
    <el-form class="search-form" ref="searchForm" :model="searchForm" :inline="true" size="small" @submit.native.prevent>
      <el-form-item prop="sourceName">
        <el-input v-model.trim="searchForm.sourceName" clearable placeholder="活动名称"></el-input>
      </el-form-item>

      <el-form-item prop="examineStatus" >
        <el-select v-model.trim="searchForm.examineStatus" clearable placeholder="审核状态">
          <el-option v-for="item in examineStatusList" :key="item.key" :label="item.label" :value="item.value"></el-option>
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
            row-key="id"
            style="width: 100%;" stripe border>
            <el-table-column
              prop="userName"
              label="评论人" width="150">
            </el-table-column>
            <el-table-column
              prop="sourceName"
              label="活动名称">
            </el-table-column>
            <el-table-column
              prop="content"
              label="评论内容">
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
            <el-table-column label="操作" width="250">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  @click="handleAudit(scope.row)" v-if="scope.row.examineStatus!=1 && hasButton('comment-review')"><i class="fa fa-pencil fa-fw"></i>审核</el-button>
                <el-button
                  size="mini"
                  type="primary" v-if="hasButton('comment-reply')"
                  @click="handleAnswer(scope.row)"><i class="fa fa-pencil fa-fw"></i>回复</el-button>
                <el-button
                  size="mini"
                  type="danger" v-if="hasButton('comment-delete')"
                  @click="handleDelete(scope.row)"><i class="fa fa-trash-o fa-fw"></i>删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <PageTemp :total="total" :pageSize="searchForm.pageSize" :currentPage="searchForm.pageNum" @goSpecifiedPage="goSpecifiedPage" />
        </template>
      </el-row>
    </section>
    <!--添加-->
    <el-dialog title="回复" :visible.sync="dialogShow" width="500px" :close-on-click-modal="false" :append-to-body='true' @close="close">
      <el-form class="dialog-form" ref="dialogForm" :model="dialogForm" label-width="80px" label-position="top" :rules="rules" size="small">
        <el-form-item label="回复内容" prop="content">
          <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 1000 }" v-model.trim="dialogForm.content"  clearable placeholder="回复内容"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogShow = false">取 消</el-button>
        <el-button type="primary" :disabled="vloading" @click="sure">确 定</el-button>
      </div>
    </el-dialog>


  </section>
</template>

<script>
  import { getDetailByVenueNum} from '@/api/mcc/venue.js'
  import { applicationDictionaryDataByTypeCode } from '@/api/config.js'
  import { deleteComment,auditComment,addComment,getExamineStatusEnum, getCommentDataPage} from '@/api/mcc/comment'

  import PageTemp from '@/components/PageTemp'
  export default {
    data(){
      let checkAnswer = (rule, value, callback)=>{
        if (value.length<5) {
          callback(new Error('回复字数不少于5个'));
        } else {
          callback();
        }
      }
      return{
        examineStatusList:[],

        //场馆列表 的检索条件
        searchForm:{
          pageNum:1,
          pageSize:10,
          sourceName:'',    //资源名称
          examineStatus:'', //审核状态
          idSource:''
        },
        tableData:[],
        total:0,
        dialogShow:false,
        dialogForm:{
          venueNum:'',
          content:'',
          idSource:'',
          sourceName:'',
          idRespondent:'',
          respondentName:'',
          parentId:'',
          idVenue:'',
          isExamine:1,
        },
        rules:{
          content:[{required:true,message:'请输入评论内容'},{validator:checkAnswer,trigger:'blur'}]
        }
      }
    },
    components:{PageTemp},
    watch:{
      $route(n,o){
        // console.log(n,o)
        //列表
        this.searchForm.idSource = n.query.idActivity?n.query.idActivity:'';
        this.getCommentDataPage();
      }
    },
    methods:{
      //对话框
      close(){
        this.dialogForm.content = ''
      },
      sure(){
        this.$refs['dialogForm'].validate((valid) => {
          if (valid) {
            addComment(this.dialogForm).then(res=>{
              if (res.code == 200){
                this.dialogShow = false;
                this.$message.success('回复成功')
                this.getCommentDataPage()
              }
            })
          }
        })
      },
      handleDelete(row){
        this.commonDeleteDialog(this.deleteComment,row.id,'删除')
      },
      //审核
      handleAudit(row){

        let params = {id:row.id};
        this.$confirm('是否确认审核？','温馨提示',{
          cancelButtonText:'审核不通过',
          confirmButtonText:'审核通过',
          type:'warning',
          center:true,
        }).then(() => {
          params.examineStatus = 1;// 审核通过
          this.auditComment(params)
        }).catch(() => {
          params.examineStatus = 2;// 审核不通过
          this.auditComment(params)
        })
      },
      //回复
      handleAnswer(row){
        getDetailByVenueNum({venueNum:row.venueNum}).then(res=>{
          if(res.code == 200){
            this.dialogForm.idSource = row.idSource;
            this.dialogForm.sourceName = row.sourceName;
            this.dialogForm.idRespondent = row.idUser;
            this.dialogForm.respondentName = row.userName;
            this.dialogForm.venueNum = row.venueNum;
            this.dialogForm.idVenue = row.idVenue;
            this.dialogForm.moduleType = row.moduleType;
            this.dialogForm.isExamine =  res.data.isExamine;
            this.dialogForm.parentId = (row.parentId ? row.parentId:row.id);
            this.dialogShow = true;
          }
        })
      },
      //查询
      querySearchForm(){
        this.getCommentDataPage()
      },
      //重置
      resetSearchForm(){
        this.searchForm.pageNum = 1;
        this.resetForm('searchForm');
        this.getCommentDataPage();
      },
      resetForm(formName) {
        this.$refs[formName] && this.$refs[formName].resetFields();
      },
      //删除
      deleteComment(dicNum){
        deleteComment(dicNum).then(res=>{
          if (res.code == 200){
            this.$message.success('删除成功')
            this.getCommentDataPage()
          }
        })
      },
      //审核
      auditComment(data){
        auditComment(data).then(res=>{
          if (res.code == 200){
            this.$message.success('审核成功')
            this.getCommentDataPage()
          }
        })
      },

      //分页
      goSpecifiedPage(val){
        this.searchForm.pageNum = val;
        this.getCommentDataPage()
      },

      //获取场馆列表
      getCommentDataPage(){
        getCommentDataPage(this.searchForm).then(res=>{
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
      //审核状态
      getExamineStatusEnum(){
        getExamineStatusEnum().then(res=>{
          if(res.code == 200){
            this.examineStatusList = res.data.map(e=>{
                e.key = 'examine' + e.code;
                e.value=e.code;
                e.label=e.message;
                return e;
            })
          }
        })
      },

      getDetailByVenueNum(venueNum){
        getDetailByVenueNum(venueNum).then(res=>{

        })
      }

    },
    created() {
      //列表
      if(this.$route.query.idActivity){
        this.searchForm.idSource = this.$route.query.idActivity;
      }
      this.getCommentDataPage();

      this.getExamineStatusEnum();
      // this.getExamineStatusEnum('examineStatus',this.examineStatusList);
    }
  };
</script>


<style lang="scss" scoped>

</style>
