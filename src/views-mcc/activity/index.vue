<template>
  <section class="view-container">
    <el-form
      class="search-form"
      ref="searchForm"
      :model="searchForm"
      :inline="true"
      size="small"
      @submit.native.prevent
    >
      <el-form-item prop="name">
        <el-input v-model="searchForm.name" clearable placeholder="活动名称"></el-input>
      </el-form-item>
      <el-form-item prop="type">
        <el-select v-model="searchForm.type" clearable placeholder="活动类型">
          <el-option
            :label="item.label"
            :value="item.value"
            v-for="item in typeActivityList"
            :key="item.key"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="examineStatus">
        <el-select v-model="searchForm.examineStatus" clearable placeholder="审核状态">
          <el-option
            :label="item.label"
            :value="item.value"
            v-for="item in examineStatusList"
            :key="item.key"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item prop="publishStatus" v-if="searchForm.examineStatus == 1">
        <el-select v-model="searchForm.publishStatus" clearable placeholder="发布状态">
          <el-option
            :label="item.label"
            :value="item.value"
            v-for="item in publishStatusList"
            :key="item.key"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item prop>
        <el-date-picker
          @change="onTimeChange"
          v-model="times"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="~"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
        ></el-date-picker>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="querySearchForm">
          <i class="fa-fw fa fa-search"></i>查询
        </el-button>
        <el-button @click="resetSearchForm">
          <i class="fa-fw fa fa-repeat"></i>重置
        </el-button>
        <el-button @click="handleAudit" v-if="false">弹层详情</el-button>
      </el-form-item>
    </el-form>
    <section class="list-wraper">
      <el-row class="btn-wraper">
        <el-button size="small" type="primary" @click="handleAdd" v-if="hasButton('activity-add')">
          <i class="fa-fw fa fa-plus"></i>新增活动
        </el-button>
        <el-button
          size="small"
          type="primary"
          @click="handleUploadFile(currentSelect)"
          v-if="hasButton('activity-upload-img')"
        >
          <i class="fa-fw fa fa-plus"></i>上传照片视频和总结
        </el-button>
        <el-button
          size="small"
          type="primary"
          @click="handleSummaryStatus(currentSelect)"
          v-if="hasButton('activity-summary-review')"
        >
          <i class="fa-fw fa fa-pencil"></i>总结审核
        </el-button>
        <el-button
          size="small"
          type="primary"
          @click="handleAppointmentManage(currentSelect)"
          v-if="hasButton('activity-order')"
        >
          <i class="fa fa-eye fa-fw"></i>订单管理
        </el-button>
        <el-button
          size="small"
          type="primary"
          @click="handleCommentManage(currentSelect)"
          v-if="hasButton('activity-coment')"
        >
          <i class="fa fa-eye fa-fw"></i>评论管理
        </el-button>
        <el-button
          size="small"
          type="primary"
          @click="handleSendAudit(currentSelect)"
          v-if="hasButton('activity-send-review')"
        >
          <i class="fa fa-pencil fa-fw"></i>发送审核
        </el-button>

        <el-button
          size="small"
          type="primary"
          @click="handleExport()"
          v-if="hasButton('activity-export')"
        >
          <i class="fa fa-pencil-square-o fa-fw"></i>导出
        </el-button>

        <!--        <el-button-->
        <!--          size="small"-->
        <!--          type="primary"-->
        <!--          @click.stop="handleAppointment(currentSelect)"><i class="fa fa-plus fa-fw"></i>预约</el-button>-->
      </el-row>
      <el-row class="table-wraper">
        <template>
          <el-table
            ref="multipleTable"
            :data="tableData"
            :header-cell-class-name="selectText"
            @current-change="handleCurrentChange"
            @selection-change="handleSelectionChange"
            row-key="id"
            style="width: 100%;"
            stripe
            border
          >
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column show-overflow-tooltip prop="name" label="活动名称"></el-table-column>
            <el-table-column show-overflow-tooltip prop="venueName" label="场馆名称"></el-table-column>
            <el-table-column sortable label="活动时间" width="220">
              <template slot-scope="scope">
                <div>开始：{{scope.row.startTime}}</div>
                <div>结束：{{scope.row.endTime}}</div>
                <!--                {{scope.row.startTime | isTimeDay1(scope.row.endTime)}}-->
              </template>
            </el-table-column>
            <!--            <el-table-column-->
            <!--              show-overflow-tooltip-->
            <!--              prop="address"-->
            <!--              label="地点">-->
            <!--            </el-table-column>-->
            <!--            <el-table-column-->
            <!--              prop="contactPerson"-->
            <!--              label="联系人" width="100">-->
            <!--            </el-table-column>-->
            <!--            <el-table-column-->
            <!--              prop="contactInfo"-->
            <!--              label="联系方式" width="120">-->
            <!--            </el-table-column>-->
            <el-table-column prop="examineStatus" label="审核状态" width="80">
              <template slot-scope="scope">
                <el-link
                  :underline="false"
                  type="success"
                  v-if="scope.row.examineStatus == 1"
                >{{scope.row.examineStatusName}}</el-link>
                <el-link :underline="false" type="danger" v-else>{{scope.row.examineStatusName}}</el-link>
              </template>
            </el-table-column>
            <el-table-column prop="publishStatus" label="发布状态" width="80">
              <template slot-scope="scope">
                <el-link
                  :underline="false"
                  type="success"
                  v-if="scope.row.publishStatus == 1"
                >{{scope.row.publishStatusName}}</el-link>
                <el-link :underline="false" type="danger" v-else>{{scope.row.publishStatusName}}</el-link>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="480">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  @click.stop="handleAudit(scope.row)"
                  v-if="scope.row.examineStatus==3 && hasButton('activity-review')"
                >
                  <i class="fa fa-pencil fa-fw"></i>审核
                </el-button>

                <el-button
                  size="mini"
                  type="primary"
                  @click.stop="handleRelease(scope.row)"
                  v-if="scope.row.examineStatus==1 && scope.row.publishStatus != 1 && hasButton('activity-release')"
                >
                  <i class="fa fa-pencil fa-fw"></i>发布
                </el-button>

                <!--已发布也能编辑-->
                <!--:disabled="scope.row.publishStatus == 1"-->
                <el-button
                  size="mini"
                  v-if="hasButton('activity-edit')"
                  @click.stop="handleEdit(scope.row)"
                >
                  <i class="fa fa-pencil fa-fw"></i>编辑
                </el-button>
                <el-button
                  size="mini"
                  type="danger"
                  v-if="hasButton('activity-delete')"
                  @click.stop="handleDelete(scope.row)"
                >
                  <i class="fa fa-trash-o fa-fw"></i>删除
                </el-button>
                <el-button
                  size="mini"
                  type="info"
                  v-if="hasButton('activity-look')"
                  @click.stop="handleView(scope.row)"
                >
                  <i class="fa fa-eye fa-fw"></i>查看
                </el-button>
                <!--                <el-button-->
                <!--                  size="mini"-->
                <!--                  type="primary"-->
                <!--                  @click.stop=""><i class="fa fa-eye fa-fw"></i>推荐</el-button>-->

                <el-button
                  size="mini"
                  type="primary"
                  v-if="scope.row.qrCode && hasButton('activity-qrCode')"
                  @click.stop="handleViewDownloadQrCode(scope.row)"
                >
                  <i class="fa fa-eye fa-fw"></i>签到码下载
                </el-button>
                <el-button
                  size="mini"
                  type="primary"
                  v-else-if="hasButton('activity-qrCode')"
                  @click.stop="handleViewCreateQrCode(scope.row)"
                >
                  <i class="fa fa-eye fa-fw"></i>生成二维码
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
    <!--添加-->
    <el-dialog
      title="预约活动"
      :visible.sync="dialogShow"
      width="500px"
      :close-on-click-modal="false"
      :append-to-body="true"
    >
      <el-form
        class="dialog-form"
        ref="dialogForm"
        :model="dialogForm"
        label-width="100px"
        :rules="rules"
        size="small"
      >
        <el-form-item label="活动名称" prop="activityName">
          <el-input v-model.trim="dialogForm.activityName" readonly></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model.trim="dialogForm.phone" clearable></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogShow = false">取 消</el-button>
        <el-button type="primary" :disabled="vloading" @click="sure">确 定</el-button>
      </div>
    </el-dialog>

    <!--活动总结-->
    <el-dialog
      title="活动总结"
      :visible.sync="dialogSummaryShow"
      width="500px"
      :close-on-click-modal="false"
      :append-to-body="true"
    >
      <el-form
        class="dialog-form"
        ref="dialogSummary"
        :model="summaryForm"
        :rules="summaryFormRules"
        size="small"
      >
        <el-form-item label="总结" prop="summary">
          <el-input v-model.trim="summaryForm.summary" clearable type="textarea"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogSummaryShow = false">取 消</el-button>
        <el-button type="primary" :disabled="vloading" @click="summarySure">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 活动详情 -->
    <page-dialog title="活动详情" :visible.sync="detailPage" width="750px" :center="true">
      <detail ref="detail" />
      <template slot="footer">
        <div style="text-align:center;">
          <el-button size="small" @click="cancelBtn">取消</el-button>
          <el-button size="small" type="primary" @click="auditBtn">审核</el-button>
        </div>
      </template>
    </page-dialog>
  </section>
