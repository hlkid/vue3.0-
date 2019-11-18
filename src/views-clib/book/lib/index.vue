
<template>
  <section class="view-container">
    <el-form class="search-form" ref="searchForm"  :model="searchForm" :inline="true" size="small" @submit.native.prevent>
      <el-form-item prop="periodName">
        <el-input clearable v-model.trim="searchForm.periodName" placeholder="输入栏目期次"></el-input>
      </el-form-item>
      <el-form-item prop="venueName">
<!--        <el-input clearable v-model.trim="searchForm.venueName" placeholder="输入场馆名称"></el-input>-->
        <el-select v-model="searchForm.instId"  clearable placeholder="请选择场馆">
          <el-option
            v-for="item in venueList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="examineStatus">
        <el-select v-model="searchForm.examineStatus"  clearable placeholder="请选择审核状态">
          <el-option
            v-for="item in examineStatus"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
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
        <el-button size="small" type="primary"  @click="handleAdd()" v-if="hasButton('add')"><i class="fa-fw fa fa-plus"></i>新增期次</el-button>
        <el-button
          size="small"
          type="primary"
          @click="handleSendAudit(currentSelect)"
          v-if="hasButton('auth')"
        ><i class="fa fa-pencil fa-fw"></i>发送审核</el-button>
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
            prop="periodName"
            label="栏目期次"
           >
          </el-table-column>
          <el-table-column
            prop="venueName"
            label="场馆名称"
          >
          </el-table-column>
          <el-table-column
            prop="examineStatus"
            label="审核状态"
            width="80">
            <template slot-scope="scope">
<!--              <el-link-->
<!--                :underline="false"-->
<!--                type="danger"-->
<!--                v-if="scope.row.examineStatus == 0"-->
<!--              >未审核</el-link>-->
<!--              <el-link-->
<!--                :underline="false"-->
<!--                type="success"-->
<!--                v-else-if="scope.row.examineStatus == 1"-->
<!--              >已审核</el-link>-->
<!--              <el-link-->
<!--                :underline="false"-->
<!--                type="success"-->
<!--                v-else-if="scope.row.examineStatus == 2"-->
<!--              >已发送</el-link>-->
<!--              <el-link-->
<!--                :underline="false"-->
<!--                type="danger"-->
<!--                v-else-->
<!--              >已驳回</el-link>-->
              <el-link
                :underline="false"
                type="success"
                v-if="scope.row.examineStatus == 1"
              >{{scope.row.examineStatusName}}</el-link>
              <el-link
                :underline="false"
                type="danger"
                v-else
              >{{scope.row.examineStatusName}}</el-link>
            </template>
          </el-table-column>
          <el-table-column
            prop="publishStatus"
            label="发布状态"
            width="80"
           >
            <template slot-scope="scope">
              <el-link
                :underline="false"
                type="success"
                v-if="scope.row.publishStatus == 1"
              >{{scope.row.publishStatusName}}</el-link>
              <el-link
                :underline="false"
                type="danger"
                v-else
              >{{scope.row.publishStatusName}}</el-link>
            </template>
          </el-table-column>
          <el-table-column
            label="发布时间"
            >
            <template slot-scope="scope">{{ scope.row.createTime }}</template>
          </el-table-column>

          <el-table-column label="操作"  width="400">
            <template slot-scope="scope">
              <el-button size="mini" type="info" @click.stop="handleView(scope.row)"  v-if="hasButton('look')"><i class="fa fa-eye fa-fw"></i>查看</el-button>
              <el-button size="mini" type="primary" @click.stop="bookRecommend(scope.row)"  v-if="scope.row.publishStatus==0 && hasButton('book')"><i class="fa fa-pencil fa-fw"></i>图书管理</el-button>
              <el-button size="mini" @click.stop="handleEdit(scope.row)"  v-if="scope.row.publishStatus==0 && hasButton('edit')"><i class="fa fa-pencil fa-fw"></i>编辑</el-button>
              <el-button
                size="mini"
                type="primary"
                @click.stop="handleAudit(scope.row)"
                v-if="scope.row.examineStatus==3 && hasButton('examine')"
              ><i class="fa fa-pencil fa-fw"></i>审核</el-button>
              <el-button
                size="mini"
                type="primary"
                @click.stop="handleRelease(scope.row)"
                v-if="scope.row.examineStatus==1 && hasButton('release')"
              ><i class="fa fa-pencil fa-fw"></i>{{ scope.row.publishStatus == 0 ? '发布' : '撤销'}}</el-button>
              <el-button
                size="mini"
                type="danger"
                v-if="scope.row.publishStatus==0 && hasButton('delete')"
                @click.stop="handleDelete(scope.row)"
              ><i class="fa fa-trash-o fa-fw"></i>删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <PageTemp :total="total" :pageSize="searchForm.limit" :currentPage="searchForm.page" @goSpecifiedPage="goSpecifiedPage" />
      </el-row>
    </section>

    <!--新增对话框-->
    <el-dialog :title="dialogType == 'add' ? '新增' : '编辑'" :visible.sync="dialogVisible" width="30%">
      <el-form ref="form"  :model="form"  :rules="rules"  @submit.native.prevent>
        <el-form-item label="所属场馆"  prop="institutionId">
          <el-select v-model="form.institutionId"  style="width: 75%;" v-if="dialogType=='add'">
            <el-option
              v-for="item in venueList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
            <el-select v-model="form.institutionId"  disabled style="width: 75%;" v-else>
              <el-option
                v-for="item in venueList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="栏目期次" prop="periodName">
          <el-input clearable v-model.trim="form.periodName" placeholder="请输入栏目期次" style="width: 75%;"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary"  @click="submitForm('form')" v-if="dialogType=='add'">保存</el-button>
        <el-button type="primary"  @click="submitEditForm('form')" v-else>保存</el-button>
      </span>
    </el-dialog>
    <!--新增对话框-->
  </section>
