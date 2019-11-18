<template>
  <section class="view-container">
    <div id="inputInnerDiv"></div>
    <el-form class="search-form" ref="searchForm" :model="searchForm" label-width="0" :inline="true" size="small">
      <el-form-item>
        <el-input v-model="searchForm.name" maxlength="50" clearable placeholder="请输入姓名"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="searchForm.certificateNum" clearable placeholder="请输入证件号码"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="searchForm.mobilePhone" clearable placeholder="请输入移动电话"></el-input>
      </el-form-item>
      <el-form-item>
        <el-select v-model="searchForm.status" filterable clearable placeholder="请选择状态">
          <el-option :label="item.message" :value="item.code" :key="index" v-for="(item,index) in statusList">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="userInfo.userType != 2">
        <el-select v-model="searchForm.groupId" filterable clearable placeholder="请选择团队">
          <el-option :label="item.groupName" :value="item.id" :key="index" v-for="(item,index) in groupList">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="searchForm.serviceTimeSort" clearable placeholder="按照服务时间排序？">
          <el-option label="是" :value="1"></el-option>
          <el-option label="否" :value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="searchForm.signInSort" clearable placeholder="按照签到比例排序？">
          <el-option label="是" :value="1"></el-option>
          <el-option label="否" :value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit()"><i class="fa fa-search"></i>&nbsp;
          查询
        </el-button>
        <el-button @click="reset('searchForm')"><i class="fa fa-repeat"></i>&nbsp;重置</el-button>
        <el-button @click="exportVolunteerExcelFun()"><i class="el-icon-position"></i>&nbsp;导出excel</el-button>
      </el-form-item>
    </el-form>
    <section class="list-wraper">
      <el-row class="btn-wraper">
        <el-button size="small" type="primary" @click="importVolunteerExcelClick"
          v-if="hasButton('volunteer_volunteer_audits')"><i class="el-icon-download"></i>
          导入excel
        </el-button>
        <el-button size="small" type="primary" @click="auditsClick" v-if="hasButton('volunteer_volunteer_audits')"><i
            class="fa fa-plus"></i>
          批量审核
        </el-button>
        <span v-if="volunteerStatisticsNum" class="time-span"> 注册志愿者数量： {{volunteerStatisticsNum}}</span>
      </el-row>
      <el-row class="table-wraper">
        <template>
          <el-table style="width: 100%;" stripe border :data="tableData" @selection-change="handleSelectionChange">
            <el-table-column type="selection" :selectable='checkboxT' width="55">
            </el-table-column>
            <el-table-column prop="unifiedNum" label="统一编号">
            </el-table-column>
            <el-table-column prop="certificateNum" label="证件号码">
            </el-table-column>
            <el-table-column prop="name" label="姓名">
            </el-table-column>
            <el-table-column prop="mobilePhone" label="移动电话">
            </el-table-column>
            <el-table-column prop="residentialAreaName" label="居住区域">
              <template slot-scope="scope">
                <div v-if="scope.row.residentialAreaName">{{scope.row.residentialAreaName}}</div>
                <div v-else>--</div>
              </template>
            </el-table-column>
            <el-table-column prop="groupName" label="团队名称">
            </el-table-column>
            <el-table-column prop="statusName" label="状态" width="60">
            </el-table-column>
            <el-table-column prop="applyTime" label="申请时间">
            </el-table-column>
            <el-table-column prop="serviceTime" label="服务时长" width="120">
            </el-table-column>
            <el-table-column prop="signInNum" label="报名签到比例" width="120">
              <template slot-scope="scope">
                <div>{{scope.row |  signRateNum}}</div>
                <!-- <div v-else>--</div> -->
              </template>
            </el-table-column>
            <el-table-column label="操作" width="260">
              <template slot-scope="scope">
                <el-button size="mini" @click="handleDetail(scope.row.id)"
                  v-if="hasButton('volunteer_volunteer_detail')"><i class="el-icon-info"></i>&nbsp;详情
                </el-button>

                <el-button size="mini" @click="handleEdit(scope.row.id)" type="info"
                  v-if="hasButton('volunteer_volunteer_edit')"><i class="fa fa-pencil"></i>&nbsp;编辑
                </el-button>

                <el-button size="mini" type="primary" @click="audit(scope.row.id)"
                  v-if="hasButton('volunteer_volunteer_audit')&& scope.row.status == '0'"><i
                    class="el-icon-s-promotion"></i>&nbsp;审核
                </el-button>

                <el-button size="mini" type="primary" @click="recommendFun(scope.row.id)"
                  v-if="hasButton('volunteer_volunteer_audit')"><i class="el-icon-star-on"></i>&nbsp;推荐
                </el-button>

                <el-button size="mini" type="danger" @click="volunteerDelFun(scope.row.id,scope.row.name)"><i
                    class="el-icon-delete"></i>&nbsp;删除</el-button>

              </template>
            </el-table-column>
          </el-table>
          <page-temp :total="total" :pageSize="searchForm.pageSize" :currentPage="searchForm.pageNum"
            @goSpecifiedPage="goSpecifiedPage" />
        </template>
      </el-row>
    </section>

    <!--详情dialog-->
    <el-dialog :title="'详情'" :visible.sync="addDialog" :append-to-body='true' @close="cancelAdd('volunteerAdd')"
      width="920px" :close-on-click-modal="false">
      <el-form class="dialog-form add-user_form" inline :model="volunteerAdd" ref="volunteerAdd" :rules="rules"
        label-position="right" label-width="80px" size="small">
        <el-form-item label="统一编号" prop="unifiedNum">
          <el-input v-model="volunteerAdd.unifiedNum" auto-complete="off" placeholder="--"
            :readonly="dialogTitleType=='detail'"></el-input>
        </el-form-item>
        <el-form-item label="证件类型" v-if="volunteerAdd.certificateType" prop="certificateTypeName">
          <el-input v-model="volunteerAdd.certificateTypeName" auto-complete="off" placeholder="--"
            :readonly="dialogTitleType=='detail'"></el-input>
        </el-form-item>
        <el-form-item label="证件号码" v-if="volunteerAdd.certificateType" prop="certificateNum">
          <el-input v-model="volunteerAdd.certificateNum" auto-complete="off" placeholder="--"
            :readonly="dialogTitleType=='detail'"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model.number="volunteerAdd.name" auto-complete="off" placeholder="--"
            :readonly="dialogTitleType=='detail'"></el-input>
        </el-form-item>
        <el-form-item label="出生日期" prop="birthDate">
          <el-input v-model.number="volunteerAdd.birthDate" auto-complete="off" placeholder="--"
            :readonly="dialogTitleType=='detail'"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="sexName">
          <el-input v-model.number="volunteerAdd.sexName" auto-complete="off" placeholder="--"
            :readonly="dialogTitleType=='detail'"></el-input>
        </el-form-item>
        <el-form-item label="所在地" prop="nationalityName">
          <el-input v-model.number="volunteerAdd.nationalityName" auto-complete="off" placeholder="--"
            :readonly="dialogTitleType=='detail'"></el-input>
        </el-form-item>
        <el-form-item label="民族" prop="nationName">
          <el-input v-model.number="volunteerAdd.nationName" auto-complete="off" placeholder="--"
            :readonly="dialogTitleType=='detail'"></el-input>
        </el-form-item>
        <el-form-item label="政治面貌" prop="politicalName">
          <el-input v-model.number="volunteerAdd.politicalName" auto-complete="off" placeholder="--"
            :readonly="dialogTitleType=='detail'"></el-input>
        </el-form-item>
        <el-form-item label="学历" prop="educationName">
          <el-input v-model.number="volunteerAdd.educationName" auto-complete="off" placeholder="--"
            :readonly="dialogTitleType=='detail'"></el-input>
        </el-form-item>
        <el-form-item label="籍贯" prop="nativePlaceName">
          <el-input v-model.number="volunteerAdd.nativePlaceName" auto-complete="off" placeholder="--"
            :readonly="dialogTitleType=='detail'"></el-input>
        </el-form-item>
        <el-form-item label="居住区域" prop="residentialAreaName">
          <el-input v-model.number="volunteerAdd.residentialAreaName" auto-complete="off" placeholder="--"
            :readonly="dialogTitleType=='detail'"></el-input>
        </el-form-item>
        <el-form-item label="固定电话" prop="fixedTelephone">
          <el-input v-model.number="volunteerAdd.fixedTelephone" auto-complete="off" placeholder="--"
            :readonly="dialogTitleType=='detail'"></el-input>
        </el-form-item>
        <el-form-item label="移动电话" prop="mobilePhone">
          <el-input v-model.number="volunteerAdd.mobilePhone" auto-complete="off" placeholder="--"
            :readonly="dialogTitleType=='detail'"></el-input>
        </el-form-item>
        <el-form-item label="电子邮箱" prop="email">
          <el-input v-model.number="volunteerAdd.email" auto-complete="off" placeholder="--"
            :readonly="dialogTitleType=='detail'"></el-input>
        </el-form-item>
        <el-form-item label="从业状况" prop="employmentStatusName">
          <el-input v-model.number="volunteerAdd.employmentStatusName" auto-complete="off" placeholder="--"
            :readonly="dialogTitleType=='detail'"></el-input>
        </el-form-item>
        <el-form-item label="服务区域" prop="serverAreaName">
          <el-input v-model.number="volunteerAdd.serverAreaName" auto-complete="off" placeholder="--"
            :readonly="dialogTitleType=='detail'"></el-input>
        </el-form-item>
        <el-form-item label="特长" prop="speciality">
          <el-input v-model.number="volunteerAdd.specialityName" type="textarea" auto-complete="off" placeholder="--"
            :readonly="dialogTitleType=='detail'"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="cancelAdd('volunteerAdd')">确定</el-button>
      </div>
    </el-dialog>

    <!--审核推荐dialog-->
    <el-dialog @close="confirmDialogResert()" :visible.sync="confirmDialog" :append-to-body='true' width="480px"
      :close-on-click-modal="false">
      <el-input type="textarea" v-model="textareaVal" :placeholder="confirmType=='1'?'请输入审核理由':'请输入推荐理由'"></el-input>
      <div v-if="confirmType=='1'" class="radio" style="margin-top:20px;text-align:center">
        <el-radio v-model="audioRadio" label="1">审批通过</el-radio>
        <el-radio v-model="audioRadio" label="2">审批拒绝</el-radio>
      </div>
      <div class="btnBox" style="margin-top:20px;text-align:center">
        <el-button @click="confirmDialog=false" type="info">取消</el-button>
        <el-button @click="confirmTrue" type="success">确定</el-button>
      </div>
    </el-dialog>

    <!--批量导入dialog-->
    <el-dialog class="volunteerContainer" style="border-radius:20px;" title="批量导入" :visible.sync="importDialog"
      :append-to-body='true' width="720px" :close-on-click-modal="false">
      <div class="card">
        <i class="el-icon-download"></i>
        <div class="right">
          <h3>填写导入数据信息</h3>
          <p>请按照数据模板格式导入数据，模板中的表头名称不可修改，表头行不能删除。</p>
          <p>请确保上传的数据在本平台手机端登录过，且上传手机号码和登录号码保持一致。</p>
          <div style="margin-top:10px" class="btn"><a>下载模板</a></div>
        </div>
      </div>
      <div class="card">
        <i class="el-icon-upload"></i>
        <div class="right">
          <h3>上传填好的数据</h3>
          <p class="subtxt">请严格按照格式要求上传数据。</p>
          <div class="btn"><b style="cursor: pointer;" @click="importVolunteerExcelFun">上传文件</b></div>
        </div>
      </div>
      <el-progress v-if="percentageNum!=0&&percentageNum!=100" :text-inside="true" :stroke-width="26"
        :percentage="percentageNum"></el-progress>
      <el-progress v-if="percentageNum==100" :text-inside="true" :stroke-width="26" :percentage="percentageNum"
        status="success"></el-progress>
    </el-dialog>
  </section>

