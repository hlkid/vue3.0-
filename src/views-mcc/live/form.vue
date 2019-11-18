<template>
  <section class="view-container">
    <el-form
      ref="dataForm"
      :rules="formRules"
      inline
      class="hbsx-form"
      :model="dataForm"
      label-width="120px"
      size="small"
      v-loading="isLoading"
    >
      <el-form-item label="直播标题" prop="title" class="edit-form">
        <el-input
          class="w920"
          v-model="dataForm.title"
          placeholder="请输入直播标题"
          maxlength="50"
          :autosize="{ minRows: 1, maxRows: 3}"
          type="textarea"
        ></el-input>
      </el-form-item>
      <el-form-item label="直播延时间" prop="liveDelayedNum">
        <el-input
          v-model="dataForm.liveDelayedNum"
          placeholder="10分钟之内，整数，单位：分钟"
          @keyup.native="iptClickNum()"
        ></el-input>
      </el-form-item>
      <el-form-item label="在线人数" prop="realUserNumFlag">
        <el-radio-group v-model="dataForm.realUserNumFlag">
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
            :picker-options="startDatePicker"
            @change="startTimechange()"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="直播结束时间" style="margin-left:30px;">
          <el-date-picker
            v-model="dataForm.endTime"
            type="datetime"
            placeholder="选择结束日期"
            value-format="yyyy-MM-dd HH:mm"
            format="yyyy-MM-dd HH:mm"
            :picker-options="endDatePicker"
            @change="endTimechange()"
          ></el-date-picker>
        </el-form-item>
      </div>
      <div>
        <el-form-item label="介绍" prop="introduce">
          <el-input
            class="w920"
            type="textarea"
            :autosize="{ minRows: 3, maxRows: 20}"
            v-model="dataForm.introduce"
            placeholder
          ></el-input>
        </el-form-item>
      </div>
      <el-form-item label="举办单位" prop="hostUnit" class="block edit-form">
        <wang-editor v-model="dataForm.hostUnit" contentHeight="220" class="w920"></wang-editor>
      </el-form-item>

      <el-form-item label="详情" prop="detail" class="block edit-form">
        <wang-editor v-model="dataForm.detail" class="w920"></wang-editor>
      </el-form-item>

      <el-form-item label="封面" prop="pcCover" class="edit-form">
        <Uploader
          :fileList="mobileCoverList"
          @getList="getCoverList"
          :limit="1"
          :type="0"
          width="750"
          height="350"
          :square="false"
        ></Uploader>
        <el-input type="hidden" v-model="dataForm.pcCover"></el-input>
      </el-form-item>

      <el-form-item label="宣传片" prop="promotionalSegment" class="edit-form">
        <Uploader :fileList="videoResourcesList" @getList="getVideoList" :limit="1" :type="2"></Uploader>
      </el-form-item>

      <div class="btns-waper">
        <el-button size="small" @click="$router.go(-1)">取 消</el-button>
        <el-button size="small" type="primary" @click="confirm">提 交</el-button>
      </div>
    </el-form>
  </section>
</template>

