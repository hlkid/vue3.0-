<template>
    <section class="view-container">
      <el-form class="hbsx-form" ref="dataForm"
               :model="dataForm"
               :rules="rules"
               inline
               label-width="120px"
               size="small" @submit.native.prevent>
        <el-form-item label="主题名称" prop="name" class="block">
          <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 5 }" v-model.trim="dataForm.name"></el-input>
        </el-form-item>

        <el-form-item label="主题分类" prop="type">
          <el-select v-model="dataForm.type" clearable placeholder="">
            <el-option :label="item.label" :value="item.value" v-for="item in typeSubjectList"
                       :key="item.key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="主题作品类型" prop="attribute">
          <el-select v-model="dataForm.attribute" clearable placeholder="">
            <el-option :label="item.label" :value="item.value" v-for="item in subjectAttributeList"
                       :key="item.key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="主题展示类型" prop="displayType">
          <el-select v-model="dataForm.displayType" clearable placeholder="">
            <el-option :label="item.label" :value="item.value" v-for="item in displayTypeList"
                       :key="item.key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否可选主题" prop="selectFlag">
          <el-select v-model="dataForm.selectFlag" clearable placeholder="">
            <el-option :label="item.label" :value="item.value" v-for="item in selectFlagList"
                       :key="item.key"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="开始结束时间" prop="startTime">
          <el-date-picker
            @change="onTimeChange"
            v-model="times"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetimerange"
            range-separator="~"
            start-placeholder="开始时间"
            end-placeholder="结束时间">
          </el-date-picker>
        </el-form-item>
        <!--<el-form-item label="开始时间" prop="startTime">
          <el-date-picker
            value-format="yyyy-MM-dd HH:mm:ss"
            v-model="dataForm.startTime"
            type="date"
            placeholder="">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间" prop="endTime">
          <el-date-picker
            value-format="yyyy-MM-dd HH:mm:ss"
            v-model="dataForm.endTime"
            type="date"
            placeholder="">
          </el-date-picker>
        </el-form-item>-->

        <div>
          <el-form-item label="pcBanner" prop="pcBanner">
            <el-upload
              class="single-uploader"
              :action="uploadFileParamsUrl"
              :on-success="handleSuccessPcBanner"
              :show-file-list="false">
              <img v-if="dataForm.pcBanner" class="single-uploader-img" :src="pcBanner">
              <i v-else class="el-icon-plus single-uploader-icon"></i>
              <div slot="tip" class="single-uploader-handle" v-if="dataForm.pcBanner">
                <i class="single-uploader-delete el-icon-delete" @click.self.stop="handleDeleteSingleUploader('pcBanner')"></i>
              </div>
            </el-upload>
          </el-form-item>
          <el-form-item label="mobileBanner" prop="mobileBanner">
            <el-upload
              class="single-uploader"
              :action="uploadFileParamsUrl"
              :on-success="handleSuccessMobileBanner"
              :show-file-list="false">
              <img v-if="dataForm.mobileBanner" class="single-uploader-img" :src="mobileBanner">
              <i v-else class="el-icon-plus single-uploader-icon"></i>
              <div slot="tip" class="single-uploader-handle" v-if="dataForm.mobileBanner">
                <i class="single-uploader-delete el-icon-delete" @click.self.stop="handleDeleteSingleUploader('mobileBanner')"></i>
              </div>
            </el-upload>
          </el-form-item>


          <el-form-item label="PC封面" prop="pcCover">
            <el-upload
              class="single-uploader"
              :action="uploadFileParamsUrl"
              :on-success="handleSuccessPcCover"
              :show-file-list="false">
              <img v-if="dataForm.pcCover" class="single-uploader-img" :src="pcCover">
              <i v-else class="el-icon-plus single-uploader-icon"></i>
              <div slot="tip" class="single-uploader-handle" v-if="dataForm.pcCover">
                <i class="single-uploader-delete el-icon-delete" @click.self.stop="handleDeleteSingleUploader('pcCover')"></i>
              </div>
            </el-upload>
          </el-form-item>
          <el-form-item label="移动端封面" prop="mobileCover">
            <el-upload
              class="single-uploader"
              :action="uploadFileParamsUrl"
              :on-success="handleSuccessMobileCover"
              :show-file-list="false">
              <img v-if="dataForm.mobileCover" class="single-uploader-img" :src="mobileCover">
              <i v-else class="el-icon-plus single-uploader-icon"></i>
              <div slot="tip" class="single-uploader-handle" v-if="dataForm.mobileCover">
                <i class="single-uploader-delete el-icon-delete" @click.self.stop="handleDeleteSingleUploader('mobileCover')"></i>
              </div>
            </el-upload>
          </el-form-item>
          <el-form-item label="pc端主题详情" prop="pcThemeDetails">
            <el-upload
              class="single-uploader"
              :action="uploadFileParamsUrl"
              :on-success="handleSuccessPcThemeDetails"
              :show-file-list="false">
              <img v-if="dataForm.pcThemeDetails" class="single-uploader-img" :src="pcThemeDetails">
              <i v-else class="el-icon-plus single-uploader-icon"></i>
              <div slot="tip" class="single-uploader-handle" v-if="dataForm.pcThemeDetails">
                <i class="single-uploader-delete el-icon-delete" @click.self.stop="handleDeleteSingleUploader('pcThemeDetails')"></i>
              </div>
            </el-upload>
          </el-form-item>
          <el-form-item label="移动端主题详情" prop="mobileThemeDetails">
            <el-upload
              class="single-uploader"
              :action="uploadFileParamsUrl"
              :on-success="handleSuccessMobileThemeDetails"
              :show-file-list="false">
              <img v-if="dataForm.mobileThemeDetails" class="single-uploader-img" :src="mobileThemeDetails">
              <i v-else class="el-icon-plus single-uploader-icon"></i>
              <div slot="tip" class="single-uploader-handle" v-if="dataForm.mobileThemeDetails">
                <i class="single-uploader-delete el-icon-delete" @click.self.stop="handleDeleteSingleUploader('mobileThemeDetails')"></i>
              </div>
            </el-upload>
          </el-form-item>
          <el-form-item label="pc端奖项设置" prop="pcAwardPictures">
            <el-upload
              class="single-uploader"
              :action="uploadFileParamsUrl"
              :on-success="handleSuccessPcAwardPictures"
              :show-file-list="false">
              <img v-if="dataForm.pcAwardPictures" class="single-uploader-img" :src="pcAwardPictures">
              <i v-else class="el-icon-plus single-uploader-icon"></i>
              <div slot="tip" class="single-uploader-handle" v-if="dataForm.pcAwardPictures">
                <i class="single-uploader-delete el-icon-delete" @click.self.stop="handleDeleteSingleUploader('pcAwardPictures')"></i>
              </div>
            </el-upload>
          </el-form-item>
          <el-form-item label="移动端奖项设置" prop="mobileAwardPictures">
            <el-upload
              class="single-uploader"
              :action="uploadFileParamsUrl"
              :on-success="handleSuccessMobileAwardPictures"
              :show-file-list="false">
              <img v-if="dataForm.mobileAwardPictures" class="single-uploader-img" :src="mobileAwardPictures">
              <i v-else class="el-icon-plus single-uploader-icon"></i>
              <div slot="tip" class="single-uploader-handle" v-if="dataForm.mobileAwardPictures">
                <i class="single-uploader-delete el-icon-delete" @click.self.stop="handleDeleteSingleUploader('mobileAwardPictures')"></i>
              </div>
            </el-upload>
          </el-form-item>
          <el-form-item label="PC端报名" prop="pcApplicationPicture">
            <el-upload
              class="single-uploader"
              :action="uploadFileParamsUrl"
              :on-success="handleSuccessPcApplicationPicture"
              :show-file-list="false">
              <img v-if="dataForm.pcApplicationPicture" class="single-uploader-img" :src="pcApplicationPicture">
              <i v-else class="el-icon-plus single-uploader-icon"></i>
              <div slot="tip" class="single-uploader-handle" v-if="dataForm.pcApplicationPicture">
                <i class="single-uploader-delete el-icon-delete" @click.self.stop="handleDeleteSingleUploader('pcApplicationPicture')"></i>
              </div>
            </el-upload>
          </el-form-item>
          <el-form-item label="移动端报名" prop="mobileApplicationPicture">
            <el-upload
              class="single-uploader"
              :action="uploadFileParamsUrl"
              :on-success="handleSuccessMobileApplicationPicture"
              :show-file-list="false">
              <img v-if="dataForm.mobileApplicationPicture" class="single-uploader-img" :src="mobileApplicationPicture">
              <i v-else class="el-icon-plus single-uploader-icon"></i>
              <div slot="tip" class="single-uploader-handle" v-if="dataForm.mobileApplicationPicture">
                <i class="single-uploader-delete el-icon-delete" @click.self.stop="handleDeleteSingleUploader('mobileApplicationPicture')"></i>
              </div>
            </el-upload>
          </el-form-item>
        </div>
        <div>
          <el-form-item label="资料" prop="material">
            <el-upload
              :action="uploadFileParamsUrl"
              :on-remove="handleRemoveMaterial"
              :on-success="handleSuccessMaterial"
              :file-list="materialFileList">
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-form-item>
        </div>

        <div class="btns-waper">
            <el-button size="small" @click="back">返回</el-button>
            <el-button size="small" type="primary" :disabled="vloading" @click="sure">提 交</el-button>
        </div>
      </el-form>



      <!--产品产品选择-->
    </section>
