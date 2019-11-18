<template>
    <section class="view-container">
      <el-form class="hbsx-form" ref="dataForm"  :rules="rules"
               :model="dataForm"
               label-width="120px"
               size="small" @submit.native.prevent>

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
              <!--<a class="el-upload-list__item-name"><i class="el-icon-document"></i>{{item.name}}</a>-->
              <label class="el-upload-list__item-status-label"><i class="el-icon-upload-success el-icon-check"></i></label>
              <span class="el-upload-list__item-actions">
                <span class="el-upload-list__item-preview" @click="handlePhotoPreview(item)">
                  <i class="el-icon-zoom-in"></i>
                </span>
                <span class="el-upload-list__item-delete" @click="handlePhotoRemove(item,index)">
                  <i class="el-icon-delete"></i>
                </span>
              </span>
              <div></div>
            </li>
            <li class="el-upload-list__item">
              <el-upload
                list-type="picture-card"
                :limit=10
                accept="image/png, image/jpeg"
                :action="uploadFileParamsUrl"
                :on-success="handleSuccessPhoto"
                :on-error="handlePhotoError"
                :on-preview="handlePhotoPreview"
                :on-remove="handlePhotoRemove"
                :before-upload="beforePhotoUpload"
                :show-file-list="false"

                :file-list="photoList">
                <i class="el-icon-plus" v-if="photoList.length<11"></i>
              </el-upload>
            </li>
            <div class="tips">提示：最多上传10张照片</div>
          </ul>
          <!--<el-upload
            list-type="picture-card"
            accept="image/png, image/jpeg"
            :action="uploadFileParamsUrl"
            :on-success="handleSuccessPhoto"
            :on-preview="handlePhotoPreview"
            :on-remove="handlePhotoRemove"
            :before-upload="beforePhotoUpload"
            :file-list="photoList">
            <i class="el-icon-plus"></i>
          </el-upload>-->
        </div>


        <!--<ul class="el-upload-list el-upload-list&#45;&#45;picture-card">
          <li class="el-upload-list__item is-success" v-for="(item,index) in photoList" :key="item.id">
            <template v-if="item.type == 0">
              <img :src="item.url" alt="" class="el-upload-list__item-thumbnail">
            </template>
            <template v-if="item.type == 2">
              <video :src="item.url"  controls="controls" class="el-upload-list__item-thumbnail"></video>
            </template>
            &lt;!&ndash;<a class="el-upload-list__item-name"><i class="el-icon-document"></i>{{item.name}}</a>&ndash;&gt;
            <label class="el-upload-list__item-status-label"><i class="el-icon-upload-success el-icon-check"></i></label>
            <span class="el-upload-list__item-actions">
                <span class="el-upload-list__item-preview">
                  <i class="el-icon-zoom-in"></i>
                </span>
                <span class="el-upload-list__item-delete">
                  <i class="el-icon-delete"></i>
                </span>
              </span>
          </li>
          <li class="el-upload-list__item">
            <el-upload
              list-type="picture-card"
              accept="image/png, image/jpeg"
              :action="uploadFileParamsUrl"
              :on-success="handleSuccessPhoto"
              :on-preview="handlePhotoPreview"
              :on-remove="handlePhotoRemove"
              :before-upload="beforePhotoUpload"
              :show-file-list="false"

              :file-list="photoList">
              <i class="el-icon-plus"></i>
            </el-upload>
          </li>
        </ul>-->


        <h3>视频</h3>
        <div class="upload-wraper" style="width: 500px">
          <el-upload
            :limit=1
            accept="video/mp4"
            :action="uploadFileParamsUrl"
            :on-success="handleSuccessVideo"
            :on-preview="handleVideoPreview"
            :on-remove="handleVideoRemove"
            :on-progress="handleProgress"
            :on-error="handleVideoError"
            :before-upload="beforeVideoUpload"
            :file-list="videoList">
            <el-button size="small" type="primary" v-if="videoList.length<2"><i class="el-icon-plus"></i> 点击上传</el-button>
          </el-upload>
          <div class="tips">提示：最多上传1个视频</div>
          <!-- <ul class="el-upload-list el-upload-list&#45;&#45;picture-card">
             <li class="el-upload-list__item is-success" v-for="(item,index) in videoList" :key="item.id">
               <template v-if="item.type == 0">
                 <img :src="item.url" alt="" class="el-upload-list__item-thumbnail">
               </template>
               <template v-if="item.type == 2">
                 <video :src="item.url" class="el-upload-list__item-thumbnail"></video>
               </template>
               &lt;!&ndash;<a class="el-upload-list__item-name"><i class="el-icon-document"></i>{{item.name}}</a>&ndash;&gt;
               <label class="el-upload-list__item-status-label"><i class="el-icon-upload-success el-icon-check"></i></label>
               <span class="el-upload-list__item-actions">
                 <span class="el-upload-list__item-preview" @click="handleVideoPreview(item)">
                   <i class="el-icon-zoom-in"></i>
                 </span>
                 <span class="el-upload-list__item-delete" @click="handleVideoRemove(item,index)">
                   <i class="el-icon-delete"></i>
                 </span>
               </span>
             </li>
             <li class="el-upload-list__item">
               <el-upload
                 list-type="picture-card"
                 accept="video/mp4"
                 :action="uploadFileParamsUrl"
                 :on-success="handleSuccessVideo"
                 :on-preview="handleVideoPreview"
                 :on-remove="handleVideoRemove"
                 :before-upload="beforeVideoUpload"
                 :show-file-list="false"
                 :file-list="videoList">
                 <i class="el-icon-plus"></i>
               </el-upload>
             </li>
           </ul>-->
        </div>

        <h3>总结</h3>
        <el-form-item prop="summary" class="form-item-sumy" >
          <el-input v-model.trim="dataForm.summary" type="textarea" placeholder="总结"></el-input>
        </el-form-item>


        <div class="btns-waper">
            <el-button size="small" @click="back">返回</el-button>
            <el-button size="small" type="primary" :disabled="Uploading" @click="sure">提 交</el-button>
        </div>
      </el-form>


      <el-dialog :visible.sync="currentViewDialog">
        <img width="100%" :src="currentView.url" alt="" v-if="currentView.type == 0" />
        <video width="100%" controls :src="currentView.url" v-if="currentView.type == 2"></video>
      </el-dialog>
    </section>
