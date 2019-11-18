<template>
  <section class="view-container">
    <el-form class="hbsx-form" inline ref="dialogForm" :model="dialogForm" label-width="120px" :rules="rules"
             size="small">
      <el-form-item label="栏目名称" prop="catalogName">
        <el-input v-model.trim="dialogForm.catalogName" clearable placeholder="请输入栏目名称" ></el-input>
      </el-form-item>
      <el-form-item label="所属场馆" prop="idInstInstitution">
        <el-select v-model="dialogForm.idInstInstitution" clearable placeholder="请选择场馆">
          <el-option
            v-for="item in venueList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="栏目编码" prop="catalogCode">
        <el-input v-model.trim="dialogForm.catalogCode" clearable placeholder="数字、字母和下划线组成" ></el-input>
      </el-form-item>
      <el-form-item label="栏目类型" prop="catalogType">
        <el-select v-model="dialogForm.catalogType" clearable placeholder="请选择栏目类型">
          <el-option
            v-for="item in catalogTypeList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="是否支持订阅" prop="supportSubscription" >
        <el-select v-model="dialogForm.supportSubscription" clearable placeholder="请选择是否支持订阅">
          <el-option
            v-for="item in subscriptionList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="终端类型" prop="terminalType" >
        <el-select v-model="dialogForm.terminalType" clearable placeholder="请选择终端类型">
          <el-option
            v-for="item in terminalTypeList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="栏目简述" prop="catalogSummary" class="block">
        <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 10 }" v-model="dialogForm.catalogSummary" clearable placeholder="请输入详细位置"></el-input>
      </el-form-item>
      <el-form-item label="栏目详情" prop="catalogDetail" class="edit-form">
        <WangEditor v-model="dialogForm.catalogDetail"></WangEditor>
      </el-form-item>
      <div>
        <el-form-item label="封面" prop="coverId">
          <el-upload
            class="single-uploader"
            :action="uploadFileParamsUrl"
            :on-success="handleSuccessCover"
            :before-upload="beforeAvatarUpload"
            :show-file-list="false">
            <img v-if="dialogForm.catalogCoverId" class="single-uploader-activity" :src="cover">
            <i v-else class="el-icon-plus single-uploader-icon"></i>
            <div slot="tip" class="single-uploader-handle" v-if="dialogForm.catalogCoverId">
              <i class="single-uploader-delete el-icon-delete" @click.self.stop="handleDeleteSingleUploader('coverId')"></i>
            </div>
            <div style="position: absolute;bottom:-50px;"> 请上传宽高比750*350的图片</div>
          </el-upload>
        </el-form-item>
      </div>

      <div class="btns-waper">
        <el-button @click="$router.go(-1)">取 消</el-button>
        <el-button type="primary" :disabled="vloading" @click="sure">确 定</el-button>
      </div>

    </el-form>
  </section>
</template>