<script>
import Uploader from "@/components/Uploader";
import { checkNumIncludeZero } from "@/utils/validate";
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
      startDatePicker: this.beginDate(),
      endDatePicker: this.processDate(),
      dataForm: {
        promotionalSegment: "",
        pcCover: "",
        title: "",
        address: "",
        introduce: "",
        hostUnit: "",
        detail: "",
        startTime: "",
        endTime: "",
        clickNum: 0, // 点击量
        liveDelayedNum: 0, //直播延时时间（分钟,10分钟之内
        realUserNumFlag: 1 //是否实时在线人数 0 否 1 是
      },
      detailId: "",
      formRules: {
        title: [{ required: true, message: "请输入直播标题" }],
        liveDelayedNum: [{ validator: checkNumIncludeZero }],
        startTime: [{ required: true, message: "请选择直播开始时间" }],
        introduce: [{ required: true, message: "请输入介绍" }],
        address: [{ required: true, message: "请输入直播地址" }],
        pcCover: [{ required: true, message: "请上传封面" }],
        hostUnit: [{ required: true, message: "请输入举办单位" }],
        detail: [{ required: true, message: "请输入详情" }]
      },
      isLoading: false,
      datatime: ":00"
    };
  },
  components: { Uploader, WangEditor },
  created() {
    if (this.$route.params.id) {
      this.detailId = this.$route.params.id;
      this.formType = "edit";
      this.getLiveBroadcastData();
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
    // 点击提交按钮
    confirm() {
      this.$refs["dataForm"].validate(validator => {
        if (validator) {
          let startTime = this.dataForm["startTime"] + this.datatime;
          let endTime = this.dataForm["endTime"] + this.datatime;
          this.dataForm["startTime"] = startTime;
          this.dataForm["endTime"] = endTime;
          if (this.formType == "add") {
            this.addLiveBroadcast();
          } else if (this.formType == "edit") {
            this.dataForm["id"] = this.detailId;
            this.editLiveBroadcast();
          }
        }
      });
    },
    // 详情接口
    getLiveBroadcastData() {
      if (this.detailId) {
        this.isLoading = true;
        getLiveBroadcastData(this.detailId)
          .then(res => {
            if (res.code == 200) {
              Object.keys(this.dataForm).forEach(key => {
                this.dataForm[key] = res.data[key];
              });

              let startTime = this.dataForm["startTime"];
              let endTime = this.dataForm["endTime"];
              this.dataForm["startTime"] = startTime.substring(
                startTime,
                startTime.length - 3
              );
              this.dataForm["endTime"] = endTime.substring(
                endTime,
                endTime.length - 3
              );
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
                      path:
                        this.baseImgUrl + res.data.promotionalSegmentInfo.path,
                      url:
                        this.baseImgUrl +
                        res.data.promotionalSegmentInfo.imgSourceCompress
                    }
                  ]
                : [];
            }
          })
          .finally(() => {
            this.isLoading = false;
          });
      }
    },
    // 正整数校验
    iptClickNum() {
      var reg = /^([1-9]\d*|[0]{1,1})$/; //含0正整数
      if (!reg.test(this.dataForm.clickNum)) {
        this.dataForm.clickNum = "";
      } else if (!reg.test(this.dataForm.liveDelayedNum)) {
        this.dataForm.liveDelayedNum = "";
      }
    },
    // 新增接口
    addLiveBroadcast() {
      addLiveBroadcast(this.dataForm).then(res => {
        if (res.code == 200) {
          this.$message.success("新增成功");
          this.$router.back();
        }
      });
    },
    // 修改接口
    editLiveBroadcast() {
      editLiveBroadcast(this.dataForm).then(res => {
        if (res.code == 200) {
          this.$message.success("修改成功");
          this.$router.back();
        }
      });
    },
    startTimechange(el) {},
    endTimechange() {},
    beginDate() {
      const self = this;
      return {
        disabledDate(time) {
          if (self.dataForm.endTime) {
            //如果结束时间不为空，则小于结束时间
            return new Date(self.dataForm.endTime).getTime() < time.getTime();
          } else {
            // return time.getTime() > Date.now()//开始时间不选时，结束时间最大值小于等于当天
          }
        }
      };
    },
    processDate() {
      const self = this;
      return {
        disabledDate(time) {
          if (self.dataForm.startTime) {
            //如果开始时间不为空，则结束时间大于开始时间
            return (
              new Date(self.dataForm.startTime).getTime() - 8.64e7 >
              time.getTime()
            );
          } else {
            // return time.getTime() > Date.now()//开始时间不选时，结束时间最大值小于等于当天
          }
        }
      };
    }
  }
};
</script>

<style lang="scss" scoped>
.w920 {
  width: 920px;
}
</style>
