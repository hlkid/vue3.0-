<template>
  <section class="view-container">
<!--    <ckeditor :editor="editor" v-model="editorData" :config="editorConfig"></ckeditor>-->

    <el-form class="search-form" ref="searchForm" :model="searchForm" :inline="true" size="small" @submit.native.prevent>
      <el-form-item prop="name">
        <el-input v-model.trim="searchForm.name" clearable placeholder="名称"></el-input>
      </el-form-item>
      <el-form-item prop="type">
        <el-select v-model="searchForm.type" clearable placeholder="类型">
          <el-option :label="item.label" :value="item.value" v-for="item in typeBannerList"
                     :key="'search'+item.key"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="position">
        <el-select v-model="searchForm.position" clearable placeholder="位置">
          <el-option :label="item.label" :value="item.value" v-for="item in positionBannerList"
                     :key="'search'+item.key"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="moduleType">
        <el-select v-model="searchForm.moduleType" clearable placeholder="模块类型">
          <el-option :label="item.message" :value="item.code" v-for="item in bannerModuleTypeList"
                     :key="item.code"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="querySearchForm"><i class="fa-fw fa fa-search"></i>查询</el-button>
        <el-button @click="resetSearchForm"><i class="fa-fw fa fa-repeat"></i>重置</el-button>
      </el-form-item>
    </el-form>
    <section class="list-wraper">
      <el-row class="btn-wraper">
        <el-button size="small" type="primary" @click="handleAdd" v-if="hasButton('banner_add')"><i class="fa-fw fa fa-plus"></i>添加</el-button>
        <el-button
          size="small"
          type="primary"
          @click="handleSendAudit(currentSelect)" v-if="hasButton('banner_sendAudit')"><i class="fa fa-pencil fa-fw"></i>发送审核</el-button>
      </el-row>
      <el-row class="table-wraper">
        <template>
          <el-table
            ref="multipleTable"
            :header-cell-class-name="selectText"
            @current-change="handleCurrentChange"
            @selection-change="handleSelectionChange"
            row-key="id"
            :data="tableData"
            style="width: 100%;" stripe border>
            <el-table-column
              type="selection"
              width="55">
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="name"
              label="名称">
            </el-table-column>
            <!--<el-table-column
              prop="sequence"
              label="顺序">
            </el-table-column>-->
            <el-table-column
              prop="typeName"
              label="平台类型">
            </el-table-column>
            <el-table-column
              prop="pageLocationName"
              label="所在页面">
            </el-table-column>
            <el-table-column
              prop="positionName"
              label="位置">
            </el-table-column>
            <el-table-column
              prop="moduleName"
              label="资源类型">
            </el-table-column>
            <el-table-column
              prop="urlPath"
              label="链接地址">
            </el-table-column>
            <el-table-column
              prop="examineStatus"
              label="审核状态"
              width="100">
              <template slot-scope="scope">
                <el-link :underline="false" type="success" v-if="scope.row.examineStatus == 1">{{scope.row.examineStatusName}}</el-link>
                <el-link :underline="false" type="danger" v-else>{{scope.row.examineStatusName}}</el-link>
              </template>
            </el-table-column>
            <el-table-column
              prop="publishStatus"
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
                  @click.stop="handleAudit(scope.row)" v-if="scope.row.examineStatus==3 && hasButton('banner_audit')"><i class="fa fa-pencil fa-fw"></i>审核</el-button>
                <el-button
                  size="mini"
                  type="primary"
                  @click.stop="handleRelease(scope.row)"  v-if="scope.row.examineStatus == 1 && hasButton('banner_release')"><i class="fa fa-pencil fa-fw"></i>{{ scope.row.publishStatus == 0 ? '发布' : '撤销'}}</el-button>
                <el-button
                  size="mini"
                  @click.stop="handleEdit(scope.row)" v-if="hasButton('banner_edit')"><i class="fa fa-pencil fa-fw"></i>编辑</el-button>
                <el-button
                  size="mini"
                  type="danger"
                  @click.stop="handleDelete(scope.row)" v-if="hasButton('banner_delete')"><i class="fa fa-trash-o fa-fw"></i>删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <PageTemp :total="total" :pageSize="searchForm.pageSize" :currentPage="searchForm.pageNum" @goSpecifiedPage="goSpecifiedPage" />
        </template>
      </el-row>
    </section>


    <!--添加-->
    <el-dialog :title="dialogType == 'add' ? '添加' : '编辑'" :visible.sync="dialogShow" width="700px" :close-on-click-modal="false" :append-to-body='true'>
      <el-form class="dialog-form" inline ref="dialogForm" :model="dialogForm" label-width="100px" :rules="rules" size="small">
        <el-form-item label="名称" prop="name">
          <el-input v-model.trim="dialogForm.name" clearable></el-input>
        </el-form-item>
        <el-form-item label="顺序" prop="sequence">
          <el-input v-model.trim="dialogForm.sequence" clearable></el-input>
        </el-form-item>

        <el-form-item label="平台类型" prop="type">
          <el-select v-model="dialogForm.type" clearable @change="changeBannerType">
            <el-option :label="item.label" :value="item.value" v-for="item in typeBannerList"
                       :key="'form'+item.key"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="页面" prop="pageLocation">
          <el-select v-model="dialogForm.pageLocation" clearable>
            <el-option :label="item.label" :value="item.value" v-for="item in bannerPageList"
                       :key="'form'+item.key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="位置" prop="position">
          <el-select v-model="dialogForm.position" clearable @change="changePosition">
            <el-option :label="item.label" :value="item.value" v-for="item in positionBannerList"
                       :key="'form'+item.key"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="链接属性" prop="urlAttribute">
          <el-radio-group v-model="dialogForm.urlAttribute">
            <el-radio :label=0>内部</el-radio>
            <el-radio :label=1>外部</el-radio>
          </el-radio-group>
        </el-form-item>
        <!--<el-form-item label="是否公开" prop="publicFlag">
          <el-radio-group v-model="dialogForm.publicFlag">
            <el-radio :label=0>否</el-radio>
            <el-radio :label=1>是</el-radio>
          </el-radio-group>
        </el-form-item>-->

        <el-form-item label="链接地址" prop="urlPath" v-if="dialogForm.urlAttribute == 1">
          <el-input v-model.trim="dialogForm.urlPath" clearable></el-input>
        </el-form-item>

        <template v-if="dialogForm.urlAttribute == 0">
          <el-form-item label="资源类型" prop="moduleType">
            <el-select v-model="dialogForm.moduleType" clearable @change="changeModuleType">
              <el-option :label="item.message" :value="item.code" v-for="item in bannerModuleTypeList"
                         :key="item.code"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="资源名称" prop="idSource" v-if="sourceParams.moduleType!=''">
            <el-select
              v-model="dialogForm.idSource"
              filterable
              remote
              reserve-keyword
              placeholder="请输入关键词"
              :remote-method="remoteActivityMethod">
              <el-option :label="item.name" :value="item.id" v-for="item in sourceList"
                         :key="item.id"></el-option>
            </el-select>
          </el-form-item>
        </template>
        <div>
          <el-form-item label="图片" prop="idFile">
            <el-upload
              class="single-uploader"
              :action="uploadFileParamsUrl"
              :before-upload="handleBeforeUpload"
              :on-success="handleSuccessIdFile"
              :on-error="handleError"
              accept="image/png, image/jpeg"
              :show-file-list="false">
              <img v-if="dialogForm.idFile" class="single-uploader-img" :src="idFile">
              <i v-else class="el-icon-plus single-uploader-icon"></i>
              <div slot="tip" class="single-uploader-handle" v-if="dialogForm.idFile">
                <i class="single-uploader-delete el-icon-delete" @click.self.stop="handleDeleteSingleUploader('idFile')"></i>
              </div>
            </el-upload>
            <el-input type="hidden" v-model="dialogForm.idFile"></el-input>
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
  import { getBannerDataPage,deleteBanner,editBanner,addBanner,getBannerDetail, getBannerModuleTypeEnum, auditBanner, releaseBanner, bannerSendExamine } from '@/api/mcc/information'
  import { applicationDictionaryDataByTypeCode } from '@/api/config.js'
  import { getRourceByMoculeTypeDataPage } from '@/api/mcc/activity.js'
  // import { bannerSendExamine } from '@/api/index.js'
  import { fileDetail ,uploadFileUrl, getfiles} from '@/api/file.js'
  import PageTemp from '@/components/PageTemp'
  import AuditDialog from '@/views-mcc/components/AuditDialog.vue'
  import {checkNumber} from '@/utils/validate.js'
  import { getBookList } from '@/api/clib/book'

  export default {
    data(){
      return{
        uploadFileUrl:uploadFileUrl,
        //对话框
        dialogShow:false,
        dialogType:'add',//点击操作按钮改变
        typeBannerList:[],
        bannerPageList:[],// banner所在页面
        positionBannerList:[],// banner所在页面的位置
        bannerModuleTypeList:[],
        sourceList:[], // 模块类型联动的资源列表
        sourceParams:{
          pageNum:1,
          pageSize:10,
          name:'',
          moduleType:''
        }, // 模块类型联动的资源列表
        //新增编辑
        idFile:'',
        dialogForm:{
            id:'',name:'',sequence:'',type:'',typeName:'',publicFlag: 1,
          urlAttribute: 0,// // 跳转链接属性 0 内部链接 1 外部链接
          urlPath:'',
          idFile:'',pageLocation:'',position:'',positionName:'',moduleType:'',idSource:''
        },
        rules:{
          name:[{ required: true, message: '请输入名称'}],
          sequence:[{ required: true, message: '请输入顺序'},{ validator:checkNumber}],
          type:[{ required: true, message: '请选择类型'}],
          pageLocation:[{ required: true, message: '请选择所在页面'}],
          position:[{ required: true, message: '请选择位置'}],
          idFile:[{ required: true, message: '请上传图片'}],
          urlAttribute:[{ required: true, message: '请选择链接属性'}],
          urlPath:[{ required: true, message: '请输入跳转地址'}],

          moduleType:[{ required: true, message: '请选择模块类型'}],
          idSource:[{ required: true, message: '请选择资源'}],
        },

        //场馆列表 的检索条件
        searchForm:{
          pageNum:1,
          pageSize:10,
          name:'',
          position:'',
          type:''
        },
        tableData:[],
        total:0,

        // 审核
        dialogAuditId: '',
        dialogAuditShow: false,
        currentSelect:{}
      }
    },
    components:{PageTemp, AuditDialog},
    methods:{
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

        this.commonDeleteDialog(this.bannerSendExamine, row.id, '发送审核')
      },
      //发送审核
      bannerSendExamine(id){
        bannerSendExamine(id).then(res=>{
          if (res.code == 200){
            this.$message.success('发送审核成功')
            this.getBannerDataPage()
          }
        })
      },
      /*table单选*/
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

      //移除图片
      handleDeleteSingleUploader(attr){
        this[attr] = '';
        this.dialogForm[attr] = '';
      },
      //文件地址
      fileDetail(id,attr){
        fileDetail(id).then(res=>{
          if (res.code == 200 && res.data){
            this[attr] = this.baseImgUrl + res.data.path
          };
        })
      },
      handleBeforeUpload(file){

      },
      handleError(res){
        // console.log(res)
      },
      // 封面文件上传 ----上传成功--
      handleSuccessIdFile(res, file, fileList){
        if (res.code == 200){
          this.dialogForm.idFile = res.data.id;
          this.idFile = this.baseImgUrl + res.data.path
          // res.data.id && this.fileDetail(res.data.id,'idFile')
        }else{
          res.errorMsg && this.$message.error(res.errorMsg)
        }
      },
      //操作按钮
      handleAdd(){
        this.dialogShow = true;
        this.dialogType = 'add';
        this.resetForm('dialogForm')
      },
      handleEdit(row){
        this.dialogShow = true;
        this.dialogType = 'edit';
        this.getBannerDetail(row.id);
        this.changeModuleType(row.moduleType)
      },
      handleDelete(row){
        this.commonDeleteDialog(this.deleteBanner,row.id,'删除')
      },
      //对话框
      sure(){
        this.$refs['dialogForm'].validate((valid) => {
          if (valid) {
            this.dialogType == 'add' && this.addBanner();
            this.dialogType == 'edit' && this.editBanner();
          }
        })
      },

      //查询
      querySearchForm(){
        this.getBannerDataPage()
      },
      //重置
      resetSearchForm(){
        this.searchForm.pageNum = 1;
        this.resetForm('searchForm');
        this.getBannerDataPage();
      },
      resetForm(formName) {
        this.$nextTick(()=>{
          this.$refs[formName].resetFields();
          setTimeout(()=>{
            this.$refs[formName].clearValidate(); //移除校验结果
          })
        });
      },

      // 切换位置
      changePosition(val){
        this.positionBannerList.forEach(i=>{
          if (val == i.value){
            this.dialogForm.positionName = i.label;
          }
        })
      },
      // 切换模块类型
      changeBannerType(val){
        this.typeBannerList.forEach(i=>{
          if (val == i.value){
            this.dialogForm.typeName = i.label;
          }
        })
      },
      //添加
      addBanner(){
        addBanner(this.dialogForm).then(res=>{
          if (res.code == 200){
            this.resetForm('dialogForm')
            this.$message.success('添加成功')
            this.dialogShow = !this.dialogShow;
            this.getBannerDataPage()
          }
        })
      },
      //删除
      deleteBanner(dicNum){
        deleteBanner(dicNum).then(res=>{
          if (res.code == 200){
            this.$message.success('删除成功')
            this.getBannerDataPage()
          }
        })
      },

      //编辑
      editBanner(){
        editBanner(this.dialogForm).then(res=>{
          if (res.code == 200){
            this.resetForm('dialogForm')
            this.$message.success('编辑成功')
            this.dialogShow = !this.dialogShow;
            this.getBannerDataPage()
          }
        })
      },
      //分页
      goSpecifiedPage(val){
        this.searchForm.pageNum = val;
        this.getBannerDataPage()
      },

      //获取场馆列表
      getBannerDataPage(){
        getBannerDataPage(this.searchForm).then(res=>{
          if (res.code == 200){
            this.tableData = res.data.result;
            this.total = res.data.totalPages;
          };
        })
      },
      //获取场馆详情
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
      // 数据词典
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
      // 模块类型
      getBannerModuleTypeEnum(){
        getBannerModuleTypeEnum().then(res=>{
          if (res.code == 200){
            this.bannerModuleTypeList = res.data;
          };
        })
      },
      // 切换模块类型，搜索资源
      changeModuleType(val){
        this.sourceParams.moduleType = val;
        console.log(val)
        if(val == 13){
          this.getBookList()
        }else{
          this.getRourceByMoculeTypeDataPage();
        }

      },
      // 关键字模糊搜索
      remoteActivityMethod(val){
        this.sourceParams.name = val;
        if(this.sourceParams.moduleType == 13){
          this.getBookList(val)
        }else{
          this.getRourceByMoculeTypeDataPage();
        }
      },
      // 根据模块类型获取资源
      getRourceByMoculeTypeDataPage(){
        getRourceByMoculeTypeDataPage(this.sourceParams).then(res=>{
          if (res.code == 200){
            if (res.data &&res.data.result) {
              this.sourceList = res.data.result;
            }else{
              this.sourceList = [];
            }
          };
        })
      },
      // 根据模块类型获取图书资源
      getBookList(name = ""){
        let data ={pageNum:1,currPage:10,bookName:name}
        getBookList(data).then(res => {
          if (res.code == 200){
            if (res.page && res.page.list) {
              this.sourceList = res.page.list;
            }else{
              this.sourceList = [];
            }
            console.log(this.sourceList)
          };
        })
      },

      // 点击审核按钮
      handleAudit (row) {
        this.dialogAuditId = row.id;
        this.dialogAuditShow = true;
      },
      handleAuditSure(data){
        this.auditBanner(data)
      },
      // 发布
      handleRelease(row){
        let publishStatus = row.publishStatus == 0 ? 1 : 0;
        let msg = row.publishStatus == 0 ? '发布' : '撤销';
        this.commonDeleteDialog(this.releaseBanner,{
          id: row.id,
          publishStatus: publishStatus
        },msg)
      },
      // 审核
      auditBanner(data){
        auditBanner(data).then(res=>{
          if (res.code == 200){
            this.dialogAuditShow = false
            this.$message.success('审核成功')
            this.getBannerDataPage()
          }
        })
      },
      // 发布
      releaseBanner(data){
        let msg = data.publishStatus == 1 ? '发布成功' : '撤销成功';
        releaseBanner(data).then(res=>{
          if (res.code == 200){
            this.$message.success(msg)
            this.getBannerDataPage()
          }
        })
      }
    },
    created() {
      // console.log(this.dialogForm)
      //列表
      this.getBannerDataPage();
      this.getBannerModuleTypeEnum();

      this.applicationDictionaryDataByTypeCode(this.$dicts.typeBanner,this.typeBannerList);
      this.applicationDictionaryDataByTypeCode(this.$dicts.positionBanner,this.positionBannerList);
      this.applicationDictionaryDataByTypeCode(this.$dicts.bannerPage,this.bannerPageList);
    }
  };
</script>


<style lang="scss" scoped>

</style>
