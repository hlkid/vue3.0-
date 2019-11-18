<!--艺术鉴赏  展览展示-->
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
      <el-form-item>
        <el-input v-model="searchForm.name" clearable placeholder="请输入课程名称"></el-input>
      </el-form-item>
      <el-form-item>
        <el-select v-model="searchForm.type" placeholder="请选择课程类型">
          <el-option
            v-for="(i,index) in courseOptions"
            :key="index"
            :label="i.label"
            :value="i.value"
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
      <el-form-item prop="publishStatus">
        <el-select v-model="searchForm.publishStatus" clearable placeholder="发布状态">
          <el-option
            :label="item.label"
            :value="item.value"
            v-for="item in publishStatusList"
            :key="item.key"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit" native-type="submit">
          <i class="fa fa-search fa-fw"></i>查询
        </el-button>
        <el-button @click="resetSearchForm">
          <i class="fa fa-repeat fa-fw"></i>重置
        </el-button>
      </el-form-item>
    </el-form>
    <section class="list-wraper">
      <el-row class="btn-wraper">
        <el-button
          size="small"
          type="primary"
          @click="addDialog"
          v-if="hasButton('teacherCourse_add')"
        >
          <i class="fa fa-plus fa-fw"></i>新增
        </el-button>
        <el-button
          size="small"
          type="primary"
          @click="handleSendAudit(currentSelect)"
          v-if="hasButton('teacherCourse_sendAudit')"
        >
          <i class="fa fa-pencil fa-fw"></i>发送审核
        </el-button>
      </el-row>
      <el-row class="table-wraper">
        <template>
          <el-table
            style="width: 100%;"
            border
            stripe
            :header-cell-class-name="selectText"
            @current-change="handleCurrentChange"
            @selection-change="handleSelectionChange"
            row-key="id"
            :data="tableData"
            ref="multipleTable"
          >
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column show-overflow-tooltip prop="name" label="课程名称"></el-table-column>
            <el-table-column show-overflow-tooltip prop="typeName" label="课程类型"></el-table-column>
            <el-table-column sortable prop="createTime" width="150" label="创建时间"></el-table-column>
            <el-table-column prop="createBy" width="120" label="创建人"></el-table-column>
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
            <el-table-column label="操作" width="300">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  @click.stop="handleAudit(scope.row)&& hasButton('teacherCourse_audit')"
                  v-if="scope.row.examineStatus==3 "
                >
                  <i class="fa fa-pencil fa-fw"></i>审核
                </el-button>
                <el-button
                  size="mini"
                  type="primary"
                  @click.stop="handleRelease(scope.row)"
                  v-if="scope.row.examineStatus == 1&& hasButton('teacherCourse_release')"
                >
                  <i class="fa fa-pencil fa-fw"></i>
                  {{ scope.row.publishStatus == 0 ? '发布' : '撤销'}}
                </el-button>
                <el-button
                  size="mini"
                  @click.stop="handleEdit(scope.$index, scope.row)"
                  v-if="hasButton('teacherCourse_edit')"
                >
                  <i class="fa fa-pencil fa-fw"></i>编辑
                </el-button>
                <el-button
                  size="mini"
                  type="info"
                  @click.stop="handleView(scope.row)"
                  v-if="hasButton('teacherCourse_view')"
                >
                  <i class="fa fa-eye fa-fw"></i>查看
                </el-button>
                <el-button
                  size="mini"
                  type="danger"
                  @click.stop="handleDelete(scope.row)"
                  v-if="hasButton('teacherCourse_delete')&&scope.row.publishStatus!=1"
                >
                  <i class="fa fa-trash-o fa-fw"></i>删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页 -->
          <page-temp
            :total="total"
            :pageSize="searchForm.pageSize"
            :currentPage="searchForm.pageNum"
            @goSpecifiedPage="goSpecifiedPage"
          />
        </template>
      </el-row>
    </section>
    <!--审核-->
    <AuditDialog :show.sync="dialogAuditShow" :id="dialogAuditId" @sure="handleAuditSure"></AuditDialog>
  </section>
</template>

