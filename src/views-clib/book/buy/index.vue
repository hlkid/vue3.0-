<template>
  <section class="view-container">
    <el-form class="search-form" ref="searchForm"  :model="searchForm" :inline="true" size="small" @submit.native.prevent>
      <el-form-item  prop="instName">
<!--        <el-input clearable v-model.trim="searchForm.venueName" placeholder="请输入场馆名称"></el-input>-->
        <el-select v-model="searchForm.instId"  clearable placeholder="请选择场馆">
          <el-option
            v-for="item in venueList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="idInstitution">
        <el-input clearable v-model.trim="searchForm.bookName" placeholder="图书名称"></el-input>
      </el-form-item>
      <el-form-item prop="userFor">
        <el-select v-model="searchForm.purchaseStatus" placeholder="请选择发布状态">
          <el-option
            v-for="item in filterBuy"
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
        <el-table
          ref="multipleTable"
          :data="tableData"
          tooltip-effect="dark"
          @current-change="handleCurrentChange"
          @selection-change="handleSelectionChange"
          row-key="id"
          style="width: 100%;"  border>
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            prop="venueName"
            label="所属场馆"
          >
          </el-table-column>
          <el-table-column
            prop="bookName"
            label="图书名称"
          >
          </el-table-column>
          <el-table-column
            prop="buyFlag"
            label="购买状态"
            width="80"
            >
            <template slot-scope="scope">
              <el-link :underline="false" type="success" v-if="scope.row.buyFlag==1" >{{scope.row.buyFlagName}}</el-link>
              <el-link
                :underline="false"
                type="danger"
                v-else
              >{{scope.row.buyFlagName}}</el-link>
            </template>
          </el-table-column>
          <el-table-column
            prop="bookAuthor"
            label="作者"
          >
          </el-table-column>
          <el-table-column
            prop="isbn"
            label="ISBN"
            width="130"
          >
          </el-table-column>
          <el-table-column
            prop="price"
            label="图书价格"
          >
          </el-table-column>
          <el-table-column
            prop="classificationCode"
            label="图书分类号"
          >
          </el-table-column>
          <el-table-column
            prop="publisher"
            label="出版社"
          >
          </el-table-column>
          <el-table-column
            label="出版时间"
          >
            <template slot-scope="scope">{{ scope.row.publishDate }}</template>
          </el-table-column>

          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" @click.stop="handleAdd(scope.row)" v-show="scope.row.status == 0 ||scope.row.status == 1 "><i class="fa fa-pencil fa-fw"></i>处理</el-button>
            </template>
          </el-table-column>
        </el-table>
        <PageTemp :total="total" :pageSize="searchForm.limit" :currentPage="searchForm.page" @goSpecifiedPage="goSpecifiedPage" />
      </el-row>
    </section>

    <!--新增对话框-->
    <el-dialog title="处理" :visible.sync="dialogVisible" width="30%">
      <el-form ref="form"  :model="form"  :rules="rules"  @submit.native.prevent>
        <el-form-item label="是否购买" prop="buyFlag">
          <el-select v-model="form.buyFlag" style="width: 75%;">
            <el-option
              v-for="item in filterBuy"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="处理结果" prop="buyRemark">
          <el-input
            clearable
            type="textarea"
            :rows="2"
            placeholder="请输入处理结果"
            v-model.trim="form.buyRemark" style="width: 75%;">
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary"  @click="submitForm('form')">保存</el-button>
      </span>
    </el-dialog>
    <!--新增对话框-->
  </section>
</template>

<script>


  import {getBookRecommendRecord,bookRecordUpdate,getBuyStatus} from "@/api/clib/book";
  import PageTemp from '@/components/PageTemp'
  import { getVenueData } from '@/api/mcc/venue.js'
  /********模拟假数据********/
  //
  const instList = [
    {value:1,label:'场馆一'},
    {value:2,label:'场馆二'},
  ];

  const filterBuy = [
    {value:0,label:'未购买'},
    {value:1,label:'已购买'},
  ];

  // const tableData = [{
  //   bookAuthor: "大刘",
  //   bookName: "三体2",
  //   buyFlag: 0,
  //   classificationCode: "123",
  //   id: 5,
  //   instInstitutionName: "合肥市图书馆",
  //   isbn: "12345678",
  //   price: "135",
  //   publishDate: "2016-09-01",
  //   publisher: "中新社",
  // },
  // ];
  /********模拟假数据********/


  export default {
    data() {
      return {
        dialogVisible: false,
        // instList:instList, //场馆列表
        venueList:[], //所属场馆
        filterBuy:[], //购买状态筛选
        tableData: [], //表格列表
        // tableData: tableData, //表格列表
        total:0,
        multipleSelection: [],
        searchForm:{ //搜索条件
          page:1,	//分页参数
          limit:10,	//分页参数	是	[string]
          bookName:"",	//图书名（筛选条件）		[string]
          purchaseStatus:"",	//购买状态（筛选条件：0未购买，1已购买）		[string]
          // venueName:"",	//场馆名称（筛选条件）	是	[string]
          instId:'',     //场馆ID

        },
        form:{ //处理表单
          id:"",        //主键id
          buyFlag:'',   //购买状态（0未购买，1已购买）	是	[string]
          buyRemark:"",      //处理结果
        },
        rules: {
          buyFlag: [
            { required: true, message: '请选择购买状态', trigger: 'blur' },
          ],
          buyRemark: [
            { required: true, message: '请输入处理结果', trigger: 'blur' },
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
        this.searchForm.pageNum = 1;
        this.resetForm('searchForm');
        this.getList();
      },
      resetForm(formName) {
        this.$refs[formName] && this.$refs[formName].resetFields();
      },


      //荐购列表
      getList(){
        getBookRecommendRecord(this.searchForm).then(res=>{
          if (res.code == 200){
            this.tableData = res.page.list;
            this.total = res.page.totalCount;
            this.currentSelect = {}
          };
        })


      },
      //分页
      goSpecifiedPage(val){
        this.searchForm.page = val;
        this.getList()
      },
      //好书推荐
      bookRecommend(row){
        this.$router.push({name:'book_recommend',params:{id:row.id}})
      },

      //操作按钮

      //新增
      handleAdd(row){
        this.dialogVisible = true;
        for (let key in this.form){
          key == 'id' ?this.form[key] = row.id:this.form[key] = '' ;
        };
        this.$nextTick(()=>{
          this.$refs['form'].clearValidate(); //移除校验结果
        })
      },
      //弹框保存按钮
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            bookRecordUpdate(this.form).then(res=>{
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

      //获取购买状态枚举
      getBuyStatus(){
        getBuyStatus().then(res=>{
          if (res.code == 200){
            this.filterBuy = res.data.map(e => {
              e.label = e.message;
              e.value = e.code;
              return e;
            });
          }
        })

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
      this.getBuyStatus();
      this.getVenueData()
    },
  }

</script>


<style lang="scss">

</style>
