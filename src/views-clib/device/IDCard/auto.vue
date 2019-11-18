<template>
  <section class="view-container">
    <section class="tip-top">
      <p class="tip-title">ID卡信息</p>
      <div class="tip-box">
        <p>卡号：{{detail.cardNo}}</p>
        <p>场馆名称：{{detail.venueName}}</p>
        <p>应用名称：{{detail.hbAppName}}</p>
      </div>
    </section>

    <el-form class="search-form" ref="searchForm" :model="searchForm" :inline="true" size="small"
             @submit.native.prevent>

      <el-form-item prop="deviceId">
        <el-input v-model="searchForm.deviceId" placeholder="设备ID"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="querySearchForm"><i class="fa-fw fa fa-search"></i>查询</el-button>
        <el-button @click="resetSearchForm"><i class="fa-fw fa fa-repeat"></i>重置</el-button>
      </el-form-item>

    </el-form>
    <section class="list-wraper">
      <el-row class="table-wraper">
        <template>
          <el-table
            ref="multipleTable"
            :data="tableData"
            stripe border
            style="width: 100%">

            <el-table-column
              type="index"
              label="序号"
              width="50">
            </el-table-column>

            <el-table-column
              prop="deviceId"
              label="设备ID">
            </el-table-column>

            <el-table-column
              prop="name"
              label="设备名称">
            </el-table-column>

            <el-table-column
              prop="spaceName"
              label="空间名称">
            </el-table-column>

            <el-table-column
              prop="venueName"
              label="场馆名称">
            </el-table-column>

            <el-table-column
              prop="hbAppName"
              label="应用名称">
            </el-table-column>

            <el-table-column
              prop="authStatusName"
              label="授权状态">
              <template slot-scope="scope">
                <el-link :underline="false" type="success" v-if="scope.row.authStatus == 0">
                  {{scope.row.authStatusName}}
                </el-link>
                <el-link :underline="false" type="danger" v-else>{{scope.row.authStatusName}}</el-link>
              </template>
            </el-table-column>

            <el-table-column label="操作" width="100">
              <template slot-scope="scope">
                <el-button size="mini" :type="scope.row.authStatus == 0?'danger':'success'"
                           @click="handleAuto(scope.row)"><i
                  class="fa fa-telegram fa-fw"></i>{{scope.row.authStatus == 0?'解除':'授权'}}
                </el-button>
              </template>
            </el-table-column>
          </el-table>

          <PageTemp :total="total" :pageSize="searchForm.pageSize" :currentPage="searchForm.pageNum"
                    @goSpecifiedPage="goSpecifiedPage"/>
        </template>
      </el-row>
    </section>

    <el-dialog title="授权" :visible.sync="dialogVisible" width="30%">
      <el-form ref="queryForm" :model="queryForm" :rules="rules" class="dialog-from" size="small" label-position="right"
               label-width="80px"  @submit.native.prevent>
        <el-form-item label="授权类型" prop="authType">
          <el-radio-group v-model="queryForm.authType">
            <el-radio :label="item.code" v-for="item in authTypeOption" :key="item.key">{{item.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="sure" size="small">确 定</el-button>
      </span>
    </el-dialog>
  </section>
</template>

<script>
  import PageTemp from '@/components/PageTemp'
  import {
    getAccessCardDetail, getDevicePage,
    addDeviceAccessCard, deleteDeviceAccessCard,
    getDeviceAuthTypeList
  } from '@/api/clib/device'

  export default {
    components: { PageTemp },
    data () {
      return {
        id: '',
        detail: {},

        dialogVisible: false,
        queryForm: {
          idDevice: '',//设备主键ID
          cardNo: '',//卡号
          authType: '',//授权类型（见枚举）
        },
        rules: {
          authType: [{ required: true, message: '请选择授权类型' }]//授权类型（见枚举）
        },

        searchForm: {
          pageNum: 1,
          pageSize: 10,
          type:'1',
          name: '',//	设备名称	是	[string]
          mac: '',//mac地址	是	[string]
          idVenue: '',//场馆主键	是	[string]		查看
          status: '',//使用状态编码	是	[string]
          faultStatus: '',//故障状态编码	是	[string]		查看
          onlineStatus: '',//连接状态编码	是	[string]
          deviceId: '',
          cardNo: ''
        },

        tableData: [],
        total: 0,

        authTypeOption: [], // 授权类型列表

      }
    },
    created () {
      this.id = this.$route.params.id
      this.getAccessCardDetail()
      this.getDeviceAuthTypeList()
    },
    methods: {
      //分页
      goSpecifiedPage (val) {
        this.searchForm.pageNum = val
        this.getDevicePage()
      },
      //搜索
      querySearchForm () {
        this.searchForm.pageNum = 1
        this.getDevicePage()
      },
      //重置
      resetSearchForm () {
        this.$refs['searchForm'] && this.$refs['searchForm'].resetFields()
        this.searchForm.pageNum = 1
        this.getDevicePage()
      },
      // 授权/解除
      handleAuto (row) {
        this.queryForm.idDevice = row.id;
        if ( row.authStatus == 0) {
          //解除
          this.commonDeleteDialog(this.deleteDeviceAccessCard,{},'解除');
        } else {
          //授权
          this.dialogVisible = true;
        }
      },

      sure() {
        this.$refs.queryForm.validate(valid => {
          if(valid){
            this.addDeviceAccessCard();
          }
        })

      },
      /*--接口--*/
      // 详情
      getAccessCardDetail () {
        let that = this
        getAccessCardDetail(this.id).then(res => {
          if (res.code == 200) {
            that.detail = res.data;
            that.searchForm.cardNo = res.data.cardNo;
            that.queryForm.cardNo = res.data.cardNo;
            that.getDevicePage();
          }
        })
      },
      //设备列表
      getDevicePage () {
        getDevicePage(this.searchForm).then(res => {
          if (res.code == 200) {
            this.tableData = res.data.result
            this.total = res.data.totalPages
          }
        })
      },

      //授权ID卡到设备
      addDeviceAccessCard () {
        let that = this
        addDeviceAccessCard(this.queryForm).then(res => {
          if (res.code == 200) {
            that.$message.success('授权成功')
            that.getDevicePage();
            this.dialogVisible = false
          }
        })
      },

      //解除ID卡授权信息
      deleteDeviceAccessCard () {
        let idDevice = this.queryForm.idDevice
        let cardNo = this.queryForm.cardNo;
        let that = this;
        deleteDeviceAccessCard(idDevice, cardNo).then(res => {
          if (res.code == 200) {
            that.$message.success('解除成功')
            that.getDevicePage()
          }
        })
      },
      //获取授权类型列表
      getDeviceAuthTypeList () {
        getDeviceAuthTypeList().then(res => {
          this.authTypeOption = res.data.map(e => {
            e.label = e.message
            e.value = e.code
            e.key = e.message + e.code
            return e
          })
        })
      }

    }
  }
</script>

<style lang="scss" scoped>
  .tip-top {
    background: white;
    margin-top: 15px;
    padding: 20px;

    .tip-title {
      color: #333;
      font-size: 18px;
    }

    .tip-box {
      margin-top: 10px;

      p {
        width: 33%;
        display: inline-block;
        font-size: 14px;
        color: #999;
      }
    }
  }

  .dialog-from {
    .el-select {
      width: 100%;
    }
  }

  .hbsx-form {
    .title {
      color: #333;
      font-size: 18px;
      margin-left: 20px;
      margin-bottom: 20px;
      margin-top: -10px;
    }
  }
</style>
