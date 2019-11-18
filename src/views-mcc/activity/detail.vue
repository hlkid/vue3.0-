<template>
  <section class="view-container">
    <el-form class="hbsx-form" ref="dataForm"
             :model="dataForm"
             inline
             label-width="100px"
             size="small" @submit.native.prevent>
      <div class="tab-box">
        <el-radio-group v-model="tabIndex" size="small">
          <el-radio-button label="0">活动基本信息</el-radio-button>
          <el-radio-button label="1">活动图片和视频</el-radio-button>
        </el-radio-group>
      </div>


      <template v-if="tabIndex == 0">
        <el-form-item label="活动名称" prop="name">{{dataForm.name}}</el-form-item>
<!--        <el-form-item label="主题" prop="subjectName">-->
<!--          {{dataForm.subjectName}}-->
<!--        </el-form-item>-->
        <el-form-item label="活动分类" prop="type">
          {{dataForm.typeName}}
        </el-form-item>
        <el-form-item label="征集类型" prop="attribute" v-if="dataForm.type == 0">
          {{dataForm.attributeName}}
        </el-form-item>
<!--        <el-form-item label="排序" prop="sequence">-->
<!--          {{dataForm.sequence}}-->
<!--        </el-form-item>-->
        <el-form-item label="联系方式" prop="contactInfo">
          {{dataForm.contactInfo}}
        </el-form-item>
<!--        <el-form-item label="联系人" prop="contactPerson">-->
<!--          {{dataForm.contactPerson}}-->
<!--        </el-form-item>-->
        <el-form-item label="可预约人数" prop="appointmentNum">
          {{dataForm.appointmentNum}}
        </el-form-item>

        <el-form-item label="区域编码" prop="districtCode">
          {{dataForm.districtCode}}
        </el-form-item>

        <el-form-item label="地点" prop="address">
          {{dataForm.address}}
        </el-form-item>
        <el-form-item label="开始时间" prop="startTime">
          {{dataForm.startTime}}
        </el-form-item>
        <el-form-item label="结束时间" prop="endTime">
          {{dataForm.endTime}}
        </el-form-item>

        <el-form-item label="温馨提示" prop="copyright" class="block edit-form">
          <div v-html="dataForm.copyright"></div>
        </el-form-item>
        <el-form-item label="活动对象" prop="requirement" class="block edit-form">
          <div v-html="dataForm.requirement"></div>
        </el-form-item>
        <el-form-item label="内容" prop="content" class="block edit-form">
          <div v-html="dataForm.content"></div>
        </el-form-item>
<!--        <el-form-item label="详细" prop="detail" class="block edit-form">-->
<!--          <div v-html="dataForm.detail"></div>-->
<!--        </el-form-item>-->
        <div>
          <el-form-item label="PC封面" prop="pcCover">
            <img width="100" height="100" v-if="dataForm.pcCover" class="single-uploader-img" :src="pcCover">
          </el-form-item>
          <el-form-item label="移动端封面" prop="mobileCover">
            <img width="100" height="100" v-if="dataForm.mobileCover" class="single-uploader-img" :src="mobileCover">
          </el-form-item>
        </div>
      </template>

      <template v-if="tabIndex == 1">
        <h3>照片</h3>
        <div class="upload-wraper">
          <ul class="el-upload-list el-upload-list--picture-card">
            <li class="el-upload-list__item is-success" v-for="(item,index) in photoList" :key="item.id">
              <template v-if="item.type == 0">
                <img :src="item.url" alt="" class="el-upload-list__item-thumbnail">
              </template>
              <template v-if="item.type == 2">
                <video :src="item.url"  controls class="el-upload-list__item-thumbnail"></video>
              </template>
              <span class="el-upload-list__item-actions">
                <span class="el-upload-list__item-preview" @click="handlePhotoPreview(item)">
                  <i class="el-icon-zoom-in"></i>
                </span>
              </span>
            </li>
          </ul>
        </div>
        <h3>视频</h3>
        <div class="upload-wraper">
          <ul class="el-upload-list el-upload-list--picture-card">
            <li class="el-upload-list__item is-success" v-for="(item,index) in videoList" :key="item.id">
              <template v-if="item.type == 0">
                <img :src="item.url" alt="" class="el-upload-list__item-thumbnail">
              </template>
              <template v-if="item.type == 2">
                <video :src="item.url"  controls class="el-upload-list__item-thumbnail"></video>
              </template>
              <span class="el-upload-list__item-actions">
                <span class="el-upload-list__item-preview" @click="handlePhotoPreview(item)">
                  <i class="el-icon-zoom-in"></i>
                </span>
              </span>
            </li>
          </ul>
        </div>

        <h3>总结</h3>
        <div class="upload-wraper">
          {{dataForm.summary}}
        </div>
      </template>

      <div class="btns-waper">
        <el-button size="small" @click="back">返回</el-button>
        <el-button size="small" type="primary" :disabled="vloading" @click="audit" v-if="$route.query.type == 'audit'">审 核</el-button>
      </div>
    </el-form>


    <el-dialog :visible.sync="currentViewDialog">
      <img width="100%" :src="currentView.url" alt="" v-if="currentView.type == 0" />
      <video width="100%" controls :src="currentView.url" v-if="currentView.type == 2"></video>
    </el-dialog>
  </section>
