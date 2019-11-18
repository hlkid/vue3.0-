<template>
  <section class="view-container">
    <el-form class="search-form" ref="searchForm" :model="searchForm" :inline="true" size="small"
             @submit.native.prevent>

      <el-form-item prop="name">
        <el-input v-model="searchForm.name" placeholder="设备名称"></el-input>
      </el-form-item>

      <el-form-item prop="mac">
        <el-input v-model="searchForm.mac" placeholder="设备MAC地址"></el-input>
      </el-form-item>

      <el-form-item prop="idVenue">
        <el-select v-model="searchForm.idVenue" clearable placeholder="场馆名称">
                    <el-option :label="item.label" :value="item.value" v-for="item in venueOption"
                             :key="item.key"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item prop="onlineStatus">
        <el-select v-model="searchForm.onlineStatus" clearable placeholder="设备连接状态">
          <el-option :label="item.label" :value="item.value" v-for="item in onlineStatusOption"
                     :key="item.key"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item prop="faultStatus">
        <el-select v-model="searchForm.faultStatus" clearable placeholder="设备故障状态">
          <el-option :label="item.label" :value="item.value" v-for="item in faultStatusOption"
                     :key="item.key"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item prop="status">
        <el-select v-model="searchForm.status" clearable placeholder="设备使用状态">
          <el-option :label="item.label" :value="item.value" v-for="item in deviceStatusOption"
                     :key="item.key"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="querySearchForm"><i class="fa-fw fa fa-search"></i>查询</el-button>
        <el-button @click="resetSearchForm"><i class="fa-fw fa fa-repeat"></i>重置</el-button>
      </el-form-item>

    </el-form>

    <section class="list-wraper">
      <el-row class="btn-wraper">
        <el-button size="small" type="primary" v-if="hasButton('device_door_add')" @click="handleAdd"><i class="fa-fw fa fa-plus"></i>新增
        </el-button>

        <el-button size="small" type="primary" v-if="hasButton('device_door_excel')"  @click="handleExcel"><i class="fa-fw fa fa-pencil-square-o"></i>导出
        </el-button>

        <el-button size="small" type="primary" v-if="hasButton('device_door_gave')" @click="handleGave(currentSelect)"><i class="fa-fw fa fa-plus"></i>授权卡
        </el-button>

        <el-button size="small" type="primary" v-if="hasButton('device_door_setting')" @click="handleSetup(currentSelect)"><i class="fa-fw fa fa-plus"></i>设置
        </el-button>
      </el-row>
      <el-row class="table-wraper">
        <template>
          <el-table
            ref="multipleTable"
            :data="tableData"
            stripe border
            :header-cell-class-name="selectText"
            @current-change="handleCurrentChange"
            @selection-change="handleSelectionChange"
            row-key="id"
            style="width: 100%">
            <el-table-column
              type="selection"
              width="55">
            </el-table-column>
            <el-table-column
              prop="deviceId"
              label="设备ID"
              width="120">
            </el-table-column>
            <el-table-column
              prop="mac"
              label="设备MAC地址">
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
              prop="onlineStatusName"
              label="设备连接状态">
              <template slot-scope="scope">
                <el-link :underline="false" type="success" v-if="scope.row.onlineStatus == 0">{{scope.row.onlineStatusName}}</el-link>
                <el-link :underline="false" type="danger" v-else>{{scope.row.onlineStatusName}}</el-link>
              </template>
            </el-table-column>
            <el-table-column
              prop="faultStatusName"
              label="设备故障状态">
              <template slot-scope="scope">
                <el-link :underline="false" type="success" v-if="scope.row.faultStatus == 0">{{scope.row.faultStatusName}}</el-link>
                <el-link :underline="false" type="danger" v-else>{{scope.row.faultStatusName}}</el-link>
              </template>
            </el-table-column>
            <el-table-column
              prop="statusName"
              label="设备使用状态">
              <template slot-scope="scope">
                <el-link :underline="false" type="success" v-if="scope.row.status == 0">{{scope.row.statusName}}</el-link>
                <el-link :underline="false" type="danger" v-else>{{scope.row.statusName}}</el-link>
              </template>
            </el-table-column>
            <el-table-column
              prop="createTime"
              label="设备注册时间">
            </el-table-column>
            <el-table-column label="操作" width="450">
              <template slot-scope="scope">
                <el-button size="mini" type="primary" v-if="hasButton('device_door_sync')" @click="hanldSync(scope.row)"><i
                  class="fa fa-pencil fa-fw"></i>设备同步
                </el-button>
                <el-button size="mini" type="primary" v-if="hasButton('device_door_look')" @click="hanldLook(scope.row)"><i
                  class="fa fa-pencil fa-fw"></i>查看
                </el-button>

                <el-button size="mini" v-if="hasButton('device_door_fault')" :type="scope.row.faultStatus==0?'info':'primary'" @click="hanldSetFault(scope.row)"><i
                  class="fa fa-pencil fa-fw"></i>{{scope.row.faultStatus==0?'故障':'正常'}}
                </el-button>

                <el-button size="mini" v-if="hasButton('device_door_status')" :type="scope.row.status == 1?'success':'info'" @click="handleEndble(scope.row)"><i
                  class="fa fa-ban fa-fw"></i>{{scope.row.status == 1?'启用':'禁用'}}
                </el-button>

                <el-button size="mini" type="warning" v-if="scope.row.status == 0 && hasButton('device_door_open')" @click="handleOpen(scope.row)"><i
                  class="fa fa-ban fa-fw"></i>开门
                </el-button>

                <el-button size="mini" type="primary" v-if="scope.row.status == 1 && hasButton('device_door_edit')"  @click="hanldEdid(scope.row)"><i
                  class="fa fa-pencil fa-fw"></i>编辑
                </el-button>

                <el-button size="mini" type="danger" v-if="scope.row.status == 1 && hasButton('device_door_delete')" @click="hanldDelete(scope.row)"><i
                  class="fa fa-trash-o fa-fw"></i>删除
                </el-button>

              </template>
            </el-table-column>
          </el-table>
          <PageTemp :total="total" :pageSize="searchForm.pageSize" :currentPage="searchForm.pageNum"
                    @goSpecifiedPage="goSpecifiedPage"/>
        </template>
      </el-row>
    </section>

  </section>
