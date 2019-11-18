<template>
  <section class="view-container">
<!--    <div class="btn-area" v-show="!isDisable">-->
<!--      <el-button type="primary" size="mini" @click="bookRoom"><i class="fa-fw fa fa-plus"></i> 书库</el-button>-->
<!--    </div>-->
    <!-- 循环列表   start -->
    <div class="content-item"  v-for="(item,index) in bookList" :key="index">
      <el-row :gutter="10">
        <el-col :xs="4" :sm="6" :md="8" :lg="5" :xl="11" class="item-l">
          <span class="num">{{index+1}}、</span>
           <div class="avatarBox">
             <div class="avatar-img">
               <el-image  :src="item.bookCover" :fit="fit">
                 <div slot="error" class="image-slot">
                   <i class="el-icon-picture-outline"></i>
                 </div>
               </el-image>
               <span class="text">图书封面</span>
             </div>
<!--             <el-avatar shape="square" :size="200" :fit="fit"  v-if="item.bookCover" :src="item.bookCover"></el-avatar>-->
<!--             <el-button size="small" type="primary" class="btn">上传</el-button>-->
             <el-upload
               class="uploader"
               :action="uploadFileParamsUrl"
               :show-file-list="false"
               :on-success="handleAvatarSuccess"
               :before-upload="beforeAvatarUpload" v-show="!isDisable">
               <el-button size="small" type="primary" class="btn" @click="uploadBookCover(item)">上传</el-button>
             </el-upload>

             <p class="" v-show="!isDisable">建议上传：174*245</p>
           </div>
        </el-col>
        <el-col :xs="4" :sm="6" :md="8" :lg="19" :xl="11">
          <el-form ref="form"  :model="form" label-width="80px" class="form"   size="small" @submit.native.prevent>
            <el-row :gutter="10">
              <el-col :xs="4" :sm="6" :md="8" :lg="12" :xl="11" >
                <el-form-item label="书名">
                  <el-input v-model="item.bookName" placeholder="请输入书名" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="标签">
                  <el-input v-model="item.bookTag" placeholder="最多四个标签，空格隔开" :disabled="isDisable"></el-input>
                </el-form-item>
              </el-col>
              <el-col :xs="4" :sm="6" :md="8" :lg="12" :xl="11" >
                <el-form-item label="作者">
                  <el-input  v-model="item.author" placeholder="请输入作者" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="来源">
                  <el-input v-model="item.sourceFrom" placeholder="请输入来源" :disabled="isDisable"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="简介">
              <el-input
                type="textarea"
                :autosize="{ minRows: 4, maxRows: 6}"
                placeholder="请输入简介"
                v-model="item.bookSummary" :disabled="isDisable">
              </el-input>
            </el-form-item>
            <el-form-item label="排序">
              <el-input v-model="item.recommendedSort" placeholder="" :disabled="isDisable"></el-input>
            </el-form-item>
            <el-form-item v-show="!isDisable">
              <el-button type="primary" @click="updateBookInfo(item)"><i class="fa fa-refresh"></i> 更新图书</el-button>
              <el-button @click="updownShelfBook(item)"><i class="fa fa-trash"></i>{{ item.publishStatus == 0 ? '上架' : '下架'}}</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>
    <!-- 循环列表 end    -->

    <!-- 书库 弹出框   -->
    <el-dialog title="书库" :visible.sync="dialogVisible">
      <el-form class="" ref="searchForm"  :model="searchForm" :inline="true" size="small" @submit.native.prevent>
        <el-form-item label="查询类型">
          <el-select clearable v-model="searchForm.searchFiled" placeholder="请选择查询类型">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="主题">
          <el-input clearable v-model.trim="searchForm.searchWord" placeholder="请输入主题名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch"><i class="fa-fw fa fa-search"></i>查询</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="gridData"  highlight-current-row ref="singleTable" @current-change="handleCurrentChange">
        <el-table-column property="title" label="图书名"></el-table-column>
        <el-table-column property="isbn" label="ISBN" ></el-table-column>
        <el-table-column property="author" label="作者"></el-table-column>
      </el-table>
      <PageTemp :total="total" :pageSize="searchForm.limit" :currentPage="searchForm.page" @goSpecifiedPage="goSpecifiedPage" />
      <div slot="footer" class="dialog-footer">
        <el-button  @click="setCurrent()">取 消</el-button>
        <el-button type="primary" @click="sure()" v-if="currentRow">确 定</el-button>
        <el-button type="primary"  disabled v-else>确 定</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>

  import PageTemp from '@/components/PageTemp'
  import {  rankRecord,bookType,booksRecord,create,rankChange,deleteRecord,updownShelf} from "@/api/clib/book";
  import { fileDetail ,uploadFileUrl, getfiles} from '@/api/file.js'
  import { isDataType ,uploadSize} from '@/utils/common.js'
  export default {
    data() {
      return {
        fit:"fill",
        uploadFileUrl:uploadFileUrl,
        dialogVisible: false,
        options:[],//查询类型
        gridData: [],
        currentRow: null,
        form: {
          name: '',
        },
        total:0,
        searchForm:{ //搜索条件
          page:1,
          limit:10,
          searchFiled:"",   //搜索类型
          searchWord: '',  //搜索关键字
          libcode:''
        },
        isDisable:false,
        bookList:[],
        currentBookItem:null
      };
    },
    components:{PageTemp},
    methods:{

      // 图书列表记录
      getBook(){
        var that = this
        var id = this.$route.params.id
        rankRecord({periodId:id}).then(res=>{
          if (res.code == 200){
            this.bookList = res.data?res.data:[];
            this.bookList.forEach(function(item){
              //判断图片是否是网络地址
              if(item.bookCover.indexOf('http') == 0){
                item.bookCover = item.bookCover
              } else {
                item.bookCover = item.bookCover?that.baseImgUrl+item.bookCover:''
              }
            });

          }
        })
      },

      //书库按钮操作
      bookRoom(){
        if(this.bookList.length>=10){
          this.$message({
            message: '图书最多只能选择10本！',
            type: 'warning'
          });
          return
        }
        this.dialogVisible = true;
        this.getBookType()
      },

      //书库搜索类型枚举
      getBookType(){
        bookType().then(res=>{
          if (res.code == 200){
            this.options = res.sysDictList.map(e => {
              e.label = e.text;
              e.value = e.value;
              return e;
            });
          }
        })

      },

      //书库中搜索操作
      handleSearch() {
       this.getSearch()
      },
      getSearch(){
        booksRecord(this.searchForm).then(res=>{
          if (res.code == 200){
            this.gridData = res.page.result;
            this.total = res.page.totalNum;
          }
        })
      },

      //分页
      goSpecifiedPage(val){
        this.searchForm.page = val;
        this.getSearch()
      },
      //选择当前行
      handleCurrentChange(val) {
        console.log("val===",val)
        this.currentRow = val;
      },
      //取消当前行
      setCurrent(row) {
        this.$refs.singleTable.setCurrentRow(row);
        this.dialogVisible = false;
      },

      //书库中选择新增图书
      sure(){
        var row = this.currentRow;
        var param = {
          "idBookPeriod":this.$route.params.id,
          "idBookInformation":'',
          "recommendedSort":1,
          "bookName":row.title,
          "seriesName":row.title,
          "recordId":row.recordId,
          "catalog":"",
          "bookCallNo":row.callNos.length?(row.callNos).join(','):'',
          "translator":"",
          "summary":row.description,
          "sourceFrom":"",
          "browseVolume":'',
          "subject":row.subject,
          "bookCover":row.coverpicture,
          "author":row.author,
          "isbn":row.isbn,
          "publisher":row.publisher,
          "bookPrice":"",
          "publishDate":row.publishYear,
          "language":"",
          "bookTag":row.subject
        };
        create(param).then(res=>{

          if (res.code == 200){
            this.$message.success('新增成功')
            this.dialogVisible = false;
            this.getBook();
          }
        })
      },

      //上传
      uploadBookCover:function(item){
        this.currentBookItem = item;
        console.log(item)
      },
      handleAvatarSuccess:function(res, file) {
        this.$set(this.currentBookItem,'bookCover',this.baseImgUrl+res.data.path);
      },
      async beforeAvatarUpload(file){
        let width = 174;
        let height = 245;
        const isSize = await uploadSize(width,height,file);
        return isSize;
      },

      //更新图书
      updateBookInfo(item){
        var bookCover = item.bookCover;
        if(bookCover.indexOf(this.baseImgUrl)!=-1){
          bookCover = bookCover.replace(this.baseImgUrl,"");
        }
        var bookTag = item.bookTag.split(" ");
        if(bookTag.length>4){
          this.$message({
            message: '最多四个标签！',
            type: 'warning'
          });
          return;
        }
        if(item.bookSummary.length<30){
          this.$message({
            message: '简介最少30字！',
            type: 'warning'
          });
          return;
        }
        var param =  {
            id:item.id,
            recordId:item.recordId,
            recommendedSort:item.recommendedSort,
            bookName:item.bookName,
            author:item.author,
            bookTag:item.bookTag,
            sourceFrom:item.sourceFrom,
            summary:item.bookSummary,
            bookCover:item.bookCover
        };
        rankChange(param).then(res=>{
          if (res.code == 200){
            this.$message.success('更新成功')
          } else {
            this.$message.error(res.msg)
          }
        })
      },

      //点击移除此书
      deleteCurrentBook(item){
        if(this.bookList.length<=3){
          this.$message.error("少于三本图书不可移除！")
          return;
        }
        this.commonDeleteDialog(this.bookDelete,item,'移除')
      },
      //上下架图书
      updownShelfBook(item){

        if(item.publishStatus==1){
          var result = this.bookList.filter(i=>i.publishStatus==1);
          if (result.length <= 5) {
            this.$message.info("最少有五本书上架！");
            return;
          }
        }
        let that = this;
        let params = {};
        let text = "";
        params.id = item.id;
        params.status = item.publishStatus == 1 ? 0 : 1;
        text = item.publishStatus == 1 ? "下架" : "上架";

        this.$confirm("是否确认" + text + "？", "温馨提示", {
          cancelButtonText: "取消",
          confirmButtonText: "确定",
          type: "",
          center: false
        })
          .then(() => {
            that.updown(params);
          })
          .catch(() => {
            if (item.publishStatus == 1) {
              that.$message.info("已取消下架");
            } else {
              that.$message.info("已取消上架");
            }
          });
      },
      updown(data) {
        updownShelf(data).then(res => {
          if (res.code == 200) {
            this.$message.success(res.msg);
            this.getBook();
          }
        });
      },
      bookDelete(item){
        deleteRecord({id:item.id}).then(res=>{
          if (res.code == 200){
            this.$message.success('移除成功')
            this.bookList.splice(item.index,1);
          } else {
            this.$message.error(res.msg)
          }
        })
      },

    },
    created() {
      //根据路由判断页面是查看还是编辑查看对应的编辑权限隐藏
      let type = this.$route.params.type;
      if(type){
        this.isDisable = !this.isDisable;
      }else{
        // this.type = 'edit';
      }
      this.getBook();
    },
  }

</script>


<style lang="scss">
  .btn-area{margin-top:20px;background-color: #fff;padding: 20px;}
  .content-item{
    padding: 20px;
    background-color: #fff;
    margin-top:20px;
  }
  .item-l{
    display: flex;
    flex: 1;
    /*align-items: center;*/
    /*justify-content: center;*/
    text-align: center;
    .num{
      font-weight: bold;
    }
  }
  .avatarBox{

    .image-slot{
      width: 200px;
      height: 200px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 60px;
      color: #999;
      background-color:#eee;
    }
  .avatar-img{
    position: relative;
    height: 200px;
    .text{
       position: absolute;
       left: 0;
       bottom: 0;
       width: 100%;
       color: #fff;
       line-height: 35px;
       background: rgba(0,0,0,0.5);
      height: 35px;
      display: flex;
      align-items: center;
      text-align: center;
      justify-content: center;
      }
    }
    img{
      /*width: 200px;*/
      height: 200px;
    }
    .el-button{
      width: 200px;
      margin: 10px 0;
      border:0px solid #fff;
    }
    .text{
      font-size: 12px;
      color: #666;
    }
  }

</style>
