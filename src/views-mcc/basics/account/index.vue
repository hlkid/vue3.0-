<template>
  <section class="view-container">
    <el-form class="search-form" ref="searchForm" :model="searchForm" :inline="true" size="small" @submit.native.prevent>
      <el-form-item prop="name">
        <el-input v-model.trim="searchForm.name" clearable placeholder="名称"></el-input>
      </el-form-item>
      <el-form-item prop="type">
        <el-select v-model="searchForm.type" clearable placeholder="类型">
          <el-option :label="item.label" :value="item.value" v-for="item in typeList"
                     :key="'form'+item.key"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="querySearchForm"><i class="fa-fw fa fa-search"></i>查询</el-button>
        <el-button @click="resetSearchForm"><i class="fa-fw fa fa-repeat"></i>重置</el-button>
      </el-form-item>
    </el-form>

    <section class="list-wraper">
      <el-row class="btn-wraper">
        <el-button size="small" type="primary" @click="handleAdd" v-if="hasButton('basics_account_add')"><i class="fa-fw fa fa-plus"></i>添加</el-button>
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
              prop="appId"
              label="程序编号">
            </el-table-column>
            <el-table-column
              prop="appSecret"
              label="程序密钥">
            </el-table-column>
            <el-table-column
              prop="typeName"
              label="类型" width="150">
            </el-table-column>
            <el-table-column
              prop="signName"
              label="应用名称">
            </el-table-column>
            <el-table-column label="操作" width="220">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  @click="wechatAccountUpdatePublishStatus(scope.row)" v-if="hasButton('basics_account_publish')"><i class="fa fa-pencil fa-fw"></i>{{scope.row.publishStatus?'取消':''}}发布</el-button>

                <el-button
                  size="mini"
                  @click="handleEdit(scope.row)" v-if="hasButton('basics_account_edit')"><i class="fa fa-pencil fa-fw"></i>编辑</el-button>

                <el-button
                  size="mini"
                  type="danger"
                  @click="handleDelete(scope.row)" v-if="hasButton('basics_account_delete')"><i class="fa fa-trash-o fa-fw"></i>删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <PageTemp :total="total" :pageSize="searchForm.pageSize" :currentPage="searchForm.pageNum" @goSpecifiedPage="goSpecifiedPage" />
        </template>
      </el-row>
    </section>

    <!--添加-->
    <el-dialog :title="dialogType == 'add' ? '添加' : '编辑'" :visible.sync="dialogShow" width="750px" :close-on-click-modal="false" :append-to-body='true'>
      <el-form class="dialog-form" inline ref="dialogForm" :model="dialogForm" label-width="125px" :rules="rules" >
        <el-form-item label="名称" prop="name">
          <el-input v-model.trim="dialogForm.name" clearable></el-input>
        </el-form-item>

        <el-form-item label="程序编号" prop="appId">
          <el-input v-model.trim="dialogForm.appId" clearable></el-input>
        </el-form-item>

        <el-form-item label="程序密钥" prop="appSecret">
          <el-input v-model.trim="dialogForm.appSecret" clearable></el-input>
        </el-form-item>

        <el-form-item label="类型" prop="type">
          <el-select v-model="dialogForm.type" clearable>
            <el-option :label="item.label" :value="item.value" v-for="item in typeList"
                       :key="'form'+item.key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="应用名称" prop="signName">
          <el-input v-model.trim="dialogForm.signName" clearable></el-input>
        </el-form-item>

        <!--dialogForm.type == 6： 直播，必须填写一下字段-->
        <template v-if="dialogForm.type == 6">
          <el-form-item label="直播密钥ID" prop="liveSecretId">
            <el-input v-model.trim="dialogForm.liveSecretId" clearable></el-input>
          </el-form-item>
          <el-form-item label="直播推流防盗链	" prop="liveAgainstKey">
            <el-input v-model.trim="dialogForm.liveAgainstKey" clearable></el-input>
          </el-form-item>
          <el-form-item label="直播推流鉴权" prop="liveApiKey">
            <el-input v-model.trim="dialogForm.liveApiKey" clearable></el-input>
          </el-form-item>
          <el-form-item label="推流域名" prop="pushDomain">
            <el-input v-model.trim="dialogForm.pushDomain" clearable></el-input>
          </el-form-item>
          <el-form-item label="拉流域名" prop="playDomain">
            <el-input v-model.trim="dialogForm.playDomain" clearable></el-input>
          </el-form-item>
        </template>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogShow = false">取 消</el-button>
        <el-button type="primary" :disabled="vloading" @click="sure">确 定</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
  import PageTemp from '@/components/PageTemp'
  import { applicationDictionaryDataByTypeCode } from '@/api/config.js'
  import { wechatAccountUpdatePublishStatus,getWechatAccountDataPage,getWechatAccountDetail,deleteWechatAccount,editWechatAccount,addWechatAccount ,getWechatAccountTypeEnum} from "@/api/mcc/venue.js"
    export default {
    components:{PageTemp},
      data() {
        return {
          //检索条件
          searchForm:{
            pageNum:1,
            pageSize:10,
            name:'',
            type:''
          },

          tableData:[],
          total:0,

          dialogShow:false,
          dialogType:'add',
          dialogForm:{
            id:'',name:'',appId:'',appSecret:'',type:'',signName:'',
            liveSecretId:'',liveAgainstKey:'',liveApiKey:'',pushDomain:'',playDomain:''
          },

          rules:{
            name:[{ required: true, message: '请输入名称'}],
            appId:[{ required: true, message: '请选择程序编号'}],
            appSecret:[{ required: true, message: '请选择程序密钥'}],
            type:[{ required: true, message: '请选择类型'}],
            signName:[{ required: true, message: '请输入签名'}],

            liveSecretId:[{ required: true, message: '请输入直播密钥ID'}],
            liveAgainstKey:[{ required: true, message: '请输入直播推流防盗链'}],
            liveApiKey:[{ required: true, message: '请输入直播推流鉴权'}],
            pushDomain:[{ required: true, message: '请输入推流域名'}],
            playDomain:[{ required: true, message: '请输入拉流域名'}],
          },

          typeList:[]

        };
      },
      methods:{
        //查询
        querySearchForm(){
          this.getWechatAccountDataPage()
        },
        //重置
        resetSearchForm(){
          this.searchForm.pageNum = 1;
          this.resetForm('searchForm');
          this.getWechatAccountDataPage();
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
            this.dialogForm[key] = '';
          };
          this.$nextTick(()=>{
            this.$refs['dialogForm'].clearValidate(); //移除校验结果
          });

          this.getWechatAccountDetail(row.id);

        },
        handleDelete(row){
          this.commonDeleteDialog(this.deleteWechatAccount,row.id,'删除')
        },

        sure(){
          this.$refs['dialogForm'].validate((valid) => {
            if (valid) {
              this.dialogType == 'add' && this.addWechatAccount();
              this.dialogType == 'edit' && this.editWechatAccount();
            }
          })
        },


        //分页
        goSpecifiedPage(val){
          this.searchForm.pageNum = val;
          this.getWechatAccountDataPage()
        },
        /*-新增-*/
        addWechatAccount(){
          let params =  this.dialogForm;
          delete  params.id;
          // console.log(params)
          addWechatAccount(params).then(res=>{
            if (res.code == 200){
              this.$message.success('添加成功')
              this.dialogShow = !this.dialogShow;
              this.getWechatAccountDataPage()
            }
          })
        },
        /*-编辑-*/
        editWechatAccount(){
          editWechatAccount(this.dialogForm).then(res=>{
            if (res.code == 200){
              this.$message.success('编辑成功')
              this.dialogShow = !this.dialogShow;
              this.getWechatAccountDataPage();
            }
          })
        },

        //分页查询
        getWechatAccountDataPage(){
          getWechatAccountDataPage(this.searchForm).then(res=>{
            if (res.code == 200){
              this.tableData = res.data.result;
              this.total = res.data.totalPages;
            };
          })
        },

        //删除
        deleteWechatAccount(dicNum){
          deleteWechatAccount(dicNum).then(res=>{
            if (res.code == 200){
              this.$message.success('删除成功')
              this.getWechatAccountDataPage()
            }
          })
        },
        //发布
        wechatAccountUpdatePublishStatus(row){
          wechatAccountUpdatePublishStatus({
            id: row.id,
            publishStatus: row.publishStatus ? 0 : 1
          }).then(res=>{
            if (res.code == 200){
              if (!row.publishStatus){
                this.$message.success('发布成功')
              } else{
                this.$message.success('取消发布成功')
              }
              this.getWechatAccountDataPage()
            }
          })
        },

        // 查询详情
        getWechatAccountDetail(id){
          getWechatAccountDetail(id).then(res=>{
            if (res.code == 200){
              for (let key in this.dialogForm){
                this.dialogForm[key] = res.data[key];
              };
            };
          })
        },

        //数据词典
        applicationDictionaryDataByTypeCode(code,arr){
          applicationDictionaryDataByTypeCode(code).then(res=>{
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
        //类型 枚举
        getWechatAccountTypeEnum(){
          getWechatAccountTypeEnum().then(res=>{
            if (res.code == 200){
              this.typeList = res.data.map(item=>{
                  item.key = item.message+item.code;
                  item.value = item.code;
                  item.label = item.message;
                return item
              })
            };
          })
        },

      },
      created(){
        this.getWechatAccountDataPage();

        this.getWechatAccountTypeEnum();

      }
    }
</script>

<style scoped>

</style>