</template>

<script>
  import PageTemp from '@/components/PageTemp'
  import { downloading } from '@/utils/common'
  import {
    getDevicePage,
    getDeviceOnlineStatusList, getDeviceStatusList,
    getDeviceFaultStatusList,setSyncDevice,
    setNormalDevice,setFailureDevice,
    getEnableDevice,getDisableDevice,
    setOpenDoor,deleteDevice,exportExcelDevice
  } from '@/api/clib/device'
  import { getVenueData } from '@/api/mcc/venue.js'

  export default {
    components: { PageTemp },
    data () {
      return {
        searchForm: {
          type: 1,
          name: '',// 设备名称  是  [string]
          mac: '',// mac地址  是  [string]
          idVenue: '',// 场馆主键  是  [string]    查看
          status: '',// 使用状态编码  是  [string]
          faultStatus: '',//  故障状态编码  是  [string]    查看
          onlineStatus: '',// 连接状态编码  是  [string]
          pageNum: 1,
          pageSize: 10,
          cardNo: ''
        },
        tableData: [],
        total: 0,

        onlineStatusOption: [],//设备连接状态
        deviceStatusOption: [],//设备使用状态
        faultStatusOption: [],//设备故障状态
        venueOption:[],//场馆list

        currentSelect: {}
      }
    },
    created () {
      this.getDevicePage();
      this.getVenueData();
      this.getDeviceFaultStatusList()
      this.getDeviceStatusList()
      this.getDeviceOnlineStatusList()
    },
    methods: {
      /*table单选*/
      handleCurrentChange (val) {
          this.currentSelect = val.id ? val : {}
          this.$refs.multipleTable.toggleRowSelection(val)
      },
      handleSelectionChange (val) {
        // console.log(val)
        setTimeout(() => {
          if (val.length > 1) {
            this.$refs.multipleTable.clearSelection()
            this.$refs.multipleTable.toggleRowSelection(val.pop())
          }
          this.currentSelect = val.length ? val[0] : {}
        })
      },
      // 重置
      resetSearchForm () {
        this.searchForm.pageNum = 1
        this.$refs.searchForm && this.$refs.searchForm.resetFields()
        this.getDevicePage()
      },
      //查询
      querySearchForm () {
        this.searchForm.pageNum = 1
        this.getDevicePage()
      },
      //分页
      goSpecifiedPage (val) {
        this.searchForm.pageNum = val
        this.getDevicePage()
      },
      //编辑
      hanldEdid(row){
        this.$router.push({
          name:'device-door-edit',
          params:{id:row.id}
        })
      },
      //新增
      handleAdd () {
        this.$router.push({
          name:'device-door-add'
        })
      },
      //导出
      handleExcel(){
        const loading = this.$loading({
          lock: true,
          text: '文件生成中',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        let params = JSON.parse(JSON.stringify(this.searchForm));
        delete  params.pageNum;
        delete  params.pageSize;
        exportExcelDevice(params).then(res=>{
          downloading(res)
          setTimeout(() => {
            loading.close();
          }, 2000);
        })
      },
      //设置
      handleSetup (row) {
        if(!row.id){
          this.$message.warning('请勾选一条记录')
          return
        }
        this.$router.push({
          name:'device_door_setup',
          params:{id: row.id}
        })
      },

      handleGave(row){
        if(!row.id){
          this.$message.warning('请勾选一条记录')
          return
        }

        this.$router.push({
          name:'device-door-setup-card',
          params:{id: row.id}
        })
      },

      //查看
      hanldLook (row) {
        this.$router.push({
          name:'device-door-detail',
          params:{id: row.id}
        })
      },

      //设备同步
      hanldSync (row) {
        setSyncDevice(row.id).then(res => {
          if (res.code == 200) {
            this.$message.success("同步成功")
            this.getDevicePage()
          }
        })
      },
      //设置故障、正常状态
      hanldSetFault (row) {
        row.faultStatus==0 && this.setFailureDevice(row.id);
        row.faultStatus==1 && this.setNormalDevice(row.id);
      },

      //启用/禁用
      handleEndble (row) {
        row.status==0 && this.getDisableDevice(row.id);
        row.status==1 && this.getEnableDevice(row.id);
      },
      //开门
      handleOpen (row) {
        setOpenDoor(row.id).then(res => {
          if (res.code == 200) {
            this.$message.success("开门成功")
            this.getDevicePage();
          }
        })
      },
      //删除
      hanldDelete(row) {
        this.commonDeleteDialog(this.deleteDevice,row.id,'删除')
      },

      /*---接口请求-----*/

      //list
      getDevicePage () {
        let that = this;
        getDevicePage(that.searchForm).then(res => {
          if (res.code == 200) {
            this.tableData = res.data && res.data.result ? res.data.result : [];
            that.total = res.data.totalPages;
          }
        })
      },
      // 设置为故障设备
      setFailureDevice (id){
        let that = this;
        setFailureDevice(id).then(res => {
          if (res.code == 200) {
            that.$message.success("设置成功");
            that.getDevicePage()
          }
        })
      },
      // 设置为正常设备
      setNormalDevice (id) {
        let that = this;
        setNormalDevice(id).then(res => {
          if (res.code == 200) {
            that.$message.success("设置成功");
            that.getDevicePage()
          }
        })
      },
      // 启用设备
      getEnableDevice(id){
        let that = this;
        getEnableDevice(id).then(res => {
          if (res.code == 200) {
            that.$message.success("设置成功");
            that.getDevicePage()
          }
        })
      },
      // 禁用设备
      getDisableDevice(id) {
        let that = this;
        getDisableDevice(id).then(res => {
          if (res.code == 200) {
            that.$message.success("设置成功");
            that.getDevicePage()
          }
        })
      },
      //删除
      deleteDevice(id) {
        deleteDevice(id).then(res => {
          if (res.code == 200) {
            this.$message.success("删除成功")
            this.getDevicePage();
          }
        })
      },

      //获取设备连接状态列表
      getDeviceOnlineStatusList () {
        getDeviceOnlineStatusList().then(res => {
          this.onlineStatusOption = res.data.map(e => {
            e.label = e.message
            e.value = e.code
            e.key = e.message + e.code
            return e
          })
        })
      },
      //获取设备使用状态列表
      getDeviceStatusList () {
        getDeviceStatusList().then(res => {
          this.deviceStatusOption = res.data.map(e => {
            e.label = e.message
            e.value = e.code
            e.key = e.message + e.code
            return e
          })
        })
      },
      //获取设备故障状态列表
      getDeviceFaultStatusList () {
        getDeviceFaultStatusList().then(res => {
          this.faultStatusOption = res.data.map(e => {
            e.label = e.message
            e.value = e.code
            e.key = e.message + e.code
            return e
          })
        })
      },
      //场馆list
      getVenueData () {
        let that = this
        getVenueData().then(res => {
          that.venueOption = res.data.map(e => {
            e.label = e.name
            e.value = e.id
            e.key = e.name + e.id
            return e
          })
        })
      },

    }
  }
</script>

<style lang="scss" scoped>
  .dialog-from {
    .el-select {
      width: 100%;
    }
  }


</style>
