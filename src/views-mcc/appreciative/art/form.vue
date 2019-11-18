<template>
  <section class="view-container-art">
    <el-form
      ref="addForm"
      :rules="addRules"
      inline
      class="hbsx-form"
      :model="addForm"
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
          ></el-input>
        </el-form-item>
      </div>
      <el-form-item label="类型" prop="childType">
        <el-select v-model="addForm.childType" placeholder="请选择类型">
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
          @input="keyInput"
          filterable
          allow-create
          default-first-option
          placeholder="请输入关键字"
          style="width:450px"
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
        ></el-input>
      </el-form-item>
      <el-form-item label="封面" prop="pcCover">
        <Uploader
          :fileList="mobileCoverList"
          @getList="getCoverList"
          :limit="1"
          :type="0"
          width="750"
          height="350"
          :square="false"
        ></Uploader>
        <el-input type="hidden" v-model="addForm.pcCover"></el-input>
      </el-form-item>
      <div>
        <el-form-item label="作品类型" v-if="addForm.type==0">
          <el-select v-model="addForm.resourceType" placeholder="请选择作品类型">
            <el-option
              v-for="(i,index) in form.audioType"
              :key="index"
              :label="i.label"
              :value="i.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </div>
      <!-- 上传视频 -->
      <el-form-item
        label="视频"
        prop="resources"
        class="edit-form"
        v-if="addForm.type==0&&addForm.resourceType==0"
      >
        <Uploader :fileList="videoResourcesList" @getList="getVideoList" :limit="1" :type="2"></Uploader>
      </el-form-item>
      <el-form-item
        label="作品"
        prop="resources"
        class="edit-form"
        v-if="addForm.type==1||addForm.resourceType==1"
      >
        <Uploader
          :fileList="pictureResourcesList"
          @getList="getPictureList"
          :limit="addForm.type==1?100:10"
          :type="0"
        ></Uploader>
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
import { getArtDetail, addArt, editArt } from "@/api/mcc/appreciative.js";
import WangEditor from "@/components/WangEditor";
import { isEmpty } from "@/utils/common";
import { fileDetail, getfiles } from "@/api/file.js";
import Uploader from "@/components/Uploader";
export default {
  data() {
    return {
      wangEditorShow: true,
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
      addRules: {
        title: [{ required: true, message: "请输入标题名称" }],
        introduce: [{ required: true, message: "请输入简介" }],
        childType: [{ required: true, message: "请选择类型" }],
        pcCover: [{ required: true, message: "请上传封面" }]
      },

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
      },
      libType: "",
      isLoading: false
    };
  },
  components: { WangEditor, Uploader },
  created() {
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
    // childTypeOptions
    if (this.$route.params && this.$route.params.id) {
      this.isLoading = true;
      this.detailId = this.$route.params.id;
      this.dialogFlag = "updata";
      this.getArtDetail();
      this.isLoading = false;
    } else {
      this.dialogFlag = "add";
    }
  },
  methods: {
    /*上传封面*/
    getCoverList(list) {
      this.mobileCoverList = list;
      this.addForm.pcCover = list
        .map(i => {
          return i.id;
        })
        .toString();
    },
    /*上传图片*/
    getPictureList(list) {
      this.pictureResourcesList = list;
      this.addForm.resources = list
        .map(i => {
          return i.id;
        })
        .toString();
    },
    /* 上传视频 */
    getVideoList(list) {
      this.videoResourcesList = list;
      this.addForm.resources = list
        .map(i => {
          return i.id;
        })
        .toString();
    },
    confirm() {
      this.$refs["addForm"].validate(validator => {
        if (validator) {
          this.addForm.tag = this.addForm.tag.join(",");
          if (this.dialogFlag == "add") this.addArt();
          if (this.dialogFlag == "updata") this.editArt();
        }
      });
    },
    //本地删除上传图片
    deleteBtn() {
      if (this.pcCoverUrl) {
        this.pcCoverUrl = "";
        this.showDelete = false;
      }
    },
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

            if (res.data.resourcesInfo) {
              for (let val of res.data.resourcesInfo) {
                // type 0为图片 2为视频
                if (val.type == 0) {
                  this.libType = 0;
                } else if (val.type == 2) {
                  this.libType = 2;
                }
              }
            }
            if (this.libType == 0) {
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
            } else if (this.libType == 2) {
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
            }
          });
        }
      });
    },

    // 新增
    addArt() {
      addArt(this.addForm).then(res => {
        if (res.code == 200) {
          this.$message.success("新增成功");
          this.$router.back();
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
    },
    //修改
    editArt() {
      this.addForm["id"] = this.detailId;
      editArt(this.addForm).then(res => {
        if (res.code == 200) {
          this.$message.success("修改成功");
          this.$refs["addForm"].resetFields();
          this.$router.back();
        }
      });
    }
  },
  destroyed() {
    this.wangEditorShow = false;
  }
};
</script>

<style lang="scss" scoped>
.view-container-art {
  .w800 {
    width: 800px;
    &.title-width {
      width: 500px;
    }
  }
}
</style>
