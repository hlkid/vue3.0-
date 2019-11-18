<template>
  <section class="view-container">
    <el-form
      ref="dataForm"
      inline
      class="hbsx-form"
      :model="dataForm"
      label-width="120px"
      size="small"
      v-loading="isLoading"
    >
      <el-form-item label="精彩片段" prop="highlights" class="edit-form">
        <Uploader :fileList="highlightsList" @getList="gethighlightsList" :limit="1" :type="2"></Uploader>
      </el-form-item>
      <el-form-item label="录播视频" prop="videoRecords" class="edit-form">
        <Uploader :fileList="videoRecordsList" @getList="getvideoRecordsList" :limit="1" :type="2"></Uploader>
      </el-form-item>

      <div class="btns-waper">
        <el-button size="small" @click="$router.go(-1)">取 消</el-button>
        <el-button size="small" type="primary" @click="confirm">保 存</el-button>
      </div>
    </el-form>
  </section>
</template>

<script>
import Uploader from "@/components/Uploader";
import { uploadLiveBroadcast, getLiveBroadcastData } from "@/api/mcc/live";
export default {
  data() {
    return {
      highlightsList: [],
      videoRecordsList: [],
      dataForm: {
        id: "",
        highlights: "",
        videoRecords: ""
      },
      isLoading: false
    };
  },
  components: { Uploader },
  created() {
    if (this.$route.params && this.$route.params.id) {
      this.dataForm.id = this.$route.params.id;
      this.getLiveBroadcastData(this.dataForm.id);
    }
  },
  methods: {
    /* 精彩片段上传 */
    gethighlightsList(list) {
      this.highlightsList = list;
      this.dataForm.highlights = list
        .map(i => {
          return i.id;
        })
        .toString();
    },
    /* 录播视频上传 */
    getvideoRecordsList(list) {
      this.videoRecordsList = list;
      this.dataForm.videoRecords = list
        .map(i => {
          return i.id;
        })
        .toString();
    },
    // 点击提交按钮
    confirm() {
      this.$refs["dataForm"].validate(validator => {
        if (validator) {
          this.uploadLiveBroadcast(this.dataForm);
        }
      });
    },
    // 详情接口
    getLiveBroadcastData(id) {
      if (id) {
        this.isLoading = true;
        getLiveBroadcastData(id)
          .then(res => {
            if (res.code == 200) {
              this.highlightsList = res.data.highlightsInfo
                ? res.data.highlightsInfo.map(i => {
                    return {
                      id: i.id,
                      type: i.type,
                      name: i.name,
                      path: this.baseImgUrl + i.path,
                      url: this.baseImgUrl + i.imgSourceCompress
                    };
                  })
                : [];

              this.videoRecordsList = res.data.videoRecordsInfo
                ? res.data.videoRecordsInfo.map(i => {
                    return {
                      id: i.id,
                      type: i.type,
                      name: i.name,
                      path: this.baseImgUrl + i.path,
                      url: this.baseImgUrl + i.imgSourceCompress
                    };
                  })
                : [];
            }
          })
          .finally(() => {
            this.isLoading = false;
          });
      }
    },
    uploadLiveBroadcast(data) {
      uploadLiveBroadcast(data).then(res => {
        if (res.code == 200) {
          this.$message.success("保存成功");
          this.$router.back();
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.w800 {
  width: 800px;
}
</style>
