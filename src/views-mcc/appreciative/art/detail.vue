<template>
  <section class="view-container-art-detail">
    <el-form
      ref="dataForm"
      inline
      class="hbsx-form"
      label-width="120px"
      size="small"
      v-loading="isLoading"
    >
      <div>
        <el-form-item :label="labelText" prop="title">
          <el-input
            class="w800"
            v-model="addForm.title"
            clearable
            :placeholder="'请输入'+labelText"
            maxlength="100"
            :autosize="{ minRows: 1, maxRows: 3}"
            type="textarea"
            readonly
          ></el-input>
        </el-form-item>
      </div>
      <el-form-item label="类型" prop="childType">
        <el-select v-model="addForm.childType" placeholder="请选择类型" disabled>
          <el-option
            v-for="item in childTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="关键字" prop="tag">
        <el-select
          v-model="addForm.tag"
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
      <el-form-item label="简介" prop="introduce" class="edit-form">
        <el-input
          class="w800"
          type="textarea"
          :autosize="{ minRows: 5, maxRows: 100}"
          v-model="addForm.introduce"
          clearable
          placeholder="简介"
          readonly
        ></el-input>
      </el-form-item>
      <el-form-item label="封面" prop="mobileCoverList" class="edit-form">
        <div class="img-div">
          <div class="img-item" v-for="(i,index) in mobileCoverList" :key="index">
            <el-image style="height:148px;width:148px" :src="i.url"></el-image>
          </div>
        </div>
      </el-form-item>

      <el-form-item label="作品类型" v-if="addForm.type==0" class="edit-form">
        <el-select
          v-model="addForm.resourceType"
          placeholder="请选择作品类型"
          style="width:200px"
          disabled
        >
          <el-option
            v-for="(i,index) in form.audioType"
            :key="index"
            :label="i.label"
            :value="i.value"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item
        label="视频"
        prop="videoResourcesList"
        class="edit-form"
        v-if="addForm.type==0&&addForm.resourceType==0"
      >
        <div class="img-div">
          <div class="img-item" v-for="(i,index) in videoResourcesList" :key="index">
            <video :src="i.path" width="148" height="148" controls></video>
          </div>
        </div>
      </el-form-item>
      <el-form-item
        label="作品"
        prop="pcCoverInfo"
        class="edit-form"
        v-if="addForm.type==1||addForm.resourceType==1"
      >
        <div class="img-div">
          <div class="img-item" v-for="(i,index) in pictureResourcesList" :key="index">
            <el-image style="height:148px;width:148px" :src="i.path"></el-image>
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
import { getArtDetail } from "@/api/mcc/appreciative.js";
export default {
  name: "appreciative",
  data() {
    return {
      isLoading: false,
      detailForm: {},
      detailId: "",
      // 路由参数
      routeQuery: {
        type: "",
        typeCode: ""
      },
      labelText: "",
      detailId: "",
      dialogFlag: "add",
      mobileCoverList: [],
      videoResourcesList: [],
      pictureResourcesList: [],
      addForm: {
        title: "",
        tag: "",
        type: "",
        childType: "",
        introduce: "",
        resources: "",
        resourceType: 0,
        pcCover: ""
      },
      showDelete: false,
      pcCoverUrl: "",
      childTypeOptions: [],
      form: {
        // type 0为视频  1为图片
        audioType: [
          {
            value: 0,
            label: "视频"
          },
          {
            value: 1,
            label: "图片"
          }
        ],
        resourceType: ""
      }
    };
  },
  created() {
    this.detailId = this.$route.query["id"] || "";
    this.addForm.type = this.$route.params["type"] || "";
    if (this.addForm.type == 1) {
      this.labelText = "展览名称";
      this.applicationDictionaryDataByTypeCode(
        this.$dicts.exhibitionType,
        this.childTypeOptions
      );
    } else if (this.addForm.type == 0) {
      this.labelText = "艺术鉴赏名称";
      this.applicationDictionaryDataByTypeCode(
        this.$dicts.artAppreciativeType,
        this.childTypeOptions
      );
    }
    this.getArtDetail();
  },
  methods: {
    // 详情
    getArtDetail() {
      getArtDetail(this.detailId).then(res => {
        if (res.code == 200) {
          Object.keys(this.addForm).forEach(key => {
            this.addForm[key] = res.data[key];
            // 获取标签
            this.addForm["tag"] = res.data["tag"].split(",");
            // 获取封面
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

            // 获取图片数组
            this.pictureResourcesList = res.data.resourcesInfo
              ? res.data.resourcesInfo.map(i => {
                  return {
                    id: i.id,
                    type: i.type,
                    name: i.name,
                    path: this.baseImgUrl + i.path,
                    url: this.baseImgUrl + i.path
                  };
                })
              : [];
            // 获取视频数组
            this.videoResourcesList = res.data.resourcesInfo
              ? res.data.resourcesInfo.map(i => {
                  return {
                    id: i.id,
                    type: i.type,
                    name: i.name,
                    path: this.baseImgUrl + i.path,
                    url: this.baseImgUrl + i.imgSourceCompress
                  };
                })
              : [];
          });
        }
      });
    },
    // 数据词典
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
.view-container-art-detail {
  .w800 {
    width: 800px;
    &.title-width {
      width: 500px;
    }
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
