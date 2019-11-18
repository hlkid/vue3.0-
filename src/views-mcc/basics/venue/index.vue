<template>
  <section class="view-container">
    <el-form class="search-form" ref="searchForm" :model="searchForm" :inline="true" size="small" @submit.native.prevent>
      <el-form-item prop="name">
        <el-input v-model.trim="searchForm.name" clearable placeholder="场馆名称"></el-input>
      </el-form-item>
      <el-form-item prop="level">
        <el-select v-model="searchForm.level" clearable placeholder="场馆等级">
          <el-option :label="item.label" :value="item.value" v-for="item in levelList"
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
        <el-button size="small" type="primary" @click="handleAdd" v-if="hasButton('basics_venue_add')"><i class="fa-fw fa fa-plus"></i>添加</el-button>
      </el-row>
      <el-row class="table-wraper">
        <template>
          <el-table
            ref="multipleTable"
            :data="tableData"
            row-key="id"
            style="width: 100%;" stripe border>
            <el-table-column
              prop="name"
              label="场馆名称" width="150">
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="address"
              label="场馆地点">
            </el-table-column>
            <el-table-column
              prop="startTime"
              label="开馆时间">
            </el-table-column>
            <el-table-column
              prop="levelName"
              width="150"
              label="级别">
            </el-table-column>
            <el-table-column
              prop="contactTel"
              label="联系电话" width="150">
              <template slot-scope="scope">
                {{scope.row.contactTel}}
              </template>
            </el-table-column>
            <el-table-column
              prop="examineStatus"
              label="审核状态"
              width="80">
              <template slot-scope="scope">
                <el-link :underline="false" type="success" v-if="scope.row.examineStatus == 1">已审核</el-link>
                <el-link :underline="false" type="danger" v-else>未审核</el-link>
              </template>
            </el-table-column>
            <el-table-column
              prop="publishStatus"
              label="发布状态"
              width="80">
              <template slot-scope="scope">
                <el-link :underline="false" type="success" v-if="scope.row.publishStatus == 1">已发布</el-link>
                <el-link :underline="false" type="danger" v-else>未发布</el-link>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="220">
              <template slot-scope="scope">
                <!--examineStatus=3，已发送审核-->
                <el-button
                  size="mini"
                  type="primary"
                  @click="handleAudit(scope.row)" v-if="scope.row.examineStatus==0 && hasButton('basics_venue_review')"><i class="fa fa-pencil fa-fw"></i>审核</el-button>
                <el-button
                  size="mini"
                  :type="scope.row.publishStatus==1?'danger':'primary'"
                  @click="handleRelease(scope.row)" v-if="scope.row.examineStatus==1 && hasButton('basics_venue_release')"><i class="fa fa-pencil fa-fw"></i>{{scope.row.publishStatus==1?'撤销':'发布'}}</el-button>
                <el-button
                  size="mini"
                  @click="handleEdit(scope.row)" v-if="hasButton('basics_venue_edit')"><i class="fa fa-pencil fa-fw"></i>编辑</el-button>
                <el-button
                  size="mini"
                  type="danger"
                  @click="handleDelete(scope.row)" v-if="hasButton('basics_venue_delete')"><i class="fa fa-trash-o fa-fw"></i>删除</el-button>
                <el-button
                  size="mini"
                  type="primary"
                  @click="handleDistribution(scope.row)" v-if="hasButton('basics_venue_power')"><i class="fa fa-pencil fa-fw"></i>分配人员</el-button>
                <el-button
                  size="mini"
                  type="primary"
                  @click="handleLinkAccount(scope.row)" v-if="hasButton('basics_venue_link')"><i class="fa fa-pencil fa-fw"></i>关联账号</el-button>
              </template>
            </el-table-column>
          </el-table>
          <PageTemp :total="total" :pageSize="searchForm.pageSize" :currentPage="searchForm.pageNum" @goSpecifiedPage="goSpecifiedPage" />
        </template>
      </el-row>
    </section>

    <!--分配运营-->
    <el-dialog class="transfer-wraper" title="分配人员" :visible.sync="dialogShow2" top="25vh" width="800px" :close-on-click-modal="false" :append-to-body='true'>
      <!--:right-default-checked="venueOperatorIds"-->
      <el-transfer v-model="venueOperatorIds"
                   :left-default-checked="venueOperatorIds"
                   :render-content="renderFunc"
                   :data="allOperatorList" :props="transferProps" :titles="['可选', '已选']"></el-transfer>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogShow2 = false">取 消</el-button>
        <el-button type="primary" @click="distribution">确 定</el-button>
      </div>
    </el-dialog>


    <!--关联账号-->
    <LinkAccount :idVenue="currentIdVenue" :show.sync="linkAccountShow"></LinkAccount>
  </section>
