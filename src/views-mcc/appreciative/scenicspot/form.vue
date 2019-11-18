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
      <el-form-item label="景点名称" prop="name">
        <el-input v-model="dataForm.name" placeholder="请输入景点名称" maxlength="50" class="w800"></el-input>
      </el-form-item>
      <div>
        <el-form-item label="类型" prop="type" v-if="travelPlaceTypeList.length">
          <el-select v-model="dataForm.type" placeholder="请选择类型" @change="typeChange">
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
            @input="keyInput"
            filterable
            allow-create
            default-first-option
            placeholder="请输入关键字"
            style="width:450px"
          ></el-select>
        </el-form-item>
      </div>
      <div>
        <el-form-item label="开放时间" prop="startTime">
          <el-input v-model="dataForm.startTime" placeholder="请输入开放时间" class="w800"></el-input>
        </el-form-item>
      </div>
      <div>
        <el-form-item label="省市区" prop="regionCode" class="district-wraper">
          <el-input type="hidden" v-model="dataForm.regionCode" class="w800">
            <ProvinceCityArea
              slot="append"
              :districtCode="dataForm.regionCode"
              @receiveEvent="receiveEvent"
            ></ProvinceCityArea>
          </el-input>
        </el-form-item>
      </div>
      <div>
        <el-form-item label="地址" prop="address">
          <el-input v-model="dataForm.address" placeholder="请输入详细地址" class="w800"></el-input>
        </el-form-item>
      </div>
      <el-form-item label="内容" prop="content">
        <el-input
          class="w800"
          type="textarea"
          :autosize="{ minRows: 5, maxRows: 20}"
          v-model="dataForm.content"
          placeholder
        ></el-input>
      </el-form-item>
      <el-form-item label="封面" prop="mobileCover" class="block">
        <Uploader
          :fileList="mobileCoverList"
          @getList="getCoverList"
          :limit="1"
          :type="0"
          width="750"
          height="350"
          :square="false"
        ></Uploader>
        <el-input type="hidden" v-model="dataForm.mobileCover"></el-input>
      </el-form-item>
      <el-form-item label="图片" prop="pictureResources" class="edit-form">
        <Uploader :fileList="pictureResourcesList" @getList="getPictureList" :limit="10" :type="0"></Uploader>
      </el-form-item>
      <el-form-item label="视频" prop="videoResources" class="edit-form">
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
        typeName: "",
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
      formRules: {
        name: [{ required: true, message: "请输入名称" }],
        type: [{ required: true, message: "请选择类型" }],
        startTime: [{ required: true, message: "请输入开放" }],
        regionCode: [{ required: true, message: "请选择区域编码" }],
        address: [{ required: true, message: "请输入详细地址" }],
        mobileCover: [{ required: true, message: "请上传封面" }]
      },
      isLoading: false
    };
  },
  components: { ProvinceCityArea, Uploader },
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
    // 点击提交按钮
    confirm() {
      this.$refs["dataForm"].validate(validator => {
        if (validator) {
          let data = JSON.parse(JSON.stringify(this.dataForm));
          data.keyword = data.keyword.toString();
          this.formType == "add" && this.travelPlaceCreate(data);
          this.formType == "edit" && this.travelPlaceUpdate(data);
        }
      });
    },
    // 省市区
    receiveEvent(data) {
      this.dataForm.regionCode = data.mergerCode;
      this.dataForm.regionName = data.mergerName.split(",")[0];
      // console.log(data)
    },
    // 关键字
    keyInput(list) {
      let keywordList = [];
      list.forEach(e => {
        if (e.length <= 5) {
          keywordList.push(e);
        } else {
          this.$message.error("关键字最多5个字");
        }
      });
      this.dataForm.keyword = keywordList;
    },
    // 详情接口
    travelPlaceDetail(id) {
      if (!id) {
        return;
      }
      this.isLoading = true;
      travelPlaceDetail(id)
        .then(res => {
          if (res.code == 200) {
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
    },

    typeChange(type) {
      let obj =
        this.travelPlaceTypeList.filter(item => {
          return type == item.value;
        })[0] || {};
      this.dataForm.typeName = obj.label;
    },
    // 新增接口
    travelPlaceCreate(data) {
      travelPlaceCreate(data).then(res => {
        if (res.code == 200) {
          this.$message.success("新增成功");
          this.$router.back();
        }
      });
    },
    // 修改接口
    travelPlaceUpdate(data) {
      travelPlaceUpdate(data).then(res => {
        if (res.code == 200) {
          this.$message.success("修改成功");
          this.$router.back();
        }
      });
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
  },
  created() {
    if (this.$route.query.id) {
      this.dataForm.id = this.$route.query.id;
      this.formType = "edit";
      this.travelPlaceDetail(this.dataForm.id);
    } else {
      this.formType = "add";
    }
    this.applicationDictionaryDataByTypeCode(
      this.$dicts.travelPlaceType,
      this.travelPlaceTypeList
    );
  }
};
</script>

<style lang="scss" scoped>
.w800 {
  width: 800px;
}
</style>
