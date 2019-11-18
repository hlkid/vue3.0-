<template>
  <section class="view-container recruitment">
    <div id="inputInnerDiv"></div>
    <el-form class="search-form" ref="searchForm" :model="searchForm" label-width="0" :inline="true" size="small">
      <el-form-item>
        <el-input style="width:220px" v-model="searchForm.actName" maxlength="50" clearable placeholder="活动名称"></el-input>
      </el-form-item>
       <el-form-item>
        <el-select v-model="searchForm.actType" clearable placeholder="活动类型">
          <el-option v-for="item in actTypeOptions" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
       <el-form-item>
        <el-select v-model="searchForm.actTheme" clearable placeholder="活动主题">
          <el-option v-for="item in actThemeOptions" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="searchForm.actStage" clearable placeholder="活动阶段">
          <el-option v-for="item in actStageOptions" :key="item.code" :label="item.message" :value="item.code">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="searchForm.status" clearable placeholder="发布状态">
          <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="searchForm.examineStatus" clearable placeholder="审核状态">
          <el-option v-for="item in examineStatusOptions" :key="item.code" :label="item.message" :value="item.code">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSearch()"><i class="fa fa-search"></i>&nbsp;
          查询
        </el-button>
        <el-button @click="reset('searchForm')"><i class="fa fa-repeat"></i>&nbsp;重置</el-button>
      </el-form-item>
    </el-form>
    <section class="list-wraper">
      <el-row class="btn-wraper">
        <el-button size="small" type="primary" @click="recruitmentAdd"><i
            class="fa fa-plus"></i>
          添加
        </el-button>
        <el-button size="small" type="primary" @click="auditsClick"><i
            class="fa fa-plus"></i>
          发送审批
        </el-button>
      </el-row>
      <el-row class="table-wraper">
        <template>
          <el-table style="width: 100%;" stripe border :data="tableData" ref="multipleTable"
            @selection-change="handleSelectionChange">
            <el-table-column type="selection" :selectable='checkboxT' width="55">
            </el-table-column>
            <el-table-column prop="actName" label="活动名称">
            </el-table-column>
            <el-table-column prop="recruitTypeStr" label="招募类型">
            </el-table-column>
            <el-table-column prop="actThemeStr" label="活动主题">
            </el-table-column>
            <el-table-column prop="actTypeStr" label="活动类型">
            </el-table-column>
            <el-table-column prop="entryStartDate" label="招募时间">
              <template slot-scope="scope">
                <p>{{scope.row.entryStartDate}} — {{scope.row.entryEndDate}}</p>
              </template>
            </el-table-column>
            <el-table-column prop="entryTypeStr" label="报名类型">
            </el-table-column>
            <el-table-column prop="isQuotaStr" label="名额限制">
            </el-table-column>
            <el-table-column prop="areaStr" label="活动举办时间">
              <template slot-scope="scope">
                <p>{{scope.row.actStartDate}} — {{scope.row.actEndDate}}</p>
              </template>
            </el-table-column>
            <el-table-column prop="address" label="地点">
            </el-table-column>
            <el-table-column prop="actStage" label="活动状态">
              <template slot-scope="scope">
                <p>{{scope.row.actStage | actStageFilter}}</p>
              </template>
            </el-table-column>
            <el-table-column prop="examineStatusName" label="审核状态">
            </el-table-column>
            <el-table-column prop="status" label="发布状态">
              <template slot-scope="scope">
                <p>{{scope.row.status | statusFilter}}</p>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="460">
              <template slot-scope="scope">
                <el-button size="mini" @click="handleDetail(scope.row.id)"><i class="fa fa-pencil"></i>&nbsp;详情</el-button>
                <el-button size="mini" @click="handleEdit(scope.row.id)"><i class="fa fa-pencil"></i>&nbsp;编辑</el-button>
                <el-button size="mini" type="primary" @click="audit(scope.row.id)"><i class="fa fa-pencil"></i>&nbsp;审核</el-button>
                <el-button size="mini" type="danger" @click="volunteerDelFun(scope.row.id,scope.row.actName)"><i class="el-icon-delete"></i>&nbsp;删除</el-button>
                <el-button size="mini" type="primary" @click="publish(scope.row.id,scope.row.actName)"><i class="fa fa-pencil"></i>&nbsp;发布</el-button>
                <el-button size="mini" type="primary" @click="audit(scope.row.id)"><i class="fa fa-pencil"></i>&nbsp;二维码</el-button>
                <el-button size="mini" type="primary" @click="audit(scope.row.id)"><i class="fa fa-pencil"></i>&nbsp;报名情况</el-button>
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

  </section>

