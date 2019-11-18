<template>
  <section class="view-container">
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
        <el-form-item :label="form.labelTitle" prop="title">
          <el-input
            class="w920"
            v-model="addForm.title"
            clearable
            :placeholder="'请输入'+form.labelTitle"
            maxlength="100"
            :autosize="{ minRows: 1, maxRows: 3}"
            type="textarea"
          ></el-input>
        </el-form-item>
      </div>
      <el-form-item label="非遗分类" prop="childType" v-if="addForm.type=='0'||addForm.type=='1'">
        <el-select v-model="addForm.childType" placeholder="请选择非遗分类">
          <el-option
            v-for="(i,index) in childTypeOptions"
            :key="index"
            :label="i.label"
            :value="i.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="关联信息" prop="parentId" v-if="addForm.type=='3'||addForm.type=='4'">
        <el-select v-model="form.labelType" placeholder="请选择关联信息" @change="labelTypeChange">
          <el-option
            v-for="(i,index) in form.parentIdOptions"
            :key="index"
            :label="i.label"
            :value="i.value"
          ></el-option>
        </el-select>
      </el-form-item>

      <!-- 传承人下面只显示保护名录 -->
      <el-form-item :label="form.labelText" v-if="form.labelType||addForm.type==1">
        <el-select
          v-model="addForm.parentId"
          placeholder="请输入关键字"
          :remote-method="fetchData"
          :loading="optionsLoading"
          filterable
          remote
          clearable
          @clear="handleClear"
        >
          <el-option
            v-for="(i,index) in parentOptions"
            :key="index"
            :label="i.label"
            :value="i.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="保护级别"
        prop="protectLevel"
        v-if="addForm.type==0||addForm.type==1||addForm.type==2"
      >
        <el-select v-model="addForm.protectLevel" placeholder="请选择保护级别">
          <el-option
            v-for="(i,index) in protectLevelOptions"
            :key="index"
            :label="i.label"
            :value="i.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="简介" prop="introduce" class="edit-form">
        <el-input
          class="w920"
          type="textarea"
          :autosize="{ minRows: 5, maxRows: 100}"
          v-model="addForm.introduce"
          clearable
          placeholder="简介"
          maxlength="200"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="地区"
        prop="regionCode"
        class="edit-form"
        v-if="addForm.type==0||addForm.type==1||addForm.type==2"
      >
        <el-input type="hidden" class="district-wraper w920" v-model="addForm.regionCode">
          <ProvinceCityArea
            slot="append"
            :districtCode="addForm.regionCode"
            @receiveProvinceEvent="receiveProvinceEvent"
            @receiveCityEvent="receiveCityEvent"
            @receiveEvent="receiveEvent"
          ></ProvinceCityArea>
        </el-input>
      </el-form-item>
      <el-form-item
        label="封面"
        prop="mobileCover"
        class="block"
        :rules="this.addForm.type==0?addRules.mobileCover:[{ required: false, message: '请上传封面'}]"
      >
        <Uploader
          :fileList="mobileCoverList"
          @getList="getCoverList"
          :limit="1"
          :type="0"
          width="750"
          height="350"
          :square="addForm.type==1?true:false"
        ></Uploader>
        <el-input type="hidden" v-model="addForm.mobileCover"></el-input>
      </el-form-item>
      <el-form-item label="图片" prop="resources" class="edit-form" v-if="!form.type">
        <Uploader :fileList="pictureResourcesList" @getList="getPictureList" :limit="10" :type="0"></Uploader>
      </el-form-item>
      <div v-if="form.type&&(addForm.type=='3'||addForm.type=='4')">
        <el-form-item label="相关资源">
          <el-select v-model="form.type" placeholder="请选择音频或者视频">
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
        v-if="form.type=='1'&&(addForm.type=='3'||addForm.type=='4')"
      >
        <Uploader :fileList="videoResourcesList" @getList="getVideoList" :limit="1" :type="2"></Uploader>
      </el-form-item>
      <!-- 上传音频 -->
      <el-form-item
        label="音频"
        prop="resources"
        class="edit-form"
        v-if="form.type=='2'&&(addForm.type=='3'||addForm.type=='4')"
      >
        <Uploader :fileList="audioResourcesList" @getList="getAudioList" :limit="1" :type="1"></Uploader>
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
import Uploader from "@/components/Uploader";
import {
  addInheritance,
  editInheritance,
  getChildTypeData,
  getInheritanceDetail,
  getDataNoPage,
  protectLevelData
} from "@/api/mcc/inheritance.js";
import WangEditor from "@/components/WangEditor";
import ProvinceCityArea from "@/components/ProvinceCityArea";
import { isEmpty } from "@/utils/common";
import { fileDetail, getfiles } from "@/api/file.js";
export default {
  data() {
    return {
      wangEditorShow: true,
      // 路由参数
      routeQuery: {
        type: "",
        typeCode: ""
      },
      mobileCoverList: [],
      pictureResourcesList: [],
      videoResourcesList: [], // 视频
      audioResourcesList: [], // 音频
      detailId: "",
      dialogFlag: "add",
      typeOptions: [], // 大类类型
      childTypeOptions: [], // 小类类型
      protectLevelOptions: [], // 保护级别
      addForm: {
        title: "",
        type: "",
        parentId: "",
        parentType: "",
        childType: "",
        introduce: "",
        protectLevel: "", // 保护级别
        regionCode: "", // 区域编码
        regionName: "", // 区域名称
        mobileCover: "",
        resources: ""
      },
      addRules: {
        title: [{ required: true, message: "请输入标题" }],
        childType: [
          { required: true, message: "请选择非遗传承", trigger: "change" }
        ],
        protectLevel: [
          { required: true, message: "请选择保护级别", trigger: "change" }
        ],
        mobileCover: [{ required: true, message: "请上传封面" }]
      },
      props: {
        value: "message",
        label: "message",
        children: "childEnum"
      },
      parentOptions: [],
      form: {
        // type 1为视频  2位音频
        type: 1,
        parentType: "",
        labelTitle: "",
        audioType: [
          {
            value: 1,
            label: "视频"
          },
          {
            value: 2,
            label: "音频"
          }
        ],
        resourceType: "",
        labelText: "关联信息",
        getNoPageObj: {},
        labelType: "",
        parentIdOptions: [
          {
            label: "保护名录",
            value: 1
          },
          {
            label: "传承人",
            value: 2
          },
          {
            label: "保护区",
            value: 3
          }
        ]
      },
      isLoading: false,
      optionsLoading: false
    };
  },
  components: { WangEditor, ProvinceCityArea, Uploader },
  created() {
    this.getChildTypeData(); // 获取小类类型
    this.protectLevelData(); // 获取保护级别
    this.routeQuery = this.$route.params;
    this.addForm.type = this.routeQuery.type;
    if (this.addForm.type == 1) {
      this.addForm.parentType = 0; // 1位传承人类型
      this.form.labelText = "保护名录";
      this.form.labelTitle = "传承人姓名";
      this.getDataNoPage({
        title: "",
        type: 0,
        examineStatus: 1,
        publishStatus: 1
      });
    } else {
      this.form.labelTitle = "标题";
    }
    if (this.$route.query && this.$route.query.id) {
      this.detailId = this.$route.query.id;
      this.dialogFlag = "updata";
      this.getInheritanceDetail();
    } else {
      if (this.addForm.type == 3) {
        this.form.type = "";
      }
      this.dialogFlag = "add";
    }
  },
  methods: {
    /*上传封面*/
    getCoverList(list) {
      this.mobileCoverList = list;
      this.addForm.mobileCover = list
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
    /* 上传音频 */
    getAudioList(list) {
      this.audioResourcesList = list;
      this.addForm.resources = list
        .map(i => {
          return i.id;
        })
        .toString();
    },
    confirm() {
      this.$refs["addForm"].validate(validator => {
        if (validator) {
          if (this.dialogFlag == "add") this.addInheritance();
          if (this.dialogFlag == "updata") this.editInheritance();
        }
      });
    },
    // 模糊搜索的选择事件
    handleSelect(el) {},
    getParentType(type) {
      if (type == 0) {
        return "  (保护名录)";
      } else if (type == 1) {
        return "  (传承人)";
      } else if (type == 2) {
        return "  (保护区)";
      } else if (type == 3) {
        return "  (图集)";
      } else if (type == 4) {
        return "  (音视频)";
      }
    },
    // split(",")[0]
    // 选择省
    receiveProvinceEvent(data) {
      this.areaData(data);
    },
    // 选择市
    receiveCityEvent(data) {
      this.areaData(data);
    },
    // 选择省市区
    receiveEvent(data) {
      this.areaData(data);
    },
    areaData(data) {
      this.addForm.regionCode = data.mergerCode;
      this.addForm.regionName = data.mergerName;
    },
    // 详情
    getInheritanceDetail() {
      if (this.detailId) {
        this.isLoading = true;
        getInheritanceDetail(this.detailId)
          .then(res => {
            if (res.code == 200) {
              Object.keys(this.addForm).forEach(key => {
                this.addForm[key] = res.data[key];
              });

              if (res.data && res.data.parentType == 0) {
                this.form.labelType = 1;
              } else if (res.data && res.data.parentType == 1) {
                this.form.labelType = 2;
              } else if (res.data && res.data.parentType == 2) {
                this.form.labelType = 3;
              }
              this.getDataNoPage({
                title: "",
                type: res.data["parentType"],
                examineStatus: 1,
                publishStatus: 1
              });
              // 获取封面
              this.mobileCoverList = res.data.coverFileInfo
                ? [
                    {
                      id: res.data.coverFileInfo.id,
                      type: res.data.coverFileInfo.type,
                      name: res.data.coverFileInfo.name,
                      url: this.baseImgUrl + res.data.coverFileInfo.path
                    }
                  ]
                : [];

              if (res.data && res.data.resourcesFileInfo) {
                for (let val of res.data.resourcesFileInfo) {
                  this.form.resourceType = val.type;
                }
              }
              if (this.form.resourceType && this.form.resourceType == 1) {
                this.form.type = 2; //音频
              } else if (
                this.form.resourceType &&
                this.form.resourceType == 2
              ) {
                this.form.type = 1; //视频
              }

              // 获取图片数组
              this.pictureResourcesList = res.data.resourcesFileInfo
                ? res.data.resourcesFileInfo.map(i => {
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
              this.videoResourcesList = res.data.resourcesFileInfo
                ? res.data.resourcesFileInfo.map(i => {
                    return {
                      id: i.id,
                      type: i.type,
                      name: i.name,
                      path: this.baseImgUrl + i.path,
                      url: this.baseImgUrl + i.imgSourceCompress
                    };
                  })
                : [];
              // 获取音频数组
              this.audioResourcesList = res.data.resourcesFileInfo
                ? res.data.resourcesFileInfo.map(i => {
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
    // 获取小类类型数据
    getChildTypeData() {
      getChildTypeData().then(res => {
        if (res.data) {
          let arr = [];
          for (let val of res.data) {
            arr.push({
              label: val.message,
              value: val.code
            });
          }
          this.childTypeOptions = [...arr];
        }
      });
    },
    labelTypeChange(labelType) {
      if (labelType == 1) {
        labelType = 0;
        this.form.labelText = "保护名录";
        this.addForm.parentType = 0;
      } else if (labelType == 2) {
        labelType = 1;
        this.form.labelText = "传承人";
        this.addForm.parentType = 1;
      } else if (labelType == 3) {
        labelType = 2;
        this.form.labelText = "保护区";
        this.addForm.parentType = 2;
      }
      this.form.getNoPageObj = {
        type: labelType,
        examineStatus: 1,
        publishStatus: 1
      };
      this.parentOptions = [];
      this.addForm.parentId = "";
      this.getDataNoPage(this.form.getNoPageObj);
    },

    // 远程搜索
    fetchData(query) {
      this.form.getNoPageObj["title"] = query || "";
      this.getDataNoPage(this.form.getNoPageObj);
    },
    // 获取父级主键
    getDataNoPage(params) {
      this.optionsLoading = true;
      getDataNoPage(params)
        .then(res => {
          if (res.data) {
            let arr = [];
            for (let val of res.data) {
              arr.push({
                label: val.title,
                value: val.id
              });
            }
            this.optionsLoading = false;
            this.parentOptions = [...arr];
          }
        })
        .finally(() => {
          this.optionsLoading = false;
        });
    },
    // 获取保护级别
    protectLevelData() {
      protectLevelData().then(res => {
        if (res.data) {
          let arr = [];
          for (let val of res.data) {
            arr.push({
              label: val.message,
              value: val.code
            });
          }
          this.protectLevelOptions = [...arr];
        }
      });
    },
    // 新增
    addInheritance() {
      addInheritance(this.addForm).then(res => {
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
    //修改
    editInheritance() {
      this.addForm["id"] = this.detailId;
      editInheritance(this.addForm).then(res => {
        if (res.code == 200) {
          this.$message.success("修改成功");
          this.$refs["addForm"].resetFields();
          this.$router.back();
        }
      });
    },
    // 清除
    handleClear() {
      this.parentOptions = [];
    }
  },
  destroyed() {
    this.wangEditorShow = false;
  }
};
</script>

<style lang="scss" scoped>
.w920 {
  width: 920px;
  &.title-width {
    width: 300px;
  }
}
</style>
