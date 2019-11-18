
<template>
  <section class="view-container">
    <el-form class="search-form" ref="searchForm"  :model="searchForm" :inline="true" size="small" @submit.native.prevent>
      <el-form-item prop="catalogName">
        <el-input clearable v-model.trim="searchForm.catalogName" placeholder="输入栏目名称"></el-input>
      </el-form-item>
      <el-form-item prop="publishStatus">
        <el-select v-model="searchForm.publishStatus" clearable placeholder="请选择发布状态">
          <el-option
            v-for="item in publishStatus"
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
      <el-row class="btn-wraper">
        <el-button size="small" type="primary"  @click="handleAdd()" v-if="hasButton('add')"><i class="fa-fw fa fa-plus"></i>新增栏目</el-button>
<!--        <el-button-->
<!--          size="small"-->
<!--          type="primary"-->
<!--          @click="handleSendAudit(currentSelect)"-->
<!--          v-if="hasButton('auth')"-->
<!--        ><i class="fa fa-pencil fa-fw"></i>发送审核</el-button>-->
        <!--        <el-button-->
        <!--          size="small"-->
        <!--          type="primary"-->
        <!--          @click="handleSendAudit(currentSelect)"-->
        <!--          v-if="hasButton('extension')"-->
        <!--        >推广</el-button>-->
        <!--        <el-button-->
        <!--          size="small"-->
        <!--          type="primary"-->
        <!--          @click="handleSendAudit(currentSelect)"-->
        <!--          v-if="hasButton('remind')"-->
        <!--        >提醒审核</el-button>-->
      </el-row>
      <el-row class="table-wraper">
        <el-table
          ref="multipleTable"
          :data="tableData"
          tooltip-effect="dark"
          @current-change="handleCurrentChange"
          @selection-change="handleSelectionChange"
          row-key="id"
          style="width: 100%;" stripe border>
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            prop="catalogName"
            label="栏目名称"
          >
          </el-table-column>
          <el-table-column
            prop="catalogCode"
            label="栏目编码"
          >
          </el-table-column>
          <el-table-column
            prop="catalogSummary"
            label="栏目简述"
          >
          </el-table-column>
          <el-table-column
            prop="catalogTypeName"
            label="栏目类型"
          >
          </el-table-column>
          <el-table-column
            prop="browseVolume"
            label="浏览量"
          >
          </el-table-column>
          <el-table-column
            prop="supportSubscription"
            label="是否支持订阅"
            width="150"
          >
            <template slot-scope="scope">
              <el-link
                :underline="false"
                type="success"
                v-if="scope.row.supportSubscription == 0"
              >支持</el-link>
              <el-link
                :underline="false"
                type="danger"
                v-else
              >不支持</el-link>
            </template>
          </el-table-column>
          <el-table-column
            prop="subscriptionNum"
            label="已订阅数量"
          >
          </el-table-column>
          <el-table-column
            prop="status"
            label="发布状态"
            width="80"
          >
            <template slot-scope="scope">
              <el-link
                :underline="false"
                type="success"
                v-if="scope.row.publishStatus == 1"
              >已发布</el-link>
              <el-link
                :underline="false"
                type="danger"
                v-else
              >未发布</el-link>
            </template>
          </el-table-column>
          <el-table-column
            label="发布时间"
          >
            <template slot-scope="scope">{{ scope.row.createTime }}</template>
          </el-table-column>

          <el-table-column label="操作"  width="230">
            <template slot-scope="scope">
<!--              <el-button size="mini" type="info" @click.stop="handleView(scope.row)"  v-if="hasButton('look')"><i class="fa fa-eye fa-fw"></i>查看</el-button>-->
<!--              <el-button size="mini" type="primary" @click.stop="bookRecommend(scope.row)"  v-if="hasButton('book')"><i class="fa fa-pencil fa-fw"></i>图书管理</el-button>-->
              <el-button size="mini" @click.stop="handleEdit(scope.row)"  v-if="scope.row.publishStatus == 0 && hasButton('edit')"><i class="fa fa-pencil fa-fw"></i>编辑</el-button>
<!--              <el-button-->
<!--                size="mini"-->
<!--                type="primary"-->
<!--                @click.stop="handleAudit(scope.row)"-->
<!--                v-if="scope.row.examine_status==3 && hasButton('examine')"-->
<!--              ><i class="fa fa-pencil fa-fw"></i>审核</el-button>-->
<!--              scope.row.examine_status==1 &&-->
              <el-button
                size="mini"
                type="primary"
                @click.stop="handleRelease(scope.row)"
                v-if="hasButton('release')"
              ><i class="fa fa-pencil fa-fw"></i>{{ scope.row.publishStatus == 0 ? '发布' : '撤销'}}</el-button>
              <el-button
                size="mini"
                type="danger"
                v-if="scope.row.publishStatus == 0 && hasButton('delete')"
                @click.stop="handleDelete(scope.row)"
              ><i class="fa fa-trash-o fa-fw"></i>删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <PageTemp :total="total" :pageSize="searchForm.limit" :currentPage="searchForm.page" @goSpecifiedPage="goSpecifiedPage" />
      </el-row>
    </section>

  </section>
</template>