</template>

<script>
  import { addSubject,editSubject,getSubjectDetail  } from '@/api/mcc/theme.js'
  import { applicationDictionaryDataByTypeCode } from '@/api/config.js'
  import { fileDetail ,uploadFileUrl, getfiles} from '@/api/file.js'
  import {checkMoney} from "@/utils/validate";
  export default {
    data(){
      return{
        uploadFileUrl:uploadFileUrl,
        type:'',//add新增edit编辑
        pcBanner:'',
        mobileBanner:'',
        pcCover:'',
        mobileCover:'',
        pcThemeDetails:'',
        mobileThemeDetails:'',
        pcAwardPictures:'',
        mobileAwardPictures:'',
        pcApplicationPicture:'',
        mobileApplicationPicture:'',
        materialFileList:[],
        materialIds:[],
        times: '',
        dataForm:{
          id:'',
          name:'',
          pcBanner:'', mobileBanner:'',
          pcCover:'',mobileCover:'',type:'',attribute:'',displayType:'',pcThemeDetails:'',
          mobileThemeDetails:'',pcAwardPictures:'',mobileAwardPictures:'',
          pcApplicationPicture:'',mobileApplicationPicture:'',selectFlag:'',startTime:'',endTime:'',material:''
        },
        rules:{
          name:[{ required: true, message: '请输入主题名称'}],
          type:[{ required: true, message: '请选择主题分类'}],
          attribute:[{ required: true, message: '请选择主题作品'}],
          displayType:[{ required: true, message: '请选择主题展示类型'}],
          pcBanner:[{ required: true, message: '请上传主题banner'}],
          mobileBanner:[{ required: true, message: '请上传移动端主题banner'}],
          pcCover:[{ required: true, message: '请上传PC封面'}],
          mobileCover:[{ required: true, message: '请上传移动端封面'}],
          pcThemeDetails:[{ required: true, message: '请上传PC主题详细'}],
          mobileThemeDetails:[{ required: true, message: '请上传移动端主题详细'}],

          startTime:[{ required: true, message: '请选择开始时间'}],
          endTime:[{ required: true, message: '请选择结束时间'}]
        },
        //数据字典
        typeSubjectList:[],
        selectFlagList:[],
        displayTypeList:[],
        subjectAttributeList:[],
      }
    },
    components:{},
    created(){
      let id = this.$route.params.id; //主题ID
      if(id){
        this.type = 'edit';
        this.getSubjectDetail(id);
      }else{
        this.type = 'add';
      }
      //获取主题类型列表
      this.applicationDictionaryDataByTypeCode('typeSubject',this.typeSubjectList);
      this.applicationDictionaryDataByTypeCode('selectFlag',this.selectFlagList);
      this.applicationDictionaryDataByTypeCode('displayType',this.displayTypeList);
      this.applicationDictionaryDataByTypeCode('subjectAttribute',this.subjectAttributeList);
    },
    methods:{
      //时间区间
      onTimeChange(val) {
        if (val.length) {
          this.dataForm.startTime = val[0]
          this.dataForm.endTime = val[1]
        }
      },
      sure(){
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.dataForm.material = this.materialIds.toString();

            this.type == 'add' && this.addSubject();
            this.type == 'edit' && this.editSubject();
          }
        })
      },
      //移除图片
      handleDeleteSingleUploader(attr){
        this[attr] = '';
        this.dataForm[attr] = '';
      },
      //qrCode文件上传 ----上传成功--
      handleSuccessPcBanner(response, file, fileList){
        this.dataForm.pcBanner = response.data.id;
        this.fileDetail(response.data.id,'pcBanner')
      },
      handleSuccessMobileBanner(response, file, fileList){
        this.dataForm.mobileBanner = response.data.id;
        this.fileDetail(response.data.id,'mobileBanner')
      },
      handleSuccessPcCover(response, file, fileList){
        this.dataForm.pcCover = response.data.id;
        this.fileDetail(response.data.id,'pcCover')
      },
      handleSuccessMobileCover(response, file, fileList){
        this.dataForm.mobileCover = response.data.id;
        this.fileDetail(response.data.id,'mobileCover')
      },
      handleSuccessPcThemeDetails(response, file, fileList){
        this.dataForm.pcThemeDetails = response.data.id;
        this.fileDetail(response.data.id,'pcThemeDetails')
      },
      handleSuccessMobileThemeDetails(response, file, fileList){
        this.dataForm.mobileThemeDetails = response.data.id;
        this.fileDetail(response.data.id,'mobileThemeDetails')
      },
      handleSuccessPcAwardPictures(response, file, fileList){
        this.dataForm.pcAwardPictures = response.data.id;
        this.fileDetail(response.data.id,'pcAwardPictures')
      },
      handleSuccessMobileAwardPictures(response, file, fileList){
        this.dataForm.mobileAwardPictures = response.data.id;
        this.fileDetail(response.data.id,'mobileAwardPictures')
      },
      handleSuccessPcApplicationPicture(response, file, fileList){
        this.dataForm.pcApplicationPicture = response.data.id;
        this.fileDetail(response.data.id,'pcApplicationPicture')
      },
      handleSuccessMobileApplicationPicture(response, file, fileList){
        this.dataForm.mobileApplicationPicture = response.data.id;
        this.fileDetail(response.data.id,'mobileApplicationPicture')
      },

      // 文件上传 ----删除一个文件的回调--
      handleRemoveMaterial(file, fileList) {
        this.materialIds = [];
        fileList.forEach(e=>{
          this.materialIds.push(e.id)
        })
      },
      // 文件上传 ----上传成功--
      handleSuccessMaterial(response, file, fileList){
        console.log(response, file, fileList)
        this.materialIds = [response.data.id]
        this.materialFileList = [{
          id: response.data.id,
          name: response.data.name,
          path: this.baseImgUrl + response.data.path
        }]
        /*fileList.forEach(e=>{
          if(e.response){
            this.materialIds.push(e.response.data.id);
          }
        });*/
      },

      //文件地址
      fileDetail(id,attr){
        fileDetail(id).then(res=>{
          if (res.code == 200 && res.data){
            this[attr] = this.baseImgUrl + res.data.path
          };
        })
      },
      getfiles(ids){
          this.materialFileList = [];
          this.materialIds = [];
          getfiles({ids:ids}).then(res=>{
            if(res.code == 200){
              res.data.forEach(e=>{
                this.materialIds.push(e.id)
                this.materialFileList.push({name:e.name,url:this.baseImgUrl + e.path,id:e.id})
              })
            }
          })
      },
      //添加
      addSubject(){
        addSubject(this.dataForm).then(res=>{
          if (res.code == 200){
            this.$message.success('添加成功');
            this.$router.back()
          }
        })
      },
      //编辑
      editSubject(){
        editSubject(this.dataForm).then(res=>{
          if (res.code == 200){
            this.$message.success('编辑成功')
            this.$router.back()
          }
        })
      },
      //详情
      getSubjectDetail(id) {
        getSubjectDetail(id).then(res => {
          if (res.code == 200) {
            for (let key in this.dataForm){
              this.dataForm[key] = res.data[key]
            };
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

            this.times = [this.dataForm.startTime,this.dataForm.endTime];
            /*this.dataForm.mobileBanner && this.fileDetail(this.dataForm.mobileBanner,'mobileBanner')
            this.dataForm.pcBanner && this.fileDetail(this.dataForm.pcBanner,'pcBanner')
            this.dataForm.pcCover && this.fileDetail(this.dataForm.pcCover,'pcCover')
            this.dataForm.mobileCover && this.fileDetail(this.dataForm.mobileCover,'mobileCover')
            this.dataForm.pcThemeDetails && this.fileDetail(this.dataForm.pcThemeDetails,'pcThemeDetails')
            this.dataForm.pcAwardPictures && this.fileDetail(this.dataForm.pcAwardPictures,'pcAwardPictures')
            this.dataForm.mobileAwardPictures && this.fileDetail(this.dataForm.mobileAwardPictures,'mobileAwardPictures')
            this.dataForm.pcApplicationPicture && this.fileDetail(this.dataForm.pcApplicationPicture,'pcApplicationPicture')
            this.dataForm.mobileApplicationPicture && this.fileDetail(this.dataForm.mobileApplicationPicture,'mobileApplicationPicture')*/
          }
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

</style>
