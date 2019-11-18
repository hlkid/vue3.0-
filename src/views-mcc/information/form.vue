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
    >
      <div>
        <el-form-item label="标题" prop="title">
          <el-input
            class="w800"
            v-model="addForm.title"
            clearable
            placeholder="标题"
            maxlength="100"
            :autosize="{ minRows: 1, maxRows: 3}"
            type="textarea"
          ></el-input>
        </el-form-item>
      </div>

      <el-form-item label="类型" prop="childType" v-if="childTypeOptions.length">
        <el-select v-model="addForm.childType" placeholder>
          <el-option
            v-for="item in childTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <!--<el-cascader :props="props" v-model="type" :options="childTypeOptions" clearable @change="typeChange"
        popper-class="cascader-form"></el-cascader>-->
      </el-form-item>

      <el-form-item label="是否公开" prop="publicFlag">
        <el-radio-group v-model="addForm.publicFlag">
          <el-radio :label="0">否</el-radio>
          <el-radio :label="1">是</el-radio>
        </el-radio-group>
      </el-form-item>

      <!--只有志愿者风采，文化动态，阅讯 可评论-->
      <template v-if="routeQuery.type == 1 || routeQuery.type == 2 || routeQuery.type == 10">
        <el-form-item label="是否可评论" prop="commentFlag">
          <el-radio-group v-model="addForm.commentFlag">
            <el-radio :label="0">否</el-radio>
            <el-radio :label="1">是</el-radio>
          </el-radio-group>
        </el-form-item>
      </template>

      <!--<el-form-item label="通知人">
        <el-select v-model="noticePerson" filterable clearable multiple collapse-tags placeholder="通知人"
                   popper-class="cascader-form">
          <el-option
            v-for="item in ourContractorOption"
            :key="item.id"
            :label="item.userRealName"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>-->

      <el-form-item label="内容" prop="content" class="edit-form">
        <wang-editor v-model="addForm.content" v-if="wangEditorShow"></wang-editor>
      </el-form-item>

      <el-form-item label="封面" prop="cover">
        <Uploader :fileList="coverList" @getList="getCoverList" :limit="1" :type="0"></Uploader>
        <el-input type="hidden" v-model="addForm.cover"></el-input>

        <!--<el-upload
          :action="uploadFileParamsUrl"
          :on-remove="handleRemove"
          :on-success="handleSuccess"
          :show-file-list="false"
        >
          <img height="150" v-if="cover.path" :src="baseImgUrl+cover.path" />
          &lt;!&ndash;<img height="100" v-if="cover.imgSourceCompress" src="http://pic37.nipic.com/20140113/8800276_184927469000_2.png">&ndash;&gt;
          <i
            style="font-size: 30px;color: #ccc;border: 1px solid #ccc; height: 100px;width: 100px;line-height: 100px;"
            v-else
            class="el-icon-plus avatar-uploader-icon"
          ></i>
        </el-upload>-->
      </el-form-item>

      <div class="btns-waper">
        <el-button size="small" @click="$router.go(-1)">取 消</el-button>
        <el-button size="small" type="primary" @click="confirm">提 交</el-button>
      </div>
    </el-form>
  </section>
</template>

