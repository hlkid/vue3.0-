<template>
  <section class="view-container">
    <el-form class="search-form" ref="searchForm" :model="searchForm" :inline="true" size="small"
             @submit.native.prevent>
      <el-form-item prop="idInstitution">
        <el-input v-model.trim="searchForm.idInstitution" clearable placeholder="场馆名称"></el-input>
      </el-form-item>
      <el-form-item prop="name">
        <el-input v-model.trim="searchForm.name" clearable placeholder="空间名称"></el-input>
      </el-form-item>
      <!--<el-form-item prop="userFor">
        <el-select v-model="searchForm.userFor" clearable placeholder="请选择空间用途">
          <el-option :label="item.label" :value="item.value" v-for="item in usefor"
                     :key="item.key"></el-option>
        </el-select>
      </el-form-item>-->
      <el-form-item prop="spaceType">
        <el-select v-model="searchForm.spaceType" clearable placeholder="空间类型">
          <el-option :label="item.label" :value="item.value" v-for="item in spaceType"
                     :key="item.key"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item prop="examineStatus">
        <el-select v-model="searchForm.examineStatus" clearable placeholder="审核状态">
          <el-option :label="item.label" :value="item.value" v-for="item in examineStatusList"
                     :key="item.key"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="publishStatus">
        <el-select v-model="searchForm.publishStatus" clearable placeholder="发布状态">
          <el-option :label="item.label" :value="item.value" v-for="item in publishStatusList"
                     :key="item.key"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="isAccessControl">
        <el-select v-model="searchForm.isAccessControl" clearable placeholder="空间门禁">
          <el-option :label="item.label" :value="item.value" v-for="item in doorLockList"
                     :key="item.key"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="querySearchForm"><i class="fa-fw fa fa-search"></i>查询</el-button>
        <!--        <el-button-->
        <!--          size="small"-->
        <!--          type="primary"-->
        <!--         ><i class="fa fa-pencil-square-o fa-fw"></i>导出</el-button>-->
        <el-button @click="resetSearchForm"><i class="fa-fw fa fa-repeat"></i>重置</el-button>
      </el-form-item>
    </el-form>
    <section class="list-wraper">
      <el-row class="btn-wraper">
        <el-button size="small" type="primary" @click="handleAdd" v-if="hasButton('space_add')"><i
          class="fa-fw fa fa-plus"></i>新增空间
        </el-button>
        <el-button size="small" type="primary" v-if="hasButton('space_send_audit')" @click="handleSendOut(currentSelect)"><i class="fa fa-bookmark fa-fw"></i>发送审核</el-button>
        <el-button
          size="small"
          type="primary" v-if="hasButton('space_export')"
          @click="handleExport()"><i class="fa fa-pencil-square-o fa-fw"></i>导出</el-button>
        <!--        <el-button size="small" type="primary" @click="handleAdd" v-if="hasButton('basics_venue_add')"><i class="fa fa-trash-o fa-fw"></i>批量删除</el-button>-->
        <!--        <el-button size="small" type="primary" @click="handleAdd" v-if="hasButton('basics_venue_add')">批量发布</el-button>-->
      </el-row>
      <el-row class="table-wraper">
        <template>
          <!--          @selection-change="handleSelectionChange"-->
          <el-table
            ref="multipleTable"
            :data="tableData"
            stripe border
            :header-cell-class-name="selectText"
            @current-change="handleCurrentChange"
            @selection-change="handleSelectionChange"
            style="width: 100%">
          <el-table-column
              type="selection"
              width="55">
            </el-table-column>
            <el-table-column
              prop="name"
              label="空间名称"
              width="120">
            </el-table-column>
            <el-table-column
              prop="venueName"
              label="场馆名称"
              width="120">
            </el-table-column>
            <el-table-column
              label="空间位置"
              show-overflow-tooltip>
              <template slot-scope="scope">
                <div>{{scope.row.constructName}}{{scope.row.constructFloor}}{{scope.row.address}}</div>
              </template>
            </el-table-column>
            <el-table-column
              prop="spaceTypeName"
              label="空间类型"
              width="80">
            </el-table-column>
            <el-table-column
              prop="examineStatusName"
              label="审核状态"
              width="80">
            </el-table-column>
            <el-table-column
              prop="publishStatusName"
              label="发布状态"
              width="80">
            </el-table-column>
            <el-table-column label="操作" width="400">
              <template slot-scope="scope">
                <el-button size="mini" type="primary" v-if="scope.row.examineStatus == 3 && hasButton('space_audit')" @click.stop="handleAudit(scope.row)"><i
                  class="fa fa-bookmark fa-fw"></i>审核
                </el-button>
                <el-button size="mini" type="warning" v-if="scope.row.publishStatus == 1 && scope.row.examineStatus == 1 && hasButton('space_audit')"
                           @click.stop="handleCancelRelease(scope.row)"><i class="fa fa-pencil fa-fw"></i>撤销
                </el-button>
                <el-button size="mini" type="primary" v-if="scope.row.publishStatus == 0 && scope.row.examineStatus == 1 && hasButton('space_release')"
                           @click.stop="handleRelease(scope.row)"><i class="fa fa-pencil fa-fw"></i>发布
                </el-button>

                <el-button size="mini" type="info" v-if="hasButton('space_look')" @click.stop="handleView(scope.row)"><i class="fa fa-eye fa-fw"></i>查看
                </el-button>

                <el-button size="mini" @click.stop="handleEdit(scope.row)" v-if="scope.row.publishStatus == 0 && hasButton('space_edit')"><i class="fa fa-pencil fa-fw"></i>编辑
                </el-button>
                <el-button size="mini" type="danger" @click.stop="handleDelete(scope.row)" v-if="scope.row.publishStatus == 0 && hasButton('space_delete')"><i
                  class="fa fa-trash-o fa-fw"></i>删除
                </el-button>
                <el-button size="mini" @click.stop="handleSetting(scope.row)" v-if="scope.row.publishStatus == 0 && hasButton('space_setup')"><i
                  class="fa fa-cog fa-fw"></i>设置
                </el-button>

              </template>
            </el-table-column>
          </el-table>
          <PageTemp :total="total" :pageSize="searchForm.pageSize" :currentPage="searchForm.pageNum"
                    @goSpecifiedPage="goSpecifiedPage"/>
        </template>
      </el-row>
    </section>
    <!--审核-->
        <AuditDialog :show.sync="dialogAuditShow" :id="dialogAuditId" @sure="handleAuditSure"></AuditDialog>
  </section>

