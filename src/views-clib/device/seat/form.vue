<template>
  <section class="view-container">
    <el-form class="hbsx-form" ref="dataForm"
             :model="dataForm"
             :rules="rules"
             inline
             label-width="120px"
             size="small" @submit.native.prevent>

      <el-form-item label="应用名称" prop="hbAppId">
        <el-select v-model="dataForm.hbAppId" clearable placeholder="应用名称" @change="hbAppChange">
          <el-option v-for="item in hbAppList" :key="item.key" :value="item.value" :label="item.label"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="场馆名称" prop="idVenue">
        <el-select v-model="dataForm.idVenue" clearable placeholder="场馆名称" @change="venueChange">
          <el-option v-for="item in venueOption" :key="item.key" :value="item.value" :label="item.label"></el-option>
        </el-select>
      </el-form-item>


      <el-form-item label="空间名称" prop="idSpace">
        <el-select v-model="dataForm.idSpace" clearable placeholder="空间名称" @change="spaceChange">
          <el-option v-for="item in spaceList" :key="item.key" :value="item.value" :label="item.label"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="座位号" prop="idSeat">
        <el-select v-model="dataForm.idSeat" clearable placeholder="座位号" @change="seatChange">
          <el-option v-for="item in seatList" :key="item.key" :value="item.value" :label="item.label"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="设备名称" prop="name">
        <el-input v-model.trim="dataForm.name" placeholder="设备名称"></el-input>
      </el-form-item>


      <el-form-item label="设备MAC地址" prop="mac">
        <el-input v-model.trim="dataForm.mac" placeholder="设备MAC地址"></el-input>
      </el-form-item>

      <!--<el-form-item label="设备密码" prop="password">
        <el-input v-model.trim="dataForm.password" placeholder="设备密码"></el-input>
      </el-form-item>-->


      <el-form-item label="备注" prop="remarks" class="block">
        <el-input type="textarea" :autosize="{ minRows: 5, maxRows: 5 }" v-model="dataForm.remarks" clearable placeholder="备注">
        </el-input>
      </el-form-item>

      <div class="btns-waper">
        <el-button size="small" @click="back">返回</el-button>
        <el-button size="small" type="primary" :disabled="vloading" @click="sure">提 交</el-button>
      </div>
    </el-form>

    <!--产品产品选择-->
  </section>
</template>

<script>

  import { hbApplicationData } from '@/api/config'
  import { getVenueData } from '@/api/mcc/venue'
  import { getSpaceData,getSeatData } from '@/api/clib/space'
  import { isMAC } from '@/utils/validate'
  import {
    addDevice,getInfoDevice,editDevice
  } from '@/api/clib/device'

  export default {
    data(){
      return{
        type:'',//add新增edit编辑
        dataForm:{
          id:'',
          idVenue:'',     //	场馆主键		[long]		查看
          idSpace:'',     //	空间主键		[long]		查看
          hbAppId:'',
          hbAppName:'',
          idSeat:'',
          seatNumber:'',
          // password:'888888',
          name:'',        //名称	是	[string]		查看
          venueName:'',   //	场馆名称	是	[string]		查看
          spaceName:'',   //	空间名称	是	[string]		查看
          type	:'0',      //
          mac:'',         //	mac 地址	是	[string]		查看
          remarks:'',     //	备注	是	[string]
        },

        rules:{
          idVenue:[{ required: true, message: '请选择场馆'}],
          idSpace:[{ required: true, message: '请选择空间'}],
          hbAppId:[{ required: true, message: '请选择应用'}],
          name:[{ required: true, message: '请输入主题名称'}],
          idSeat:[{ required: true, message: '请选择座位号'}],
          mac:[{ required: true, message: '请输入MAC地址'},{validator:isMAC}],
          remarks:[{ required: true, message: '请输入备注'}],
        },
        spaceForm:{
          examineStatus:1,
          publishStatus:1,
          hbAppId:'',
          idVenue:'',
        },

        venueOption:[],    // 场馆list
        hbAppList:[],
        spaceList:[],
        seatList:[],
      }
    },
    components:{},
    created(){
      this.dataForm.id = this.$route.params.id; //主题ID
      if(this.dataForm.id){
        this.type = 'edit';
        this.getInfoDevice(this.dataForm.id)
      }else{
        this.type = 'add';
      }
      this.getVenueData();
      this.hbApplicationData();
      this.getSpaceData();
    },
    methods:{
      sure(){
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            let data = JSON.parse(JSON.stringify(this.dataForm));
            if (this.type == 'add') {
              this.addDevice(data);
            }else{
              this.editDevice(data)
            }
          }
        })
      },
      venueChange(id){
        let data = this.venueOption.find(e => e.id == id);
        if(data){
          this.dataForm.venueName = data.label;

          this.spaceForm.idVenue = this.dataForm.idVenue
          this.spaceForm.hbAppId = this.dataForm.hbAppId
          this.dataForm.idSpace = "";
          this.getSpaceData();
        }
      },
      spaceChange(id){
        let data = this.spaceList.find(e => e.id == id);
        if(data){
          this.dataForm.spaceName = data.label;
          this.getSeatData(id);
        }
      },
      hbAppChange(id){
        let data = this.hbAppList.find(e => e.value == id);
        if(data){
          this.dataForm.hbAppName = data.label;
          this.spaceForm.idVenue = this.dataForm.idVenue
          this.spaceForm.hbAppId = this.dataForm.hbAppId
          this.dataForm.idSpace = "";
          this.getSpaceData();
          this.getSeatData();
        }
      },
      seatChange (id) {
        let data = this.seatList.find(e => e.value == id);
        if(data){
          this.dataForm.seatNumber = data.label;
        }
      },

      /*----接口----*/
      //门禁坐席新增
      addDevice(data){
        addDevice(data).then(res => {
          if (res.code == 200) {
            this.$message.success('新增成功');
            setTimeout(()=>{
              this.$router.back()
            },300)
          }
        })
      },
      //更新设备信息
      editDevice(data){
        editDevice(data).then(res => {
          if(res.code == 200){
            this.$message.success('修改成功');
            setTimeout(()=>{
              this.$router.back()
            },300)
          }

        })
      },
      //详情
      getInfoDevice(id){
        getInfoDevice(id).then(res => {
          if(res.code == 200) {
            Object.keys(this.dataForm).forEach(key => {
              this.dataForm[key] = res.data[key];
            })
          }
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
      //空间列表
      getSpaceData(){
        getSpaceData(this.spaceForm).then(res => {
          if(res.code==200){
            this.spaceList = res.data.map(e => {
              e.label = e.name
              e.value = e.id
              e.key = e.id
              return e
            })
          }
        })
      },
      //座位分页
      getSeatData(idSpace){
        getSeatData({idSpace:idSpace}).then(res => {
          if(res.code == 200) {
            this.seatList = res.data.map(e => {
              e.label = e.seatNumber
              e.value = e.id
              e.key = e.id
              return e
            })
          }
        })
      }
    }
  };
</script>

<style lang="scss" scoped>

</style>