</template>

<script>
  import { photoOrVideoUpdate,getActivityDetail } from '@/api/mcc/activity.js'
  import { fileDetail ,uploadFileUrl, getfiles} from '@/api/file.js'
  export default {
    data(){
      return{
        Uploading:false,
        currentViewDialog:false,
        currentView:{},
        uploadFileUrl:uploadFileUrl,
        photoList:[],
        videoList:[],
        dataForm:{
          id:'',
          photo:'',
          video:'',
          summary:''
        },
        rules:{
          summary:{required: true, message: '请输入活动总结'}
        }
      }
    },
    components:{},
    created(){
      let id = this.$route.params.id; //活动ID
      if(id){
        this.getActivityDetail(id);
      }
    },
    methods:{
      sure(){
        this.$refs['dataForm'].validate(valid => {
          if(valid){
            this.photoOrVideoUpdate();
          }
        })
      },
      /*图片*/
      handleSuccessPhoto(response, file, fileList){
        let data = response.data;
        data.url = this.baseImgUrl + data.path;
        this.photoList.push(data);
        this.$message.success('上传成功')
      },
      handlePhotoError(err, file, fileList){
        console.log(err, file, fileList)
        this.photoList = fileList;
        this.$message.error('上传失败')
      },
      handlePhotoPreview(file){
        this.currentViewDialog = true
        this.currentView = file;
      },
      handlePhotoRemove(file, index){
        this.photoList.splice(index,1)
      },
      /*handlePhotoRemove(file, fileList){
        this.photoList = fileList
      },*/
      beforePhotoUpload(file){
        // console.log(file)
        let isImg = (file.type === 'image/png' || file.type === 'image/jpeg');
        if (!isImg){
          this.$message.warning('请上传png、jpg格式的图片')
        }
        return isImg
      },
      /*视频*/
      handleSuccessVideo(response, file, fileList){
        this.Uploading = false;
        let data = response.data;
        data.url = this.baseImgUrl + data.path;
        this.videoList.push(data);
        this.$message.success('上传成功')
      },
      handleVideoError(){
        this.videoList = [];
        this.$message.error('上传失败')
      },
      handleVideoPreview(file){
        this.currentViewDialog = true
        this.currentView = file;
      },
      handleVideoRemove(file, index){
        this.videoList.splice(index,1)
      },
      /*handleVideoRemove(file, fileList){
        this.videoList = fileList
      },*/
      beforeVideoUpload(file){
        let isMp4 = file.type === 'video/mp4';
        if (!isMp4){
          this.$message.warning('请上传mp4格式的视频')
        }
        return isMp4
      },

      handleProgress(event, file, fileList){
        this.Uploading = true;
      },
      //文件地址
      fileDetail(id,attr){
        fileDetail(id).then(res=>{
          if (res.code == 200 && res.data){
            //this[attr] = this.baseImgUrl + res.data.imgSmallCompress
          };
        })
      },
      getfiles(ids){
          this.materialFileList = [];
          getfiles({ids:ids}).then(res=>{
            if(res.code == 200){
              res.data.forEach(e=>{
                //this.materialFileList.push({name:e.name,url:this.baseImgUrl + e.path,id:e.id})
              })
            }
          })
      },
      //提交
        photoOrVideoUpdate(){
        let photo = this.photoList.map(i=>{
          return i.id
        });
        let video = this.videoList.map(i=>{
          return i.id
        });
        this.dataForm.photo = photo.toString();
        this.dataForm.video = video.toString();
        photoOrVideoUpdate(this.dataForm).then(res=>{
          if (res.code == 200){
            this.$message.success('提交成功')
            this.$router.back()
          }
        })
      },
      //详情
      getActivityDetail(id) {
        getActivityDetail(id).then(res => {
          if (res.code == 200) {
            this.dataForm.id = res.data.id;
            this.photoList = res.data.photoInfo ? res.data.photoInfo.map(i=>{
              i.url = this.baseImgUrl + i.path
              return i
            }) : [];
            this.videoList= res.data.videoInfo ? res.data.videoInfo.map(i=>{
              i.url = this.baseImgUrl + i.path
              return i
            }) : [];

            this.dataForm.summary = res.data.summary ? res.data.summary : '';

            this.$nextTick(()=>{
              this.$refs['addForm'].clearValidate(); //移除校验结果
            })
          }
        })
      }

    }
  };
</script>

<style lang="scss" scoped>
  .view-container{
    h3{
      padding: 0 30px;
    }
    .upload-wraper{
      padding: 0 30px;
    }

  }
.tips{
  margin-top: 15px;
  font-size: 12px;
}
</style>
