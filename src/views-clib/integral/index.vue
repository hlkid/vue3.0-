<template>
  <section class="view-container">
    <el-form class="search-form" ref="searchForm" :model="searchForm" :inline="true" size="small"
             @submit.native.prevent>

      <el-form-item prop="termCode">
        <el-select v-model="searchForm.termCode" placeholder="积分栏目">
          <el-option v-for="item in termOption" :key="item.key" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item prop="status">
        <el-select v-model="searchForm.status" clearable placeholder="积分状态">
          <el-option :label="item.label" :value="item.value" v-for="item in statusOptions"
                     :key="item.key"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item prop="integralType">
        <el-select v-model="searchForm.integralType" clearable placeholder="积分类型">
          <el-option :label="item.label" :value="item.value" v-for="item in typeOptions"
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
        <el-button size="small" type="primary" v-if="hasButton('integral_add')" @click="handleAdd"><i
          class="fa-fw fa fa-plus"></i>新增
        </el-button>
      </el-row>
      <el-row class="table-wraper">
        <template>
          <el-table
            ref="multipleTable"
            :data="tableData"
            stripe border
            style="width: 100%">
            <el-table-column
              prop="termCode"
              label="栏目编码"
              width="120">
            </el-table-column>
            <el-table-column
              prop="name"
              label="积分栏目">
            </el-table-column>
            <el-table-column
              prop="integralTypeName"
              label="积分类型"
              width="80">
            </el-table-column>
            <el-table-column
              label="状态"
              width="80">
              <template slot-scope="scope">
                <el-link type="danger" :underline="false" v-if="scope.row.status == 1">{{scope.row.statusName}}</el-link>
                <el-link type="primary" :underline="false" v-else>{{scope.row.statusName}}</el-link>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="300">
              <template slot-scope="scope">
                <el-button size="mini" type="primary" v-if="scope.row.status == 1 && hasButton('integral_edit')" @click="hanldEdid(scope.row)"><i
                class="fa fa-pencil fa-fw"></i>编辑
                </el-button>

                <el-button size="mini" type="primary" v-if="scope.row.status == 0 && hasButton('integral_apply')" @click="hanldApply(scope.row)"><i
                  class="fa fa-bookmark fa-fw"></i>绑定应用
                </el-button>

                <el-button size="mini" :type="scope.row.status == 1?'success':'info'" v-if="hasButton('integral_status')" @click="handleEndble(scope.row)"><i
                  class="fa fa-ban fa-fw"></i>{{scope.row.status == 1?'启用':'禁用'}}
                </el-button>

              </template>
            </el-table-column>
          </el-table>
          <PageTemp :total="total" :pageSize="searchForm.pageSize" :currentPage="searchForm.pageNum"
                    @goSpecifiedPage="goSpecifiedPage"/>
        </template>
      </el-row>
    </section>

    <el-dialog :title="dialogType=='add'?'新增':'修改'" :visible.sync="addDialogShow" width="400px">
      <el-form ref="queryForm" :model="queryForm" class="dialog-from" :rules="rules" size="small" label-position="right" label-width="80px">
        <el-form-item label="积分栏目" prop="termCode">
