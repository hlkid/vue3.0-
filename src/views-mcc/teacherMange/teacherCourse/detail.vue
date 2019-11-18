<template>
  <section class="view-teacher-course-detail">
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
        <el-form-item label="课程名称" prop="name">
          <el-input
            v-model="addForm.name"
            clearable
            placeholder="请输入课程名称"
            maxlength="50"
            style="width:350px"
            readonly
          ></el-input>
        </el-form-item>
        <el-form-item label="课件数量" prop="courseNum" style="margin-left:220px">
          <el-input
            v-model="addForm.courseNum"
            clearable
            placeholder="请输入课件数量"
            style="width:350px"
            readonly
          ></el-input>
        </el-form-item>
      </div>
      <div>
        <el-form-item label="课程类型" prop="type">
          <el-select v-model="addForm.type" placeholder="请选择课程类型" style="width:350px" disabled>
            <el-option
              v-for="(i,index) in courseOptions"
              :key="index"
              :label="i.label"
              :value="i.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="教师" prop="idTeacher" style="margin-left:220px">
          <el-select
            v-model="addForm.idTeacher"
            placeholder="请输入关键字"
            :remote-method="fetchData"
            :loading="optionsLoading"
            filterable
            remote
            clearable
            style="width:350px"
            disabled
          >
            <el-option
              v-for="(i,index) in idTeacherOptions"
              :key="index"
              :label="i.label"
              :value="i.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </div>

      <el-form-item label="简介" prop="introduce" class="edit-form" v-if="addForm.type!='0'">
        <el-input
          class="w800"
          type="textarea"
          :autosize="{ minRows: 5, maxRows: 1000}"
          v-model="addForm.introduce"
          clearable
          placeholder="请输入简介"
          readonly
        ></el-input>
      </el-form-item>
      <el-form-item label="内容" prop="content" class="edit-form" v-if="addForm.type=='0'">
        <div v-html="addForm.content"></div>
      </el-form-item>
      <el-form-item label="封面" prop="mobileCover">
        <div class="img-div">
          <div class="img-item" v-for="(i,index) in mobileCoverList" :key="index">
            <el-image style="height:148px;width:148px" :src="i.url"></el-image>
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
import Uploader from "@/components/Uploader";
import {
  addTeacherCourse,
  editTeacherCourse,
  getTeacherCourseDetail,
  getCourseType,
  getTeacherMangeDataNoPage
} from "@/api/mcc/teacherMange.js";
import WangEditor from "@/components/WangEditor";
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
      idTeacherOptions: [],
      detailId: "",
      dialogFlag: "add",
      courseOptions: [],
      addForm: {
        name: "",
        type: "",
        idTeacher: "",
        content: "",
        courseNum: "",
        introduce: "",
        mobileCover: ""
      },
      addRules: {
        name: [{ required: true, message: "请输入课程名称" }],
        type: [
          { required: true, message: "请选择课程类型", trigger: "change" }
        ],
        courseNum: [{ required: true, message: "请输入课程数量" }],
        mobileCover: [{ required: true, message: "请上传封面" }]
      },

      props: {
        value: "message",
        label: "message",
        children: "childEnum"
      },
      form: {
        // type 1为视频  2位音频
        type: 1,
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
        labelType: "",
        getNoPageObj: {},
        labelOptions: []
      },

      isLoading: false,
      optionsLoading: false
    };
  },
  components: { Uploader, WangEditor },
  created() {
    this.getCourseType();
    this.fetchData();
    if (this.$route.query && this.$route.query.id) {
      this.detailId = this.$route.query.id;
      this.dialogFlag = "updata";
      this.getTeacherCourseDetail();
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
    // 详情
    getTeacherCourseDetail() {
      this.isLoading = true;
      if (this.detailId) {
        getTeacherCourseDetail(this.detailId)
          .then(res => {
            if (res.code == 200) {
              Object.keys(this.addForm).forEach(key => {
                this.addForm[key] = res.data[key];
              });
              // 获取封面
              this.mobileCoverList = res.data.mobileCoverFileInfo
                ? [
                    {
                      id: res.data.mobileCoverFileInfo.id,
                      type: res.data.mobileCoverFileInfo.type,
                      name: res.data.mobileCoverFileInfo.name,
                      url: this.baseImgUrl + res.data.mobileCoverFileInfo.path
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
    // 获取课程类型
    getCourseType() {
      getCourseType().then(res => {
        if (res) {
          let arr = [];
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
    fetchData(query) {
      let obj = {
        name: query || "",
        examineStatus: 1,
        publishStatus: 1
      };
      this.getTeacherMangeDataNoPage(obj);
    },
    // 获取父级主键
    getTeacherMangeDataNoPage(params) {
      this.optionsLoading = true;
      getTeacherMangeDataNoPage(params)
        .then(res => {
          if (res.data) {
            let arr = [];
            for (let val of res.data) {
              arr.push({
                label: val.name,
                value: val.id
              });
            }
            this.idTeacherOptions = [...arr];
          }
        })
        .finally(() => {
          this.optionsLoading = false;
        });
    }
  },
  destroyed() {
    this.wangEditorShow = false;
  }
};
</script>

<style lang="scss" scoped>
.view-teacher-course-detail {
  .w800 {
    width: 920px;
    &.title-width {
      width: 200px;
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
