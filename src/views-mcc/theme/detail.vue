<template>
  <section class="view-container">
    <el-form class="hbsx-form" ref="dataForm"
             :model="dataForm"
             :rules="rules"
             inline
             label-width="120px"
             size="small" @submit.native.prevent>
      <el-form-item label="主题名称" prop="name">{{dataForm.name}}</el-form-item>
      <el-form-item label="主题分类" prop="type">{{dataForm.typeName}}</el-form-item>
      <el-form-item label="主题作品类型" prop="attribute">{{dataForm.attributeName}}</el-form-item>
      <el-form-item label="主题展示类型" prop="displayType">{{dataForm.displayTypeName?'私有':'公开'}}</el-form-item>
      <el-form-item label="是否可选主题" prop="selectFlag">{{dataForm.selectFlagName?'否':'是'}}</el-form-item>
      <el-form-item label="开始时间" prop="startTime">{{dataForm.startTime}}</el-form-item>
      <el-form-item label="结束时间" prop="endTime">{{dataForm.endTime}}</el-form-item>

      <div>
        <el-form-item label="pcBanner" prop="pcBanner">
            <img width="100" height="100" v-if="dataForm.pcBanner" class="single-uploader-img" :src="pcBanner">
        </el-form-item>
        <el-form-item label="mobileBanner" prop="mobileBanner">
            <img width="100" height="100" v-if="dataForm.mobileBanner" class="single-uploader-img" :src="mobileBanner">
        </el-form-item>

        <el-form-item label="PC封面" prop="pcCover">
            <img width="100" height="100" v-if="dataForm.pcCover" class="single-uploader-img" :src="pcCover">
        </el-form-item>
        <el-form-item label="移动端封面" prop="mobileCover">
            <img width="100" height="100" v-if="dataForm.mobileCover" class="single-uploader-img" :src="mobileCover">
        </el-form-item>
        <el-form-item label="pc端主题详情" prop="pcThemeDetails">
            <img width="100" height="100" v-if="dataForm.pcThemeDetails" class="single-uploader-img" :src="pcThemeDetails">
        </el-form-item>
        <el-form-item label="移动端主题详情" prop="mobileThemeDetails">
            <img width="100" height="100" v-if="dataForm.mobileThemeDetails" class="single-uploader-img" :src="mobileThemeDetails">
        </el-form-item>
        <el-form-item label="pc端奖项设置" prop="pcAwardPictures">
            <img width="100" height="100" v-if="dataForm.pcAwardPictures" class="single-uploader-img" :src="pcAwardPictures">
        </el-form-item>
        <el-form-item label="移动端奖项设置" prop="mobileAwardPictures">
            <img width="100" height="100" v-if="dataForm.mobileAwardPictures" class="single-uploader-img" :src="mobileAwardPictures">
        </el-form-item>
        <el-form-item label="PC端报名" prop="pcApplicationPicture">
            <img width="100" height="100" v-if="dataForm.pcApplicationPicture" class="single-uploader-img" :src="pcApplicationPicture">
        </el-form-item>
        <el-form-item label="移动端报名" prop="mobileApplicationPicture">
            <img width="100" height="100" v-if="dataForm.mobileApplicationPicture" class="single-uploader-img" :src="mobileApplicationPicture">
        </el-form-item>
      </div>
      <div>
        <el-form-item label="资料" prop="material">
          <div v-for="item in materialFileList" class="material-item" @click="downloadFile(item)"><i class="el-icon-document mr10"></i>{{item.name}}</div>
        </el-form-item>
      </div>




      <div class="btns-waper">
        <el-button size="small" @click="back">返回</el-button>
      </div>
    </el-form>



    <!--产品产品选择-->
  </section>
</template>