</template>
<script>
import {
  getVolunteerDataPage,
  getVolunteerByUcid,
  volunteerApply,
  statusList,
  auditsVolunteer,
  getVolunteerStatistics,
  exportVolunteerExcel,
  importVolunteerExcel,
  detailVolunteerApply,
  volunteerStar,
  volunteerDel
} from "@/api/volunteer/volunteer";
import { groupData } from "@/api/volunteer/volunteer";
import { mapGetters } from "vuex";
import PageTemp from "@/components/PageTemp";
import { downloading } from "@/utils/common.js";

export default {
  computed: {
    ...mapGetters(["userInfo"])
  },
  data() {
    return {
      confirmDialog: false,
      importDialog: false,
      percentageNum: 0, //上传进度
      textareaVal: "",
      confirmType: "",
      audioRadio: "",
      searchForm: {
        pageNum: 1,
        pageSize: 10,
        name: "",
        certificateNum: "",
        mobilePhone: "",
        status: "",
        serviceTimeSort: "",
        signInSort: "",
        groupId: ""
      },
      tableData: [],
      addDialog: false,
      volunteerAdd: {},
      dialogTitleType: "detail",
      total: 0,
      rules: {},
      groupList: [],
      statusList: [],

      SelectionRows: [],

      volunteerStatisticsNum: ""
    };
  },
  components: { PageTemp },
  methods: {
    //导出志愿者excel
    exportVolunteerExcelFun: function() {
      const loading = this.$loading({
        lock: true,
        text: "文件生成中",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      let params = JSON.parse(JSON.stringify(this.searchForm));
      delete params.pageNum;
      delete params.pageSize;
      exportVolunteerExcel(params).then(res => {
        downloading(res);
        setTimeout(() => {
          loading.close();
        }, 2000);
      });
    },
    //多选
    handleSelectionChange(rows) {
      let SelectionRows = [];
      rows.forEach(e => {
        SelectionRows.push(e.applyId);
      });
      this.SelectionRows = SelectionRows;
    },

    checkboxT(row, rowIndex) {
      // if (row.status == "0") {
      //   return true; //不禁用
      // } else {
      //   return false; //不禁用
      // }
      return true;
    },

    //导入excel点击事件
    importVolunteerExcelClick: function() {
      this.percentageNum = 0;
      this.importDialog = true;
    },

    //导入excel
    importVolunteerExcelFun: function() {
      let _this = this;
      let inputNode = document.createElement("input");
      inputNode.name = "fileToUpload";
      inputNode.type = "file";
      inputNode.id = "fileToUpload";
      inputNode.style = "display:none";
      let inputInnerDiv = document.getElementById("inputInnerDiv");
      // inputInnerDiv.html="";
      inputInnerDiv.appendChild(inputNode);
      inputNode.click();
      inputNode.onchange = function() {
        _this.percentageNum = 20;
        _this.fileSelected();
      };
    },
    //上传附件
    fileSelected: function() {
      let _this = this;
      let fileList_ = document.getElementById("fileToUpload");
      let file = fileList_.files[0];
      var form = new FormData();
      form.append("file", file);
      setTimeout(() => {
        _this.percentageNum = 60;
      }, 200);
      importVolunteerExcel(form).then(res => {
        _this.percentageNum = 100;
        if (res.code == 200) {
          this.$message.success("导入成功");
          this.importDialog = false;
          _this.getTableData();
        }
      });
    },
    //
    confirmDialogResert: function() {
      this.textareaVal = "";
      this.audioRadio = "";
    },
    //审核_批量
    auditsClick() {
      this.volunteerApplyIds = [];
      if (this.SelectionRows.length > 0) {
        this.volunteerApplyIds = this.SelectionRows;
        this.confirmDialog = true;
        this.confirmType = "1";
      } else {
        this.$message.info("您未进行选择，请选择后进行操作");
      }
    },

    //推荐
    recommendFun: function(id) {
      this.volunteerId = id;
      this.confirmDialog = true;
      this.confirmType = "2";
    },
    //删除
    volunteerDelFun: function(id, name) {
      this.$confirm("此操作将删除" + name + "?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          volunteerDel(id).then(res => {
            if (res.data == null) {
              this.$message.success("删除成功");
              this.getTableData();
            } else {
              this.$message.error("删除失败");
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消用户删除"
          });
        });
    },
    //审核dialog
    audit(id) {
      this.volunteerApplyIds = [];
      this.volunteerApplyIds[0] = id;
      this.confirmDialog = true;
      this.confirmType = "1";
    },
    //推荐确定事件
    confirmTrue: function() {
      if (this.confirmType == "1") {
        if (this.audioRadio != "" && this.textareaVal != "") {
          let param1 = {
            status: this.audioRadio,
            approvalOpinion: this.textareaVal,
            volunteerApplyIds: this.volunteerApplyIds
          };
          this.volunteerAudit(param1);
        } else {
          this.$message.info("请选择要审核结果并填写审核原因");
        }
      } else {
        if (this.textareaVal != "") {
          let param2 = {
            volunteerId: this.volunteerId,
            recommendOpinion: this.textareaVal
          };
          this.volunteerRecommend(param2);
        } else {
          this.$message.info("请填写推荐原因");
        }
      }
    },
    //（批量）审批志愿者申请加入团体团队
    volunteerAudit(data) {
      auditsVolunteer(data).then(res => {
        if (res.code == 200) {
          this.$message.success("审核结果上传成功");
          this.getTableData();
          this.confirmDialog = false;
        } else {
          this.$message.error("审核失败");
        }
      });
    },
    //推荐志愿者
    volunteerRecommend(data) {
      volunteerStar(data).then(res => {
        if (res.code == 200) {
          this.$message.success("推荐结果上传成功");
          this.getTableData();
          this.confirmDialog = false;
        } else {
          this.$message.error("推荐失败");
        }
      });
    },
    //详情
    handleDetail(id) {
      this.$router.push({
        name: "volunteer_detail",
        params: { type: "detail", id: id }
      });
    },
    //修改
    handleEdit(id) {
      this.$router.push({
        name: "volunteer_form",
        params: { type: "edit", id: id }
      });
    },

    //取消按钮
    cancelAdd(formName) {
      this.addDialog = false;
      this.$refs[formName].resetFields();
      this.$refs[formName].clearValidate(); //移除校验结果
    },
    //分页
    goSpecifiedPage(val) {
      this.searchForm.pageNum = val;
      this.getTableData();
    },
    //查询
    onSubmit() {
      this.searchForm.pageNum = 1;
      this.getTableData();
    },
    //获取志愿者列表(分页)
    getTableData() {
      getVolunteerDataPage(this.searchForm).then(res => {
        if (res.code == 200) {
          this.tableData = res.data.result;
          this.total = res.data.totalPages;
        }
      });
    },
    groupOrg() {
      groupData().then(res => {
        if (res.code == 200) {
          this.groupList = res.data;
        }
      });
    },
    //审核状态（数据字典）
    getStatus() {
      statusList().then(res => {
        if (res.code == 200) {
          this.statusList = res.data;
        }
      });
    },

    getVolunteerStatistics() {
      let that = this;
      getVolunteerStatistics().then(res => {
        if (res.code == 200) {
          that.volunteerStatisticsNum = res.data;
        }
      });
    },
    //重置
    reset() {
      this.searchForm = {
        pageNum: 1,
        pageSize: 10,
        name: "",
        certificateNum: "",
        mobilePhone: "",
        status: "",
        serviceTimeSort: "",
        signInSort: "",
        groupId: ""
      };
      this.getTableData();
    }
  },
  created() {
    this.getTableData();
    this.groupOrg();
    this.getStatus();
    this.getVolunteerStatistics();
  },
  mounted() {},

  watch: {},
  filters: {
    signRateNum: function(val) {
      return val.signInNum + " / " + val.signUpNum;
    }
  }
};
</script>

<style lang="scss">
.volunteerContainer {
  .el-dialog__header {
    background: #409eff !important;
    border-radius: 10px 10px 0 0;
    .el-dialog__title{
      color: #fff !important;
    }
  }
  .el-icon-close{
    color: #fff !important;
  }
  .el-dialog {
    border-radius: 10px !important;
  }
  .card {
    border: 1px solid #ccc;
    box-shadow: 0 0 8px #ddd;
    margin-bottom: 30px;
    height: 122px;
    i {
      width: 120px;
      font-size: 60px;
      line-height: 120px;
      color: #fff;
      display: inline-block;
      float: left;
      text-align: center;
      border-right: 1px solid #ccc;
      background: #409eff;
    }
    .right {
      text-indent: 20px;
      .btn {
        color: #409eff;
        margin-top: 20px;
      }
    }
  }
}
</style>

<style lang="scss">
.add-user_form {
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

.volunteerAddtreeBox {
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
  border-color: #ed3800;
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
.time-span {
  font-size: 14px;
  color: #ed3800;
  margin-left: 10px;
}
</style>
