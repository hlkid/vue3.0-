<template>
  <section class="view-teacher-style-detail">
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
      <el-form-item label="姓名" prop="name">
        <el-input
          v-model="addForm.name"
          clearable
          placeholder="请输入姓名"
          style="width:200px"
          maxlength="10"
          readonly
        ></el-input>
      </el-form-item>
      <el-form-item label="性别" prop="sex">
        <el-select v-model="addForm.sex" placeholder="请选择性别" style="width:200px" disabled>
          <el-option
            v-for="(i,index) in sexTypeOptions"
            :key="index"
            :label="i.label"
            :value="i.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="教师分类" prop="artType">
        <el-select
          v-model="addForm.artType"
          placeholder="请选择教师分类"
          multiple
          style="width:200px"
          disabled
        >
          <el-option v-for="i in artTypeOptions" :key="i.value" :label="i.label" :value="i.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="职位荣誉" prop="positionHonor" class="edit-form">
        <el-input
          class="w800"
          type="textarea"
          :autosize="{ minRows: 3, maxRows: 10}"
          v-model="addForm.positionHonor"
          clearable
          placeholder="请输入职位荣誉"
          readonly
        ></el-input>
      </el-form-item>
      <el-form-item label="简介" class="edit-form">
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
      <el-form-item label="封面" prop="pcCover">
        <div class="img-div">
          <div class="img-item" v-for="(i,index) in pcCoverList" :key="index">
            <el-image style="height:148px;width:148px" :src="i.url"></el-image>
          </div>
        </div>
      </el-form-item>
      <div class="btns-waper">
        <el-button size="small" @click="$router.go(-1)">返回</el-button>
      </div>
    </el-form>
  </section>
</template>

<script>
import { applicationDictionaryDataByTypeCode } from "@/api/config.js";
import Uploader from "@/components/Uploader";
import {
  addTeacherMange,
  addTeacherCourse,
  editTeacherMange,
  getTeacherMangeDetail
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
      pcCoverList: [],
      artTypeOptions: [],
      detailId: "",
      dialogFlag: "add",
      sexTypeOptions: [
        {
          label: "男",
          value: 0
        },
        {
          label: "女",
          value: 1
        }
      ],
      addForm: {
        name: "",
        sex: "",
        artType: "",
        positionHonor: "",
        introduce: "",
        pcCover: ""
      },
      addRules: {
        name: [{ required: true, message: "请输入姓名" }],
        sex: [{ required: true, message: "请选择性别", trigger: "change" }],
        positionHonor: [{ required: true, message: "请输入职位荣誉" }],
        introduce: [{ required: true, message: "请输入简介" }],
        artType: [
          { required: true, message: "请选择教师分类", trigger: "change" }
        ],
        pcCover: [{ required: true, message: "请上传封面" }]
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
        oldType: [],
        typeOptions: []
      },
      isLoading: false
    };
  },
  components: { Uploader },
  created() {
    this.applicationDictionaryDataByTypeCode(
      this.$dicts.teacherArtType,
      this.artTypeOptions
    );
    this.routeQuery = this.$route.params;
    if (this.$route.query && this.$route.query.id) {
      this.isLoading = true;
      this.detailId = this.$route.query.id;
      this.dialogFlag = "updata";
      this.getTeacherMangeDetail();
      this.isLoading = false;
    } else {
      this.dialogFlag = "add";
    }
  },
  methods: {
    /*上传封面*/
    getCoverList(list) {
      this.pcCoverList = list;
      this.addForm.pcCover = list
        .map(i => {
          return i.id;
        })
        .toString();
    },
    // 详情
    getTeacherMangeDetail() {
      if (this.detailId) {
        getTeacherMangeDetail(this.detailId).then(res => {
          if (res.code == 200) {
            Object.keys(this.addForm).forEach(key => {
              this.addForm[key] = res.data[key];
            });
            let newData = [];
            let tag = res.data["artType"].split(",");
            this.artTypeOptions.forEach(item => {
              tag.forEach(code => {
                if (item.value == code) {
                  newData.push(item);
                }
              });
            });
            this.addForm["artType"] = newData.map(item => item.value);
            // 获取封面
            this.pcCoverList = res.data.pcCoverInfo
              ? [
                  {
                    id: res.data.pcCoverInfo.id,
                    type: res.data.pcCoverInfo.type,
                    name: res.data.pcCoverInfo.name,
                    url: this.baseImgUrl + res.data.pcCoverInfo.path
                  }
                ]
              : [];
          }
        });
      }
    },
    //数据词典
    applicationDictionaryDataByTypeCode(code, arr = []) {
      applicationDictionaryDataByTypeCode(code).then(res => {
        if (res.code == 200) {
          res.data.forEach(item => {
            arr.push({
              label: item.valueName,
              value: item.value
            });
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
  },
  destroyed() {
    this.wangEditorShow = false;
  }
};
</script>

<style lang="scss" scoped>
.view-teacher-style-detail {
  .w800 {
    width: 900px;
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
