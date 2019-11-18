<template>
  <section class="view-container">
    <el-form class="search-form" ref="searchForm" :model="searchForm" :inline="true" size="small" @submit.native.prevent>
      <el-form-item prop="idInstitution">
        <el-input v-model.trim="searchForm.idInstitution" clearable placeholder="请输入场馆名称"></el-input>
      </el-form-item>
      <el-form-item prop="name">
        <el-input v-model.trim="searchForm.name" clearable placeholder="请输入空间名称"></el-input>
      </el-form-item>
      <el-form-item prop="userFor">
        <el-select v-model="searchForm.userFor" clearable placeholder="请选择空间用途">
          <el-option :label="item.label" :value="item.value" v-for="item in usefor"
                     :key="item.key"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="spaceType">
        <el-select v-model="searchForm.spaceType" clearable placeholder="请选择空间类型">
          <el-option :label="item.label" :value="item.value" v-for="item in spaceType"
                     :key="item.key"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="publishStatus">
        <el-select v-model="searchForm.publishStatus" placeholder="请选择发布状态">
          <el-option
            v-for="item in [{'label':'未发布',value:'0'},{'label':'已发布',value:'1'}]"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="querySearchForm"><i class="fa-fw fa fa-search"></i>查询</el-button>
        <el-button @click="resetSearchForm"><i class="fa-fw fa fa-repeat"></i>重置</el-button>
      </el-form-item>
    </el-form>
    <section class="list-wraper">
      <el-row class="table-wraper">
        <template>
          <!--          @selection-change="handleSelectionChange"-->
          <el-table
            ref="multipleTable"
            :data="tableData"
            stripe border
            tooltip-effect="dark"
            style="width: 100%">
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
              prop="updateTime"
              label="删除时间"
              width="120">
            </el-table-column>
            <el-table-column
              prop="updateBy"
              label="删除经办人"
              show-overflow-tooltip>
            </el-table-column>
            <el-table-column label="操作" width="120" >
              <template slot-scope="scope">
                <el-button size="mini" type="danger" v-if="hasButton('space_recovery')" @click.stop="handleDelete(scope.row)"><i class="fa fa-trash-o fa-fw"></i>恢复删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <PageTemp :total="total" :pageSize="searchForm.pageSize" :currentPage="searchForm.pageNum" @goSpecifiedPage="goSpecifiedPage" />
        </template>
      </el-row>
    </section>

  </section>
</template>

<script>
  import { getRecycleSpacePage,cancelDelete,publishSpace,cancelpublishSpace} from '@/api/clib/space'
  import { getDicListByTypeCode,districtParentData,districtChildData,getUserData,getAttributeUser } from '@/api/config.js'
  import { fileDetail ,uploadFileUrl, getfiles} from '@/api/file.js'
  import PageTemp from '@/components/PageTemp'
  //空间用途
  const useforOptions = [
    {value:1,label:'用途1'},
    {value:2,label:'用途2'},
    {value:3,label:'用途3'},
    {value:4,label:'用途4'}
  ];
  //空间类型
  const spaceTypeOptions = [
    {value:1,label:'类型1'},
    {value:2,label:'类型2'},
    {value:3,label:'类型3'},
    {value:4,label:'类型4'}
  ];
  //预约类型
  const applytype = [
    {value:1,label:'预约类型1'},
    {value:2,label:'预约类型2'},
    {value:3,label:'预约类型3'},
    {value:4,label:'预约类型4'}
  ];

  //预约方式
  const applyway = [
    {value:1,label:'预约方式1'},
    {value:2,label:'预约方式2'},
    {value:3,label:'预约方式3'},
    {value:4,label:'预约方式4'}
  ];
  export default {
    data(){
      return{
        usefor:useforOptions,//空间用途
        spaceType: spaceTypeOptions, //空间类型
        applytype:applytype,//预约类型
        applyway:applyway,//预约方式
        searchForm:{
          pageNum:1,
          pageSize:10,
          // idInstitution:"",//场馆名称	是
          name:"",//空间名称	是
          applyType:"",	//预约类型	是
          applyWay:"",	//预约方式	是
          isAccessControl:1,	//是否有门禁	是
          userFor:"",	//空间用途	是
          spaceType:"",	//空间类型	是
          publishStatus:"",	//发布状态	是
        },
        tableData: [],
        multipleSelection: [],
        total:0,
      }
    },
    components:{PageTemp},
    methods:{
      //查看空间
      handleView(row){
        this.$router.push({
          params:{
            id:row.id
          },
          name:'space_detail'
        })
      },


      //新增空间
      handleAdd(){
        this.$router.push({name:'space_add'})
      },
      //编辑行
      handleEdit(row){
        this.$router.push({name:'space_edit',params:{id:row.id}})
      },
      handleDelete(row){
        this.commonDeleteDialog(this.delSpace,row.id,'取消删除')
      },
      //审核
      handleAudit(row){
        this.commonDeleteDialog(this.auditVenue,{
          id:row.id,
          examineStatus:1
        },'审核')
      },
      //发布空间
      handleRelease(row){
        let params = {};
        let text = "";
        params.id = row.id;
        // params.publishStatus = row.publishStatus == 1?0:1;
        text = '发布';
        this.commonDeleteDialog(this.releaseSpace,params,text);
      },
      // 取消发布
      handleCancelRelease(row){
        let params = {};
        let text = "";
        params.id = row.id;
        text =  '撤销发布';
        this.commonDeleteDialog(this.cancelpublishSpace,params,text);
      },
      //查询
      querySearchForm(){
        this.getSpaceDataPage()
      },
      //重置
      resetSearchForm(){
        this.searchForm.pageNum = 1;
        this.resetForm('searchForm');
        this.getSpaceDataPage();
      },
      resetForm(formName) {
        this.$refs[formName] && this.$refs[formName].resetFields();
      },

      //删除
      delSpace(dicNum){
        cancelDelete(dicNum).then(res=>{
          if (res.code == 200){
            this.$message.success('恢复成功')
            this.getSpaceDataPage()
          }
        })
      },
      //审核
      auditVenue(data){
        auditVenue(data).then(res=>{
          if (res.code == 200){
            this.$message.success('审核成功')
            this.getSpaceDataPage()
          }
        })
      },
      //发布
      releaseSpace(data){
        publishSpace(data).then(res=>{
          if (res.code == 200){
            this.$message.success("发布成功");
            this.getSpaceDataPage()
          }
        })
      },
      //取消发布
        cancelpublishSpace(data){
          cancelpublishSpace(data).then(res=>{
            if (res.code == 200){
              this.$message.success("撤销成功");
              this.getSpaceDataPage()
            }
          })
        },

      //分页
      goSpecifiedPage(val){
        this.searchForm.pageNum = val;
        this.getSpaceDataPage()
      },

      //获取空间管理列表
      getSpaceDataPage(){
        getRecycleSpacePage(this.searchForm).then(res=>{
          if (res.code == 200){
            this.tableData = res.data.result;
            this.total = res.data.totalPages;
          };
        })
      },
      //数据词典
      getDicListByTypeCode(code,arr){
        getDicListByTypeCode(code).then(res=>{
          if (res.code == 200){
            res.data.forEach(item=>{
              arr.push({
                key:item.valueName+item.value,
                value:item.value,
                label:item.valueName
              })
            })
          };
        })
      },
    },
    created() {
      //列表
      this.getSpaceDataPage();
      // 数据字典
      // this.getDicListByTypeCode('venueLevel',this.levelList);
    }
  };
</script>


<style lang="scss">
  .transfer-wraper{
    .el-transfer-panel{
      width: 320px;
    }
  }
</style>