</template>

<script>
  import { getVenueDataPage,deleteVenue,editVenue,addVenue,getVenueDetail,getVenueOperatorList,bindOperatorVenue,releaseVenue,auditVenue } from '@/api/mcc/venue.js'
  import { applicationDictionaryDataByTypeCode,districtParentData,districtChildData,getAttributeUser } from '@/api/config.js'
  import { fileDetail ,uploadFileUrl, getfiles} from '@/api/file.js'
  import PageTemp from '@/components/PageTemp'
  import LinkAccount from './components/LinkAccount.vue'
  export default {
    data () {
      return {
        // 关联账号
        currentIdVenue: '', // 点击管理账号，设置为当前行的ID
        linkAccountShow: false,
        //对话框
        dialogShow:false,
        dialogShow2:false,
        dialogType:'add',//点击操作按钮改变
        levelList:[],
        transferProps:{
          key:'id',
          label:'userRealName'
        },
        renderFunc(h, option) {
          // console.log(h,option)
          return  <span>{option.userRealName} <span style="font-size:12px;color:#999"> ({option.attributeName})</span> <span style="font-size:12px;color:#999"> ({option.userAccount})</span> </span>;
        },
        venueOperatorIds:[],
        venueOperatorList:[],
        allOperatorList:[],
        dialogForm2:{
          idUser:'',
          idVenue:''
        },
        //行政区
        province:'',
        city:'',
        area:'',
        provinceList:[],
        cityList:[],
        areaList:[],

        rules2:{},
        //场馆列表 的检索条件
        searchForm:{
          pageNum:1,
          pageSize:10,
          name:'',
          level:''
        },
        tableData:[],
        total:0,
      }
    },
    components:{PageTemp,LinkAccount},
    methods:{
      changeProvince(val){
        this.city = '';
        this.cityList = [];
        this.area = '';
        this.areaList = [];
        this.districtChildData(val,this.cityList);
        this.provinceList.forEach(item=>{
          if (val === item.id){
            this.dialogForm.parentDistrictCode = item.id;
            this.dialogForm.parentDistrictCodeName = this.districtName;
          }
        })
      },
      changeCity(val){
        this.area = '';
        this.areaList = [];
        this.districtChildData(val,this.areaList)
      },
      changeArea(val){
        this.dialogForm.districtCode = [this.province,this.city,this.area].toString();
      },
      //省级区域
      districtParentData() {
        districtParentData().then(res => {
          if (res.code == 200) {
            this.provinceList = res.data
          }
        })
      },
      //省级子级区域
      districtChildData(parentId,arr=[]) {
        districtChildData(parentId).then(res => {
          if (res.code == 200) {
            res.data.forEach(item=>{
              arr.push(item)
            })
          }
        })
      },

      //文件地址
      fileDetail(id,attr){
        fileDetail(id).then(res=>{
          if (res.code == 200 && res.data){
            this[attr] = this.baseImgUrl + res.data.imgSmallCompress
          };
        })
      },

      // 封面文件上传 ----上传成功--
      handleSuccessCover(response, file, fileList){
        this.dialogForm.cover = response.data.id;
        this.fileDetail(response.data.id,'cover')
      },
      //logo文件上传 ----上传成功--
      handleSuccessLogo(response, file, fileList){
        this.dialogForm.logo = response.data.id;
        this.fileDetail(response.data.id,'logo')
      },
      //qrCode文件上传 ----上传成功--
      handleSuccessQrCode(response, file, fileList){
        this.dialogForm.qrCode = response.data.id;
        this.fileDetail(response.data.id,'qrCode')
      },


      //操作按钮
      handleAdd(){
        this.$router.push({name:'basics_venue_add'})
      },
      handleEdit(row){
        this.$router.push({name:'basics_venue_edit',params:{id:row.id}})
      },
      handleDelete(row){
        this.commonDeleteDialog(this.deleteVenue,row.id,'删除')
      },
      //审核
      handleAudit(row){
        this.commonDeleteDialog(this.auditVenue,{
          id:row.id,
          examineStatus:1
        },'审核')
      },
      //发布
      handleRelease(row){
        let params = {};
        let text = "";
        params.id = row.id;
        params.publishStatus = row.publishStatus == 1?0:1;
        text =  row.publishStatus == 1?'撤销发布':'发布';
        this.commonDeleteDialog(this.releaseVenue,params,text);
      },
      // 点击分配人员
      handleDistribution(row){
        this.dialogShow2 = true;
        this.dialogForm2.idVenue = row.id;
        this.getVenueOperatorList(row.id)
      },
      // 点击关联账号
      handleLinkAccount(row){
        this.linkAccountShow = true;
        this.currentIdVenue = row.id;
      },
      //对话框
      sure(){
        this.$refs['dialogForm'].validate((valid) => {
          if (valid) {
            this.dialogType == 'add' && this.addVenue();
            this.dialogType == 'edit' && this.editVenue();
          }
        })
      },
      distribution(){
        if (this.venueOperatorIds.length){
          this.dialogForm2.idUser = this.venueOperatorIds.toString();
          bindOperatorVenue(this.dialogForm2).then(res=>{
            if (res.code == 200){
              this.dialogShow2 = false;
              this.$message.success('分配运营人员成功')
              this.getVenueDataPage()
            }
          })
        } else{
          this.$message.warning('请选择运营人员')
        }
      },
      //查询
      querySearchForm(){
        this.getVenueDataPage()
      },
      //重置
      resetSearchForm(){
        this.searchForm.pageNum = 1;
        this.resetForm('searchForm');
        this.getVenueDataPage();
      },
      resetForm(formName) {
        this.$refs[formName] && this.$refs[formName].resetFields();
      },

      //列表
      //添加
      addVenue(){
        let params =  this.dialogForm;
        addVenue(params).then(res=>{
          if (res.code == 200){
            this.$message.success('添加成功')
            this.dialogShow = !this.dialogShow;
            this.getVenueDataPage()
          }
        })
      },
      //删除
      deleteVenue(dicNum){
        deleteVenue(dicNum).then(res=>{
          if (res.code == 200){
            this.$message.success('删除成功')
            this.getVenueDataPage()
          }
        })
      },
      //审核
      auditVenue(data){
        auditVenue(data).then(res=>{
          if (res.code == 200){
            this.$message.success('审核成功')
            this.getVenueDataPage()
          }
        })
      },
      //发布
      releaseVenue(data){
        releaseVenue(data).then(res=>{
          if (res.code == 200){
            let text = data.publishStatus == 1?'发布成功':'撤销成功';
            this.$message.success(text);
            this.getVenueDataPage()
          }
        })
      },
      //编辑
      editVenue(){
        editVenue(this.dialogForm).then(res=>{
          if (res.code == 200){
            this.$message.success('编辑成功')
            this.dialogShow = !this.dialogShow;
            this.getVenueDataPage()
          }
        })
      },
      //分页
      goSpecifiedPage(val){
        this.searchForm.pageNum = val;
        this.getVenueDataPage()
      },

      //获取场馆列表
      getVenueDataPage(){
        getVenueDataPage(this.searchForm).then(res=>{
          if (res.code == 200){
            this.tableData = res.data.result;
            this.total = res.data.totalPages;
          };
        })
      },
      //获取场馆详情
      getVenueDetail(id){
        getVenueDetail(id).then(res=>{
          if (res.code == 200){
            for (let key in this.dialogForm){
              this.dialogForm[key] = res.data[key];
            };

            let districtCodeArr = this.dialogForm.districtCode.split(',');
            this.province = districtCodeArr[0];
            this.city = districtCodeArr[1];
            this.area = districtCodeArr[2];
            this.districtChildData(this.province,this.cityList);
            this.districtChildData(this.city,this.areaList);

            this.fileDetail(res.data.cover,'cover');
            this.fileDetail(res.data.logo,'logo');
          };
        })
      },
      //数据词典
      applicationDictionaryDataByTypeCode(code,arr){
        applicationDictionaryDataByTypeCode(code).then(res=>{
          if (res.code == 200){
            res.data.forEach(item=>{
              arr.push({
                key:item.valueName+item.value,
                value:item.value,
                label:item.valueName
              })
            })
          };
        })
      },
      // 已分配运营人员列表
      getVenueOperatorList(id){
        getVenueOperatorList(id).then(res=>{
          if (res.code == 200){
            this.venueOperatorList = res.data;
            this.venueOperatorIds = [];
            this.venueOperatorList.forEach(i=>{
              this.venueOperatorIds.push(i.userId)
            })
          };
          // console.log(this.venueOperatorList)
        })
      },
      // 所有运营总分馆馆方账户
      getAttributeUser(){
        getAttributeUser().then(res=>{
          if (res.code == 200){
            this.allOperatorList = res.data;
          };
        })
      }
    },
    created() {
      //列表
      this.getVenueDataPage();
      //所有运营人员列表
      this.getAttributeUser();
      //行政区
      this.districtParentData();
      this.applicationDictionaryDataByTypeCode('venueLevel',this.levelList);
    }
  };
</script>


<style lang="scss">
  .transfer-wraper{
    .el-transfer-panel{
      width: 320px;
    }
  }
</style>
