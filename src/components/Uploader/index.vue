<template>
  <div class="upload-wraper">
    <el-upload
      :show-file-list="true"
      :class="_fileList.length<limit ? 'show' : 'hide'"
      :action="uploadFileParamsUrl"
      :file-list="_fileList"
      :accept="accept"
      :limit="limit"
      :disabled="disabled"
      :on-success="handleSuccess"
      :on-exceed="handleExceed"
      :on-error="handleError"
      :on-progress="handleProgress"
      :before-upload="handleBeforeUpload"
      list-type="picture-card"
    >
      <div slot="tip" class="el-upload__tip">
        <span>提示：最多上传{{limit}}个</span>
        <span v-if="type==0">图片</span>
        <span v-else-if="type==1">音频</span>
        <span v-else-if="type==2">视频</span>
        <span v-else>文件</span>
        <span v-if="width&&height&&!square">。(图片宽高为：{{width}}*{{height}})</span>
        <span v-if="square">。(图片宽高比： 1:1)</span>
      </div>
      <i slot="default" class="el-icon-plus"></i>

      <div class="file-item" slot="file" slot-scope="{file}">
        <div class="el-progress-wraper">
          <img class="el-upload-list__item-thumbnail" :src="file.url" :onerror="defaultImg" />
          <!--进度条-->
          <el-progress
            class="el-upload_progress"
            :width="80"
            :stroke-width="3"
            type="circle"
            :percentage="percentage"
            v-if="progressShow(file)"
          ></el-progress>
        </div>

        <span class="el-upload-list__item-actions">
          <span
            v-if="!disabled"
            class="el-upload-list__item-preview"
            @click="handlePictureCardPreview(file)"
          >
            <i class="el-icon-zoom-in"></i>
          </span>
          <!--<span
                  v-if="!disabled"
                  class="el-upload-list__item-delete"
                  @click="handleDownload(file)"
                >
                  <i class="el-icon-download"></i>
          </span>-->
          <span v-if="!disabled" class="el-upload-list__item-delete" @click="handleRemove(file)">
            <i class="el-icon-delete"></i>
          </span>
        </span>
      </div>
    </el-upload>

    <!--预览图片-->
    <el-dialog class="preview-file" :visible.sync="dialogVisible" :append-to-body="true">
      <img width="100%" :src="previewObj.path" alt v-if="previewObj.type == 0 && dialogVisible" />
      <audio width="100%" :src="previewObj.path" alt v-if="previewObj.type == 1 && dialogVisible"></audio>
      <video
        width="100%"
        height="500"
        :src="previewObj.path"
        alt
        v-if="previewObj.type == 2 && dialogVisible"
        controls
      ></video>
    </el-dialog>
  </div>
</template>

