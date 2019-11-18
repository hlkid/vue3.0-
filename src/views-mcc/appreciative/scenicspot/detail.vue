<template>
  <section class="view-scenicspot-detail">
    <el-form
      ref="dataForm"
      inline
      class="hbsx-form"
      :model="dataForm"
      label-width="120px"
      size="small"
      v-loading="isLoading"
    >
      <el-form-item label="景点名称" prop="name">
        <el-input
          v-model="dataForm.name"
          placeholder="请输入景点名称"
          maxlength="50"
          class="w800"
          readonly
        ></el-input>
      </el-form-item>
      <div>
        <el-form-item label="类型" prop="type" v-if="travelPlaceTypeList.length">
          <el-select v-model="dataForm.type" placeholder="请选择类型" disabled>
            <el-option
              v-for="item in travelPlaceTypeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="关键字" prop="keyword">
          <el-select
            v-model="dataForm.keyword"
            multiple
            :multiple-limit="3"
            filterable
            allow-create
            default-first-option
            placeholder="请输入关键字"
            style="width:450px"
            disabled
          ></el-select>
        </el-form-item>
      </div>
      <div>
        <el-form-item label="开放时间" prop="startTime">
          <el-input v-model="dataForm.startTime" placeholder="请输入开放时间" class="w800" readonly></el-input>
        </el-form-item>
      </div>
      <div>
        <el-form-item label="省市区" prop="regionCode" class="district-wraper">
          <el-input type="hidden" v-model="dataForm.regionCode" class="w800">
            <ProvinceCityArea
              slot="append"
              :districtCode="dataForm.regionCode"
              @receiveEvent="receiveEvent"
              :isDisabled="true"
            ></ProvinceCityArea>
          </el-input>
        </el-form-item>
      </div>
      <div>
        <el-form-item label="地址" prop="address">
          <el-input v-model="dataForm.address" placeholder="请输入详细地址" class="w800" readonly></el-input>
        </el-form-item>
      </div>
      <el-form-item label="内容" prop="content">
        <el-input
          class="w800"
          type="textarea"
          :autosize="{ minRows: 5, maxRows: 20}"
          v-model="dataForm.content"
          placeholder
          readonly
        ></el-input>
      </el-form-item>
      <el-form-item label="封面" class="edit-form">
        <div class="img-div">
          <div class="img-item" v-for="(i,index) in mobileCoverList" :key="index">
            <el-image style="height:148px;width:148px" :src="i.url"></el-image>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="图片" class="edit-form">
        <div class="img-div">
          <div class="img-item" v-for="(i,index) in pictureResourcesList" :key="index">
            <el-image style="height:148px;width:148px" :src="i.path"></el-image>
          </div>
        </div>
      </el-form-item>

      <el-form-item label="视频" class="edit-form">
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
import { applicationDictionaryDataByTypeCode } from "@/api/config.js";
import {
  travelPlaceDetail,
  travelPlaceCreate,
  travelPlaceUpdate
} from "@/api/mcc/appreciative.js";
import ProvinceCityArea from "@/components/ProvinceCityArea";
import Uploader from "@/components/Uploader";
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
        type: "",
        keyword: [],
        mobileCover: "",
        content: "",
        startTime: "",
        regionCode: "",
        regionName: "",
        address: "",
        name: "",
        pictureResources: "",
        videoResources: ""
      },
      isLoading: false
    };
  },
  components: { ProvinceCityArea, Uploader },
  created() {
    if (this.$route.query.id) {
      this.dataForm.id = this.$route.query.id;
      this.travelPlaceDetail(this.dataForm.id);
      this.applicationDictionaryDataByTypeCode(
        this.$dicts.travelPlaceType,
        this.travelPlaceTypeList
      );
    }
  },
  methods: {
    /*文件上传*/
    getCoverList(list) {
      this.mobileCoverList = list;
      this.dataForm.mobileCover = list
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
      this.dataForm.videoResources = list
        .map(i => {
          return i.id;
        })
        .toString();
    },
    // 省市区
    receiveEvent(data) {
      this.dataForm.regionCode = data.mergerCode;
      this.dataForm.regionName = data.mergerName.split(",")[0];
      // console.log(data)
    },
    // 详情接口
    travelPlaceDetail(id) {
      if (id) {
        this.isLoading = true;
        travelPlaceDetail(id)
          .then(res => {
            if (res.code == 200) {
              console.log(res.data);
              Object.keys(this.dataForm).forEach(key => {
                this.dataForm[key] = res.data[key];
              });
              this.dataForm.keyword = res.data.keyword
                ? res.data.keyword.split(",")
                : [];
              this.mobileCoverList = res.data.coverFileInfoVO
                ? [
                    {
                      id: res.data.coverFileInfoVO.id,
                      type: res.data.coverFileInfoVO.type,
                      name: res.data.coverFileInfoVO.name,
                      url: this.baseImgUrl + res.data.coverFileInfoVO.path
                    }
                  ]
                : [];
              this.pictureResourcesList = res.data.pictureFileInfoVOs.map(i => {
                return {
                  id: i.id,
                  type: i.type,
                  name: i.name,
                  path: this.baseImgUrl + i.path,
                  url: this.baseImgUrl + i.path
                };
              });
              this.videoResourcesList = res.data.videoFileInfoVOs.map(i => {
                return {
                  id: i.id,
                  type: i.type,
                  name: i.name,
                  path: this.baseImgUrl + i.path,
                  url: this.baseImgUrl + i.imgSourceCompress
                };
              });
            }
          })
          .finally(() => {
            this.isLoading = false;
          });
      }
    },
    // 数据词典接口
    applicationDictionaryDataByTypeCode(code, arr = []) {
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
    }
  }
};
</script>

<style lang="scss" scoped>
.view-scenicspot-detail {
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
