<template>
  <section class="view-container">
    <el-form class="search-form" ref="searchForm" :model="searchForm" :inline="true" size="small"
             @submit.native.prevent>

      <el-form-item prop="code">
        <el-input v-model="searchForm.code" placeholder="智能灯ID"></el-input>
      </el-form-item>

      <el-form-item prop="idVenue">
        <el-select v-model="searchForm.idVenue" clearable placeholder="场馆名称">
          <el-option :label="item.label" :value="item.value" v-for="item in venueOption"
                     :key="item.key"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item prop="status">
        <el-select v-model="searchForm.status" clearable placeholder="启用状态">
          <el-option :label="item.label" :value="item.value" v-for="item in statusOptions"
                     :key="item.key"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item prop="deviceName">
        <el-input v-model="searchForm.deviceName" placeholder="设备名称"></el-input>
      </el-form-item>

      <el-form-item prop="bindDeviceType">
        <el-select v-model="searchForm.bindDeviceType" clearable placeholder="设备类型">
          <el-option :label="item.label" :value="item.value" v-for="item in typeOptions"
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
        <el-button size="small" type="primary" v-if="hasButton('device_lamp_add')" @click="handleAdd"><i class="fa-fw fa fa-plus"></i>新增
        </el-button>

        <el-button size="small" type="primary" v-if="hasButton('device_lamp_excel')" @click="handleExcel"><i class="fa-fw fa fa-pencil-square-o"></i>导出
        </el-button>

      </el-row>
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
              width="55">
            </el-table-column>
            <el-table-column
              prop="code"
              label="智能灯ID">
            </el-table-column>
            <el-table-column
              prop="name"
              label="智能灯名称">
            </el-table-column>
            <el-table-column
              prop="venueName"
              label="场馆名称">
            </el-table-column>
            <el-table-column
              prop="bindDeviceTypeName"
              label="绑定设备类型">
            </el-table-column>
            <el-table-column
              prop="deviceId"
              label="绑定设备ID">
            </el-table-column>
            <el-table-column
              prop="deviceName"
              label="绑定设备名称">
            </el-table-column>
            <el-table-column
              prop="hbAppName"
              label="应用名称">
            </el-table-column>
            <el-table-column
              prop="statusName"
              label="智能灯状态">
              <template slot-scope="scope">
                <el-link :underline="false" type="success" v-if="scope.row.status == 0">{{scope.row.statusName}}
                </el-link>
                <el-link :underline="false" type="danger" v-else>{{scope.row.statusName}}</el-link>
              </template>
            </el-table-column>

            <el-table-column
              prop="createTime"
              label="创建时间">
            </el-table-column>
            <el-table-column label="操作" width="300">
               <template slot-scope="scope">
                 <el-button size="mini" v-if="hasButton('device_lamp_status')" :type="scope.row.status == 1?'success':'info'" @click="handleEndble(scope.row)"><i
                   class="fa fa-ban fa-fw"></i>{{scope.row.status == 1?'启用':'禁用'}}
                 </el-button>

                 <el-button size="mini" type="primary" v-if="scope.row.status == 1 && hasButton('device_lamp_edit')"  @click="hanldEdid(scope.row)"><i
                   class="fa fa-pencil fa-fw"></i>编辑
                 </el-button>

                 <el-button size="mini" type="danger" v-if="scope.row.status == 1 && hasButton('device_lamp_delete')" @click="hanldDelete(scope.row)"><i
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

    <el-dialog :title="dialogType=='add'?'新增':'修改'" :visible.sync="addDialogShow" width="700px">
      <el-form ref="queryForm" :model="queryForm" class="dialog-from" :rules="rules" size="small" :inline="true" label-position="right" label-width="120px">
        <p class="title">智能灯信息</p>
        <el-form-item label="场馆名称" prop="idVenue">
          <el-select v-model="queryForm.idVenue" placeholder="场馆名称" @change="venueChange">
            <el-option v-for="item in venueOption" :key="item.key" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="应用名称" prop="hbAppId">
          <el-select v-model="queryForm.hbAppId" placeholder="应用名称" @change="venueChange">
            <el-option v-for="item in hbAppList" :key="item.key" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="智能灯名称" prop="name">
          <el-input v-model="queryForm.name" placeholder="智能灯名称"></el-input>
        </el-form-item>

        <el-form-item label="智能灯ID" prop="code">
          <el-input v-model="queryForm.code" placeholder="智能灯ID"></el-input>
        </el-form-item>
        <div>
          <el-form-item label="备注" prop="remark">
            <el-input v-model="queryForm.remark" placeholder="备注" type="textarea" ></el-input>
          </el-form-item>
        </div>

        <p class="title">绑定设备</p>
        <div>
          <el-form-item label="绑定设备类型" prop="bindDeviceType">
            <el-radio-group v-model="queryForm.bindDeviceType">
              <el-radio :label="item.code" v-for="item in typeOptions" :key="item.key">{{item.label}}</el-radio>
            </el-radio-group>
          </el-form-item>
        </div>

        <div>
          <el-form-item label="绑定设备ID" prop="idDevice">
            <el-select v-model="queryForm.idDevice" placeholder="应用名称">
              <el-option v-for="item in deviceOption" :key="item.key" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </div>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogShow = false">取 消</el-button>
        <el-button type="primary" @click="dialogSure">确 定</el-button>
      </div>
    </el-dialog>

  </section>
