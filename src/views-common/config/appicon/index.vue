<template>
  <section class="view-container">
    <el-form
      class="search-form"
      ref="searchForm"
      :model="searchForm"
      label-width="0"
      :inline="true"
      size="small"
    >
      <el-form-item prop="name">
        <el-input v-model="searchForm.name" placeholder="请输入名称"></el-input>
      </el-form-item>

      <el-form-item label prop="hbAppId">
        <el-select v-model="searchForm.hbAppId" clearable placeholder="请选择应用类型">
          <el-option
            :label="item.label"
            :value="item.value"
            v-for="(item,index) in useTypeList"
            :key="index"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit()">
          <i class="fa fa-search"></i>&nbsp;
          查询
        </el-button>
        <el-button @click="reset()">
          <i class="fa fa-repeat"></i>&nbsp;重置
        </el-button>
      </el-form-item>
    </el-form>
    <section class="list-wraper">
      <el-row class="btn-wraper">
        <el-button
          v-if="hasButton('config_appicon_add')"
          size="small"
          type="primary"
          @click="addIcon()"
        >
          <i class="fa fa-plus"></i>
          &nbsp;新增图标
        </el-button>
      </el-row>
      <el-row class="table-wraper">
        <template>
          <el-table style="width: 100%;" stripe border :data="tableData" ref="multipleTable">
            <el-table-column prop="name" sortable label="名称" align="center"></el-table-column>
            <el-table-column prop="hbAppName" label="应用名称" align="center"></el-table-column>
            <el-table-column prop="moduleNum" label="模块编码" width="150" align="center"></el-table-column>
            <el-table-column label="图标" align="center">
              <template slot-scope="scope">
                <img :src="baseImgUrl+scope.row.filePath" style="width:48px;height:48px" />
              </template>
            </el-table-column>
            <el-table-column prop="remark" label="备注" align="center" width="250"></el-table-column>
            <el-table-column label="操作" width="150" align="center">
              <template slot-scope="scope">
                <!--data-clipboard-action="copy"
                @click="handleCopy(scope.row)"-->
                <el-button
                  :id="'copy-btn-'+scope.row.id"
                  size="mini"
                  data-clipboard-action="copy"
                  :data-clipboard-text="scope.row.filePath"
                  @click="handleCopy(scope.row)"
                >复制链接</el-button>
                <el-button
                  size="mini"
                  @click="handleEdit(scope.$index, scope.row)"
                  v-if="hasButton('config_appicon_edit')"
                >
                  <i class="fa fa-pencil"></i>&nbsp;编辑
                </el-button>
                <el-button
                  size="mini"
                  type="danger"
                  @click="handleDelete(scope.row.id)"
                  v-if="false"
                >
                  <i class="fa fa-trash-o"></i>&nbsp;删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <page-temp
            :total="total"
            :pageSize="searchForm.pageSize"
            :currentPage="searchForm.pageNum"
            @goSpecifiedPage="goSpecifiedPage"
          />
        </template>
      </el-row>
    </section>

    <!--新增、修改dialog-->
    <el-dialog
      :title="dialogTitleType=='add'?'新增图标':'编辑图标'"
      :visible.sync="iconAddDialog"
      :append-to-body="true"
      @close="cancelAdd('iconAdd')"
      width="680px"
      :close-on-click-modal="false"
    >
      <el-form
        class="dialog-form add-appicon_form"
        inline
        :model="iconAdd"
        ref="iconAdd"
        :rules="rules"
        label-position="right"
        label-width="80px"
        size="small"
      >
        <el-form-item label="名称" prop="name">
          <el-input v-model="iconAdd.name" auto-complete="off" placeholder="请输入名称"></el-input>
        </el-form-item>
        <!--普通用户不允许新增，可允许编辑-->
        <el-form-item label="应用类型" prop="hbAppId">
          <el-select v-model="iconAdd.hbAppId" clearable placeholder="请选择应用类型" @change="typeChange">
            <el-option
              :label="item.label"
              :value="item.value"
              v-for="(item,index) in useTypeList"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="模块编码" prop="moduleNum">
          <el-input v-model="iconAdd.moduleNum" auto-complete="off" placeholder="请输入模块编码"></el-input>
        </el-form-item>
        <el-form-item label="标识" prop="identification">
          <el-input
            v-model="iconAdd.identification"
            auto-complete="off"
            placeholder="应用_模块_英文名_字母组合"
            @change="checkIdentification()"
          ></el-input>
        </el-form-item>
        <div>
          <el-form-item label="上传图标" class="ava" prop="filePath">
            <el-upload
              class="avatar-uploader"
              :action="uploadFileUrl"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
              :data="uploadData"
            >
              <img v-if="iconAdd.filePath" :src="baseImgUrl+iconAdd.filePath" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <div class="el-upload__tip">请上传png、jpg及jpeg格式图片</div>
          </el-form-item>
        </div>
        <div>
          <el-form-item label="备注" prop="remark">
            <el-input
              v-model="iconAdd.remark"
              auto-complete="off"
              placeholder="请输入备注"
              :autosize="{ minRows: 3, maxRows: 10}"
              type="textarea"
              style="width:510px"
            ></el-input>
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelAdd('iconAdd')">取 消</el-button>
        <el-button type="primary" @click="saveiconAdd('iconAdd')" :disabled="identificationType">保 存</el-button>
      </div>
    </el-dialog>
  </section>
