<template>
  <section class="view-container">
    <div id="inputInnerDiv"></div>
    <el-form class="search-form" ref="searchForm" :model="searchForm" label-width="0" :inline="true" size="small">
      <el-form-item prop="groupName">
        <el-select v-model="searchForm.groupName" filterable clearable placeholder="请选择团队">
          <el-option :label="item.groupName" :value="item.groupName" :key="index" v-for="(item,index) in groupList">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="areaCode">
        <el-input type="hidden" class="district-wraper" v-model="searchForm.areaCode">
          <el-select slot="append" v-model="province" filterable placeholder="省" @change="changeProvince"
            class="district">
            <el-option v-for="item in provinceList" :key="item.id" :label="item.districtName" :value="item.id">
            </el-option>
          </el-select>
          <el-select slot="append" v-model="city" filterable placeholder="市" @change="changeCity" class="district">
            <el-option v-for="item in cityList" :key="item.id" :label="item.districtName" :value="item.id">
            </el-option>
          </el-select>
          <el-select slot="append" v-model="area" filterable placeholder="区/县" @change="changeArea" class="district">
            <el-option v-for="item in areaList" :key="item.id" :label="item.districtName" :value="item.id">
            </el-option>
          </el-select>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-select v-model="searchForm.status" clearable placeholder="请选择状态">
          <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
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
        <el-button size="small" type="primary" @click="orgAddClick" v-if="hasButton('volunteer_group_org_audits')"><i
            class="fa fa-plus"></i>
          添加团队
        </el-button>
        <el-button size="small" type="primary" @click="auditsClick" v-if="hasButton('volunteer_group_org_audits')"><i
            class="fa fa-plus"></i>
          批量审核
        </el-button>
        <el-button size="small" type="primary" @click="importVolunteerExcelClick"
          v-if="hasButton('volunteer_volunteer_audits')"><i class="el-icon-download"></i>
          批量导入excel
        </el-button>
        <span v-if="tableData.length && tableData[0].allServiceTime" class="time-span"> 累计服务时长（小时）：
          {{tableData[0].allServiceTime}}</span>
      </el-row>
      <el-row class="table-wraper">
        <template>
          <el-table style="width: 100%;" stripe border :data="tableData" ref="multipleTable"
            @selection-change="handleSelectionChange">
            <el-table-column type="selection" :selectable='checkboxT' width="55">
            </el-table-column>
            <el-table-column prop="groupNum" sortable label="团队编号">
            </el-table-column>
            <el-table-column prop="groupName" label="团队名称">
            </el-table-column>
            <el-table-column prop="orgStr" label="主管单位">
            </el-table-column>
            <el-table-column prop="areaStr" label="所在区域">
            </el-table-column>
            <el-table-column prop="groupDescribe" label="团队简要描述">
            </el-table-column>
            <el-table-column prop="status" label="状态">
              <template slot-scope="scope">
                <div v-if="scope.row.status == 0">未审核</div>
                <div v-else-if="scope.row.status == 1">审核通过</div>
                <div v-else="scope.row.status == 2">审核未通过</div>
              </template>
            </el-table-column>
            <el-table-column prop="createTime" label="申请时间">
            </el-table-column>
            <el-table-column label="操作" width="240">
              <template slot-scope="scope">
                <el-button size="mini" @click="handleDetail(scope.row.id)"
                  v-if="hasButton('volunteer_group_org_detail')"><i class="fa fa-pencil"></i>&nbsp;详情
                </el-button>
                <el-button size="mini" @click="handleEdit(scope.row.id)" v-if="hasButton('volunteer_group_org_edit')"><i
                    class="fa fa-pencil"></i>&nbsp;修改
                </el-button>
                <el-button size="mini" type="primary" @click="audit(scope.row.id)"
                  v-if="hasButton('volunteer_group_org_audit')&& scope.row.status == '0'"><i
                    class="fa fa-pencil"></i>&nbsp;审核
                </el-button>
                <el-button size="mini" type="danger" @click="volunteerDelFun(scope.row.id,scope.row.groupName)"><i
                    class="el-icon-delete"></i>&nbsp;删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <page-temp :total="total" :pageSize="searchForm.pageSize" :currentPage="searchForm.pageNum"
            @goSpecifiedPage="goSpecifiedPage" />
        </template>
      </el-row>
    </section>

    <!--审核dialog-->
    <el-dialog @close="confirmDialogResert()" :visible.sync="confirmDialog" :append-to-body='true' width="480px"
      :close-on-click-modal="false">
      <el-input type="textarea" v-model="textareaVal" placeholder="请输入审核理由"></el-input>
      <div class="radio" style="margin-top:20px;text-align:center">
        <el-radio v-model="audioRadio" label="1">审批通过</el-radio>
        <el-radio v-model="audioRadio" label="2">审批拒绝</el-radio>
      </div>
      <div class="btnBox" style="margin-top:20px;text-align:center">
        <el-button @click="confirmDialog=false" type="info">取消</el-button>
        <el-button @click="confirmTrue" type="success">确定</el-button>
      </div>
    </el-dialog>

    <!--批量导入dialog-->
    <el-dialog class="volunteerContainer" title="批量导入" :visible.sync="importDialog" :append-to-body='true' width="720px" :close-on-click-modal="false">
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
          <div class="btn"><b style="cursor: pointer;" @click="importVolunteerExcelFun" >上传文件</b></div>
        </div>
      </div>
      <el-progress v-if="percentageNum!=0&&percentageNum!=100" :text-inside="true" :stroke-width="26" :percentage="percentageNum"></el-progress>
      <el-progress v-if="percentageNum==100" :text-inside="true" :stroke-width="26" :percentage="percentageNum" status="success"></el-progress>
    </el-dialog>

  </section>