<script>
import { applicationDictionaryDataByTypeCode } from "@/api/config.js";
import {
  getTeacherCourseDataPage,
  teacherCourseSendExamine,
  auditTeacherCourse,
  publishTeacherCourse,
  deleteTeacherCourse,
  getCourseType
} from "@/api/mcc/teacherMange.js";
import pageTemp from "@/components/PageTemp";
import AuditDialog from "./components/auditDialog.vue";
export default {
  components: { AuditDialog, pageTemp },
  data() {
    return {
      routeQuery: {},
      courseOptions: [],
      searchForm: {
        name: "", //名称
        type: "",
        pageNum: 1,
        pageSize: 10,
        examineStatus: "",
        publishStatus: ""
      },
      examineStatusList: [],
      publishStatusList: [],
      pageType: "", // 0为老师风采 1为教师课程

      tableData: [],
      total: 0, // 总 条数

      // 审核
      dialogAuditId: "",
      dialogAuditShow: false,
      currentSelect: {}
    };
  },
  created() {
    this.applicationDictionaryDataByTypeCode(
      "examineStatus",
      this.examineStatusList
    );
    this.applicationDictionaryDataByTypeCode(
      "publishStatus",
      this.publishStatusList
    );
    this.getTeacherCourseDataPage();
    this.getCourseType();
  },
  methods: {
    //发送审核
    handleSendAudit(row) {
      if (!row.id) {
        this.$message.warning("请勾选一条记录");
        return;
      }
      if (row.examineStatus == 1) {
        this.$message.warning("该条数据已审核");
        return;
      }
      if (row.examineStatus == 3) {
        this.$message.warning("您已经发送了审核");
        return;
      }

      if (row.examineStatus == 2) {
        this.$message.warning("该条数据不通过，请修改后在发送");
        return;
      }

      this.commonDeleteDialog(
        this.teacherCourseSendExamine,
        row.id,
        "发送审核"
      );
    },
    //发送审核
    teacherCourseSendExamine(id) {
      teacherCourseSendExamine(id).then(res => {
        if (res.code == 200) {
          this.$message.success("发送审核成功");
          this.getTeacherCourseDataPage();
        }
      });
    },
    /*table单选*/
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
    /* 删除 */
    handleDelete(row) {
      this.commonDeleteDialog(this.deleteTeacherCourse, row.id, "删除");
    },
    deleteTeacherCourse(id) {
      deleteTeacherCourse(id).then(res => {
        if (res.code == 200) {
          this.$message.success("删除成功");
          this.getTeacherCourseDataPage();
        }
      });
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
    /*编辑*/
    handleEdit(index, row) {
      this.$router.push({
        name: "teacherCourse_form",
        query: { id: row.id }
      });
    },
    // 审核
    handleAudit(row) {
      this.dialogAuditId = row.id;
      this.dialogAuditShow = true;
    },
    handleAuditSure(data) {
      this.auditTeacherCourse(data);
    },
    // 发布
    handleRelease(row) {
      let publishStatus = row.publishStatus == 0 ? 1 : 0;
      let msg = row.publishStatus == 0 ? "发布" : "撤销";
      this.commonDeleteDialog(
        this.publishTeacherCourse,
        {
          id: row.id,
          publishStatus: publishStatus
        },
        msg
      );
    },
    // 审核
    auditTeacherCourse(data) {
      auditTeacherCourse(data).then(res => {
        if (res.code == 200) {
          this.dialogAuditShow = false;
          this.$message.success("审核成功");
          this.getTeacherCourseDataPage();
        }
      });
    },
    // 发布
    publishTeacherCourse(data) {
      let msg = data.publishStatus == 1 ? "发布成功" : "撤销成功";
      publishTeacherCourse(data).then(res => {
        if (res.code == 200) {
          this.$message.success(msg);
          this.getTeacherCourseDataPage();
        }
      });
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
    // 查询
    onSubmit() {
      this.searchForm.pageNum = 1;
      this.getTeacherCourseDataPage();
    },
    //重置
    resetSearchForm() {
      this.searchForm.title = "";
      this.searchForm.type = "";
      this.searchForm.pageNum = 1;
      this.getTeacherCourseDataPage();
    },
    //分页
    goSpecifiedPage(val) {
      this.searchForm.pageNum = val;
      this.getTeacherCourseDataPage();
    },
    // 新增跳转
    addDialog() {
      this.$router.push({
        name: "teacherCourse_form"
      });
    },
    // list列表
    getTeacherCourseDataPage() {
      getTeacherCourseDataPage(this.searchForm).then(res => {
        this.tableData = res.data && res.data.result ? res.data.result : [];
        this.total = res.data.totalPages;
      });
    },

    // 查看详情
    handleView(row) {
      this.$router.push({
        name: "teacherCourse_view",
        query: {
          id: row.id
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