<script>
  import PageTemp from '@/components/PageTemp'
  import {getMoudle,changeMoudle,moudleDelete} from "@/api/clib/book";
  import { applicationDictionaryDataByTypeCode } from "@/api/config.js";
  /********模拟数据********/

    //发布状态
  const publishStatus = [
      {value:0,label:'未发布'},
      {value:1,label:'已发布'},
    ];

  /********模拟数据********/


  export default {
    data() {
      return {
        id:'',//编辑期次
        examineStatus:[], //审核状态筛选
        publishStatus:[], //发布状态筛选
        tableData: [], //表格列表
        total:0,
        multipleSelection: [],
        searchForm:{        //搜索条件
          page:1,
          limit:10,
          catalogName:'',     //栏目名称（筛选条件）
          publishStatus: '',       //发布状态
        },

      }
    },
    components:{PageTemp},
    methods:{
      //查询
      querySearchForm(){
        this.getList()
      },
      //重置
      resetSearchForm(){
        this.searchForm.page = 1;
        this.resetForm('searchForm');
        this.getList();
      },
      resetForm(formName) {
        this.$refs[formName] && this.$refs[formName].resetFields();
      },


      //列表
      getList(){
        getMoudle(this.searchForm).then(res=>{
          if (res.code == 200){
            this.tableData = res.page.list;
            this.total = res.page.totalCount;
          };
        })


      },
      //分页
      goSpecifiedPage(val){
        this.searchForm.page = val;
        this.getList()
      },
      //查看 type 为 1代表是查看
      handleView(row){
        this.$router.push({name:'book_famous_look',params:{type:1,id:row.id}})
      },
      //好书推荐
      bookRecommend(row){
        this.$router.push({name:'book_famous_manage_edit',params:{id:row.id}})
      },

      //操作按钮

      //新增
      handleAdd(){
        this.$router.push({name:'book_moudle_add'})
      },

      //编辑
      handleEdit(row){

        this.$router.push({
          params: {
            id: row.id
          },
          name: "book_moudle_edit"
        });

      },


      //删除好书推荐
      handleDelete(row){
        this.commonDeleteDialog(this.delete,row.id,'删除')
      },
      delete(id){
        moudleDelete({id:id}).then(res=>{
          if (res.code == 200){
            this.$message.success('删除成功')
            this.getList()
          }
        })
      },

      //新增期次  弹框保存按钮
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            var param = {};
            param = this.form;
            param.periodType = 0  //期次类型 馆员推荐 0 默认2
            console.log(param)
            save(param).then(res=>{
              if (res.code == 200){
                this.$message.success("保存成功");
                this.dialogVisible = false;
                this.getList();
              }
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },

      //编辑期次
      submitEditForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            var param = {};
            param.id = this.id;
            param.periodName = this.form.periodName
            update(param).then(res=>{
              if (res.code == 200){
                this.$message.success("保存成功");
                this.dialogVisible = false;
                this.getList();
              }
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },

      //发送审核
      handleSendAudit(row){
        if(!row.id){
          this.$message.warning('请勾选一条记录')
          return
        }
        if(row.examineStatus == 1  ){
          this.$message.warning('该期次已审核')
          return
        }
        if(row.examineStatus == 3 ){
          this.$message.warning('您已经发送了审核')
          return
        }

        // if(row.examineStatus == 2 ){
        //   this.$message.warning('该期次不通过，请修改后在发送')
        //   return
        // }

        this.commonDeleteDialog(this.send,{
          id:row.id
        },'发送审核')
      },
      send(data) {
        bookSendExamine(data).then(res => {
          if (res.code == 200) {
            this.$message.success("发送审核成功");
            this.getList();
          }
        });
      },

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


      //获取审核状态
      getStatus(){
        getAuthStatus().then(res=>{
          if (res.code == 200){
            this.examineStatus = res.data.map(e => {
              e.label = e.message;
              e.value = e.code;
              return e;
            });
          }
        })

      },


      //审核
      handleAudit(row) {
        this.$confirm('是否确认审核?', '温馨提示', {
          distinguishCancelAndClose: true,
          cancelButtonText:'审核不通过',
          confirmButtonText:'审核通过',
          type:'warning',
          center:true,
        }).then(() => {
          this.audit(row,1,"");
        }).catch(() => {
          this.$prompt('请输入审核不通过的原因','提示',{
            confirmButtonText: '确定',
            cancelButtonText: '取消',
          }).then((value)=>{
            this.audit(row,2,value.value,)
            console.log("审核不通过填写的理由")
          }).catch(()=>{})
        });
      },
      audit(data,examineStatus,examineOpinion) {
        bookExamine({id:data.id,examineStatus:examineStatus,examineOpinion:examineOpinion}).then(res => {
          if (res.code == 200) {
            if(data.id == 2){
              this.$message.success("保存成功");
            } else {
              this.$message.success("审核成功");
            }

            this.getList();
          }
        });
      },


      //发布/撤销发布
      handleRelease(row) {
        let that = this;
        let params = {};
        let text = "";
        params.id = row.id;
        params.status = row.publishStatus == 1 ? 0 : 1;
        text = row.publishStatus == 1 ? "撤销发布" : "发布";

        this.$confirm("是否确认" + text + "？", "温馨提示", {
          cancelButtonText: "取消",
          confirmButtonText: "确定",
          type: "",
          center: false
        })
          .then(() => {
            that.release(params);
          })
          .catch(() => {
            if (row.status == 1) {
              that.$message.info("已取消撤销发布");
            } else {
              that.$message.info("已取消发布");
            }
          });
      },
      release(data) {
        changeMoudle(data).then(res => {
          if (res.code == 200) {
            this.$message.success("发布成功");
            this.getList();
          }
        });
      },

      //数据词典
      applicationDictionaryDataByTypeCode(code, arr) {
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

    },
    created() {
      this.getList();
      this.applicationDictionaryDataByTypeCode(
        "publishStatus",
        this.publishStatus
      );
    },
  }

</script>


<style lang="scss">

</style>