</template>
<script>
import {
  getGroupDataPage,
  groupDelete,
  groupApply,
  getDetailById,
  groupData,
  userDetail,
  auditsGroup,
  editGroupName,
  exportGroupExcel,
  importGroupExcel
} from "@/api/volunteer/volunteer";
import { districtParentData, districtChildData } from "@/api/config.js";
import { uploadFileUrl } from "@/api/file.js";
import PageTemp from "@/components/PageTemp";
import { downloading } from "@/utils/common.js";

export default {
  data() {
    return {
      uploadFileUrl: uploadFileUrl,
      confirmDialog:false,
      importDialog:false,
      percentageNum:0,//上传进度
      textareaVal:"",
      statusOptions: [
        {
          value: "0",
          label: "未审核"
        },
        {
          value: "1",
          label: "审核通过"
        },
        {
          value: "2",
          label: "审核未通过"
        }
      ],
      msg: {
        idSource: "",
        typeSource: ""
      },
      groupIds:[],
      audioRadio: "",
      detailDialog:{},
      certificateImgUrl: "",
      groupSealImgUrl: "",
      status: "",
      cascaderData: [],
      selectedOptions: [],
      searchForm: {
        pageNum: 1,
        pageSize: 10,
        groupName: "",
        areaCode: "",
        status: ""
      },
      districtNames: [],
      tableData: [],
      orgAdd: {},
      dialogTitleType: "add",
      total: 0,
      addDialog: false,
      rules: {},
      groupList: [],
      userForm: {},

      /*区域*/
      province: "",
      city: "",
      area: "",
      provinceList: [],
      cityList: [],
      areaList: [],
      SelectionRows: []
    };
  },
  components: { PageTemp },
  methods: {
    //导出志愿者团队excel
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
      exportGroupExcel(params).then(res => {
        downloading(res);
        setTimeout(() => {
          loading.close();
        }, 2000);
      });
    },
    //多选
    handleSelectionChange(rows) {
      // console.log(rows)
      let SelectionRows = [];
      rows.forEach(e => {
        SelectionRows.push(e.id);
      });
      this.SelectionRows = SelectionRows;
    },

    checkboxT(row, rowIndex) {
      // if (row.status == "0") {
      //   return true; //不禁用
      // } else {
      //   return false; //不禁用
      // }
      return true
    },

    //删除团队
    volunteerDelFun: function(id,name) {
      let _this=this;
      this.$confirm("此操作将删除"+name+"?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          groupDelete(id).then(res => {
            if (res.data == null) {
              _this.$message.success("删除成功");
              _this.getGroupDataPage();
            } else {
              _this.$message.error("删除失败");
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
    //导入excel点击事件
    importVolunteerExcelClick: function() {
      this.percentageNum=0;
      this.importDialog=true;
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
        _this.percentageNum=20;
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
        _this.percentageNum=60;
      }, 200);
      importGroupExcel(form).then(res => {
        _this.percentageNum=100;
        if (res.code == 200) {
          this.$message.success("导入成功");
          this.importDialog=false;
          _this.getTableData();
        }
      });
    },
    //
    confirmDialogResert: function() {
      this.textareaVal = "";
      this.audioRadio = "";
    },
    //审核确定事件
    confirmTrue: function() {
        if (this.audioRadio != "" && this.textareaVal != "") {
          let param = {
            status: this.audioRadio,
            approvalOpinion: this.textareaVal,
            groupIds: this.groupIds
          };
          this.volunteerAudit(param);
        } else {
          this.$message.info("请选择要审核结果并填写审核原因");
        }
    },
    //（批量）审批志愿者申请加入团体团队
    volunteerAudit(data) {
      auditsGroup(data).then(res => {
        if (res.code == 200) {
          this.$message.success("审核结果上传成功");
          this.getGroupDataPage();
          this.confirmDialog = false;
        } else {
          this.$message.error("审核失败");
        }
      });
    },
    auditsClick() {
      this.groupIds = [];
      if (this.SelectionRows.length > 0) {
        this.groupIds = this.SelectionRows;
        this.confirmDialog = true;
      } else {
        this.$message.info("您未进行选择，请选择后进行操作");
      }
    },
    auditsGroup(data) {
      auditsGroup(data).then(res => {
        if (res.code == 200) {
          this.$message.success("审核结果上传成功");
          this.getGroupDataPage();
        } else {
          this.$message.error("审核失败");
        }
      });
    },
    //获取列表(分页)
    getGroupDataPage() {
      getGroupDataPage(this.searchForm).then(res => {
        if (res.code == 200) {
          this.tableData = res.data.result;
          this.total = res.data.totalPages;
        }
      });
    },
    //查询
    onSubmit() {
      this.searchForm.pageNum = 1;
      if (this.selectedOptions.length > 0) {
        this.searchForm.areaCode =
          this.selectedOptions[0] + "," + this.selectedOptions[1];
      }
      this.getGroupDataPage();
    },
    goSpecifiedPage(val) {
      this.searchForm.pageNum = val;
      this.getGroupDataPage();
    },
    //取消按钮
    cancelAdd(formName) {
      this.addDialog = false;
      this.$refs[formName].resetFields();
      this.$refs[formName].clearValidate(); //移除校验结果
    },
    //详情
    handleDetail(id) {
      getDetailById(id).then(res => {
        this.dialogTitleType = "detail";
        this.addDialog = true;
        this.orgAdd = res.data;
        this.detailDialog=res.data;
      });
      this.getUserDetail(id);
      // this.$router.push({name:'group_form',params:{id:id}})
    },
    //添加团队
    orgAddClick: function() {
      this.$router.push({ name: "volunteer_group_form", params: { id: "" } });
    },
    //修改
    handleEdit(id) {
      this.$router.push({ name: "volunteer_group_edit", params: { id: id,type:"edit" } });
    },
    //管理员详情
    getUserDetail(id) {
      this.$router.push({ name: "volunteer_group_detail", params: { id: id,type:"detail" } });
    },
    groupOrg() {
      groupData().then(res => {
        if (res.code == 200) {
          this.groupList = res.data;
        }
      });
    },
    // 图片
    handleAvatarSuccess(res, file) {
      if (res.code == 200) {
        this.imageUrl = URL.createObjectURL(file.raw);
        this.userAdd.userIcon = res.data.id;
      } else {
        this.$message.error(res.errorMsg);
      }
    },
    beforeAvatarUpload(file) {
      const isJPG =
        file.type === "image/jpeg" ||
        file.type === "image/jpg" ||
        file.type === "image/png";
      if (!isJPG) {
        this.$message.error("上传头像图片只能是 jpeg/jpg/png 格式！");
      }
      const isLt4M = file.size / 1024 / 1024 < 4;
      if (!isLt4M) {
        this.$message.error("上传头像图片大小不能超过 4MB!");
      }
      return isJPG && isLt4M;
    },
    //审核dialog
    audit(id) {
      this.groupIds = [];
      this.groupIds[0] = id;
      this.confirmDialog = true;
    },
    //审核
    groupAudit(data) {
      groupApply(data).then(res => {
        if (res.code == 200) {
          this.$message.success("审核结果上传成功");
          this.getGroupDataPage();
        } else {
          this.$message.error("审核失败");
        }
      });
    },
    // //加载省
    // loadProvince(){
    //     districtParentData().then(res=>{
    //         let item = res.data
    //         this.cascaderData = item.map((value, i) => {
    //             return {
    //                 id: value.id,
    //                 name: value.fullName,
    //                 cities: []
    //             }
    //         })
    //     })
    // },
    // //加载市
    // handleItemChange(val){
    //     districtChildData(val[0]).then(res=>{
    //         let item = res.data
    //         this.cascaderData.map((value, i) => {
    //             if (value.id === val[0]) {
    //                 if (!value.cities.length) {
    //                     value.cities = item.map((value, i) => {
    //                         return {
    //                             id: value.id,
    //                             name: value.fullName
    //                         }
    //                     })
    //                 }
    //             }
    //         })
    //     })
    // },
    /*区域*/
    changeProvince(val) {
      this.city = "";
      this.cityList = [];
      this.area = "";
      this.areaList = [];
      this.districtChildData(val, this.cityList);
      this.provinceList.forEach(item => {
        if (val === item.id) {
          // console.log(item)
          this.districtNames[0] = item.districtName;
        }
      });
    },
    changeCity(val) {
      this.area = "";
      this.areaList = [];
      this.districtChildData(val, this.areaList);
      this.cityList.forEach(item => {
        if (val === item.id) {
          // console.log(item)
          this.districtNames[1] = item.districtName;
        }
      });
    },
    changeArea(val) {
      this.areaList.forEach(item => {
        if (val === item.id) {
          // console.log(item)
          this.districtNames[2] = item.districtName;
        }
      });

      this.searchForm.areaCode = [
        this.province,
        this.city,
        this.area
      ].toString();
      // this.searchForm.areaStr = this.districtNames.toString();
    },
    //省级区域
    districtParentData() {
      districtParentData().then(res => {
        if (res.code == 200) {
          this.provinceList = res.data;
        }
      });
    },
    //省级子级区域
    districtChildData(parentId, arr = []) {
      districtChildData(parentId).then(res => {
        if (res.code == 200) {
          res.data.forEach(item => {
            arr.push(item);
          });
        }
      });
    },

    //重置
    reset() {
      this.searchForm.pageNum = 1;
      this.searchForm.pageSize = 10;
      this.searchForm.groupName = "";
      this.searchForm.areaCode = "";
      this.searchForm.status = "";
      this.selectedOptions = [];
      this.province = "";
      this.city = "";
      this.area = "";
      this.getGroupDataPage();
    }
  },
  created() {
    this.districtParentData();
    this.getGroupDataPage();
    // this.loadProvince();
    this.groupOrg();
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
.search-form {
  .el-input-group__append {
    padding: 0;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    background-color: #fff;
    .district {
      .el-input {
        width: 100px;
      }
      width: 35%;
      margin: 0;
      &:nth-child(1) {
        width: 30%;
      }
    }
  }
  .el-select,
  .el-input {
    width: 300px;
  }
}
</style>
