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
      <el-form-item prop="title">
        <el-input v-model="searchForm.title" clearable placeholder="请输入标题"></el-input>
      </el-form-item>
      <el-form-item prop="childType">
        <el-select v-model="searchForm.childType" placeholder="请选择类型">
          <el-option
            v-for="(item,index) in childTypeOptions"
            :key="index"
            :label="item.label"
            :value="item.value"
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
          v-if="hasButton('artAppreciative_add')"
        >
          <i class="fa fa-plus fa-fw"></i>新增
        </el-button>
        <el-button
          size="small"
          type="primary"
          @click="handleSendAudit(currentSelect)"
          v-if="hasButton('artAppreciative_sendAudit')"
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
            <el-table-column show-overflow-tooltip prop="title" label="标题"></el-table-column>
            <el-table-column width="200" label="类型">
              <template slot-scope="scope">
                <span style="margin-left: 10px">{{ scope.row.typeName }}{{ scope.row.childTypeName}}</span>
              </template>
            </el-table-column>
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
                  @click.stop="handleAudit(scope.row)&& hasButton('artAppreciative_audit')"
                  v-if="scope.row.examineStatus==3"
                >
                  <i class="fa fa-pencil fa-fw"></i>审核
                </el-button>
                <el-button
                  size="mini"
                  type="primary"
                  @click.stop="handleRelease(scope.row)"
                  v-if="scope.row.examineStatus == 1&& hasButton('artAppreciative_release')"
                >
                  <i class="fa fa-pencil fa-fw"></i>
                  {{ scope.row.publishStatus == 0 ? '发布' : '撤销'}}
                </el-button>
                <el-button
                  size="mini"
                  @click.stop="handleEdit(scope.$index, scope.row)"
                  v-if="hasButton('artAppreciative_edit')"
                >
                  <i class="fa fa-pencil fa-fw"></i>编辑
                </el-button>
                <el-button
                  size="mini"
                  type="info"
                  @click.stop="handleView(scope.row)"
                  v-if="hasButton('artAppreciative_view')"
                >
                  <i class="fa fa-eye fa-fw"></i>查看
                </el-button>
                <el-button
                  size="mini"
                  type="danger"
                  @click.stop="handleDelete(scope.row)"
                  v-if="hasButton('artAppreciative_delete')"
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
  addArt,
  getArtDataPage,
  artExhibition,
  artSendExamine,
  auditArt,
  publishArt,
  deleteArt
} from "@/api/mcc/appreciative.js";
import AuditDialog from "./components/auditDialog.vue";
import pageTemp from "@/components/PageTemp";
export default {
  components: { AuditDialog, pageTemp },
  data() {
    return {
      routeQuery: {},
      // 新闻列表 的检索条件
      childTypeOptions: [],
      searchForm: {
        type: "",
        childType: "",
        title: "", //名称
        pageNum: 1,
        pageSize: 10,
        examineStatus: "",
        publishStatus: ""
      },
      examineStatusList: [],
      publishStatusList: [],
      tableData: [],
      total: 0, // 总 条数

      // 审核
      dialogAuditId: "",
      dialogAuditShow: false,
      currentSelect: {}
    };
  },
  watch: {
    $route() {
      this.examineStatusList = [];
      this.publishStatusList = [];
      this.searchForm.examineStatus = "";
      this.searchForm.publishStatus = "";
      this.routeQuery = this.$route.params;
      this.searchForm.type = this.routeQuery.type;
      this.childTypeOptions = [];
      this.getArtDataPage();
      this.applicationDictionaryDataByTypeCode(
        "examineStatus",
        this.examineStatusList
      );
      this.applicationDictionaryDataByTypeCode(
        "publishStatus",
        this.publishStatusList
      );
      if (this.searchForm.type == 1) {
        this.applicationDictionaryDataByTypeCode(
          this.$dicts.exhibitionType,
          this.childTypeOptions
        );
      } else if (this.searchForm.type == 0) {
        this.applicationDictionaryDataByTypeCode(
          this.$dicts.artAppreciativeType,
          this.childTypeOptions
        );
      }
    }
  },
  created() {
    this.routeQuery = this.$route.params;
    this.searchForm.type = this.routeQuery.type;
    this.childTypeOptions = [];
    this.getArtDataPage();
    this.applicationDictionaryDataByTypeCode(
      "examineStatus",
      this.examineStatusList
    );
    this.applicationDictionaryDataByTypeCode(
      "publishStatus",
      this.publishStatusList
    );
    if (this.searchForm.type == 1) {
      this.applicationDictionaryDataByTypeCode(
        this.$dicts.exhibitionType,
        this.childTypeOptions
      );
    } else if (this.searchForm.type == 0) {
      this.applicationDictionaryDataByTypeCode(
        this.$dicts.artAppreciativeType,
        this.childTypeOptions
      );
    }
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

      this.commonDeleteDialog(this.artSendExamine, row.id, "发送审核");
    },
    //发送审核
    artSendExamine(id) {
      artSendExamine(id).then(res => {
        if (res.code == 200) {
          this.$message.success("发送审核成功");
          this.getArtDataPage();
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
    /* 删除 */
    handleDelete(row) {
      this.commonDeleteDialog(this.deleteArt, row.id, "删除");
    },
    deleteArt(id) {
      deleteArt(id).then(res => {
        if (res.code == 200) {
          this.$message.success("删除成功");
          this.getArtDataPage();
        }
      });
    },
    /*编辑*/
    handleEdit(index, row) {
      this.$router.push({
        name: "appreciative",
        params: { id: row.id }
      });
    },
    // 审核
    handleAudit(row) {
      this.dialogAuditId = row.id;
      this.dialogAuditShow = true;
    },
    handleAuditSure(data) {
      this.auditArt(data);
    },
    // 发布
    handleRelease(row) {
      let publishStatus = row.publishStatus == 0 ? 1 : 0;
      let msg = row.publishStatus == 0 ? "发布" : "撤销";
      this.commonDeleteDialog(
        this.publishArt,
        {
          id: row.id,
          publishStatus: publishStatus
        },
        msg
      );
    },
    // 审核
    auditArt(data) {
      auditArt(data).then(res => {
        if (res.code == 200) {
          this.dialogAuditShow = false;
          this.$message.success("审核成功");
          this.getArtDataPage();
        }
      });
    },
    // 发布
    publishArt(data) {
      let msg = data.publishStatus == 1 ? "发布成功" : "撤销成功";
      publishArt(data).then(res => {
        if (res.code == 200) {
          this.$message.success(msg);
          this.getArtDataPage();
        }
      });
    },
    // 查询
    onSubmit() {
      this.searchForm.pageNum = 1;
      this.getArtDataPage();
    },
    //重置 清除
    resetSearchForm() {
      this.searchForm.pageNum = 1;
      this.resetForm("searchForm");
      this.getArtDataPage();
    },
    resetForm(formName) {
      this.$nextTick(() => {
        this.$refs[formName].resetFields();
      });
    },
    //分页
    goSpecifiedPage(val) {
      this.searchForm.pageNum = val;
      this.getArtDataPage();
    },
    // 新增跳转
    addDialog() {
      this.$router.push({
        name: "appreciative",
        params: { type: this.routeQuery.type }
      });
    },
    // list列表
    getArtDataPage() {
      getArtDataPage(this.searchForm).then(res => {
        this.tableData = res.data.result;
        this.total = res.data.totalPages;
      });
    },

    // 查看详情
    handleView(row) {
      this.$router.push({
        name: "appreciative_view",
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
