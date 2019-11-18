<template>
  <section class="view-container">
    <el-form class="search-form" ref="searchForm" :model="searchForm" :inline="true" size="small" @submit.native.prevent>
      <el-form-item prop="name">
        <el-input v-model.trim="searchForm.name" clearable placeholder="名称"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="querySearchForm"><i class="fa-fw fa fa-search"></i>查询</el-button>
        <el-button @click="resetSearchForm"><i class="fa-fw fa fa-repeat"></i>重置</el-button>
      </el-form-item>
    </el-form>

    <section class="list-wraper">
      <el-row class="btn-wraper">
        <el-button size="small" type="primary" @click="handleAdd" v-if="hasButton('config_group_add')"><i class="fa-fw fa fa-plus"></i>添加</el-button>
      </el-row>
      <el-row class="table-wraper">
        <template>
          <el-table
            ref="multipleTable"
            :data="tableData"
            row-key="id"
            style="width: 100%;" stripe border>
            <el-table-column
              prop="name"
              label="名称">
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="remark"
              label="备注">
            </el-table-column>
            <el-table-column label="操作" width="310">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  @click="handleEdit(scope.row)" v-if="hasButton('config_group_edit')"><i class="fa fa-pencil fa-fw"></i>编辑</el-button>
                <el-button
                  size="mini"
                  type="danger"
                  @click="handleDelete(scope.row)" v-if="hasButton('config_group_delete')"><i class="fa fa-trash-o fa-fw"></i>删除</el-button>
                <el-button
                  size="mini"
                  type="primary"
                  @click="handleBindUser(scope.row)" v-if="hasButton('config_group_bindUser')"><i class="fa fa-pencil fa-fw"></i>绑定用户</el-button>
                <el-button
                  size="mini"
                  type="primary"
                  @click="handleBindApp(scope.row)" v-if="hasButton('config_group_bindApp')"><i class="fa fa-pencil fa-fw"></i>绑定应用</el-button>
              </template>
            </el-table-column>
          </el-table>
          <PageTemp :total="total" :pageSize="searchForm.pageSize" :currentPage="searchForm.pageNum" @goSpecifiedPage="goSpecifiedPage" />
        </template>
      </el-row>
    </section>

    <!--添加-->
    <el-dialog :title="dialogType == 'add' ? '添加' : '编辑'" :visible.sync="dialogShow" width="550px" :close-on-click-modal="false" :append-to-body='true'>
      <el-form class="dialog-form" ref="dialogForm" :model="dialogForm" label-width="100px" :rules="rules" >
        <el-form-item label="名称" prop="name">
          <el-input v-model.trim="dialogForm.name" clearable></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="dialogForm.remark" type="textarea" placeholder="请输入备注"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogShow = false">取 消</el-button>
        <el-button type="primary" :disabled="vloading" @click="sure">确 定</el-button>
      </div>
    </el-dialog>

    <!--绑定用户-->
    <BindUser :show.sync="dialogBindUserShow" :idSysGroup="currentGroupId"></BindUser>
    <!--绑定应用-->
    <BindApp :show.sync="dialogBindAppShow" :idSysGroup="currentGroupId"></BindApp>
  </section>
</template>

<script>
  import { getSysGroupDataPage, sysGroupUpdate, sysGroupCreate, sysGroupDetail, sysGroupDelete } from '@/api/config.js'
  import PageTemp from '@/components/PageTemp'
  import BindApp from './components/BindApp.vue'
  import BindUser from './components/BindUser.vue'

  export default {
    components:{PageTemp,BindApp,BindUser},
    data() {
      return {
        // 绑定应用
        dialogBindUserShow: false,
        dialogBindAppShow: false,
        currentGroupId: '',

        //检索条件
        searchForm:{
          pageNum:1,
          pageSize:10,
          name:''
        },

        tableData:[],
        total:0,

        dialogShow:false,
        dialogType:'add',
        dialogForm:{
          id:'',name:'',remark:''
        },
        rules:{
          name:[{ required: true, message: '请输入名称'}],
          remark:[{ required: false, message: '请备注'}]
        },

      }
    },
    methods: {
      handleBindUser(row){
        this.dialogBindUserShow = true;
        this.currentGroupId = row.id;
      },
      handleBindApp(row){
        this.dialogBindAppShow = true;
        this.currentGroupId = row.id;
      },
      //查询
      querySearchForm(){
        this.getSysGroupDataPage()
      },
      //重置
      resetSearchForm(){
        this.searchForm.pageNum = 1;
        this.resetForm('searchForm');
        this.getSysGroupDataPage();
      },
      resetForm(formName) {
        this.$refs[formName] && this.$refs[formName].resetFields();
      },
      //操作按钮
      handleAdd(){
        this.dialogShow = true;
        this.dialogType = 'add';
        for (let key in this.dialogForm){
          this.dialogForm[key] = '';
        };
        this.$nextTick(()=>{
          this.$refs['dialogForm'].clearValidate(); //移除校验结果
        })
      },
      handleEdit(row){
        this.dialogShow = true;
        this.dialogType = 'edit';
        for (let key in this.dialogForm){
          this.dialogForm[key] = row[key];
        }
      },
      handleDelete(row){
        this.commonDeleteDialog(this.sysGroupDelete,row.id,'删除')
      },

      sure(){
        this.$refs['dialogForm'].validate((valid) => {
          if (valid) {
            this.dialogType == 'add' && this.sysGroupCreate();
            this.dialogType == 'edit' && this.sysGroupUpdate();
          }
        })
      },
      //分页
      goSpecifiedPage(val){
        this.searchForm.pageNum = val;
        this.getSysGroupDataPage()
      },
      /*-新增-*/
      sysGroupCreate(){
        let params =  this.dialogForm;
        delete  params.id;
        // console.log(params)
        sysGroupCreate(params).then(res=>{
          if (res.code == 200){
            this.$message.success('添加成功')
            this.dialogShow = !this.dialogShow;
            this.getSysGroupDataPage()
          }
        })
      },
      // 编辑
      sysGroupUpdate(){
        sysGroupUpdate(this.dialogForm).then(res=>{
          if (res.code == 200){
            this.$message.success('编辑成功')
            this.dialogShow = !this.dialogShow;
            this.getSysGroupDataPage();
          }
        })
      },
      // 分页查询
      getSysGroupDataPage(){
        getSysGroupDataPage(this.searchForm).then(res=>{
          if (res.code == 200){
            this.tableData = res.data.result;
            this.total = res.data.totalPages;
          };
        })
      },
      // 删除
      sysGroupDelete(id){
        sysGroupDelete(id).then(res=>{
          if (res.code == 200){
            this.$message.success('删除成功')
            this.getSysGroupDataPage()
          }
        })
      },

      // 查询详情
      sysGroupDetail(id){
        sysGroupDetail(id).then(res=>{
          if (res.code == 200){
            for (let key in this.dialogForm){
              this.dialogForm[key] = res.data[key];
            };
          };
        })
      }

    },
    created(){
      this.getSysGroupDataPage();
    }
  }
</script>

<style scoped>

</style>