</template>

<script>
import {
  deleteActivity,
  getActivityDataPage,
  auditActivity,
  activitySendExamine,
  releaseActivity,
  addAppointment,
  editActivity,
  saveQrCode,
  saveSummary,
  setSummartyExamin,
  getActivityExport,
  getActivityStatusEnum
} from "@/api/mcc/activity.js";
import { createQrcode, fileDetail } from "@/api/file";
import { applicationDictionaryDataByTypeCode } from "@/api/config.js";
import { isTimeDay, downloading, isEmpty } from "@/utils/common";
import PageTemp from "@/components/PageTemp";
import download from "ly-downloader";
import pageDialog from "@/components/lib/data/page-dialog";
import detail from "./components/detail";

import { checkMobile, mobile } from "@/utils/validate";
export default {
  data() {
    return {
      //活动总结
      dialogSummaryShow: false,
      summaryForm: {
        id: "",
        summary: ""
      },
      summaryFormRules: {
        summary: { required: true, message: "请输入活动总结" }
      },

      //预约活动
      dialogShow: false,
      dialogForm: {
        idActivity: "",
        activityName: "",
        phone: ""
      },
      rules: {
        activityName: [{ required: true, message: "请选择活动" }],
        phone: [
          { required: true, message: "请输入手机号" },
          { validator: checkMobile }
        ]
      },
      //检索条件
      times: [],
      searchForm: {
        pageNum: 1,
        pageSize: 10,
        name: "",
        type: "",
        examineStatus: "",
        publishStatus: "",
        startDate: "",
        endDate: ""
      },
      typeActivityList: [],
      examineStatusList: [],
      publishStatusList: [],

      tableData: [],
      total: 0,
      currentSelect: {},
      detailPage: false,
      fid: ""
    };
  },
  components: { PageTemp, pageDialog, detail },
  filters: {
    //时间过滤
    isTimeDay1: function(data1, data2) {
      let time = "";
      if (isTimeDay(data1, data2)) {
        time = data1 + " ~ " + data2;
      } else {
        time = data1 + "~ " + data2.substring(10, data2.length);
      }
      return time;
    }
  },
  created() {
    this.getActivityDataPage();
    this.applicationDictionaryDataByTypeCode(
      "typeActivity",
      this.typeActivityList
    );
    // this.applicationDictionaryDataByTypeCode('examineStatus',this.examineStatusList);
    this.getActivityStatusEnum();
    this.applicationDictionaryDataByTypeCode(
      "publishStatus",
      this.publishStatusList
    );
  },
  methods: {
    //时间区间
    onTimeChange(val) {
      if (val.length) {
        this.searchForm.startDate = val[0];
        this.searchForm.endDate = val[1];
      }
    },
    //活动状态
    getActivityStatusEnum() {
      getActivityStatusEnum().then(res => {
        if (res.code == 200) {
          this.examineStatusList = res.data.map(e => {
            e.key = "status" + e.code;
            e.label = e.message;
            e.value = e.code;
            return e;
          });
        }
      });
    },
    //导出
    handleExport() {
      const loading = this.$loading({
        lock: true,
        text: "文件生成中",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      let params = { name: "", type: "" };
      params.name = this.searchForm.name;
      params.type = this.searchForm.type;
      params.examineStatus = this.searchForm.examineStatus;
      params.publishStatus = this.searchForm.publishStatus;
      params.startDate = this.searchForm.startDate;
      params.endDate = this.searchForm.endDate;
      getActivityExport(params).then(res => {
        downloading(res);
        setTimeout(() => {
          loading.close();
        }, 2000);
      });
    },
    handleCurrentChange(val) {
      this.currentSelect = val.id ? val : {};
      this.$refs.multipleTable.toggleRowSelection(val);
    },
    handleSelectionChange(val) {
      setTimeout(() => {
        if (val.length > 1) {
          this.$refs.multipleTable.clearSelection();
          this.$refs.multipleTable.toggleRowSelection(val.pop());
        }
        this.currentSelect = val.length ? val[0] : {};
      });
    },

    //确定预约
    sure() {
      this.$refs["dialogForm"].validate(valid => {
        if (valid) {
          this.addAppointment();
        }
      });
    },
    addAppointment() {
      addAppointment(this.dialogForm).then(res => {
        if (res.code == 200) {
          this.$message.success("预约成功");
          this.dialogShow = false;
          this.getActivityDataPage();
        }
      });
    },
    //操作按钮
    handleAdd() {
      this.$router.push({
        name: "activity_add"
      });
    },
    handleEdit(row) {
      this.$router.push({
        params: {
          id: row.id
        },
        name: "activity_edit"
      });
    },
    handleDelete(row) {
      this.commonDeleteDialog(this.deleteActivity, row.id, "删除");
    },
    handleView(row) {
      this.$router.push({
        params: {
          id: row.id
        },
        name: "activity_detail"
      });
    },
    //总结
    handleSummary(row) {
      this.dialogSummaryShow = true;
      this.summaryForm.id = row.id;
    },
    summarySure() {
      let that = this;
      this.$refs["dialogSummary"].validate(valid => {
        if (valid) {
          saveSummary(that.summaryForm).then(res => {
            if (res.code == 200) {
              that.getActivityDataPage();
            }
          });
        }
      });
    },
    setSummartyExamin(params) {
      let that = this;
      setSummartyExamin(params).then(res => {
        if (res.code == 200) {
          that.getActivityDataPage();
        }
      });
    },

    //预约
    handleAppointment(row) {
      this.dialogShow = true;
      this.dialogForm.idActivity = row.id;
      this.dialogForm.activityName = row.name;
      this.dialogForm.phone = "";
    },

    // 审核总结
    handleSummaryStatus(row) {
      if (!row.id) {
        this.$message.warning("请勾选一条记录");
        return;
      }
      if (isEmpty(row.summary)) {
        this.$message.warning("请先上传图片视频和总结");
        return;
      }

      if (row.summaryExamineStatus == 1) {
        this.$message.warning("该审核已通过！！");
        return;
      }
      this.commonReviewDialog(
        (params, isReview) => {
          if (isReview) {
            params.status = 1;
          } else {
            params.status = 2;
            params.reason = params.value.value;
          }
          this.setSummartyExamin(params);
        },
        { id: row.id },
        "审核"
      );
    },
    //预约管理
    handleAppointmentManage(row) {
      if (!row.id) {
        this.$message.warning("请勾选一条记录");
        return;
      }
      this.$router.push({
        query: {
          idActivity: row.id
        },
        name: "appointment"
      });
    },
    //评论管理
    handleCommentManage(row) {
      if (!row.id) {
        this.$message.warning("请勾选一条记录");
        return;
      }
      this.$router.push({
        query: {
          idActivity: row.id
        },
        name: "comment"
      });
    },
    //发送审核
    handleSendAudit(row) {
      if (!row.id) {
        this.$message.warning("请勾选一条记录");
        return;
      }
      if (row.examineStatus == 1) {
        this.$message.warning("该活动已审核");
        return;
      }
      if (row.examineStatus == 3) {
        this.$message.warning("您已经发送了审核");
        return;
      }

      if (row.examineStatus == 2) {
        this.$message.warning("该活动不通过，请修改后在发送");
        return;
      }

      this.commonDeleteDialog(
        this.activitySendExamine,
        {
          id: row.id
        },
        "发送审核"
      );
    },
    //上传照片和视频
    handleUploadFile(row) {
      if (!row.id) {
        this.$message.warning("请勾选一条记录");
        return;
      }
      // console.log(row.summary)
      // if(!isEmpty(row.summary)){
      //   this.$message.warning('这条活动已经上传过了')
      //   return
      // }
      if (row.summaryExamineStatus == 0 && !isEmpty(row.summary)) {
        this.$message.warning("这条活动已经上传过了");
        return;
      }

      if (row.summaryExamineStatus == 1) {
        this.$message.warning("这条活动总结审核已经通过");
        return;
      }

      this.$router.push({
        params: {
          id: row.id
        },
        name: "activity_upload"
      });
    },
    //审核
    handleAudit(row) {
      // this.$router.push({
      //   params: {
      //     id: row.id
      //   },
      //   query: {
      //     type: "audit" //点击审核
      //   },
      //   name: "activity_detail"
      // });
      this.detailPage = true;
      this.fid = row.id;
      this.$nextTick(() => {
        this.$refs.detail.setData(row.id);
      });
    },
    //发布
    handleRelease(row) {
      let that = this;
      let params = {};
      let text = "";
      params.id = row.id;
      params.publishStatus = row.publishStatus == 1 ? 0 : 1;
      text = row.publishStatus == 1 ? "撤销发布" : "发布，发布后活动将不可修改";

      this.$confirm("是否确认" + text + "？", "温馨提示", {
        cancelButtonText: "取消",
        confirmButtonText: "确定",
        type: "",
        center: false
      })
        .then(() => {
          that.releaseActivity(params);
        })
        .catch(() => {
          if (row.publishStatus == 1) {
            that.$message.info("已取消撤销发布");
          } else {
            that.$message.info("已取消发布");
          }
        });
      // this.commonDeleteDialog(this.releaseActivity,params,text)
    },
    //发送审核
    activitySendExamine(data) {
      activitySendExamine(data).then(res => {
        if (res.code == 200) {
          this.$message.success("发送审核成功");
          this.getActivityDataPage();
        }
      });
    },
    //审核
    auditActivity(data) {
      auditActivity(data).then(res => {
        if (res.code == 200) {
          this.$message.success("审核成功");
          this.detailPage = false;
          this.getActivityDataPage();
        }
      });
    },
    //发布
    releaseActivity(data) {
      releaseActivity(data).then(res => {
        if (res.code == 200) {
          this.$message.success("发布成功");
          this.getActivityDataPage();
        }
      });
    },
    //下载二维码
    handleViewDownloadQrCode(data) {
      // console.log(data)
      let name = data.name;
      fileDetail(data.qrCode).then(res => {
        if (res.code == 200 && res.data) {
          let adress = this.baseImgUrl + res.data.path;
          download(1, adress, name);
        }
      });
    },
    //生成二维码
    handleViewCreateQrCode(data) {
      let that = this;
      let activityId = data.id;
      let params = { content: activityId };
      createQrcode(params).then(res => {
        if (res.code == 200) {
          let data = { id: activityId, qrCode: res.data.id };
          saveQrCode(data).then(res => {
            if (res.code == 200) {
              that.getActivityDataPage();
            }
          });
        }
      });
    },

    //查询
    querySearchForm() {
      this.getActivityDataPage();
    },
    //重置
    resetSearchForm() {
      this.searchForm.pageNum = 1;
      this.searchForm.startDate = "";
      this.searchForm.endDate = "";
      this.times = [];
      this.resetForm("searchForm");
      this.getActivityDataPage();
    },
    resetForm(formName) {
      this.$refs[formName] && this.$refs[formName].resetFields();
    },

    //列表

    //删除
    deleteActivity(dicNum) {
      deleteActivity(dicNum).then(res => {
        if (res.code == 200) {
          this.$message.success("删除成功");
          this.getActivityDataPage();
        }
      });
    },

    //分页
    goSpecifiedPage(val) {
      this.searchForm.pageNum = val;
      this.getActivityDataPage();
    },

    //获取活动列表
    getActivityDataPage() {
      if (this.searchForm.examineStatus == 0) {
        this.searchForm.publishStatus = "";
      }

      getActivityDataPage(this.searchForm).then(res => {
        if (res.code == 200) {
          this.tableData = res.data.result;
          this.total = res.data.totalPages;

          this.currentSelect = {};
        }
      });
    },

    //数据词典
    applicationDictionaryDataByTypeCode(code, arr) {
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
    // 详情取消
    cancelBtn() {
      this.detailPage = false;
    },
    // 审核按钮
    auditBtn() {
      this.commonReviewDialog(
        (params, isReview) => {
          if (isReview) {
            params.status = 1;
          } else {
            params.status = 2;
            params.reason = params.value.value;
          }
          this.auditActivity(params);
        },
        { id: this.fid },
        "审核"
      );
    }
  }
};
</script>

<style lang="scss" scoped>
.print-dialog {
  .el-dialog__body {
    padding: 20px;
  }
}
.native-table {
  text-align: center;
  border-collapse: collapse;
  th {
    height: 50px;
  }
  td {
    height: 40px;
  }
  td,
  th {
    border: 1px solid #ccc;
  }
}
</style>