<script>
  import { saveMoudle,getMoudleInfo,changeMoudle,updateMoudle,getSupportStatus} from "@/api/clib/book";
  import { fileDetail ,uploadFileUrl, getfiles} from '@/api/file.js'
  import WangEditor from '@/components/WangEditor'
  import { isDataType ,uploadSize} from '@/utils/common.js'
  import { applicationDictionaryDataByTypeCode } from "@/api/config.js";
  import { getVenueData } from '@/api/mcc/venue.js'

  /***模拟数据开始**/

    //场馆名称
  const instList = [
      {value:1,label:'场馆1'},
      {value:2,label:'场馆2'},
      {value:3,label:'场馆3'},
      {value:4,label:'场馆4'}
    ];


  //栏目类型
  const catalogTypeList = [
    {value:1,label:'栏目1'},
    {value:2,label:'栏目2'},
    {value:3,label:'栏目3'},
  ];

  //是否支持订阅
  const subscriptionList = [
    {value:0,label:'支持'},
    {value:1,label:'不支持'},
  ];

  //终端类型
  const terminalTypeList = [
    {value:1,label:'微信小程序'},
    {value:2,label:'PC'},
  ];


  /***模拟数据 结束**/


  export default {
    components: {WangEditor},
    data() {
      return {
        id:'',//书单主键ID
        uploadFileUrl: uploadFileUrl,//上传地址
        dialogType:'',//判断新增还是编辑
        catalogTypeList:[], //栏目类型
        venueList:[], //所属场馆
        subscriptionList:[], // 是否支持订阅
        terminalTypeList:[],// 终端类型
        cover:'',//回显图片
        dialogForm: {
           idInstInstitution:"",	//场馆外键	是	[string]		查看
           catalogCode:"",	      //栏目编码	是	[string]		查看
           catalogCoverId:"",	    //栏目封面id	是	[string]
           catalogDetail:"",	    //栏目详情	是	[string]		查看
           catalogName:"",	      //栏目名称	是	[string]		查看
           catalogSummary:"",   	//栏目简述	是	[string]		查看
           catalogType:"",	      //栏目类型	是	[string]		查看
           supportSubscription:"",	//是否支持订阅(0：支持；1：不支持)	是	[string]		查看
           terminalType:""	          //终端类型（1 微信小程序 2 PC），系统参数配置	是	[string]
        },
        rules: {
          catalogName: [{required: true, message: '请输入栏目名称'}],
          idInstInstitution: [{required: true, message: '请选择所书场馆'}],
          catalogCode: [{required: true, message: '请输入栏目编码'}],
          catalogCoverId: [{required: true, message: '请上传栏目封面'}],
          catalogDetail: [{required: true, message: '请输入栏目详情'}],
          catalogSummary: [{required: true, message: '请输入栏目简述'}],
          catalogType: [{required: true, message: '请选择栏目类型'}],
          supportSubscription: [{required: true, message: '请选择是否支持订阅'}],
          terminalType: [{required: true, message: '请选择终端类型'}],
        },
      }
    },

    methods: {

      //封面
      handleSuccessCover(response, file, fileList){
        this.dialogForm.catalogCoverId = response.data.id;
        this.fileDetail(response.data.id,'cover')
      },
      // 空间封面上传
      async beforeAvatarUpload(file){
        // let width = 750;
        // let height = 350;
        // const isSize = await uploadSize(width,height,file);
        // return isSize;
      },
      //删除封面图片
      handleDeleteSingleUploader(attr){
        this.cover = '';
        this.dialogForm[attr] = '';
      },
      //文件地址
      fileDetail(id, attr) {
        fileDetail(id).then(res => {
          if (res.code == 200 && res.data) {
            this[attr] = this.baseImgUrl + res.data.imgSmallCompress
          }
          ;
        })
      },

      //确定
      sure() {
        this.$refs['dialogForm'].validate((valid) => {
          if (valid) {
            this.dialogType == 'add' && this.add();
            this.dialogType == 'edit' && this.edit();
          }
        })
      },

      //新增书单
      add() {
        let params =  this.dialogForm;
        saveMoudle(params).then(res => {
          if (res.code == 200) {
            this.$message.success('添加成功');
            this.$router.go(-1)
          }
        })
      },
      //编辑
      edit() {
        let params =  this.dialogForm;
        params.id = this.id;
        updateMoudle(params).then(res => {
          if (res.code == 200) {
            this.$message.success('编辑成功');
            this.$router.go(-1);
          }
        })
      },

      //获取详情
      getDetail(id) {
        getMoudleInfo(id).then(res => {
          if (res.code == 200) {
            for (let key in this.dialogForm) {
                if(key == "catalogType"){
                  this.dialogForm[key] = parseInt(res.functionCatalog[key]);
                } else {
                  this.dialogForm[key] = res.functionCatalog[key];
                }

            }
            this.id = res.functionCatalog.id;
            this.cover && this.fileDetail(this.dataForm.catalogCoverId,'cover')

          }
        })
      },


      //数据词典
      applicationDictionaryDataByTypeCode(code, arr) {
        applicationDictionaryDataByTypeCode(code).then(res => {
          if (res.code == 200) {
            res.data.forEach(item => {
              arr.push({
                key: item.valueName + item.value,
                value: item.value,
                label: item.valueName
              });
            });
          }
        });
      },

      //获取场馆列表
      getVenueData(params){
        getVenueData(params).then(res=>{
          if (res.code == 200){
            res.data.forEach(item => {
              this.venueList.push({
                value: item.id,
                label: item.name
              });
            });
          };
        })
      },
      //获取枚举
      getStatus(){
        getSupportStatus().then(res=>{
          if (res.code == 200){
            this.subscriptionList = res.data.map(e => {
              e.label = e.message;
              e.value = e.code;
              return e;
            });
          }
        })

      },

    },



    created() {
      if (this.$route.params.id) { //编辑
        this.dialogType = "edit";
        this.getDetail(this.$route.params.id);

      } else {  //新增
        this.dialogType = "add";
      }
      this.applicationDictionaryDataByTypeCode(
        "columnType",
        this.catalogTypeList
      );

      this.applicationDictionaryDataByTypeCode(
        "terminalType",
        this.terminalTypeList
      );

      this.getVenueData()
      this.getStatus()

    }
  }
</script>
<style>
  .el-tag + .el-tag,.el-tag  {
    margin-right: 10px;
    margin-bottom: 10px;
  } {
    margin-right: 10px;
    margin-bottom: 10px;
  }
</style>
<style lang="scss" scoped>

  .select-accout{
    .selected{
      &::after{
        font-size: 0 !important;
      }
    }
  }
</style>
