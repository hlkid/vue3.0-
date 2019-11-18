<template>
  <section class="view-container">
    <el-form class="search-form" ref="searchForm" :model="searchForm" :inline="true" size="small" @submit.native.prevent>
      <el-form-item prop="name">
        <el-input v-model.trim="searchForm.name" clearable placeholder="作品名称"></el-input>
      </el-form-item>
      <el-form-item prop="level">
        <el-select v-model="searchForm.type" clearable placeholder="作品类型">
          <el-option :label="item.message" :value="item.code" v-for="item in typeList"
                     :key="item.code"></el-option>
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
        <el-button size="small" type="primary" @click="handleAdd" v-if="hasButton('works_add')"><i class="fa-fw fa fa-plus"></i>添加</el-button>
        <el-button
          size="small"
          type="primary"
          @click="handleSendAudit(currentSelect)" v-if="hasButton('works_sendAudit')"><i class="fa fa-pencil fa-fw"></i>发送审核</el-button>
        <el-button size="small" type="primary" @click="handleExport(currentSelect)" v-if="hasButton('works_export')"><i class="fa-fw fa fa-plus"></i>导出</el-button>
      </el-row>
      <el-row class="table-wraper">
        <template>
          <el-table
            ref="multipleTable"
            :data="tableData"
            :header-cell-class-name="selectText"
            @current-change="handleCurrentChange"
            @selection-change="handleSelectionChange"
            row-key="id"
            style="width: 100%;" stripe border>
            <el-table-column
              type="selection"
              width="55">
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="name"
              label="作品名称">
            </el-table-column>
            <el-table-column
              prop="author"
              label="作者">
            </el-table-column>
            <el-table-column
              prop="mobile"
              label="电话">
            </el-table-column>
            <el-table-column
              prop="activityName"
              label="活动名称">
            </el-table-column>
            <!--<el-table-column
              prop="type"
              label="作品类型">
            </el-table-column>-->
            <!--<el-table-column
              show-overflow-tooltip
              prop="description"
              label="描述">
            </el-table-column>-->
            <el-table-column
              prop="examineStatusName"
              label="审核状态"
              width="100">
              <template slot-scope="scope">
                <el-link :underline="false" type="success" v-if="scope.row.examineStatus == 1">已审核</el-link>
                <el-link :underline="false" type="danger" v-else>{{scope.row.examineStatusName}}</el-link>
              </template>
            </el-table-column>
            <el-table-column
              prop="publishStatusName"
              label="发布状态"
              width="80">
              <template slot-scope="scope">
                <el-link :underline="false" type="success" v-if="scope.row.publishStatus == 1">已发布</el-link>
                <el-link :underline="false" type="danger" v-else>{{scope.row.publishStatusName}}</el-link>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="250">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  @click.stop="handleAudit(scope.row)" v-if="scope.row.examineStatus==3 && hasButton('works_audit')"><i class="fa fa-pencil fa-fw"></i>审核</el-button>
                <!--已审核-->
                <el-button
                  size="mini"
                  type="primary"
                  @click.stop="handleRelease(scope.row)" v-if="scope.row.examineStatus==1 && hasButton('works_release')"><i class="fa fa-pencil fa-fw"></i>{{ scope.row.publishStatus == 0 ? '发布' : '撤销'}}</el-button>
                <el-button
                  size="mini"
                  @click.stop="handleEdit(scope.row)" v-if="hasButton('works_edit')"><i class="fa fa-pencil fa-fw"></i>编辑</el-button>
                <el-button
                  size="mini"
                  type="danger"
                  @click.stop="handleDelete(scope.row)" v-if="hasButton('works_delete')"><i class="fa fa-trash-o fa-fw"></i>删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <PageTemp :total="total" :pageSize="searchForm.pageSize" :currentPage="searchForm.pageNum" @goSpecifiedPage="goSpecifiedPage" />
        </template>
      </el-row>
    </section>


    <!--添加-->
    <el-dialog :title="dialogType == 'add' ? '添加' : '编辑'" :visible.sync="dialogShow" width="750px" :close-on-click-modal="false" :append-to-body='true'>
      <el-form class="dialog-form" inline ref="dialogForm" :model="dialogForm" label-width="80px" :rules="rules" size="small">
        <el-form-item label="作品名称" prop="name" class="block">
          <el-input type="textarea" :autosize="{ minRows: 1, maxRows: 3 }" v-model.trim="dialogForm.name" maxlength="100"></el-input>
        </el-form-item>
        <el-form-item label="作品类型" prop="type">
          <el-select v-model="dialogForm.type" clearable placeholder="作品类型" @change="changeType">
            <el-option :label="item.message" :value="item.code" v-for="item in typeList"
                       :key="item.code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="作者" prop="author">
          <el-input v-model.trim="dialogForm.author" clearable maxlength="10"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model.trim="dialogForm.mobile" clearable></el-input>
        </el-form-item>
        <el-form-item label="活动名称" prop="idSource" class="block">
          <el-select
            v-model="dialogForm.idSource"
            @change="changeActivity"
            filterable
            remote
            reserve-keyword
            placeholder="请输入关键词"
            :remote-method="remoteActivityMethod">
            <el-option
              v-for="item in activityList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>

        <!--<el-form-item label="顺序" prop="prizeSort">
          <el-input v-model.trim="dialogForm.prizeSort" clearable></el-input>
        </el-form-item>-->
        <el-form-item label="简介" prop="description" class="block">
          <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 1000 }" v-model.trim="dialogForm.description" maxlength="250"></el-input>
        </el-form-item>
        <div v-if="dialogForm.type !== ''">
          <el-form-item label="作品文件" prop="opus" class="block">
            <Uploader :fileList="opusFileList" @getList="getCoverList" :limit="dialogForm.type == 0 ? 10 : 1" :type="dialogForm.type"></Uploader>
            <el-input type="hidden" v-model="dialogForm.opus"></el-input>
          </el-form-item>
        </div>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogShow = false">取 消</el-button>
        <el-button type="primary" :disabled="vloading" @click="sure">确 定</el-button>
      </div>
    </el-dialog>

    <!--审核-->
    <AuditDialog :show.sync="dialogAuditShow" :id="dialogAuditId" @sure="handleAuditSure"></AuditDialog>
  </section>