</template>
<script>
import {
activityDataPageByWeb,
activityStageEnum,
activityExamineStatusEnum,
activityDel,
activityAudit,
activityAuditBatch,
activityPublish,
getDicListByTypeCode,


  getGroupDataPage,
  groupApply,
  getDetailById,
  groupData,
  userDetail,
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
      textareaVal:"",
      actTypeOptions:[],
      actThemeOptions:[],
      actStageOptions:[],
      statusOptions:[
        {
          value: "0",
          label: "未发布"
        },
        {
          value: "1",
          label: "已发布"
        }
      ],
      examineStatusOptions: [],
      msg: {
        idSource: "",
        typeSource: ""
      },
      groupIds:[],
      audioRadio: "",
      detailDialog:{},
      status: "",
      searchForm: {
        pageNum: 1,
        pageSize: 10,
        actName: "",//活动名称
        actType: "",//活动类型——字典表
        actTheme: "",//活动主题——字典表
        actStage:"",//活动阶段
        status:"",//发布状态
        examineStatus:"",//审核状态
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
    //字典
    getDicListByTypeCode(code, arr) {
      getDicListByTypeCode(code).then(res => {
        if (res.code == 200) {
          res.data.forEach(e => {
            e.label = e.valueName;
            e.key = e.valueName + e.value;
            arr.push(e);
          });
        }
      });
    },
    //枚举值
      EnumFun:function(){
          let _this=this;
          //活动阶段枚举类
          activityStageEnum().then(res => {
            if (res.code == 200) {
                _this.actStageOptions=res.data
            }
        });
        //活动审核状态枚举类
          activityExamineStatusEnum().then(res => {
            if (res.code == 200) {
                _this.examineStatusOptions=res.data
            }
        })
      },
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
      if (row.status == "0") {
        return true; //不禁用
      } else {
        return false; //不禁用
      }
    },

    //删除团队
    volunteerDelFun: function(id,actName) {
      let _this=this;
      this.$confirm("此操作将删除"+actName+"?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          activityDel(id).then(res => {
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
    
    //发布
    publish:function(id,actName){
      let _this=this;
      this.$confirm("此操作将发布"+actName+"?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let param={
            id:id,
            status:1
          }
          activityPublish(param).then(res => {
            if (res.data == null) {
              _this.$message.success("发布成功");
              _this.getGroupDataPage();
            } else {
              _this.$message.error("发布失败");
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
        _this.fileSelected();
      };
      // inputInnerDiv.on("change", function () {
      //   fileSelected(param, function (data) {
      //     callback(data)
      //   })
      // })
    },
    //上传附件
    fileSelected: function() {
      let _this = this;
      let fileList_ = document.getElementById("fileToUpload");
      let file = fileList_.files[0];
      var form = new FormData();
      form.append("file", file);
      importGroupExcel(form).then(res => {
        if (res.code == 200) {
          this.$message.success("导入成功");
          _this.getGroupDataPage();
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
            examineStatus: this.audioRadio,
            approvalOpinion: this.textareaVal,
            activityIds: this.groupIds
          };
          this.volunteerAudit(param);
        } else {
          this.$message.info("请选择要审核结果并填写审核原因");
        }
    },
    //（批量）审批志愿者申请加入团体团队
    volunteerAudit(data) {
      activityAuditBatch(data).then(res => {
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
        let param = {
            examineStatus: 3,
            approvalOpinion: "",
            activityIds: this.groupIds
          };
          this.volunteerAudit(param);
      } else {
        this.$message.info("您未进行选择，请选择后进行操作");
      }
    },
    //获取列表(分页)
    getGroupDataPage() {
      activityDataPageByWeb(this.searchForm).then(res => {
        if (res.code == 200) {
          this.tableData = res.data.result;
          this.total = res.data.totalPages;
        }
      });
    },
    //查询
    onSearch() {
      this.searchForm.pageNum = 1;
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
      this.$router.push({ name: "volunteer_recruitment_detail", params: { id: id,type:"detail" } });
    },
    //添加
    recruitmentAdd: function() {
      this.$router.push({ name: "volunteer_recruitment_form", params: { id: "" ,type:"form" } });
    },
    //修改
    handleEdit(id) {
      this.$router.push({ name: "volunteer_recruitment_edit", params: { id: id,type:"edit" } });
    },
    groupOrg() {
      groupData().then(res => {
        if (res.code == 200) {
          this.groupList = res.data;
        }
      });
    },
    //审核dialog
    audit(id) {
      this.groupIds = [];
      this.groupIds[0] = id;
      this.confirmDialog = true;
    },

    //重置
    reset() {
      this.searchForm.pageNum = 1;
      this.searchForm.pageSize = 10;
      this.searchForm.actName = "";
      this.searchForm.actType = "";
      this.searchForm.actTheme = "";
      this.searchForm.actStage = "";
      this.searchForm.status = "";
      this.searchForm.examineStatus = "";
      this.getGroupDataPage();
    }
  },
  created() {
    this.EnumFun();
    this.getDicListByTypeCode("actvType", this.actTypeOptions);
    this.getDicListByTypeCode("actvTheme", this.actThemeOptions);
    this.getGroupDataPage();
    // this.loadProvince();
    this.groupOrg();
  },
  filters:{
    //活动状态
    actStageFilter:function(val){
      switch (val) {
        case 0:
          return "未开始"
          break;
        case 1:
          return "招募中"
          break;
          case 2:
          return "进行中"
          break;
        case 3:
          return "已结束"
          break;
      default:
          return "未知"
          break;
      }
    },
    //发布状态
    statusFilter:function(val){
      switch (val) {
        case 0:
          return  "未发布"
          break;
        case 1:
          return  "已发布"
          break;
      default:
          return  "未知"
          break;
      }
    }
  }
};
</script>

<style lang="scss">
.recruitment{
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
    width: 150px;
  }
}
}
</style>
