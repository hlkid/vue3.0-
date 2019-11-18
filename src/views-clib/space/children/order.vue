<template>
  <section class="view-container">
    <el-form class="search-form" ref="searchForm" :model="searchForm" :inline="true"  size="small"
             @submit.native.prevent>
      <el-form-item prop="idInstitution">
        <el-input v-model.trim="searchForm.idInstitution" clearable placeholder="读者证ID"></el-input>
      </el-form-item>
      <el-form-item prop="name">
        <el-select placeholder="预约状态">
          <el-option>

          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-date-picker
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="querySearchForm"><i class="fa-fw fa fa-search"></i>查询</el-button>
        <el-button @click="resetSearchForm"><i class="fa-fw fa fa-repeat"></i>重置</el-button>
      </el-form-item>
    </el-form>
    <section class="list-wraper">
      <el-row class="table-wraper">
        <template>
          <!--          @selection-change="handleSelectionChange"-->
          <el-table
            ref="multipleTable"
            :data="tableData"
            stripe border
            style="width: 100%">
            <el-table-column
              prop="name"
              label="姓名"
              width="120">
            </el-table-column>
            <el-table-column
              prop="idInstitution"
              label="读者证ID"
              width="120">
            </el-table-column>
            <el-table-column
              label="手机号">
            </el-table-column>

            <el-table-column
              prop="spaceType"
              label="预约空间"
              width="120">
            </el-table-column>
            <el-table-column
              label="预约时间">
            </el-table-column>
            <el-table-column
              prop="publishStatus"
              label="预约状态"
              width="80">
              <template slot-scope="scope">
                <el-link :underline="false" type="success" v-if="scope.row.publishStatus == 1">已发布</el-link>
                <el-link :underline="false" type="danger" v-else>未发布</el-link>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="400">
              <template slot-scope="scope">
                <el-button size="mini" type="info" @click.stop="handleView(scope.row)"><i class="fa fa-eye fa-fw"></i>查看
                </el-button>

                <el-button size="mini" @click.stop="handleEdit(scope.row)"><i class="fa fa-pencil fa-fw"></i>编辑
                </el-button>

                <el-button size="mini" type="danger" @click.stop="handleDelete(scope.row)"><i
                  class="fa fa-trash-o fa-fw"></i>删除
                </el-button>

                <el-button size="mini" type="danger"><i
                  class="fa fa-trash-o fa-fw"></i>取消
                </el-button>

              </template>
            </el-table-column>
          </el-table>
          <PageTemp :total="total" :pageSize="searchForm.pageSize" :currentPage="searchForm.pageNum"
                    @goSpecifiedPage="goSpecifiedPage"/>
        </template>
      </el-row>
    </section>
    <!--审核-->
    <!--    <AuditDialog :show.sync="dialogAuditShow" :id="dialogAuditId" @sure="handleAuditSure"></AuditDialog>-->
  </section>
</template>

<script>
    export default {
      data() {
        return {
          searchForm:{},
          tableData:[],
          total:0
        }
      },

      methods:{
        //查询
        querySearchForm(){

        },
        //重置
        resetSearchForm(){

        },
        //分页
        goSpecifiedPage(val){

        }

      }
    }
</script>

<style scoped>

</style>
