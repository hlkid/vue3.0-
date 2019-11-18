<template>
    <section class="view-container">
      <section class="tip-top">
        <p class="tip-title">积分规则</p>
        <div class="tip-box">
          <p>积分编码：{{detail.name}}</p>
          <p>积分栏目：{{detail.termCode}}</p>
          <p>积分类型：{{detail.integralTypeName}}</p>
        </div>
      </section>

      <el-form class="search-form" ref="searchForm" :model="searchForm" :inline="true" size="small"
               @submit.native.prevent>

        <el-form-item prop="hbAppId" >
          <el-select v-model="searchForm.hbAppId" placeholder="应用名称">
            <el-option v-for="item in hbAppList" :label="item.label" :value="item.value" :key="item.key"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="querySearchForm"><i class="fa-fw fa fa-search"></i>查询</el-button>
          <el-button @click="resetSearchForm"><i class="fa-fw fa fa-repeat"></i>重置</el-button>
        </el-form-item>
      </el-form>
      <section class="list-wraper">
        <el-row class="btn-wraper">
          <el-button size="small" type="primary" v-if="hasButton('integral_apply_add')" @click="handleAdd"><i
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
                prop="hbAppName"
                label="应用名称">
              </el-table-column>
              <el-table-column
                prop="singlePoint"
                label="单次积分">
              </el-table-column>
              <el-table-column
                prop="upperLimit"
                label="单日上限">
              </el-table-column>
              <el-table-column label="操作" width="200">
                <template slot-scope="scope">
                  <el-button size="mini" type="primary" v-if="hasButton('integral_apply_edit')" @click="handleEdit(scope.row)"><i
                    class="fa fa-bookmark fa-fw"></i>编辑
                  </el-button>

                  <el-button size="mini" type="primary" v-if="hasButton('integral_apply_unty')" @click="handleUnty(scope.row)"><i
                    class="fa fa-bookmark fa-fw"></i>解绑
                  </el-button>

                </template>
              </el-table-column>
            </el-table>
            <PageTemp :total="total" :pageSize="searchForm.pageSize" :currentPage="searchForm.pageNum"
                      @goSpecifiedPage="goSpecifiedPage"/>
          </template>
        </el-row>
      </section>

      <el-dialog title="绑定应用" :visible.sync="addDialogShow" width="400px">
        <el-form :model="queryForm" size="small"  class="dialog-from" label-position="right" label-width="80px">
          <el-form-item label="应用名称" >
            <el-select v-model="queryForm.hbAppId">
              <el-option v-for="item in hbAppList" :label="item.label" :value="item.value" :key="item.key"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="单次积分" >
            <el-input v-model="queryForm.singlePoint" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="单日上限" >
            <el-input v-model="queryForm.upperLimit" autocomplete="off"></el-input>
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
    getTermConfig,
    getConfigPage,
    addConfig,editConfig,deleteConfig
  } from '@/api/clib/integral'
  import { hbApplicationData } from '../../api/config'
  export default {
      components:{ PageTemp },
      data () {
        return {
          id:'',
          detail:{},
          searchForm: {
            pageNum: 1,
            pageSize: 10,
            hbAppId:"",//应用ID
          },
          tableData: [],
          total:0,

          addDialogShow:false,
          dialogType:'add',
          queryForm:{
            idIntegralTermConfig:'',
            hbAppId:'',
            singlePoint:'',
            upperLimit:''
          },
          //应用列表
          hbAppList:[],
        }
      },
      created () {
        this.id = this.$route.params.id;
        this.getTermConfig();
        this.getConfigPage();
        this.hbApplicationData();
      },
      methods:{
        //查询
        querySearchForm () {
          this.searchForm.pageNum = 1;
          this.getConfigPage();
        },
        //重置
        resetSearchForm () {
          this.searchForm.pageNum = 1;
          this.$refs.searchForm && this.$refs.searchForm.resetFields();
          this.getConfigPage();
        },
        //分页
        goSpecifiedPage(val) {
          this.searchForm.pageNum = val;
          this.getConfigPage();
        },
        // 编辑
        handleEdit(row) {
          Object.keys(this.queryForm).forEach( key => {
            this.queryForm[key] = row[key]
          });
          this.$set(this.queryForm,'id',row.id)
          this.dialogType = 'edit'
          this.addDialogShow = true;
        },
        // 新增
        handleAdd() {
          this.$delete(this.queryForm,'id');
          Object.keys(this.queryForm).forEach( key => {
              this.queryForm[key] = ''
          });
          this.queryForm.idIntegralTermConfig = this.id;
          this.dialogType = 'add'
          this.addDialogShow = true;
        },
        //解绑
        handleUnty(row) {
          deleteConfig(row.id).then(res => {
            if (res.code == 200) {
              this.$message.success("删除成功")
              this.getConfigPage();
            }
          })
        },
        //dialog确定
        dialogSure(){
          this.dialogType == 'edit' && this.editConfig();
          this.dialogType == 'add' && this.addConfig();
        },

        // 接口
        //新增
        addConfig() {
          addConfig(this.queryForm).then(res => {
            if(res.code == 200){
              this.searchForm.pageNum = 1;
              this.$message.success("新增成功")
              this.getConfigPage();
              this.addDialogShow = false;
            }
          })
        },
        //修改
        editConfig(){
          editConfig(this.queryForm).then(res=>{
            if(res.code == 200){
              this.$message.success("修改成功")
              this.getConfigPage();
              this.addDialogShow = false;
            }
          })

        },
        //详情
        getTermConfig(){
          let that = this;
          getTermConfig(this.id).then(res => {
            if(res.code == 200){
              that.detail = res.data
            }
          })
        },

        //条件查询应用积分规则
        getConfigPage () {
          let that = this;
          getConfigPage(this.searchForm).then(res => {
            if (res.code == 200 ) {
              that.tableData = res.data.result;
              that.total = res.data.totalPages;
            }
          })
        },
        //应用不分页查询
        hbApplicationData(){
          let that = this;
          hbApplicationData().then(res => {
            that.hbAppList = res.data.map(e => {
              e.label = e.name;
              e.value = e.appId
              e.key = e.id;
              return e;
            })
            console.log(that.hbAppList)
          })
        }
      }
    }
</script>

<style lang="scss" scoped>
  .tip-top{
    background: white;
    margin-top: 15px;
    padding: 20px;
    .tip-title{
      color: #333;
      font-size: 18px;
    }
    .tip-box{
      margin-top: 10px;
      p{
        width: 33%;
        display: inline-block;
        font-size: 14px;
        color: #999;
      }
    }
  }
  .dialog-from{
    .el-select{
      width: 100%;
    }
  }
</style>