</template>
<script>
import {
  appImgDataPage,
  appImgCreate,
  appImgUpdate,
  appImgDetail,
  hbApplicationData,
  appImgCheckIdentification
} from "@/api/config.js";
// appImgFileUpload
import { iconAdd, userMsg, reviseUser } from "@/api/mcc/index.js";
import PageTemp from "@/components/PageTemp";
import { checkMobile, checkEmail } from "@/utils/validate";
import { outputTree } from "@/utils/common.js";
import { applicationDictionaryDataByTypeCode } from "@/api/config.js";
import { specialUploadUrl } from "@/api/file.js";
export default {
  data() {
    return {
      imageUrl: "",
      uploadData: {},
      defaultPropsjg: {
        children: "children",
        label: "name"
      },
      searchForm: {
        pageNum: 1,
        pageSize: 10,
        name: "",
        hbAppId: ""
      },
      tableData: [],
      iconAddDialog: false,
      iconAdd: {
        name: "",
        hbAppId: "",
        moduleNum: "",
        hbAppName: "",
        identification: "", //标识
        remark: "", // 备注
        filePath: ""
      },
      identificationType: false,
      useTypeList: [],
      dialogTitle: "",
      dialogTitleType: "add",
      examineStatusList: [],
      publishStatusList: [],
      tableData: [],
      total: 0, // 总 条数
      editId: "",
      rules: {
        name: [{ required: true, message: "请输入名称" }],
        moduleNum: [{ required: true, message: "请输入模块编码" }],
        filePath: [{ required: true, message: "请上传图片" }],
        hbAppId: [
          { required: true, message: "请选择应用类型", trigger: "change" }
        ]
      }
    };
  },
  components: { PageTemp },
  created() {
    this.hbApplicationData();
    this.appImgDataPage();
  },
  computed: {
    uploadFileUrl: {
      get() {
        this.uploadData = {
          hbAppId: this.iconAdd.hbAppId,
          moduleNum: this.iconAdd.moduleNum
        };
        console.log(this.uploadData);
        return specialUploadUrl;
      }
    }
  },
  methods: {
    // 复制图片链接
    handleCopy(row) {
      let clipboard = new this.clipboard("#copy-btn-" + row.id);
      clipboard.on("success", function() {
        // console.log("复制成功")
      });
      clipboard.on("error", function() {
        // console.log("复制失败")
      });
    },
    //提交按钮
    saveiconAdd(formName) {
      if (!this.iconAdd.hbAppId || !this.iconAdd.moduleNum) {
        this.$message.warning("先填写应用类型及模块编码，后上传文件");
        this.iconAdd.filePath = "";
        return;
      }
      this.iconAdd.identification = this.iconAdd.moduleNum;

      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.dialogTitleType == "add") {
            this.appImgCreate();
          } else {
            this.appImgUpdate();
          }
        } else {
          return false;
        }
      });
    },
    //获取列表(分页)
    appImgDataPage() {
      appImgDataPage(this.searchForm).then(data => {
        if (data.code == 200) {
          this.tableData = data.data["result"] || [];
          this.total = data.data["totalPages"] || "";
        }
      });
    },

    //新增按钮
    addIcon() {
      this.dialogTitle = "新增用户";
      this.dialogTitleType = "add";
      this.iconAddDialog = true;
      this.iconAdd = {
        name: "",
        hbAppId: "",
        moduleNum: "",
        identification: "", //标识
        remark: "", // 备注
        filePath: ""
      };

      this.$nextTick(() => {
        this.$refs["iconAdd"].clearValidate(); //移除校验结果
      });
    },
    // 获取应用类型
    hbApplicationData() {
      hbApplicationData().then(res => {
        if (res.code == 200 && res.data) {
          let arr = [];
          for (let val of res.data) {
            arr.push({
              label: val.name,
              value: val.appId
            });
          }
          this.useTypeList = [...arr];
        }
      });
    },
    //编辑
    handleEdit(index, row) {
      this.dialogTitle = "编辑";
      this.dialogTitleType = "edit";
      // 列表行的id
      this.iconAddDialog = true;
      this.editId = row.id;
      if (row.id) {
        // 详情
        appImgDetail(row.id).then(res => {
          console.log(res);
          if (res.code == 200 && res.data) {
            Object.keys(res.data).forEach(key => {
              this.iconAdd[key] = res.data[key];
            });
          }
        });
      }
    },
    // 标识效验
    checkIdentification() {
      if (this.iconAdd.identification) {
        let params = {
          identification: this.iconAdd.identification
        };
        appImgCheckIdentification(params).then(res => {
          if (res.code == 200) {
            if (res.data) {
              this.$message.error("应用标识已存在,请重新输入");
            }
            this.identificationType = res.data;
          }
        });
      }
    },
    // 应用类型选择
    typeChange(type) {
      let obj =
        this.useTypeList.filter(item => {
          return item.value == type;
        })[0] || {};
      this.iconAdd.hbAppName = obj.label;
    },
    //取消按钮
    cancelAdd(formName) {
      this.iconAddDialog = false;
      this.$refs[formName].resetFields();
      this.$refs[formName].clearValidate(); //移除校验结果
      this.imageUrl = "";
    },
    //分页
    goSpecifiedPage(val) {
      this.searchForm.pageNum = val;
      this.appImgDataPage();
    },
    //查询
    onSubmit() {
      this.searchForm.pageNum = 1;
      this.appImgDataPage();
    },

    //重置
    reset() {
      this.$refs["searchForm"].resetFields();
      this.appImgDataPage();
    },

    // 成功上传钩子
    handleAvatarSuccess(res, file) {
      if (res.code == 200) {
        this.iconAdd.filePath = res["data"] || "";
      } else {
        res.errorMsg && this.$message.error(res.errorMsg);
        this.iconAdd.filePath = "";
      }
    },
    // 上传图片前钩子
    beforeAvatarUpload(file) {
      if (!this.iconAdd.hbAppId || !this.iconAdd.moduleNum) {
        this.$message.warning("先填写应用类型及模块编码，后上传文件");
        this.iconAdd.filePath = "";
        return false;
      }
      const isJPG =
        file.type === "image/jpeg" ||
        file.type === "image/jpg" ||
        file.type === "image/png";
      if (!isJPG) {
        this.$message.error("上传图标只能是 jpeg/jpg/png 格式！");
      }
      return isJPG;
    },
    // 新增
    appImgCreate() {
      appImgCreate(this.iconAdd).then(res => {
        if (res.code == 200) {
          this.$message.success("新增成功");
          this.iconAddDialog = false;
          this.appImgDataPage();
        }
      });
    },
    // 修改
    appImgUpdate() {
      this.iconAdd["id"] = this.editId;
      appImgUpdate(this.iconAdd).then(res => {
        if (res.code == 200) {
          this.$message.success("修改成功");
          this.iconAddDialog = false;
          this.appImgDataPage();
        }
      });
    },
    //删除
    handleDelete(index) {
      this.$confirm("此操作将删除用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          userDelete(index).then(data => {
            if (data.data == null) {
              this.$message({
                message: "删除成功",
                type: "success"
              });
              this.appImgDataPage();
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消用户删除"
          });
        });
    }
  }
};
</script>

<style lang="scss">
.add-appicon_form {
  .block {
    width: 100% !important;
    .el-form-item__content {
      width: 550px !important;
    }
  }
}

.treeBox {
  border: 1px solid #c0c4cc;
  position: absolute;
  top: 33px;
  left: 0;
  z-index: 1000;
  border-radius: 4px;
  overflow: auto;
  background: #fff;
}

.iconAddtreeBox {
  border: 1px solid #c0c4cc;
  position: absolute;
  top: 41px;
  left: 0;
  z-index: 1000;
  border-radius: 4px;
  overflow: auto;
  background: #fff;
}
.bmBox {
  position: relative;
}

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 80px;
  height: 80px;
  line-height: 80px;
  text-align: center;
}
.avatar {
  width: 80px;
  height: 80px;
  display: block;
}
.el-upload__tip {
  font-size: 12px;
  color: #c0c4cc;
}
.ava .avatar-uploader {
  line-height: 0 !important;
}
</style>
