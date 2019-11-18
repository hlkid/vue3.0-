<!--艺术鉴赏  展览展示-->
<template>
  <section class="view-container live-broadcast">
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
      <el-form-item prop="examineStatus">
        <el-select v-model="searchForm.examineStatus" placeholder="请选择审核状态">
          <el-option
            v-for="(item,index) in examineStatusOption"
            :key="index"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="publishStatus">
        <el-select v-model="searchForm.publishStatus" placeholder="请选择发布状态">
          <el-option
            v-for="(item,index) in publishStatusOption"
            :key="index"
            :label="item.label"
            :value="item.value"
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
        <el-button size="small" type="primary" v-if="hasButton('live_add')" @click="handleAddBtn">
          <i class="fa fa-plus fa-fw"></i>新增
        </el-button>
        <el-button
          size="small"
          type="primary"
          @click="handleSendAudit(currentSelect)"
          v-if="hasButton('live_sendAudit')"
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
            <el-table-column prop="title" label="直播名称"></el-table-column>
            <el-table-column prop="address" label="地址"></el-table-column>
            <el-table-column sortable width="150" prop="startTime" label="开始时间"></el-table-column>
            <el-table-column prop="liveStatus" label="直播状态">
              <template slot-scope="scope">
                <el-link
                  :underline="false"
                  type="success"
                  v-if="scope.row.liveStatus == 1"
                >{{scope.row.liveStatusName}}</el-link>
                <el-link :underline="false" type="danger" v-else>{{scope.row.liveStatusName}}</el-link>
              </template>
            </el-table-column>
            <el-table-column prop="examineStatus" label="审核状态" width="100">
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
            <el-table-column prop="publishStatus" label="直播推流地址" width="100" align="center">
              <template slot-scope="scope">
                <el-button
                  @click="copyBtn(scope.row.id)"
                  data-clipboard-action="copy"
                  :data-clipboard-text="scope.row.pushUrl"
                  :id="'copy-btn-'+scope.row.id"
                  size="mini"
                >复制地址</el-button>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="300">
              <template slot-scope="scope">
                <div class="btn-area">
                  <div v-if="scope.row.examineStatus==3 && hasButton('live_audit')">
                    <el-button size="mini" type="primary" @click.stop="handleAudit(scope.row)">
                      <i class="fa fa-pencil fa-fw"></i>审核
                    </el-button>
                  </div>
                  <div v-if="scope.row.examineStatus == 1 && hasButton('live_release')">
                    <el-button size="mini" type="primary" @click.stop="handleRelease(scope.row)">
                      <i class="fa fa-pencil fa-fw"></i>
                      {{ scope.row.publishStatus == 0 ? '发布' : '撤销'}}
                    </el-button>
                  </div>
                  <!-- 设置开始 -->
                  <div
                    v-if="scope.row.publishStatus == 1 && scope.row.liveStatus !=1&&scope.row.liveStatus != 2 && hasButton('live_setstart')"
                  >
                    <el-button size="mini" type="success" @click.stop="handleStart(scope.row)">
                      <i class="fa fa-cog"></i>设置开始
                    </el-button>
                  </div>
                  <!-- 设置结束 -->
                  <div
                    v-if="scope.row.liveStatus == 1&&scope.row.liveStatus != 2 && hasButton('live_setend')"
                  >
                    <el-button size="mini" type="success" @click.stop="handleEnd(scope.row)">
                      <i class="fa fa-cog"></i>设置结束
                    </el-button>
                  </div>
                  <!--设置结束状态时 资源视频上传 -->
                  <div v-if="scope.row.liveStatus == 2  && hasButton('live_resource')">
                    <el-button size="mini" type="success" @click.stop="handleUpload(scope.row)">
                      <i class="fa fa-cog"></i>资源视频
                    </el-button>
                  </div>
                  <div v-if=" hasButton('live_edit')">
                    <el-button size="mini" @click.stop="handleEdit(scope.$index, scope.row)">
                      <i class="fa fa-pencil fa-fw"></i>编辑
                    </el-button>
                  </div>
                  <div v-if="hasButton('live_view')">
                    <el-button size="mini" type="info" @click.stop="handleView(scope.row)">
                      <i class="fa fa-eye fa-fw"></i>查看
                    </el-button>
                  </div>
                  <div v-if="hasButton('live_delete')">
                    <el-button size="mini" type="danger" @click.stop="handleDelete(scope.row)">
                      <i class="fa fa-trash-o fa-fw"></i>删除
                    </el-button>
                  </div>
                </div>
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
    <!--审核-->
    <AuditDialog :show.sync="dialogAuditShow" :id="dialogAuditId" @sure="handleAuditSure"></AuditDialog>
  </section>