</template>

<script>
  import PageTemp from '@/components/PageTemp'
  import { hbApplicationData } from '@/api/config'
  import { getVenueData } from '@/api/mcc/venue.js'
  import { downloading } from '@/utils/common'
  import {checkNumber} from '@/utils/validate'
  import {
    getLampPage,exportLampExcel,
    getLampStatusList,getDeviceTypeList,
    enableLamp,disableLamp,deleteLamp,
    getDeviceAuthTypeList,getDeviceList,
    addLampCreate,editLamp
  } from '@/api/clib/device.js'

  export default {
    components: { PageTemp },
    data () {
      return {
        addDialogShow:false,
        dialogType:'add',
        queryForm:{
          name:"",//智能灯名称
          code:'',//智能灯ID
          bindDeviceType:'',//绑定设备类型
          idDevice:"",//绑定设备ID
          hbAppId:'',
          idVenue:'',
          remark:''
        },
        rules:{
          name:[{required: true, message: '请输入智能灯名称'}],//智能灯名称
          code:[{required: true, message: '请输入智能灯ID'},{validator:checkNumber}],//智能灯ID
          bindDeviceType:[{required: true, message: '请选择设备类型'}],//绑定设备类型
          idDevice:[{required: true, message: '请选择设备ID'}],//绑定设备ID
          hbAppId:[{required: true, message: '请选择应用'}],
          idVenue:[{required: true, message: '请选择场馆'}],
          remark:[{required: true, message: '请输入备注'}]
        },
        searchForm: {
          pageNum: 1,
          pageSize: 10,
          code: '',      //智能类ID	是	[string]		查看
          venueName: '', //	场馆名称	是	[string]		查看
          status: '',    //	状态编码	是	[string]		查看
          deviceName: '',//设备名称	是	[string]		查看
          bindDeviceType: '' //绑定设备类型编码
        },
        tableData: [],
        total: 0,

        venueOption:[],    // 场馆list
        hbAppList:[],
        statusOptions:[], //状态list
        typeOptions:[],  //类型list
        authTypeOption:[],//设备类型
        deviceOption:[],//设备list

      }
    },
    created () {
      this.getLampPage()
      this.hbApplicationData()
      this.getVenueData();
      this.getLampStatusList();
      this.getDeviceTypeList();
      this.getDeviceAuthTypeList()
    },
    methods: {
      // 重置
      resetSearchForm () {
        this.searchForm.pageNum = 1
        this.$refs.searchForm && this.$refs.searchForm.resetFields()
        this.getLampPage();
      },
      //查询
      querySearchForm () {
        this.searchForm.pageNum = 1
        this.getLampPage();
      },
      //分页
      goSpecifiedPage (val) {
        this.searchForm.pageNum = val
        this.getLampPage();
      },
      //新增
      handleAdd () {
        this.addDialogShow = true;

        Object.keys(this.queryForm).forEach(key => {
          this.queryForm[key] = "";
        })
        this.dialogType = 'add';
      },

      //导出
      handleExcel() {
        const loading = this.$loading({
          lock: true,
          text: '文件生成中',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        let params = JSON.parse(JSON.stringify(this.searchForm));
        delete  params.pageNum;
        delete  params.pageSize;
        exportLampExcel(params).then(res=>{
          downloading(res)
          setTimeout(() => {
            loading.close();
          }, 2000);
        })
      },
      //删除
      hanldDelete (row) {
        this.commonDeleteDialog(this.deleteLamp,row.id,'删除')
      },
      //场馆变化 && 应用id变化
      venueChange(){
        let data = {idVenue:this.queryForm.idVenue,//绑定设备ID
                    type:0, hbAppId:this.queryForm.hbAppId};
        this.getDeviceList(data);
      },

      hanldEdid(row) {
        Object.keys(this.queryForm).forEach(key => {
          this.queryForm[key] = row[key]
        });
        this.addDialogShow = true;
        this.$set(this.queryForm,'id',row.id);
        this.dialogType = 'edit';

        let data = {idVenue:this.queryForm.idVenue,//绑定设备ID
           type:0, hbAppId:this.queryForm.hbAppId};
        this.getDeviceList(data);
      },
      //确认
      dialogSure(){
        this.$refs.queryForm.validate(valid => {
          if (valid) {
            this.dialogType == 'add' &&  this.addLampCreate();
            this.dialogType == 'edit' &&  this.editLamp();
          }
        })
      },

      //启用/禁用
      handleEndble (row) {
        row.status == 1  && this.enableLamp(row.id);
        row.status == 0  && this.disableLamp(row.id);
      },

      /*---接口请求-----*/
      //list
      getLampPage () {
        getLampPage(this.searchForm).then(res => {
          if (res.code == 200) {
            this.tableData = res.data.result
            this.total = res.data.totalPages
          }
        })
      },
      //新增
      addLampCreate() {
        let data = {"name":"","code":'',"bindDeviceType":'',"idDevice":"",remark:''},
            that = this;
        Object.keys(data).forEach(key => {
          data[key] = this.queryForm[key];
        });
        addLampCreate(data).then(res => {
          if (res.code == 200) {
            that.$message.success('新增成功')
            that.getLampPage();
            that.addDialogShow = false;
          }
        })
      },
      //修改
      editLamp () {
        let data = {"id":"","name":"","code":'', "bindDeviceType":'',"idDevice":"",remark:''},
            that = this;
        Object.keys(data).forEach(key => {
          data[key] = this.queryForm[key];
        });
        editLamp(data).then(res => {
          if (res.code == 200) {
            that.$message.success('修改成功')
            that.getLampPage();
            that.addDialogShow = false;
          }
        })
      },
      //启用
      enableLamp(id) {
        enableLamp(id).then(res => {
          if (res.code == 200) {
            this.$message.success('启用成功')
            this.getLampPage();
          }
        })
      },
      //禁用
      disableLamp(id) {
        disableLamp(id).then(res => {
          if (res.code == 200) {
            this.$message.success('禁用成功')
            this.getLampPage();
          }
        })
      },
      //删除
      deleteLamp(id) {
        deleteLamp(id).then(res => {
          if (res.code == 200) {
            this.$message.success('删除成功')
            this.getLampPage();
          }
        })
      },

      // 根据条件获取设备列表
      getDeviceList(data){
        let that = this;
        getDeviceList(data).then(res => {
          that.deviceOption = res.data.map(e => {
            e.label = e.deviceId+'(' +e.mac+ ')'
            e.value = e.id
            e.key = e.id
            return e
          })
        })
      },

      //应用不分页查询
      hbApplicationData () {
        let that = this
        hbApplicationData().then(res => {
          that.hbAppList = res.data.map(e => {
            e.label = e.name
            e.value = e.appId
            e.key = e.id
            return e
          })
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

      //应用不分页查询
      hbApplicationData(){
        let that = this;
        hbApplicationData().then(res => {
          that.hbAppList = res.data.map(e => {
            e.label = e.name;
            e.value = e.appId
            e.key = e.id;
            return e;
          })
        })
      },
      //获取智能灯使用状态列表
      getLampStatusList() {
        getLampStatusList().then(res => {
          if (res.code == 200) {
            this.statusOptions = res.data.map(e => {
              e.label = e.message;
              e.value = e.code;
              e.key = e.message+e.code;
              return e
            })
          }
        })
      },
      //获取设备类型列表
      getDeviceTypeList () {
        getDeviceTypeList().then(res => {
          if (res.code == 200) {
            this.typeOptions = res.data.map(e => {
              e.label = e.message;
              e.value = e.code;
              e.key = e.message+e.code;
              return e
            })
          }
        })
      },

    }
  }
</script>

<style lang="scss" scoped>
  .dialog-from {
    .el-textarea{
      width: 400px;
    }
    .el-select,.el-input {
      width: 200px;
    }
    .title {
      margin: -10px 0 10px 0;
      font-size: 14px;
      color: #333;
    }
  }


</style>