</template>

<script>
  import PageTemp from '@/components/PageTemp'
  import { getRecords,libList,getAuthStatus,save,sendExamine,examine,publish,deleteById,detail,update} from "@/api/clib/book";
  import { applicationDictionaryDataByTypeCode } from "@/api/config.js";
  import { getVenueData } from '@/api/mcc/venue.js'
  /********模拟数据********/

  //发布状态
  const publishStatus = [
    {value:0,label:'未发布'},
    {value:1,label:'已发布'},
  ];
  const instList = [
    {value:1,label:'场馆一'},
    {value:2,label:'场馆二'},
  ];

  /********模拟数据********/


  export default {
    data() {
      return {
        id:'',//编辑期次
        dialogVisible: false,
        dialogType:'add',
        examineStatus:[], //审核状态筛选
        publishStatus:[], //发布状态筛选
        venueList:[], //所属场馆
        tableData: [], //表格列表
        total:0,
        multipleSelection: [],
        searchForm:{        //搜索条件
          page:1,
          limit:10,
          periodName:"",    //期次名称
          // venueName:'',     //场馆名称
          instId:'',     //场馆ID
          examineStatus:'', //审核状态
          publishStatus: '',//发布状态
        },
        form:{ //新增表单
          institutionId:'',     //场馆编码
          periodName:"",   //期次名字
        },
        rules: {
          periodName: [
            { required: true, message: '请输入期次名称', trigger: 'blur' },
          ],
          institutionId: [
            { required: true, message: '请选择所属场馆', trigger: 'blur' },
          ],
        },
        currentSelect:{}
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


      //馆员推荐列表
      getList(){
        libList(this.searchForm).then(res=>{
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
        this.$router.push({name:'book_lib_look',params:{type:1,id:row.id}})
      },
      //好书推荐
      bookRecommend(row){
        this.$router.push({name:'book_lib_edit',params:{id:row.id}})
      },

      //操作按钮

      //新增
      handleAdd(){
        this.dialogVisible = true;
        this.dialogType = 'add';
        for (let key in this.form){
          if(key == 'institutionId'){
            this.form[key] = this.venueList[0].value
          } else {
            this.form[key] = '';
          }
        };
        this.$nextTick(()=>{
          this.$refs['form'].clearValidate(); //移除校验结果
        })
      },

      //编辑
      handleEdit(row){
        this.dialogVisible = true;
        this.dialogType = 'edit';
        for (let key in this.form){
          this.form[key] = '';
        };
        this.$nextTick(()=>{
          this.$refs['form'].clearValidate(); //移除校验结果
        });

        this.getInfo(row.id);

      },

      // 查询详情
      getInfo(id){
        detail(id).then(res=>{
          if (res.code == 200){
            this.id = res.bookPeriod.id;
            for (let key in this.form){
              this.form[key] = res.bookPeriod[key];
            };
          };
        })
      },

      //删除好书推荐
      handleDelete(row){
        this.commonDeleteDialog(this.delete,row.id,'删除')
      },
      delete(id){
        deleteById({id:id}).then(res=>{
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
        //审核判断是否有图书记录
        this.getBook(row.id)

        // this.commonDeleteDialog(this.send,{
        //   id:row.id
        // },'发送审核')
      },
      // 图书列表记录
      getBook(id){
        getRecords({periodId:id}).then(res=>{
          if (res.code == 200){
            if (res.data.length < 1) {
              this.$message.error("请至少添加1本图书！")
              return;
            }
            this.commonDeleteDialog(this.send,{
              id:id
            },'发送审核')
          }
        })
      },
      send(data) {
        sendExamine(data).then(res => {
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
        examine({id:data.id,examineStatus:examineStatus,examineOpinion:examineOpinion}).then(res => {
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
        params.publishStatus = row.publishStatus == 1 ? 0 : 1;
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
            if (row.publishStatus == 1) {
              that.$message.info("已取消撤销发布");
            } else {
              that.$message.info("已取消发布");
            }
          });
      },
      release(data) {
        publish(data).then(res => {
          if (res.code == 200) {
            this.$message.success("发布成功");
            this.getList();
          }
        });
      },
      //获取场馆列表
      getVenueData(params){
        getVenueData(params).then(res=>{
          if (res.code == 200){
            res.data.forEach(item => {
              this.venueList.push({
                value: item.id,
                label: item.name
              });
            });
          };
        })
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
      this.getStatus();
      this.applicationDictionaryDataByTypeCode(
        "publishStatus",
        this.publishStatus
      );
      this.getVenueData()
    },
  }

</script>


<style lang="scss">

</style>