<script>
import {
  getUserData,
  applicationDictionaryDataByTypeCode
} from "@/api/config.js";
import {
  getNewNoticeTypeEnum,
  getNewNoticeDetail,
  addNewNotice,
  editNewNotice
} from "@/api/mcc/information.js";
import WangEditor from "@/components/WangEditor";
import { isEmpty } from "@/utils/common";
import { fileDetail, uploadFileUrl, getfiles } from "@/api/file.js";
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

      // 封面
      coverList: [],

      reviseId: "",
      dialogFlag: "add",

      noticePerson: [],

      addForm: {
        title: "",
        content: "",
        type: "",
        childType: "",
        noticePerson: "",
        cover: "",
        commentFlag: 0,
        publicFlag: 0
      },
      addRules: {
        title: [{ required: true, message: "请输入新闻标题" }],
        childType: [{ required: true, message: "请选择类型" }],
        content: [{ required: true, message: "请输入新闻内容" }]
      },

      childTypeOptions: [],
      //联系人
      ourContractorOption: [],

      props: {
        value: "message",
        label: "message",
        children: "childEnum"
      }
    };
  },
  components: { WangEditor, Uploader },

  methods: {
    // 文件上传 ----删除一个文件的回调--
    handleRemove(file, fileList) {
      this.cover = {};
      this.addForm.cover = "";
    },
    // 文件上传 ----上传成功--
    handleSuccess(response, file, fileList) {
      this.cover = response.data;
      this.addForm.cover = response.data.id;
    },
    confirm() {
      this.$refs["addForm"].validate(validator => {
        if (validator) {
          this.addForm.noticePerson = this.noticePerson.join(",");

          if (this.dialogFlag == "add") this.addNewNotice();

          if (this.dialogFlag == "updata") this.editNewNotice();
        }
      });
    },
    // 文件 查询
    fileDetail(ids) {
      if (!isEmpty(ids)) {
        getfiles({ ids: ids }).then(res => {
          if (res.code == 200) {
            this.coverList = res.data.map(i => {
              return {
                id: i.id,
                type: i.type,
                name: i.name,
                path: this.baseImgUrl + i.path,
                url: this.baseImgUrl + i.path
              };
            });
          }
        });
      }
    },
    getCoverList(list) {
      this.coverList = list;
      this.addForm.cover = list
        .map(i => {
          return i.id;
        })
        .toString();
    },
    /*getNewNoticeTypeEnum() {
        getNewNoticeTypeEnum().then(res => {
          if (res.code == 200) {
            this.childTypeOptions = res.data;
          }
        })
      },*/
    // 用户列表
    getUserData() {
      getUserData().then(res => {
        //console.log(res)
        this.ourContractorOption = res.data;
      });
    },

    //类型change
    typeChange(row) {
      let that = this;
      if (row.length) {
        let valueChildren = [];
        row.forEach((e, i) => {
          if (i == 0) {
            let value = this.childTypeOptions.find(obj => obj.message == e);
            if (value) {
              that.addForm.type = value.code;
              valueChildren = value.childEnum;
            }
          } else {
            let value = valueChildren.find(obj => obj.message == e);
            if (value) that.addForm.childType = value.code;
          }
        });
      }
    },
    // 详情
    getNewNoticeDetail() {
      getNewNoticeDetail(this.reviseId).then(res => {
        if (res.code == 200) {
          for (let key in this.addForm) {
            this.addForm[key] = res.data[key];
          }
          if (res.data.noticePerson) {
            this.noticePerson = res.data.noticePerson.split(",");
          }
          let typeList = [];
          let types = this.childTypeOptions.find(e => e.code == res.data.type);
          if (types) {
            typeList.push(types.message);
            let childTypes = types.childEnum.find(
              e => e.code == res.data.childType
            );
            if (childTypes) {
              typeList.push(childTypes.message);
            }
          }
          this.type = typeList;

          this.fileDetail(this.addForm.cover);
        }
      });
    },

    // 新增
    addNewNotice() {
      addNewNotice(this.addForm).then(res => {
        if (res.code == 200) {
          this.$message.success("新增成功");
          // this.$refs['addForm'].resetFields();
          this.$router.back();
        }
      });
    },
    //修改
    editNewNotice() {
      editNewNotice(this.reviseId, this.addForm).then(res => {
        if (res.code == 200) {
          this.$message.success("修改成功");
          // this.$refs['addForm'].resetFields();
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
    }
  },
  created() {
    this.routeQuery = this.$route.params;
    this.addForm.type = this.routeQuery.type;
    if (this.$route.params.id) {
      this.reviseId = this.$route.params.id;
      this.dialogFlag = "updata";
      this.getNewNoticeDetail();
    } else {
      this.dialogFlag = "add";
    }
    // this.getUserData();
    this.applicationDictionaryDataByTypeCode(
      this.routeQuery.typeCode,
      this.childTypeOptions
    );
    // this.getNewNoticeTypeEnum();
  },
  destroyed() {
    this.wangEditorShow = false;
  }
};
</script>

<style lang="scss" scoped>
.w800 {
  width: 800px;
}
</style>
