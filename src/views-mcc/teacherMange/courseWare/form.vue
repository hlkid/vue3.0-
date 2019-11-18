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
        <el-form-item label="标题" prop="title">
          <el-input
            class="w920"
            v-model="addForm.title"
            clearable
            placeholder="请输入标题"
            maxlength="50"
            :autosize="{ minRows: 1, maxRows: 3}"
            type="textarea"
          ></el-input>
        </el-form-item>
      </div>
      <div>
        <el-form-item label="课程类型" prop="type">
          <el-select
            v-model="addForm.type"
            placeholder="请选择课程类型"
            @change="typeChange"
            style="width:350px"
          >
            <el-option
              v-for="(i,index) in courseOptions"
              :key="index"
              :label="i.label"
              :value="i.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="课程" v-if="form.labelType" style="margin-left:220px" prop="idTeacherCourse">
          <el-select
            v-model="addForm.idTeacherCourse"
            placeholder="请输入关键字"
            :remote-method="fetchData"
            :loading="optionsLoading"
            filterable
            remote
            clearable
            style="width:350px"
          >
            <el-option
              v-for="(i,index) in courseList"
              :key="index"
              :label="i.label"
              :value="i.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </div>
      <el-form-item label="简介" prop="introduce" class="edit-form" v-if="form.labelType!=1">
        <el-input
          class="w920"
          v-model="addForm.introduce"
          clearable
          placeholder="请输入简介"
          :autosize="{ minRows: 3, maxRows: 100}"
          type="textarea"
        ></el-input>
      </el-form-item>
      <el-form-item label="内容" prop="content" class="block edit-form" v-if="form.labelType==1">
        <WangEditor v-model="addForm.content"></WangEditor>
      </el-form-item>
      <!-- 上传音频 -->
      <el-form-item label="音频" prop="resources" class="edit-form" v-if="form.labelType==2">
        <Uploader :fileList="audioResourcesList" @getList="getAudioList" :limit="1" :type="1"></Uploader>
      </el-form-item>
      <!-- 上传视频 -->
      <el-form-item label="视频" prop="resources" class="edit-form" v-if="form.labelType==3">
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
import Uploader from "@/components/Uploader";
import WangEditor from "@/components/WangEditor";
import {
  addTeacherCourseware,
  editTeacherCourseware,
  getTeacherCoursewareDetail,
  getCourseType,
  getLinkCourseList
} from "@/api/mcc/teacherMange.js";
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
      videoResourcesList: [],
      audioResourcesList: [],
      detailId: "",
      dialogFlag: "add",
      courseOptions: [],
      courseList: [],
      addForm: {
        title: "",
        idTeacherCourse: "",
        introduce:"",
        type: "",
        content: "",
        resources: ""
      },
      addRules: {
        title: [{ required: true, message: "请输入标题" }],
        type: [{ required: true, message: "请选择课程类型", trigger: "change" }],
        idTeacherCourse:[{ required: true, message: "请选择课程", trigger: "change" }],
        idTeacher: [
          { required: true, message: "请选择教师", trigger: "change" }
        ],
        content: [{ required: true, message: "请输入内容" }]
      },
      form: {
        // type  0为图文 1为视频  2位音频
        type: 0,
        labelType: "",
        getNoPageObj: {}
      },
      isLoading: false,
      optionsLoading: false
    };
  },
  components: { Uploader, WangEditor },
  created() {
    this.getCourseType();
    if (this.$route.query && this.$route.query.id) {
      this.detailId = this.$route.query.id;
      this.dialogFlag = "updata";
      this.getTeacherCoursewareDetail();
    } else {
      this.dialogFlag = "add";
    }
  },
  methods: {
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
          if (this.dialogFlag == "add") this.addTeacherCourseware();
          if (this.dialogFlag == "updata") this.editTeacherCourseware();
        }
      });
    },
    // 详情
    getTeacherCoursewareDetail() {
      this.isLoading = true;
      if (this.detailId) {
        getTeacherCoursewareDetail(this.detailId)
          .then(res => {
            if (res.code == 200) {
              Object.keys(this.addForm).forEach(key => {
                this.addForm[key] = res.data[key];
              });

              if (res.data && res.data.type == 0) {
                this.form.labelType = 1;
              } else if (res.data && res.data.type == 1) {
                this.form.labelType = 2;
              } else if (res.data && res.data.type == 2) {
                this.form.labelType = 3;
              }
              this.getLinkCourseList({
                name: "",
                type: res.data["type"],
                examineStatus: 1,
                publishStatus: 1
              });
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
    // 获取课程关联列表
    getCourseType() {
      let params = {
        examineStatus: 1,
        publishStatus: 1
      };
      getCourseType(params).then(res => {
        let arr = [];
        if (res) {
          for (let val of res.data) {
            arr.push({
              label: val.message,
              value: val.code
            });
          }
          this.courseOptions = [...arr];
        }
      });
    },
    typeChange(type) {
      if (type == 0) {
        this.form.labelType = 1;
      } else if (type == 1) {
        this.form.labelType = 2;
      } else if (type == 2) {
        this.form.labelType = 3;
      }
      this.form.getNoPageObj = {
        type: type,
        name: "",
        examineStatus: 1,
        publishStatus: 1
      };
      this.addForm.idTeacherCourse = "";
      this.courseList = [];
      this.getLinkCourseList(this.form.getNoPageObj);
    },
    // 远程搜索
    fetchData(query) {
      this.form.getNoPageObj["name"] = query || "";
      this.getLinkCourseList(this.form.getNoPageObj);
    },
    // 获取课程列表
    getLinkCourseList(params) {
      this.optionsLoading = true;
      getLinkCourseList(params)
        .then(res => {
          if (res.data) {
            let arr = [];
            for (let val of res.data) {
              arr.push({
                label: val.name,
                value: val.id
              });
            }
            this.optionsLoading = false;
            this.courseList = [...arr];
          }
        })
        .finally(() => {
          this.optionsLoading = false;
        });
    },
    // 新增
    addTeacherCourseware() {
      addTeacherCourseware(this.addForm).then(res => {
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
    editTeacherCourseware() {
      this.addForm["id"] = this.detailId;
      editTeacherCourseware(this.addForm).then(res => {
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
.w920 {
  width: 920px;
}
</style>