</template>

<script>
  import {getSpacePage, delSpace, publishSpace, cancelpublishSpace,getSendAduit,exportExcel,SendAduit} from '@/api/clib/space'
  import AuditDialog from "@/views/components/AuditDialog.vue"
  import { downloading } from "@/utils/common";
  import {getDicListByTypeCode} from '@/api/config.js'
  import PageTemp from '@/components/PageTemp'
  export default {
    data() {
      return {
        dialogAuditShow: false,
        dialogAuditId:'',
        currentSelect:'',

        usefor: [],//空间用途
        spaceType: [], //空间类型
        examineStatusList:[],//审核状态
        publishStatusList:[],//发布状态
        doorLockList:[],//空间门禁

        searchForm: {
          pageNum: 1,
          pageSize: 10,
          // idInstitution:"",//场馆名称	是
          name: "",//空间名称	是
          applyType: "",	//预约类型	是
          applyWay: "",	//预约方式	是
          isAccessControl: "",	//是否有门禁	是
          userFor: "",	//空间用途	是
          spaceType: "",	//空间类型	是
          publishStatus: "",	//发布状态	是
        },
        tableData: [],
        multipleSelection: [],
        total: 0,
      }
    },
    components: {PageTemp, AuditDialog},
    methods: {
      handleCurrentChange(val){
        this.currentSelect = val.id ? val : {};
        this.$refs.multipleTable.toggleRowSelection(val)
      },

      handleSelectionChange(val){
        // console.log(val)
        setTimeout(()=>{
          if (val.length > 1) {
            this.$refs.multipleTable.clearSelection();
            this.$refs.multipleTable.toggleRowSelection(val.pop());
          }
          this.currentSelect = val.length ? val[0] : {};
        })
      },
      //导出
      handleExport(){
        const loading = this.$loading({
          lock: true,
          text: '文件生成中',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        let params = JSON.parse(JSON.stringify(this.searchForm));
        delete  params.pageNum;
        delete  params.pageSize;
        exportExcel(params).then(res=>{
          downloading(res)
          setTimeout(() => {
            loading.close();
          }, 2000);
        }).catch(()=>{
          loading.close();
        })
      },
      //发送审核
      handleSendOut(row){
        if(!row.id){
          this.$message.warning('请勾选一条记录')
          return
        }
        if(row.examineStatus == 1  ){
          this.$message.warning('该条数据已审核')
          return
        }
        if(row.examineStatus == 3 ){
          this.$message.warning('您已经发送了审核')
          return
        }

        if(row.examineStatus == 2 ){
          this.$message.warning('该条数据不通过，请修改后在发送')
          return
        }

        this.commonDeleteDialog(this.bannerSendExamine, row.id, '发送审核')
      },
      bannerSendExamine(id){
        SendAduit(id).then(res=>{
          if (res.code == 200) {
            this.$message.success("发送成功");
          }
        })
      },
      //查看空间
      handleView(row) {
        this.$router.push({
          params: {
            id: row.id
          },
          name: 'space_detail'
        })
      },
      //新增空间
      handleAdd() {
        this.$router.push({name: 'space_add'})
      },
      //编辑行
      handleEdit(row) {
        this.$router.push({name: 'space_edit', params: {id: row.id}})
      },
      handleDelete(row) {
        this.commonDeleteDialog(this.delSpace, row.id, '删除')
      },
      handleAudit(row){
        this.dialogAuditShow = true;
        this.dialogAuditId = row.id;
      },
      //审核
      handleAuditSure(e) {
        console.log(e)
        let data = e;
        data.idSource = data.id;
        getSendAduit(data).then(res=>{
          if(res.code == 200){
            this.$message.success('审核成功');
            this.getSpaceDataPage();
          }
          this.dialogAuditShow = false;
        })
      },
      //设置
      handleSetting(row) {
        this.$router.push({
          name: "space_setting",
          params: {id: row.id}
        })
      },
      //发布空间
      handleRelease(row) {
        let params = {};
        let text = "";
        params.id = row.id;
        // params.publishStatus = row.publishStatus == 1?0:1;
        text = '发布';
        this.commonDeleteDialog(this.releaseSpace, params, text);
      },
      // 取消发布
      handleCancelRelease(row) {
        let params = {};
        let text = "";
        params.id = row.id;
        text = '撤销发布';
        this.commonDeleteDialog(this.cancelpublishSpace, params, text);
      },
      //查询
      querySearchForm() {
        this.getSpaceDataPage()
      },
      //重置
      resetSearchForm() {
        this.searchForm.pageNum = 1;
        this.resetForm('searchForm');
        this.getSpaceDataPage();
      },
      resetForm(formName) {
        this.$refs[formName] && this.$refs[formName].resetFields();
      },

      //删除
      delSpace(dicNum) {
        // console.log("删除的ID===",dicNum)
        delSpace(dicNum).then(res => {
          if (res.code == 200) {
            this.$message.success('删除成功')
            this.getSpaceDataPage()
          }
        })
      },
      //发布
      releaseSpace(data) {
        publishSpace(data).then(res => {
          if (res.code == 200) {
            this.$message.success("发布成功");
            this.getSpaceDataPage()
          }
        })
      },
      //取消发布
      cancelpublishSpace(data) {
        cancelpublishSpace(data).then(res => {
          if (res.code == 200) {
            this.$message.success("撤销成功");
            this.getSpaceDataPage()
          }
        })
      },

      //分页
      goSpecifiedPage(val) {
        this.searchForm.pageNum = val;
        this.getSpaceDataPage()
      },

      //获取空间管理列表
      getSpaceDataPage() {
        getSpacePage(this.searchForm).then(res => {
          if (res.code == 200) {
            this.tableData = res.data.result;
            this.total = res.data.totalPages;
          }
          ;
        })
      },
      //数据词典
      getDicListByTypeCode(code, arr) {
        getDicListByTypeCode(code).then(res => {
          if (res.code == 200) {
            res.data.forEach(item => {
              arr.push({
                key: item.valueName + item.value,
                value: item.value,
                label: item.valueName
              })
            })
          }
          ;
        })
      },
    },
    created() {
      //列表
      this.getSpaceDataPage();
      // 数据字典
      /*this.getDicListByTypeCode('spaceUse',this.usefor); */    //空间用途
      this.getDicListByTypeCode(this.$dicts.spaceType, this.spaceType);//空间类型
      this.getDicListByTypeCode(this.$dicts.examineStatus, this.examineStatusList);//审核状态
      this.getDicListByTypeCode(this.$dicts.publishStatus, this.publishStatusList);//空间类型
      this.getDicListByTypeCode(this.$dicts.doorLock, this.doorLockList);//空间门禁
    }
  };
</script>


<style lang="scss">
  .transfer-wraper {
    .el-transfer-panel {
      width: 320px;
    }
  }
</style>
