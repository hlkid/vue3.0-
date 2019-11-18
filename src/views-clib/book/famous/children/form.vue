<template>
  <section class="view-container">
    <el-form class="hbsx-form" inline ref="dialogForm" :model="dialogForm" label-width="120px" :rules="rules"
             size="small">
      <el-form-item label="书单名称" prop="name">
        <!--        :disabled="true"-->
        <el-input v-model.trim="dialogForm.name" clearable placeholder="请输入书单名称" ></el-input>
      </el-form-item>
      <el-form-item label="所属场馆" prop="idInstInstitution">
        <el-select v-model="dialogForm.idInstInstitution" clearable placeholder="请选择场馆名称">
          <el-option
            v-for="item in venueList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
<!--      <div>-->
<!--        <el-form-item label="书单分类" prop="booklistType" >-->
<!--          <el-select v-model="dialogForm.booklistType" clearable placeholder="请选择书单类型">-->
<!--            <el-option-->
<!--              v-for="item in bookTypeList"-->
<!--              :key="item.value"-->
<!--              :label="item.label"-->
<!--              :value="item.value">-->
<!--            </el-option>-->
<!--          </el-select>-->
<!--        </el-form-item>-->
<!--      </div>-->
      <el-form-item label="简介" prop="summary" class="block">
        <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 10 }" v-model="dialogForm.summary" clearable placeholder="请输入详细位置"></el-input>
      </el-form-item>
      <el-form-item label="详情" prop="detail" class="edit-form">
        <WangEditor v-model="dialogForm.detail"></WangEditor>
      </el-form-item>
      <div>
        <el-form-item label="封面" prop="coverId">
          <el-upload
            class="single-uploader"
            :action="uploadFileParamsUrl"
            :on-success="handleSuccessCover"
            :before-upload="beforeAvatarUpload"
            :show-file-list="false">
            <img v-if="dialogForm.coverId" class="single-uploader-activity" :src="cover">
            <i v-else class="el-icon-plus single-uploader-icon"></i>
            <div slot="tip" class="single-uploader-handle" v-if="dialogForm.coverId">
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
  import { saveBook,getBookInfo,updateBook} from "@/api/clib/book";
  import { fileDetail ,uploadFileUrl, getfiles} from '@/api/file.js'
  import WangEditor from '@/components/WangEditor'
  import { isDataType ,uploadSize} from '@/utils/common.js'
  import { getVenueData } from '@/api/mcc/venue.js'

  /***模拟数据开始**/

    //场馆名称
  const instList = [
      {value:1,label:'场馆1'},
      {value:2,label:'场馆2'},
      {value:3,label:'场馆3'},
      {value:4,label:'场馆4'}
    ];


  //书单类型
  const bookTypeList = [
    {value:1,label:'冬日好书'},
    {value:2,label:'好书推荐'},
    {value:3,label:'精选书单'},
  ];
  /***模拟数据 结束**/


  export default {
    components: {WangEditor},
    data() {
      return {
        id:'',//书单主键ID
        uploadFileUrl: uploadFileUrl,//上传地址
        dialogType:'',//判断新增还是编辑
        bookTypeList:bookTypeList, //书单类型
        venueList:[], //所属场馆
        cover:'',//回显图片
        dialogForm: {
          idInstInstitution:"",   // 场馆id
          name:'', //书单名称
          // booklistType:"", // 书单分类
          catalogType:"selectedbooks_zjmj", //分类
          summary:"", //简介
          detail:"", //书单详细信息
          coverId:"", //书单封面图片id
        },
        rules: {
          name: [{required: true, message: '请输入书单名称'}],
          idInstInstitution: [{required: true, message: '请选择所书场馆'}],
          // booklistType: [{required: true, message: '请选择书单类型'}],
          summary: [{required: true, message: '请输入简介'}],
          detail: [{required: true, message: '请输入详情'}],
          coverId: [{required: true, message: '请上传封面'}],
        },
      }
    },

    methods: {

      //封面
      handleSuccessCover(response, file, fileList){
        this.dialogForm.coverId = response.data.id;
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
        saveBook(params).then(res => {
          if (res.code == 200) {
            this.$message.success('添加成功');
            this.$router.go(-1)
          }
        })
      },
      //编辑
      edit() {
        let params = {
          id:this.id,
          name:this.dialogForm.name,
          // booklistType:this.dialogForm.booklistType,
          summary:this.dialogForm.summary,
          detail:this.dialogForm.detail,
          coverId:this.dialogForm.coverId,
        }
        updateBook(params).then(res => {
          if (res.code == 200) {
            this.$message.success('编辑成功');
            this.$router.go(-1);
          }
        })
      },

      //获取详情
      getDetail(id) {
        getBookInfo(id).then(res => {
          if (res.code == 200) {
            for (let key in this.dialogForm) {
                this.dialogForm[key] = res.bookListInfo[key];
            }
            this.id = res.bookListInfo.id;
            this.cover && this.fileDetail(this.dataForm.coverId,'cover')

          }
        })
      },

      //数据词典
      // getDicListByTypeCode(code, arr) {
      //   getDicListByTypeCode(code).then(res => {
      //     if (res.code == 200) {
      //       res.data.forEach(item => {
      //         arr.push({
      //           key: item.valueName + item.value,
      //           value: item.value,
      //           label: item.valueName
      //         })
      //       })
      //     }
      //   })
      // },

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
            this.dialogForm.idInstInstitution = res.data[0].id
          };
        })
      },

    },



    created() {
      if (this.$route.params.id) { //编辑
        this.getDetail(this.$route.params.id);
        this.dialogType = "edit";
      } else {  //新增
        this.dialogType = "add";
      }

      this.getVenueData()

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
