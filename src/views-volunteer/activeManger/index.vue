<template>
  <section class="view-container activeManger">
    <div id="inputInnerDiv"></div>
    <el-form class="search-form" ref="searchForm" :model="searchForm" label-width="0" :inline="true" size="small">
      <el-form-item>
        <el-input style="width:220px" v-model="searchForm.activityName" maxlength="50" clearable placeholder="活动名称"></el-input>
      </el-form-item>
      <el-form-item>
        <el-select v-model="searchForm.activityStatus" clearable placeholder="活动状态">
          <el-option v-for="item in actStageOptions" :key="item.code" :label="item.message" :value="item.code">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="searchForm.status" clearable placeholder="审核状态">
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
      <el-row class="table-wraper">
        <template>
          <el-table style="width: 100%;" stripe border :data="tableData" ref="multipleTable">
            <el-table-column prop="activityName" label="活动名称">
              <template slot-scope="scope">
                <p><a style="color:#409EFF" @click="toActivityDetail(scope.row.id)">{{scope.row.activityName}}</a></p>
              </template>
            </el-table-column>
            <el-table-column prop="volunteerName" label="姓名">
              <template slot-scope="scope">
                <p><a style="color:#409EFF" @click="toVolunteerDetail(scope.row.volunteerId)">{{scope.row.volunteerName}}</a></p>
              </template>
            </el-table-column>
            <el-table-column prop="activityStatus" label="活动状态">
              <template slot-scope="scope">
                <p>{{scope.row.activityStatus | actStageFilter}}</p>
              </template>
            </el-table-column>
            <el-table-column prop="statusName" label="审核状态">
            </el-table-column>
            </el-table-column>
            <el-table-column label="操作" width="80">
              <template slot-scope="scope">
                <el-button size="mini" type="primary" @click="audit(scope.row.id,scope.row.activityId)"><i class="fa fa-pencil"></i>&nbsp;审核</el-button>
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
  volunteerActivityApplyDataPage,
volunteerActivityApplyAudit,
activityStageEnum,
activityExamineStatusEnumActivity,
getDicListByTypeCode,
} from "@/api/volunteer/volunteer";
import PageTemp from "@/components/PageTemp";

export default {
  data() {
    return {
      confirmDialog:false,
      textareaVal:"",
      auditId:"",//报名主键
      activityId:"",//活动主键
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
        activityName: "",//活动名称
        activityStatus:"",//活动阶段
        status:"",//审核状态
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
    //跳转活动详情
    toActivityDetail:function(id){
      this.$router.push({ name: "volunteer_recruitment_detail", params: { id: id,type:"detail" } });
    },
    //跳转志愿者详情
    toVolunteerDetail:function(id){
      this.$router.push({ name: "volunteer_detail", params: { type:"detail",id: id } });
    },
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
          activityExamineStatusEnumActivity().then(res => {
            if (res.code == 200) {
                _this.examineStatusOptions=res.data
            }
        })
      },

    //
    confirmDialogResert: function() {
      this.textareaVal = "";
      this.audioRadio = "";
    },
    //获取列表(分页)
    geDataPage() {
      volunteerActivityApplyDataPage(this.searchForm).then(res => {
        if (res.code == 200) {
          this.tableData = res.data.result;
          this.total = res.data.totalPages;
        }
      });
    },
    //查询
    onSearch() {
      this.searchForm.pageNum = 1;
      this.geDataPage();
    },
    goSpecifiedPage(val) {
      this.searchForm.pageNum = val;
      this.geDataPage();
    },
    //审核dialog
    audit(id,activityId) {
      this.groupIds = [];
      this.auditId=id;
      this.activityId = activityId;
      this.confirmDialog = true;
    },
    //审核确定事件
    confirmTrue: function() {
        if (this.audioRadio != "" && this.textareaVal != "") {
          let param = {
            id:this.auditId,
            status: this.audioRadio,
            approvalOpinion: this.textareaVal,
            activityId: this.activityId
          };
          this.auditFun(param);
        } else {
          this.$message.info("请选择要审核结果并填写审核原因");
        }
    },
    //审核
    auditFun(param){
      volunteerActivityApplyAudit(param).then(res => {
        if (res.code == 200) {
          this.$message.success("审核结果上传成功");
          this.geDataPage();
          this.confirmDialog = false;
        } else {
          this.$message.error("审核失败");
        }
      });
    },
    //重置
    reset() {
      this.searchForm.pageNum = 1;
      this.searchForm.pageSize = 10;
      this.searchForm.activityName = "";
      this.searchForm.activityStatus = "";
      this.searchForm.status = "";
      this.geDataPage();
    }
  },
  created() {
    this.EnumFun();
    this.geDataPage();
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
.activeManger{
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