</template>

<script>
  import { getActivityDetail,auditActivity  } from '@/api/mcc/activity.js'
  import { fileDetail, getfiles} from '@/api/file.js'
  export default {
    data(){
      return{
        tabIndex:0,
        photoList:[],
        videoList:[],
        currentViewDialog:false,
        currentView:{},


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
          /*name:[{ required: true, message: '请输入活动名称'}],
          type:[{ required: true, message: '请选择活动类型'}],
          idBaseCustomer:[{ required: true, message: '请选择客户'}],
          idBaseContacts:[{ required: true, message: '请选择客户联系人'}],
          responsiblePerson:[{ required: true, message: '请选择责任人'}],
          sellPerson:[{ required: true, message: '请选择销售责任人'}],
          predictPrice:[{ required: true, message: '请输入预计金额'},{validator: checkMoney}],*/
        },
      }
    },
    created(){
      let id = this.$route.params.id; //活动ID
      id && this.getActivityDetail(id);
    },
    methods:{
      //审核
      audit(){
        this.commonReviewDialog((params,isReview)=>{
          if(isReview){
            params.status = 1
          }else{
            params.status = 2
            params.reason = params.value.value;
          }
          this.auditActivity(params);
        },{ id:this.dataForm.id},'审核');
      },
      auditActivity(data){
        auditActivity(data).then(res=>{
          if (res.code == 200){
            this.$message.success('审核成功')
            this.$router.back()
          }
        })
      },
      handlePhotoPreview(file){
        this.currentViewDialog = true
        this.currentView = file;
      },
      //文件地址
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
      getActivityDetail(id) {
        getActivityDetail(id).then(res => {
          if (res.code == 200) {
            this.dataForm  = res.data;

            this.dataForm.material && this.getfiles(this.dataForm.material)
            this.dataForm.pcCover && this.fileDetail(this.dataForm.pcCover,'pcCover')
            this.dataForm.mobileCover && this.fileDetail(this.dataForm.mobileCover,'mobileCover')
            this.dataForm.pcThemeDetails && this.fileDetail(this.dataForm.pcThemeDetails,'pcThemeDetails')
            this.dataForm.pcAwardPictures && this.fileDetail(this.dataForm.pcAwardPictures,'pcAwardPictures')
            this.dataForm.mobileAwardPictures && this.fileDetail(this.dataForm.mobileAwardPictures,'mobileAwardPictures')
            this.dataForm.pcApplicationPicture && this.fileDetail(this.dataForm.pcApplicationPicture,'pcApplicationPicture')
            this.dataForm.mobileApplicationPicture && this.fileDetail(this.dataForm.mobileApplicationPicture,'mobileApplicationPicture')

            this.photoList = res.data.photoInfo ? res.data.photoInfo.map(i=>{
              i.url = this.baseImgUrl + i.path
              return i
            }) : [];
            this.videoList= res.data.videoInfo ? res.data.videoInfo.map(i=>{
              i.url = this.baseImgUrl + i.path
              return i
            }) : [];
          }
        })
      }
    }
  };
</script>

<style lang="scss" scoped>
.tab-box{
  padding: 0 30px;
  margin-bottom: 30px;
}
h3{
  padding: 0 30px;
}
.upload-wraper{
  padding: 0 30px;
}
</style>