</template>

<script>
import {
  getLiveBroadcastPage,
  deleteLiveBroadcast,
  publishLiveBroadcast,
  sendLiveBroadcastExamine,
  getLiveBroadcastExamine,
  setStartLiveBroadcast,
  setEndLiveBroadcast
} from "@/api/mcc/live";
import { getDicListByTypeCode } from "@/api/config.js";
import PageTemp from "@/components/PageTemp";
import AuditDialog from "./components/auditDialog.vue";

export default {
  components: { PageTemp, AuditDialog },
  data() {
    return {
      routeQuery: {},
      // 新闻列表 的检索条件
      childTypeOptions: [],
      searchForm: {
        examineStatus: "", //审核状态
        publishStatus: "", //	发布状态
        title: "", //名称
        pageNum: 1,
        pageSize: 10
      },

      tableData: [],
      total: 0, // 总 条数

      // 审核
      dialogAuditId: "",
      dialogAuditShow: false,
      currentSelect: {},

      //审核列表
      examineStatusOption: [],
      //发布状态
      publishStatusOption: []
    };
  },
  created() {
    this.routeQuery = this.$route.params;
    this.searchForm.type = this.routeQuery.type;
    this.getLiveBroadcastPage();
    this.getDicListByTypeCode(
      this.$dicts.examineStatus,
      this.examineStatusOption
    );
    this.getDicListByTypeCode(
      this.$dicts.publishStatus,
      this.publishStatusOption
    );
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
        this.sendLiveBroadcastExamine,
        row.id,
        "发送审核"
      );
    },
    //发送审核
    artSendExamine(id) {
      sendLiveBroadcastExamine(id).then(res => {
        if (res.code == 200) {
          this.$message.success("发送审核成功");
          this.getLiveBroadcastPage();
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

    deleteLiveBroadcast(id) {
      deleteLiveBroadcast(id).then(res => {
        if (res.code == 200) {
          this.$message.success("删除成功");
          this.getLiveBroadcastPage();
        }
      });
    },
    // 发送审核
    sendLiveBroadcastExamine(id) {
      sendLiveBroadcastExamine(id).then(res => {
        if (res.code == 200) {
          this.$message.success("发送审核成功");
          this.getLiveBroadcastPage();
        }
      });
    },
    /*table单选*/
    handleCurrentChange(val) {
      this.currentSelect = val.id ? val : {};
      this.$refs.multipleTable.toggleRowSelection(val);
    },
    handleSelectionChange(val) {
      // console.log(val)
      setTimeout(() => {
        if (val.length > 1) {
          this.$refs.multipleTable.clearSelection();
          this.$refs.multipleTable.toggleRowSelection(val.pop());
        }
        this.currentSelect = val.length ? val[0] : {};
      });
    },
    // 点击删除按钮
    handleDelete(row) {
      this.commonDeleteDialog(this.deleteLiveBroadcast, row.id, "删除");
    },
    // 删除接口
    deleteLiveBroadcast(id) {
      deleteLiveBroadcast(id).then(res => {
        if (res.code == 200) {
          this.$message.success("删除成功");
          this.getLiveBroadcastPage();
        }
      });
    },
    // 点击编辑按钮
    handleEdit(index, row) {
      this.$router.push({
        name: "live_edit",
        params: {
          id: row.id
        }
      });
    },
    // 审核
    handleAudit(row) {
      this.dialogAuditId = row.id;
      this.dialogAuditShow = true;
    },
    handleAuditSure(data) {
      this.getLiveBroadcastExamine(data);
    },
    // 发布
    handleRelease(row) {
      let publishStatus = row.publishStatus == 0 ? 1 : 0;
      let msg = row.publishStatus == 0 ? "发布" : "撤销";
      this.commonDeleteDialog(
        this.publishLiveBroadcast,
        {
          id: row.id,
          publishStatus: publishStatus
        },
        msg
      );
    },
    // 审核
    getLiveBroadcastExamine(data) {
      getLiveBroadcastExamine(data).then(res => {
        if (res.code == 200) {
          this.dialogAuditShow = false;
          this.$message.success("审核成功");
          this.getLiveBroadcastPage();
        }
      });
    },
    // 发布
    publishLiveBroadcast(data) {
      let msg = data.publishStatus == 1 ? "发布成功" : "撤销成功";
      publishLiveBroadcast(data).then(res => {
        if (res.code == 200) {
          this.$message.success(msg);
          this.getLiveBroadcastPage();
        }
      });
    },
    // 查询
    onSubmit() {
      this.searchForm.pageNum = 1;
      this.getLiveBroadcastPage();
    },
    //重置 清除
    resetSearchForm() {
      this.searchForm.pageNum = 1;
      this.$nextTick(() => {
        this.$refs.searchForm.resetFields();
      });
      this.getLiveBroadcastPage();
    },
    //分页
    goSpecifiedPage(val) {
      this.searchForm.pageNum = val;
      this.getLiveBroadcastPage();
    },
    // 新增跳转
    handleAddBtn() {
      this.$router.push({
        name: "live_add"
      });
    },
    // list
    getLiveBroadcastPage() {
      getLiveBroadcastPage(this.searchForm).then(res => {
        this.tableData = res.data.result;
        this.total = res.data.totalPages;
      });
    },
    //数据词典
    getDicListByTypeCode(code, arr = []) {
      getDicListByTypeCode(code).then(res => {
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

    handleView(row) {
      this.$router.push({
        name: "live_view",
        params: {
          id: row.id
        }
      });
    },
    // 设置开始
    handleStart(row) {
      this.commonDeleteDialog(this.setStartLiveBroadcast, row.id, "直播开始");
    },
    //直播开始
    setStartLiveBroadcast(id) {
      setStartLiveBroadcast(id).then(res => {
        if (res.code == 200) {
          this.$message.success("设置开始直播成功");
          this.getLiveBroadcastPage();
        }
      });
    },
    // 设置结束
    handleEnd(row) {
      this.commonDeleteDialog(this.setEndLiveBroadcast, row.id, "直播结束");
    },
    // 直播结束
    setEndLiveBroadcast(id) {
      setEndLiveBroadcast(id).then(res => {
        if (res.code == 200) {
          this.$message.success("设置直播结束成功");
          this.getLiveBroadcastPage();
        }
      });
    },
    handleUpload(row) {
      this.$router.push({
        name: "live_upload",
        params: {
          id: row.id
        }
      });
    },
    // 拷贝
    copyBtn(id) {
      var clipboard = new this.clipboard(`#copy-btn-${id}`);
      clipboard.on("success", () => {});
      clipboard.on("error", () => {});
    },
    // 查看详情
    handleView(row) {
      this.$router.push({
        name: "live_detail",
        params: {
          id: row.id
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.live-broadcast {
  .btn-area {
    display: flex;
    flex-wrap: wrap;
    div {
      margin: 0px 8px 8px 0;
    }
  }
}
</style>
