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
      <el-form-item prop="type">
        <el-select v-model="searchForm.type" placeholder="请选择类型">
          <el-option
            v-for="(item,index) in travelPlaceTypeList"
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
          v-if="hasButton('scenicspot_add')"
          @click="handleAddBtn"
        >
          <i class="fa fa-plus fa-fw"></i>新增
        </el-button>
        <el-button
          size="small"
          type="primary"
          @click="handleSendAudit(currentSelect)"
          v-if="hasButton('scenicspot_sendAudit')"
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
            <el-table-column prop="name" label="景点名称"></el-table-column>
            <el-table-column prop="typeName" label="类型"></el-table-column>
            <el-table-column prop="keyword" label="关键字"></el-table-column>
            <!-- <el-table-column prop="content" label="内容" v-if="false"></el-table-column> -->
            <el-table-column sortable prop="startTime" width="150" label="开始时间"></el-table-column>
            <el-table-column prop="address" label="地址"></el-table-column>
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
            <el-table-column label="操作" width="300">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  @click.stop="handleAudit(scope.row)"
                  v-if="scope.row.examineStatus==3 && hasButton('scenicspot_audit')"
                >
                  <i class="fa fa-pencil fa-fw"></i>审核
                </el-button>
                <el-button
                  size="mini"
                  type="primary"
                  @click.stop="handleRelease(scope.row)"
                  v-if="scope.row.examineStatus == 1 && hasButton('scenicspot_release')"
                >
                  <i class="fa fa-pencil fa-fw"></i>
                  {{ scope.row.publishStatus == 0 ? '发布' : '撤销'}}
                </el-button>

                <el-button
                  v-if="hasButton('scenicspot_edit')"
                  size="mini"
                  @click.stop="handleEdit(scope.$index, scope.row)"
                >
                  <i class="fa fa-pencil fa-fw"></i>编辑
                </el-button>
                <el-button
                  size="mini"
                  type="info"
                  v-if="hasButton('scenicspot_view')"
                  @click.stop="handleView(scope.row)"
                >
                  <i class="fa fa-eye fa-fw"></i>查看
                </el-button>
                <el-button
                  size="mini"
                  type="danger"
                  v-if="hasButton('scenicspot_delete')"
                  @click.stop="handleDelete(scope.row)"
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
import {
  getTravelPlaceDataPage,
  travelPlaceExamine,
  travelPlacePublish,
  travelPlaceDelete,
  travelPlaceSendExamine
} from "@/api/mcc/appreciative.js";
import { applicationDictionaryDataByTypeCode } from "@/api/config.js";
import pageTemp from "@/components/PageTemp";
import AuditDialog from "@/views/components/AuditDialog.vue";
export default {
  components: { pageTemp, AuditDialog },
  data() {
    return {
      // 新闻列表 的检索条件
      travelPlaceTypeList: [],
      examineStatusList: [],
      publishStatusList: [],
      searchForm: {
        type: "", //类型
        name: "", //名称
        examineStatus: "",
        publishStatus: "",
        pageNum: 1,
        pageSize: 10
      },

      tableData: [],
      total: 0, // 总 条数

      // 审核
      dialogAuditId: "",
      dialogAuditShow: false,
      currentSelect: {}
    };
  },
  created() {
    this.getTravelPlaceDataPage();
    this.applicationDictionaryDataByTypeCode(
      this.$dicts.travelPlaceType,
      this.travelPlaceTypeList
    );

    this.applicationDictionaryDataByTypeCode(
      "examineStatus",
      this.examineStatusList
    );
    this.applicationDictionaryDataByTypeCode(
      "publishStatus",
      this.publishStatusList
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

      this.commonDeleteDialog(this.travelPlaceSendExamine, row.id, "发送审核");
    },
    //发送审核
    travelPlaceSendExamine(id) {
      travelPlaceSendExamine(id).then(res => {
        if (res.code == 200) {
          this.$message.success("发送审核成功");
          this.getTravelPlaceDataPage();
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
    // 发送审核
    travelPlaceSendExamine(id) {
      travelPlaceSendExamine(id).then(res => {
        if (res.code == 200) {
          this.$message.success("发送审核成功");
          this.getTravelPlaceDataPage();
        }
      });
    },
    // 点击删除按钮
    handleDelete(row) {
      this.commonDeleteDialog(this.travelPlaceDelete, row.id, "删除");
    },
    // 删除接口
    travelPlaceDelete(id) {
      travelPlaceDelete(id).then(res => {
        if (res.code == 200) {
          this.$message.success("删除成功");
          this.getTravelPlaceDataPage();
        }
      });
    },
    // 点击编辑按钮
    handleEdit(index, row) {
      this.$router.push({
        name: "scenicspot_form",
        query: {
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
      let _data = data;
      _data.idSource = data.id;
      this.travelPlaceExamine(_data);
    },
    // 发布
    handleRelease(row) {
      let publishStatus = row.publishStatus == 0 ? 1 : 0;
      let msg = row.publishStatus == 0 ? "发布" : "撤销";
      this.commonDeleteDialog(
        this.travelPlacePublish,
        {
          id: row.id,
          publishStatus: publishStatus
        },
        msg
      );
    },
    // 审核
    travelPlaceExamine(data) {
      travelPlaceExamine(data).then(res => {
        if (res.code == 200) {
          this.dialogAuditShow = false;
          this.$message.success("审核成功");
          this.getTravelPlaceDataPage();
        }
      });
    },
    // 发布
    travelPlacePublish(data) {
      let msg = data.publishStatus == 1 ? "发布成功" : "撤销成功";
      travelPlacePublish(data).then(res => {
        if (res.code == 200) {
          this.$message.success(msg);
          this.getTravelPlaceDataPage();
        }
      });
    },
    // 查询
    onSubmit() {
      this.searchForm.pageNum = 1;
      this.getTravelPlaceDataPage();
    },
    //重置 清除
    resetSearchForm() {
      this.searchForm.pageNum = 1;
      this.resetForm("searchForm");
      this.getTravelPlaceDataPage();
    },
    resetForm(formName) {
      this.$nextTick(() => {
        this.$refs[formName].resetFields();
      });
    },
    //分页
    goSpecifiedPage(val) {
      this.searchForm.pageNum = val;
      this.getTravelPlaceDataPage();
    },
    // 新增跳转
    handleAddBtn() {
      this.$router.push({
        name: "scenicspot_form"
      });
    },
    // list
    getTravelPlaceDataPage() {
      getTravelPlaceDataPage(this.searchForm).then(res => {
        this.tableData = res.data && res.data.result;
        this.total = res.data && res.data.totalPages;
      });
    },
    //数据词典
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
    },
    handleView(row) {
      this.$router.push({
        name: "scenicspot_view",
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
