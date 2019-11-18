<template>
  <section class="view-container">
    <el-form class="search-form" ref="searchForm" :model="searchForm" :inline="true" size="small" @submit.native.prevent>
      <el-form-item>
        <el-input v-model="searchForm.title" clearable placeholder="请输入新闻标题"></el-input>
      </el-form-item>
      <el-form-item>
        <el-select v-model="searchForm.type" clearable  placeholder="请选择类型">
          <el-option
            v-for="item in messageNoticeTypeList"
            :key="item.code"
            :label="item.message"
            :value="item.code">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item >
        <el-button type="primary" @click="onSubmit" native-type="submit"><i class="fa fa-search fa-fw"></i>查询</el-button>
        <el-button @click="resetSearchForm"><i class="fa fa-repeat fa-fw"></i>重置</el-button>
      </el-form-item>
    </el-form>

        <section class="list-wraper">
          <el-row class="table-wraper" >
            <template>
              <el-table style="width: 100%;" border stripe :data="tableData" @row-click="rowClick"  ref="multipleTable">
                <el-table-column
                  label="序号"
                  type="index"
                  width="50">
                </el-table-column>
                <el-table-column
                  sortable
                  prop="title"
                  label="消息标题">
                </el-table-column>
                <el-table-column
                  label="状态">
                  <template slot-scope="scope">
                    <span v-if="scope.row.status == 0" style="color: red">未读</span>
                    <span v-else-if="scope.row.status == 1">已读</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="typeName"
                  label="类型">
                </el-table-column>
                <el-table-column
                  prop="createTime"
                  label="创建时间">
                </el-table-column>
    <!--            <el-table-column label="操作" width="290">-->
    <!--              <template slot-scope="scope">-->
    <!--                <el-button-->
    <!--                  size="mini"-->
    <!--                  @click.stop.prevent="handleEdit(scope.$index, scope.row)"><i class="fa fa-pencil"></i>&nbsp;编辑</el-button>-->
    <!--              </template>-->
    <!--            </el-table-column>-->
              </el-table>
              <page-temp :total="total" :pageSize="searchForm.pageSize" :currentPage="searchForm.pageNum" @goSpecifiedPage="goSpecifiedPage" />
            </template>
          </el-row>
        </section>
  </section>
</template>

<script>
  import { getMessageRecordList , uploadmessageRecord ,getMessageNoticeType } from "@/api/mcc/information.js"
  import { fileDetail ,uploadFileUrl, getfiles} from '@/api/file.js'
  import PageTemp from '@/components/PageTemp'
  import { isEmpty } from '@/utils/common'
  export default {
    components:{ PageTemp },
    data () {

      return {
        //列表 的检索条件
        searchForm:{
          pageNum:1,
          pageSize:10,
          title:'',
          type:'',
        },
        messageNoticeTypeList:[],
        typeOptions:[],
        tableData: [],
        total:0, //总 条数

      }
    },
    created(){
      this.getMessageRecordList();
      this.getMessageNoticeType();
    },
    methods:{
      //查询
      onSubmit(){
        this.searchForm.pageNum = 1;
        this.getMessageRecordList();
      },
      //重置 清除
      resetSearchForm(){
        this.searchForm.title = '';
        this.searchForm.type = '';
        this.searchForm.pageNum = 1;
        this.getMessageRecordList();
      },
      //分页
      goSpecifiedPage(val){
        this.searchForm.pageNum = val;
        this.getMessageRecordList();
      },

      // list
      getMessageRecordList(){
        getMessageRecordList(this.searchForm).then(res=>{
          this.tableData = res.data.result;
          this.total =  res.data.totalPages;
        })
      },


      rowClick(row, column, event){
        if( row.status == 0){
          uploadmessageRecord(row.id).then(res=>{
            if(res.code == 200){
              this.getMessageRecordList();
            }
          })

        }

        if (row.type == 1){//新闻公告
          this.$router.push({name:'newNotice_detail',params:{id:row.idSource}})
        }else if(row.type == 0){//项目报价
          this.$router.push({
            name:'approval_price'
          })
        };
        // console.log(row)
      },

      //消息
      getMessageNoticeType(){
        getMessageNoticeType().then(res=>{
          if (res.code == 200){
            this.messageNoticeTypeList = res.data
          };
        })
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>
