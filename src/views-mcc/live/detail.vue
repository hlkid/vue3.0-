<template>
  <section class="view-live-detail">
    <el-form
      ref="dataForm"
      inline
      class="hbsx-form"
      :model="dataForm"
      label-width="120px"
      size="small"
    >
      <el-form-item label="直播标题" prop="title" class="edit-form">
        <el-input
          class="w920"
          v-model="dataForm.title"
          placeholder="请输入直播标题"
          maxlength="50"
          :autosize="{ minRows: 1, maxRows: 3}"
          type="textarea"
          readonly
        ></el-input>
      </el-form-item>
      <el-form-item label="直播延时间" prop="liveDelayedNum">
        <el-input
          v-model="dataForm.liveDelayedNum"
          placeholder="10分钟之内，整数，单位：分钟"
          @keyup.native="iptClickNum()"
          readonly
        ></el-input>
      </el-form-item>
      <el-form-item label="在线人数" prop="realUserNumFlag">
        <el-radio-group v-model="dataForm.realUserNumFlag" disabled>
          <el-radio :label="1">显示</el-radio>
          <el-radio :label="0">不显示</el-radio>
        </el-radio-group>
      </el-form-item>
      <!-- 编辑状态下面显示点击量 -->
      <el-form-item label="点击量" prop="clickNum" v-if="false">
        <el-input v-model="dataForm.clickNum" placeholder="请输入点击量(整数)" @keyup.native="iptClickNum"></el-input>
      </el-form-item>
      <el-form-item label="现场地址" prop="address" class="edit-form">
        <el-input v-model="dataForm.address" placeholder="请输入现场地址" maxlength="100" class="w920"></el-input>
      </el-form-item>
      <div>
        <el-form-item label="直播开始时间" prop="startTime">
          <el-date-picker
            v-model="dataForm.startTime"
            type="datetime"
            placeholder="选择开始日期"
            value-format="yyyy-MM-dd HH:mm"
            format="yyyy-MM-dd HH:mm"
            @change="startTimechange()"
            disabled
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="直播结束时间" style="margin-left:30px;">
          <el-date-picker
            v-model="dataForm.endTime"
            type="datetime"
            placeholder="选择结束日期"
            value-format="yyyy-MM-dd HH:mm"
            format="yyyy-MM-dd HH:mm"
            @change="endTimechange()"
            disabled
          ></el-date-picker>
        </el-form-item>
      </div>
      <div>
        <el-form-item label="介绍" prop="introduce">
          <el-input
            class="w800"
            type="textarea"
            :autosize="{ minRows: 3, maxRows: 20}"
            v-model="dataForm.introduce"
            placeholder
            readonly
          ></el-input>
        </el-form-item>
      </div>
      <el-form-item label="举办单位" prop="hostUnit" class="block edit-form">
        <div v-html="dataForm.hostUnit"></div>
      </el-form-item>
      <el-form-item label="详情" prop="detail" class="block edit-form">
        <div v-html="dataForm.detail"></div>
      </el-form-item>

      <el-form-item label="封面" class="block">
        <div class="img-div">
          <div class="img-item" v-for="(i,index) in mobileCoverList" :key="index">
            <el-image style="height:148px;width:148px" :src="i.url"></el-image>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="视频" prop="promotionalSegment" class="block">
        <div class="img-div">
          <div class="img-item" v-for="(i,index) in videoResourcesList" :key="index">
            <video :src="i.path" width="148" height="148" controls></video>
          </div>
        </div>
      </el-form-item>
      <div class="btns-waper">
        <el-button size="small" @click="$router.go(-1)">返 回</el-button>
      </div>
    </el-form>
  </section>
</template>

<script>
import Uploader from "@/components/Uploader";
import { checkNumFloat } from "@/utils/validate";
import WangEditor from "@/components/WangEditor";
import {
  addLiveBroadcast,
  editLiveBroadcast,
  getLiveBroadcastData
} from "@/api/mcc/live";
export default {
  data() {
    return {
      formType: "add", // 编辑or新增
      travelPlaceTypeList: [], // 类型列表

      mobileCoverList: [],
      pictureResourcesList: [],
      videoResourcesList: [],
      dataForm: {
        id: "",
        promotionalSegment: "",
        pcCover: "",
        title: "",
        address: "",
        introduce: "",
        hostUnit: "",
        detail: "",
        startTime: "",
        endTime: "",
        time: [],
        clickNum: 0, // 点击量
        liveDelayedNum: "", //直播延时时间（分钟,10分钟之内
        realUserNumFlag: 1 //是否实时在线人数 0 否 1 是
      }
    };
  },
  components: { Uploader, WangEditor },
  created() {
    if (this.$route.params.id) {
      this.dataForm.id = this.$route.params.id;
      this.formType = "edit";
      this.getLiveBroadcastData(this.dataForm.id);
    } else {
      this.formType = "add";
    }
  },
  methods: {
    /*文件上传*/
    getCoverList(list) {
      this.mobileCoverList = list;
      this.dataForm.pcCover = list
        .map(i => {
          return i.id;
        })
        .toString();
    },
    getPictureList(list) {
      this.pictureResourcesList = list;
      this.dataForm.pictureResources = list
        .map(i => {
          return i.id;
        })
        .toString();
    },
    getVideoList(list) {
      this.videoResourcesList = list;
      this.dataForm.promotionalSegment = list
        .map(i => {
          return i.id;
        })
        .toString();
    },
    timeChange(e) {
      this.dataForm.startTime = e[0];
      this.dataForm.endTime = e[1];
    },
    // 详情接口
    getLiveBroadcastData(id) {
      if (!id) {
        return;
      }
      getLiveBroadcastData(id).then(res => {
        if (res.code == 200) {
          Object.keys(this.dataForm).forEach(key => {
            this.dataForm[key] = res.data[key];
          });
          this.dataForm.time = [
            res.data.startTime ? res.data.startTime : "",
            res.data.endTime ? res.data.endTime : ""
          ];
          // 图片
          this.mobileCoverList = res.data.pcCoverInfo
            ? [
                {
                  id: res.data.pcCoverInfo.id,
                  type: res.data.pcCoverInfo.type,
                  name: res.data.pcCoverInfo.name,
                  url: this.baseImgUrl + res.data.pcCoverInfo.path
                }
              ]
            : [];
          // 视频
          this.videoResourcesList = res.data.promotionalSegmentInfo
            ? [
                {
                  id: res.data.promotionalSegmentInfo.id,
                  type: res.data.promotionalSegmentInfo.type,
                  name: res.data.promotionalSegmentInfo.name,
                  path: this.baseImgUrl + res.data.promotionalSegmentInfo.path,
                  url:
                    this.baseImgUrl +
                    res.data.promotionalSegmentInfo.imgSourceCompress
                }
              ]
            : [];
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.view-live-detail {
  .w800 {
    width: 800px;
  }
  .img-div {
    display: flex;
    flex-wrap: wrap;
    .img-item {
      margin: 0 10px 10px 0;
    }
  }
}
</style>