<!--          <el-input v-model="queryForm.name" autocomplete="off"></el-input>-->
          <el-select v-model="queryForm.termCode" placeholder="积分栏目" :disabled="dialogType=='add'?false:true" @change="termChange">
            <el-option v-for="item in termOption" :key="item.key" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="积分类型" prop="integralType">
          <el-select v-model="queryForm.integralType">
            <el-option :label="item.label" :value="item.value" :key="item.key" v-for="item in typeOptions"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogShow = false">取 消</el-button>
        <el-button type="primary" @click="dialogSure">确 定</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
  import PageTemp from '@/components/PageTemp'
  import {
    getIntegralTermStatusList,
    getIntegralTypeList,
    getTermConfigPage,addTermConfig,editTermConfig,
    setTermConfigState,getIntegralTermList
  } from '@/api/clib/integral'

  export default {
    components: { PageTemp },
    data () {
      return {
        searchForm: {
          pageNum: 1,
          pageSize: 10,
          termCode:"",//	积分规则编码	是	[string]		查看
          status:"",//	积分状态	是	[string]
          integralType:'',//	积分类型	是	[string]
        },
        tableData: [],
        total: 0,

        addDialogShow: false,
        dialogType:'add',
        queryForm: {
          name: '',
          termCode: '',
          integralType: ''
        },
        rules:{
          termCode: [{ required: true, message: "请输入积分编码" }],
          integralType: [{ required: true, message: "请选择积分类型" }],
        },

        statusOptions: [],//积分状态
        typeOptions: [],//积分类型
        termOption:[], //积分项列表
      }
    },
    created () {
      this.getIntegralTermStatusList();
      this.getIntegralTypeList();
      this.getTermConfigPage();
      this.getIntegralTermList();
    },
    methods: {
      // 重置
      resetSearchForm(){
        this.searchForm.pageNum = 1;
        this.$refs.searchForm && this.$refs.searchForm.resetFields();
        this.getTermConfigPage();
      },
      //查询
      querySearchForm () {
        this.searchForm.pageNum = 1;
        this.getTermConfigPage();
      },
      //分页
      goSpecifiedPage (val) {
        this.searchForm.pageNum = val;
        this.getTermConfigPage();
      },
      //新增
      handleAdd() {
        this.$delete(this.queryForm,'id');
        Object.keys(this.queryForm).forEach( key => {
          this.queryForm[key] = ''
        });
        this.addDialogShow = true;
        this.dialogType = 'add';
      },
      // 修改
      hanldEdid(row) {
        Object.keys(this.queryForm).forEach(key => {
          this.queryForm[key] = row[key]
        });
        this.addDialogShow = true;
        this.$set(this.queryForm,'id',row.id);
        this.dialogType = 'edit';
      },

      //修改 新增提交
      dialogSure(){
        this.$refs.queryForm.validate(valid => {
          if (valid) {
            this.dialogType == 'add' && this.addTermConfig();
            this.dialogType == 'edit' && this.editTermConfig();
          }
        })
      },
      //绑定应用
      hanldApply(row) {
        this.$router.push({
          name:'integral_apply',
          params:{id : row.id}
        })
      },
      //启用/禁用
      handleEndble(row){
        let that = this;
        setTermConfigState({
          id:row.id,
          status:row.status==1?0:1
        }).then(res => {
          if(res.code == 200){
            that.$message.success("修改成功");
            that.getTermConfigPage();
          }
        })
      },
      termChange(id){
        let obj = this.termOption.find(e => e.value == id);
        if(obj){
          this.queryForm.name = obj.label;
        }
      },

      /*---接口请求-----*/
      //新增积分
      addTermConfig(){
        let that = this;
        addTermConfig(this.queryForm).then(res => {
            if(res.code == 200){
              that.$message.success("新增成功");
              that.searchForm.pageNum = 1;
              that.addDialogShow = false;
              that.getTermConfigPage();
            }
        })
      },

      editTermConfig(){
        let that = this;
        editTermConfig(this.queryForm).then(res => {
            if(res.code == 200){
              that.$message.success("修改成功");
              that.addDialogShow = false;
              that.searchForm.pageNum = 1;
              that.getTermConfigPage();
            }
        })
      },

      //list
      getTermConfigPage() {
        getTermConfigPage(this.searchForm).then(res => {
          if (res.code == 200) {
            this.tableData = res.data.result;
            this.total = res.data.totalPages;
          }

        })
      },
      //  获取积分状态列表
      getIntegralTermStatusList () {
        let that = this;
        getIntegralTermStatusList().then(res => {
          if (res.code == 200) {
            that.statusOptions = res.data.map(e => {
              e.label = e.message;
              e.value = e.code;
              e.key = e.code+e.message;
              return e
            });
          }
        })
      },
      //积分项列表
      getIntegralTermList() {
        let that = this;
        getIntegralTermList().then(res => {
          if(res.code == 200){
            that.termOption = res.data.map(e => {
              e.label = e.message;
              e.value = e.code;
              e.key = e.code + e.message;
              return e;
            })
          }
        })
      },
      //获取积分类型列表
      getIntegralTypeList () {
        let that = this;
        getIntegralTypeList().then(res => {
          if (res.code == 200) {
            that.typeOptions = res.data.map(e => {
              e.label = e.message;
              e.value = e.code;
              e.key = e.code+e.message;
              return e
            });
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .dialog-from{
    .el-select{
      width: 100%;
    }
  }


</style>
