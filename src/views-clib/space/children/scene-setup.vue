<template>
  <section class="view-container">
    <section class="list-wraper">
      <el-table ref="multipleTable"
                :data="tableData"
                stripe border>
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column label="预约时段"></el-table-column>
        <el-table-column label="可预约人数"></el-table-column>
        <el-table-column label="可预约状态"></el-table-column>
        <el-table-column label="已预约人数"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">

            <el-button size="mini">编辑</el-button>

            <el-button size="mini" type="danger">删除</el-button>

          </template>
        </el-table-column>

      </el-table>
    </section>

    <!--编辑-->
    <el-dialog title="编辑" :visible.sync="editDialogShow" append-to-body width="700px">
      <el-form :model="form" inline size="small" >
        <el-form-item label="预约时段">
          <el-date-picker v-model="form.year" class="time-picker" type="date" placeholder="选择日期"></el-date-picker>
          <el-time-picker
            is-range
            v-model="form.time"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            placeholder="选择时间范围">
          </el-time-picker>
        </el-form-item>
        <el-form-item label="可预约人数">
          <el-input v-model="form.num" placeholder="可预约人数"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogShow = false">取 消</el-button>
        <el-button type="primary" @click="editDialogShow = false">确 定</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
  import {getSpaceScenePage} from "@/api/clib/space";

  export default {
    data() {
      return {
        tableData: [],
        query: {
          pageSize: '',
          pageNum: '',
          idSpace: '',
          orderDate: ''
        },
        form: {
          year: "",
          time:'',
          num:''
        },

        editDialogShow: true,
      };
    },
    created() {
      this.getSpaceScenePage();
    },
    methods: {
      getSpaceScenePage() {
        getSpaceScenePage(this.query).then(res => {
          if (res.code == 200) {

          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .time-picker{
    width: 150px;
    margin-right: 10px;
  }
</style>
