<template>
  <section class="view-container starManger">
    <div id="inputInnerDiv"></div>
    <el-form class="search-form" ref="searchForm" :model="searchForm" label-width="0" :inline="true" size="small">
      <el-form-item>
        <el-input style="width:220px" v-model="searchForm.volunteerName" maxlength="50" clearable placeholder="志愿者姓名"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSearch()"><i class="fa fa-search"></i>&nbsp;
          查询
        </el-button>
        <el-button @click="reset('searchForm')"><i class="fa fa-repeat"></i>&nbsp;重置</el-button>
      </el-form-item>
    </el-form>
    <section class="list-wraper">
      <el-row class="table-wraper">
        <template>
          <el-table style="width: 100%;" stripe border :data="tableData" ref="multipleTable">
            <el-table-column prop="volunteerName" label="姓名">
              <template slot-scope="scope">
                <p><a style="color:#409EFF" @click="toVolunteerDetail(scope.row.id)">{{scope.row.volunteerName}}</a></p>
              </template>
            </el-table-column>
            <el-table-column prop="recommendOpinion" label="推荐理由">
            </el-table-column>
            <el-table-column label="操作" width="100">
              <template slot-scope="scope">
                <el-button size="mini" type="primary" @click="starCancel(scope.row.id,scope.row.volunteerName)"><i class="fa fa-pencil"></i>&nbsp;取消推荐</el-button>
              </template>
            </el-table-column>
          </el-table>
          <page-temp :total="total" :pageSize="searchForm.pageSize" :currentPage="searchForm.pageNum"
            @goSpecifiedPage="goSpecifiedPage" />
        </template>
      </el-row>
    </section>

  </section>

</template>
<script>
import {
volunteerStarDataPage,
volunteerStarCancel,
} from "@/api/volunteer/volunteer";
import PageTemp from "@/components/PageTemp";

export default {
  data() {
    return {
      detailDialog:{},
      status: "",
      searchForm: {
        pageNum: 1,
        pageSize: 10,
        volunteerName: "",//活动名称
      },
      tableData: [],
      total: 0,
    };
  },
  components: { PageTemp },
  methods: {
    //获取列表(分页)
    geDataPage() {
      volunteerStarDataPage(this.searchForm).then(res => {
        if (res.code == 200) {
          this.tableData = res.data.result;
          this.total = res.data.totalPages;
        }
      });
    },
    //跳转志愿者详情
    toVolunteerDetail:function(id){
      this.$router.push({ name: "volunteer_detail", params: { type:"detail",id: id } });
    },
    //查询
    onSearch() {
      this.searchForm.pageNum = 1;
      this.geDataPage();
    },
    goSpecifiedPage(val) {
      this.searchForm.pageNum = val;
      this.geDataPage();
    },
    //取消推荐志愿者之星
    starCancel(id,name) {
      let _this=this;
      this.$confirm("是否取消 "+name+" 的志愿者之星?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
           volunteerStarCancel(id).then(res => {
            if (res.data == null) {
              _this.$message.success("取消成功");
              _this.geDataPage();
            } else {
              _this.$message.error("取消失败");
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消用户删除"
          });
        });
    },
    //重置
    reset() {
      this.searchForm.pageNum = 1;
      this.searchForm.pageSize = 10;
      this.searchForm.volunteerName = "";
      this.geDataPage();
    }
  },
  created() {
    this.geDataPage();
  },
  filters:{
    //活动状态
    actStageFilter:function(val){
      switch (val) {
        case 0:
          return "未开始"
          break;
        case 1:
          return "招募中"
          break;
          case 2:
          return "进行中"
          break;
        case 3:
          return "已结束"
          break;
      default:
          return "未知"
          break;
      }
    },
    //发布状态
    statusFilter:function(val){
      switch (val) {
        case 0:
          return  "未发布"
          break;
        case 1:
          return  "已发布"
          break;
      default:
          return  "未知"
          break;
      }
    }
  }
};
</script>

<style lang="scss">
.starManger{
.search-form {
  .el-input-group__append {
    padding: 0;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    background-color: #fff;
    .district {
      .el-input {
        width: 100px;
      }
      width: 35%;
      margin: 0;
      &:nth-child(1) {
        width: 30%;
      }
    }
  }
  .el-select,
  .el-input {
    width: 150px;
  }
}
}
</style>
