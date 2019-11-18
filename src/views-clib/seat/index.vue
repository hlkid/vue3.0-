<template>
  <section class="view-container">
    <el-form class="search-form" ref="searchForm" :model="searchForm" :inline="true" size="small"
             @submit.native.prevent>
      <el-form-item prop="name">
        <el-input v-model.trim="searchForm.name" clearable placeholder="请输入空间名称"></el-input>
      </el-form-item>
      <el-form-item prop="userFor">
        <el-select v-model="searchForm.userFor" clearable placeholder="发布状态">
          <el-option :label="item.label" :value="item.value" v-for="item in usefor"
                     :key="item.key"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="spaceType">
        <el-select v-model="searchForm.spaceType" clearable placeholder="预约状态">
          <el-option :label="item.label" :value="item.value" v-for="item in spaceType"
                     :key="item.key"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="querySearchForm"><i class="fa-fw fa fa-search"></i>查询</el-button>
        <el-button @click="resetSearchForm"><i class="fa-fw fa fa-repeat"></i>重置</el-button>
      </el-form-item>
    </el-form>
    <section class="list-wraper">
      <el-row class="btn-wraper">
        <el-button size="small" type="primary" @click="handleAdd" v-if="hasButton('basics_venue_add')"><i
          class="fa-fw fa fa-plus"></i>统一设置
        </el-button>
      </el-row>
      <el-row class="table-wraper">
        <template>
          <!--          @selection-change="handleSelectionChange"-->
          <el-table
            ref="multipleTable"
            :data="tableData"
            stripe border
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
              prop="idInstitution"
              label="循环开放时间">
            </el-table-column>

            <el-table-column
              label="座位数"
              width="120">
            </el-table-column>
            <el-table-column
              prop="publishStatus"
              label="预约状态"
              width="80">
              <template slot-scope="scope">
                <el-link :underline="false" type="success" v-if="scope.row.publishStatus == 1">已发布</el-link>
                <el-link :underline="false" type="danger" v-else>未发布</el-link>
              </template>
            </el-table-column>
            <el-table-column
              prop="publishStatus"
              label="发布状态"
              width="80">
              <template slot-scope="scope">
                <el-link :underline="false" type="success" v-if="scope.row.publishStatus == 1">已发布</el-link>
                <el-link :underline="false" type="danger" v-else>未发布</el-link>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="400">
              <template slot-scope="scope">
                <el-button size="mini" type="primary" @click.stop="dialogAuditShow = true"><i class="fa fa-pencil fa-fw"></i>审核</el-button>
                <el-button size="mini" type="info" @click.stop="handleView(scope.row)"><i class="fa fa-eye fa-fw"></i>查看
                </el-button>
                <el-button size="mini" type="warning" v-if="scope.row.publishStatus==1"
                           @click.stop="handleCancelRelease(scope.row)"><i class="fa fa-pencil fa-fw"></i>已发布
                </el-button>
                <el-button size="mini" type="primary" v-if="scope.row.publishStatus==0"
                           @click.stop="handleRelease(scope.row)"><i class="fa fa-pencil fa-fw"></i>发布
                </el-button>
                <el-button size="mini" @click.stop="handleEdit(scope.row)"><i class="fa fa-pencil fa-fw"></i>编辑
                </el-button>
                <el-button size="mini" type="danger" @click.stop="handleDelete(scope.row)"><i
                  class="fa fa-trash-o fa-fw"></i>删除
                </el-button>
                <el-button size="mini"  @click.stop="handleSetting(scope.row)"><i
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
    <!--    <AuditDialog :show.sync="dialogAuditShow" :id="dialogAuditId" @sure="handleAuditSure"></AuditDialog>-->
  </section>

</template>

<script>
  import {getSeatDataPage, delSpace, publishSpace, cancelpublishSpace} from '@/api/clib/space'
  import AuditDialog from "@/views/components/AuditDialog.vue"
  import {
    getDicListByTypeCode,
    districtParentData,
    districtChildData,
    getUserData,
    getAttributeUser
  } from '@/api/config.js'
  import {fileDetail, uploadFileUrl, getfiles} from '@/api/file.js'
  import PageTemp from '@/components/PageTemp'
  //空间用途
  const useforOptions = [
    {value: 1, label: '用途1'},
    {value: 2, label: '用途2'},
    {value: 3, label: '用途3'},
    {value: 4, label: '用途4'}
  ];
  //空间类型
  const spaceTypeOptions = [
    {value: 1, label: '类型1'},
    {value: 2, label: '类型2'},
    {value: 3, label: '类型3'},
    {value: 4, label: '类型4'}
  ];
  //预约类型
  const applytype = [
    {value: 1, label: '预约类型1'},
    {value: 2, label: '预约类型2'},
    {value: 3, label: '预约类型3'},
    {value: 4, label: '预约类型4'}
  ];

  //预约方式
  const applyway = [
    {value: 1, label: '预约方式1'},
    {value: 2, label: '预约方式2'},
    {value: 3, label: '预约方式3'},
    {value: 4, label: '预约方式4'}
  ];
  export default {
    data() {
      return {
        dialogAuditShow:false,
        usefor: useforOptions,//空间用途
        spaceType: spaceTypeOptions, //空间类型
        applytype: applytype,//预约类型
        applyway: applyway,//预约方式
        searchForm: {
          pageNum: 1,
          pageSize: 10,
          // idInstitution:"",//场馆名称	是
          name: "",//空间名称	是
          applyType: "",	//预约类型	是
          applyWay: "",	//预约方式	是
          isAccessControl: 1,	//是否有门禁	是
          userFor: "",	//空间用途	是
          spaceType: "",	//空间类型	是
          publishStatus: "",	//发布状态	是
        },
        tableData: [],
        multipleSelection: [],
        total: 0,
      }
    },
    components: {PageTemp,AuditDialog},
    methods: {
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
      //审核
      handleAuditSure(e){

      },
      //设置
      handleSetting(row){
        this.$router.push({
          name:"space_setting",
          params:{id:row.id}
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
        this.getSeatDataPage()
      },
      //重置
      resetSearchForm() {
        this.searchForm.pageNum = 1;
        this.resetForm('searchForm');
        this.getSeatDataPage();
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
            this.getSeatDataPage()
          }
        })
      },
      //审核
      auditVenue(data) {
        auditVenue(data).then(res => {
          if (res.code == 200) {
            this.$message.success('审核成功')
            this.getSpaceDataPage()
          }
        })
      },
      //发布
      releaseSpace(data) {
        publishSpace(data).then(res => {
          if (res.code == 200) {
            this.$message.success("发布成功");
            this.getSeatDataPage()
          }
        })
      },
      //取消发布
      cancelpublishSpace(data) {
        cancelpublishSpace(data).then(res => {
          if (res.code == 200) {
            this.$message.success("撤销成功");
            this.getSeatDataPage()
          }
        })
      },

      //分页
      goSpecifiedPage(val) {
        this.searchForm.pageNum = val;
        this.getSeatDataPage()
      },

      //获取空间管理列表
      getSeatDataPage() {
       /* getSeatDataPage(this.searchForm).then(res => {
          if (res.code == 200) {
            this.tableData = res.data.result;
            this.total = res.data.totalPages;
          }
          ;
        })*/
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
      // this.getSeatDataPage();
      // 数据字典
      // this.getDicListByTypeCode('venueLevel',this.levelList);
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