<script>
import { uploadSize } from "@/utils/common.js";
export default {
  props: {
    fileList: {
      type: Array,
      default: () => {
        return [];
      }
    },
    type: {
      type: Number,
      default: 100 // 0图片1音频2视频
    },
    limit: {
      type: Number,
      default: 1
    },
    width: String,
    height: String,
    square: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    _fileList: {
      get() {
        return this.fileList;
      },
      set(val) {
        this.$emit("getList", val);
      }
    }
  },
  watch: {
    type(n, o) {
      this.setAccept(n);
    }
  },
  mounted() {
    this.setAccept(this.type);
  },
  data() {
    return {
      accept: "",
      percentage: 0, // 进度条
      currentFileId: "",
      previewObj: {}, // 预览
      dialogVisible: false,
      disabled: false,
      defaultImg: 'this.src="' + require("@/assets/default-img.jpg") + '"' // 默认图片
    };
  },
  methods: {
    // 显示进度
    progressShow(file) {
      return file.id == this.currentFileId && this.percentage > 0;
    },
    // 上传成功
    handleSuccess(response, file, fileList) {
      this.disabled = false;
      if (response.code == 200) {
        this._fileList = fileList.map(i => {
          if (
            i.response &&
            i.response.code == 200 &&
            i.response.data &&
            i.response.data.id
          ) {
            // 刚刚上传的数据
            i.id = i.response.data.id;
            // type == 2视频展示第一帧图片
            if (i.response.data.type != 0) {
              i.url = this.baseImgUrl + i.response.data.imgSourceCompress;
            }
            i.path = this.baseImgUrl + i.response.data.path;
            i.type = i.response.data.type;
          }
          return i;
        });
      } else {
        response.errorMsg && this.$message.error(response.errorMsg);
        this._fileList.pop(); //失败后移除最后一个文件
      }
      let timer = setTimeout(() => {
        this.percentage = 0;
        clearTimeout(timer);
        timer = null;
      }, 1000);
    },
    // 移除
    handleRemove(file) {
      this._fileList = this._fileList.filter(i => {
        return file.url !== i.url;
      });
    },
    // 上传前
    async handleBeforeUpload(file) {
      // 检验格式
      const isImg =
        file.type === "image/jpeg" ||
        file.type === "image/jpg" ||
        file.type === "image/png" ||
        file.type === "image/gif";
      const isAudio = file.type === "audio/mp3";
      const isVideo = file.type === "video/mp4";
      const isPdf = file.type === "application/pdf";

      if (this.type == 0 && !isImg) {
        this.$message.warning("图片只支持 jpeg、jpg、png、gif 格式！");
        return false;
      } else if (this.type == 1 && !isAudio) {
        this.$message.warning("音频只支持 mp3 格式！");
        return false;
      } else if (this.type == 2 && !isVideo) {
        this.$message.warning("视频只支持 mp4 格式！");
        return false;
      } else if (this.type == 3 && !isPdf) {
        this.$message.warning("请上传PDF格式的文件！");
        return false;
      }

      // type图片类型为0 && limit图片数量为1 时  对图片大小750*350作校验
      if (this.type == 0 && this.limit == 1 && this.width && this.height) {
        const isSize = await uploadSize(this.width, this.height, file);
        return isSize;
      }
      if (this.square) {
        const isSize = await uploadSize(1, 1, file);
        return isSize;
      }

      this.disabled = true;
    },
    // 上传错误
    handleError(err, file, fileList) {
      this.disabled = false;
    },
    // 上传进度
    handleProgress(event, file, fileList) {
      this.percentage =
        parseInt(event.percent) > 98 ? 98 : parseInt(event.percent);
      this.currentFileId = file.id;
      /*this._fileList = fileList.map(i => {
        if (i.response && i.response.code == 200 && i.response.data && i.response.data.id) {
          // 刚刚上传的数据
          i.id = i.response.data.id;
          // type == 2视频展示第一帧图片
          if (i.response.data.type == 2) {
            i.url = this.baseImgUrl + i.response.data.imgSourceCompress;
          }
          i.path = this.baseImgUrl + i.response.data.path;
          i.type = i.response.data.type;
        }
        return i;
      });*/
    },
    // 预览
    handlePictureCardPreview(file) {
      this.previewObj = file;
      this.dialogVisible = true;
    },
    // 文件数量限制
    handleExceed(files, fileList) {
      this.$message.warning(`最多上传${this.limit}个文件`);
    },
    handleDownload(file) {
      // console.log(file);
    },
    // 设置筛选文件
    setAccept(type) {
      switch (type) {
        case 0:
          this.accept = "image/png, image/jpg, image/jpeg, image/gif";
          break;
        case 1:
          this.accept = "audio/mp3";
          break;
        case 2:
          this.accept = "video/mp4";
          break;
        default:
          this.accept = "";
          break;
      }
    }
  }
};
</script>


<style lang="scss">
.preview-file {
  video {
    background: rgba(0, 0, 0, 0.6);
  }
}
.upload-wraper {
  .el-upload {
    position: relative;
  }
  .el-progress-wraper {
    position: relative;
    width: 148px !important;
    height: 148px !important;
    .el-upload_progress {
      width: 80px !important;
    }
    .el-upload-list__item-thumbnail {
      width: 148px !important;
      height: 148px !important;
      object-fit: cover;
    }
  }

  .hide {
    .el-upload {
      display: none !important;
    }
  }
  .show {
    .el-upload {
      display: inline-block !important;
    }
  }
}
</style>