<script>
  import { getSubjectDetail  } from '@/api/mcc/theme.js'
  import { fileDetail, getfiles} from '@/api/file.js'
  export default {
    data () {
      return{
        pcBanner:'',
        mobileBanner:'',
        pcCover:'',
        mobileCover:'',
        pcThemeDetails:'',
        pcAwardPictures:'',
        mobileAwardPictures:'',
        pcApplicationPicture:'',
        mobileApplicationPicture:'',
        materialFileList:[],
        materialIds:[],
        dataForm:{
          /*id:'',
          name:'',pcCover:'',mobileCover:'',type:'',attribute:'',displayType:'',pcThemeDetails:'',
          mobileThemeDetails:'',pcAwardPictures:'',mobileAwardPictures:'',
          pcApplicationPicture:'',mobileApplicationPicture:'',selectFlag:'',startTime:'',endTime:'',material:''*/
        },
        rules:{
          /*name:[{ required: true, message: '请输入主题名称'}],
          type:[{ required: true, message: '请选择主题类型'}],
          idBaseCustomer:[{ required: true, message: '请选择客户'}],
          idBaseContacts:[{ required: true, message: '请选择客户联系人'}],
          responsiblePerson:[{ required: true, message: '请选择责任人'}],
          sellPerson:[{ required: true, message: '请选择销售责任人'}],
          predictPrice:[{ required: true, message: '请输入预计金额'},{validator: checkMoney}],*/
        },
      }
    },
    created(){
      let id = this.$route.params.id; //主题ID
      id && this.getSubjectDetail(id);
    },
    methods:{
      // 下载附件
      downloadFile(item){
        if (item.url){
          location.href = item.url;
        } else{
          this.$message.warning('附件地址错误')
        }
      },
      // 文件地址
      fileDetail(id,attr){
        fileDetail(id).then(res=>{
          if (res.code == 200 && res.data){
            this[attr] = this.baseImgUrl + res.data.imgSmallCompress
          };
        })
      },
      getfiles(ids){
        this.materialFileList = [];
        getfiles({ids:ids}).then(res=>{
          if(res.code == 200){
            res.data.forEach(e=>{
              this.materialFileList.push({name:e.name,url:this.baseImgUrl + e.path,id:e.id})
            })
          }
        })
      },
      //详情
      getSubjectDetail(id) {
        getSubjectDetail(id).then(res => {
          if (res.code == 200) {
            this.dataForm  = res.data;

            this.dataForm.material && this.getfiles(this.dataForm.material)
            this.mobileBanner = res.data.mobileBannerInfo ? this.baseImgUrl + res.data.mobileBannerInfo.path :'';
            this.pcBanner =  res.data.pcBannerInfo ? this.baseImgUrl + res.data.pcBannerInfo.path :'';
            this.pcCover =  res.data.pcCoverInfo ? this.baseImgUrl + res.data.pcCoverInfo.path :'';
            this.mobileCover =  res.data.mobileCoverInfo ? this.baseImgUrl + res.data.mobileCoverInfo.path :'';
            this.pcThemeDetails =  res.data.pcThemeDetailsInfo ? this.baseImgUrl + res.data.pcThemeDetailsInfo.path :'';
            this.mobileThemeDetails =  res.data.mobileThemeDetailsInfo ? this.baseImgUrl + res.data.mobileThemeDetailsInfo.path :'';
            this.pcAwardPictures =  res.data.pcAwardPicturesInfo ? this.baseImgUrl + res.data.pcAwardPicturesInfo.path :'';
            this.mobileAwardPictures =  res.data.mobileAwardPicturesInfo ? this.baseImgUrl + res.data.mobileAwardPicturesInfo.path :'';
            this.pcApplicationPicture =  res.data.pcApplicationPictureInfo ? this.baseImgUrl + res.data.pcApplicationPictureInfo.path :'';
            this.mobileApplicationPicture =  res.data.mobileApplicationPictureInfo ? this.baseImgUrl + res.data.mobileApplicationPictureInfo.path :'';
          }
        })
      }
    }
  };
</script>

<style lang="scss" scoped>
.material-item{
  color: #1482f0;
  cursor: pointer;
}
</style>