</template>

<script>
  import { getOpusDataPage,deleteOpus,editOpus,addOpus,getOpusDetail,releaseOpus,auditOpus,opusSendExamine, opusExport, opusTypeEnum } from '@/api/mcc/works.js'
  import { getActivityData } from '@/api/mcc/activity.js'
  import { applicationDictionaryDataByTypeCode } from '@/api/config.js'
  import { fileDetail ,uploadFileUrl, getfiles , uploadFile} from '@/api/file.js'

  import PageTemp from '@/components/PageTemp'
  import AuditDialog from '@/views-mcc/components/AuditDialog.vue'
  import {checkMobile,checkNumber} from "@/utils/validate";
  import { isTimeDay,downloading,isEmpty } from "@/utils/common"
  import Uploader from "@/components/Uploader";

  export default {
    data(){
      return{
        uploadFileUrl:uploadFileUrl,
        //对话框
        dialogShow:false,
        dialogType:'add',//点击操作按钮改变

        typeList:[],
        examineStatusList:[],
        publishStatusList:[],
        activityList:[],
        //新增编辑
        opusFileList:[],
        dialogForm:{
          id:'',name:'',author:'',mobile:'',nameSource:'',idSource:'',type:'',opus:'',
          prizeSort:'',
          description:''
        },
        rules:{
          name:[{ required: true, message: '请输入作品名称'}],
          author:[{ required: true, message: '请输入作者'}],
          type:[{ required: true, message: '请选择作品类型'}],
          idSource:[{ required: false, message: '请选择活动'}],
          mobile:[{ required: false, message: '请输入手机号'},{ validator:checkMobile}],
          // prizeSort:[{ required: true, message: '请输入排序'},{ validator:checkNumber}],
          opus:[{ required: true, message: '请上传文件'}],
        },
        //作品列表 的检索条件
        searchForm:{
          pageNum:1,
          pageSize:10,
          name: '',
          type: '',
          examineStatus:'',
          publishStatus:''
        },
        tableData:[],
        total:0,
        queryActivity:{
          name:'',
          type: '',
          attribute:'',
          publishStatus: 1
        },

        // 审核
        dialogAuditId: '',
        dialogAuditShow: false,
        currentSelect:{}
      }
    },
    components:{PageTemp, AuditDialog, Uploader},
    methods:{
      // 点击导出按钮
      handleExport(row){
        const loading = this.$loading({
          lock: true,
          text: '文件生成中',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        let params = {name:"",type:''};
        params.name = this.searchForm.name;
        params.type = this.searchForm.type;
        params.examineStatus = this.searchForm.examineStatus;
        params.publishStatus = this.searchForm.publishStatus;
        opusExport(params).then(res=>{
          // console.log( res.headers)
          // download(1,res);
          downloading(res)
          setTimeout(() => {
            loading.close();
          }, 2000);
        })
      },
      //发送审核
      handleSendAudit(row){
        if(!row.id){
          this.$message.warning('请勾选一条记录')
          return
        }
        if(row.examineStatus == 1  ){
          this.$message.warning('该条数据已审核')
          return
        }
        if(row.examineStatus == 3 ){
          this.$message.warning('您已经发送了审核')
          return
        }

        if(row.examineStatus == 2 ){
          this.$message.warning('该条数据不通过，请修改后在发送')
          return
        }

        this.commonDeleteDialog(this.opusSendExamine, row.id, '发送审核')
      },
      // 发送审核接口
      opusSendExamine(id){
        opusSendExamine(id).then(res=>{
          if (res.code == 200){
            this.$message.success('发送审核成功')
            this.getOpusDataPage()
          }
        })
      },
      /*table单选*/
      handleCurrentChange (val) {
        this.currentSelect = val.id ? val : {}
        this.$refs.multipleTable.toggleRowSelection(val)
      },
      handleSelectionChange (val) {
        // console.log(val)
        setTimeout(() => {
          if (val.length > 1) {
            this.$refs.multipleTable.clearSelection()
            this.$refs.multipleTable.toggleRowSelection(val.pop())
          }
          this.currentSelect = val.length ? val[0] : {};
        })
      },

      //文件地址
      fileDetail(id,attr){
        fileDetail(id).then(res=>{
          if (res.code == 200 && res.data){
            this[attr] = this.baseImgUrl + res.data.imgSmallCompress
          };
        })
      },
      changeType(){
        this.opusFileList = [];
        this.dialogForm.opus = ''
      },
      // 上传文件回调
      getCoverList(list) {
        console.log(list)
        this.opusFileList = list;
        this.dialogForm.opus = list
          .map(i => {
            return i.id;
          })
          .toString();
      },
     /* beforeUploadOpus(file){
        /!*let data = new FormData();
        data.append('file',file);

        uploadFile(data,this.uploadFileParamsUrl)

        return false*!/

        this.$store.dispatch('ToggleVloading', true);
        const isImg = (file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png');
        const isAudio = (file.type === 'audio/mp3');
        const isVideo = (file.type === 'video/mp4');

        if (this.dialogForm.type == 0) {
          console.log(this.opusFileList.length)
          if (isImg){
            if (this.opusFileList.length == 10){
              this.$message.warning('最多上传10图片');
              return false
            }
          } else{
            this.$message.warning('图片只支持 jpeg、jpg、png 格式！');
            return false
          }
        }else if (this.dialogForm.type == 1 && !isAudio) {
          this.$message.warning('音频只支持 mp3 格式！');
          return false
        }else if (this.dialogForm.type == 2 && !isVideo) {
          this.$message.warning('视频只支持 mp4 格式！');
          return false
        }
      },
      // 文件上传 ----删除一个文件的回调--
      handleRemoveOpus(file, fileList) {
        this.opusFileList = fileList;
        /!*this.dialogForm.opus = '';
        this.dialogForm.type = '';*!/
      },
      // 文件上传 ----上传成功--
      handleSuccessOpus(res, file, fileList){
        if (res.code == 200){
          this.opusFileList.push({
            name:res.data.name,
            url: this.baseImgUrl + res.data.path,
            id: res.data.id});
        }else{
          res.errorMsg && this.$message.error(res.errorMsg)
        }
        this.$store.dispatch('ToggleVloading', false);
        /!*this.dialogForm.opus =response.data.id;
        this.dialogForm.type =response.data.type;*!/
      },
      handleErrorOpus(){
        this.$store.dispatch('ToggleVloading', false);
      },*/
      //操作按钮
      handleAdd(){
        this.opusFileList = [];
        this.dialogShow = true;
        this.dialogType = 'add';
        for (let key in this.dialogForm){
          this.dialogForm[key] = '';
        };
        this.$nextTick(()=>{
          this.$refs['dialogForm'].clearValidate(); //移除校验结果
        })
      },
      handleEdit(row){
        this.opusFileList = [];
        this.dialogShow = true;
        this.dialogType = 'edit';
        for (let key in this.dialogForm){
          this.dialogForm[key] = '';
        };
        this.$nextTick(()=>{
          this.$refs['dialogForm'].clearValidate(); //移除校验结果
        });

        this.getOpusDetail(row.id);
      },
      handleDelete(row){
        this.commonDeleteDialog(this.deleteOpus,row.id,'删除')
      },
      // 审核
      handleAudit (row) {
        this.dialogAuditId = row.id;
        this.dialogAuditShow = true;
      },
      handleAuditSure(data){
        this.auditOpus(data)
      },
      //发布
      handleRelease(row){
        let publishStatus = row.publishStatus == 0 ? 1 : 0;
        let msg = row.publishStatus == 0 ? '发布' : '撤销';
        this.commonDeleteDialog(this.releaseOpus,{
          id: row.id,
          publishStatus: publishStatus
        },msg)

        /*this.commonDeleteDialog(this.releaseOpus,{
          id:row.id
        },'发布')*/
      },
      //对话框
      sure(){
        let opus = this.opusFileList.map(i=>{
          return i.id;
        })
        this.dialogForm.opus = opus.toString();
        this.$refs['dialogForm'].validate((valid) => {
          if (valid) {
            this.dialogType == 'add' && this.addOpus();
            this.dialogType == 'edit' && this.editOpus();
          }
        })
      },

      //查询
      querySearchForm(){
        this.getOpusDataPage()
      },
      //重置
      resetSearchForm(){
        this.searchForm.pageNum = 1;
        this.searchForm.type = '';
        this.resetForm('searchForm');
        this.getOpusDataPage();
      },
      resetForm(formName) {
        this.$refs[formName] && this.$refs[formName].resetFields();
      },

      //列表
      //添加
      addOpus(){
        addOpus(this.dialogForm).then(res=>{
          if (res.code == 200){
            this.$message.success('添加成功')
            this.dialogShow = !this.dialogShow;
            this.getOpusDataPage()
          }
        })
      },
      //删除
      deleteOpus(dicNum){
        deleteOpus(dicNum).then(res=>{
          if (res.code == 200){
            this.$message.success('删除成功')
            this.getOpusDataPage()
          }
        })
      },
      //审核
      auditOpus(data){
        auditOpus(data).then(res=>{
          if (res.code == 200){
            this.dialogAuditShow = false;
            this.$message.success('审核成功')
            this.getOpusDataPage()
          }
        })
      },
      //发布
      releaseOpus(data){
        let msg = data.publishStatus == 1 ? '发布成功' : '撤销成功';
        releaseOpus(data).then(res=>{
          if (res.code == 200){
            this.$message.success(msg)
            this.getOpusDataPage()
          }
        })
      },
      //编辑
      editOpus(){
        editOpus(this.dialogForm).then(res=>{
          if (res.code == 200){
            this.$message.success('编辑成功')
            this.dialogShow = !this.dialogShow;
            this.getOpusDataPage()
          }
        })
      },
      //分页
      goSpecifiedPage(val){
        this.searchForm.pageNum = val;
        this.getOpusDataPage()
      },

      //获取作品列表
      getOpusDataPage(){
        getOpusDataPage(this.searchForm).then(res=>{
          if (res.code == 200){
            this.tableData = res.data.result;
            this.total = res.data.totalPages;
          };
        })
      },
      //获取作品详情
      getOpusDetail(id){
        getOpusDetail(id).then(res=>{
          if (res.code == 200){
            for (let key in this.dialogForm){
              this.dialogForm[key] = res.data[key];
            };

            this.opusFileList = res.data.opusFileInfo.map((i)=>{
              return {
                id: i.id,
                type: i.type,
                name: i.name,
                path: this.baseImgUrl + i.path,
                url: this.baseImgUrl + ( i.type == 0 ? i.path : i.imgSourceCompress)
              }
            })
            // this.dialogForm.opus && this.getfiles(this.dialogForm.opus)
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
      // 作品类型
      opusTypeEnum(){
        this.typeList = []
        opusTypeEnum().then(res=>{
          if (res.code == 200){
            this.typeList = res.data
          };
        })
      },
      getfiles(ids){
        this.opusFileList = [];
        getfiles({ids:ids}).then(res=>{
          if(res.code == 200){
            res.data.forEach(e=>{
              this.opusFileList.push({name:e.name,url:this.baseImgUrl + e.path,id:e.id})
            })
          }
        })
      },
      changeActivity(val){
        // console.log(val)
        this.activityList.forEach(item=>{
          if(val === item.id){
            this.dialogForm.nameSource = item.name;
          }
        })
      },
      //选择活动
      remoteActivityMethod(name){
        this.queryActivity.name = name;
        getActivityData(this.queryActivity).then(res=>{
          if (res.code == 200 && res.data){
            this.activityList = res.data;
          };
        })
      }
    },
    created() {
      //列表
      this.getOpusDataPage();
      this.remoteActivityMethod('');
      this.opusTypeEnum();
      this.applicationDictionaryDataByTypeCode('examineStatus',this.examineStatusList);
      this.applicationDictionaryDataByTypeCode('publishStatus',this.publishStatusList);
    }
  };
</script>


<style lang="scss" scoped>

</style>
