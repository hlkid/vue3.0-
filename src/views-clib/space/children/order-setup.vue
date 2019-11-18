<template>
  <section class="view-container">
    <el-form class="search-form" ref="searchForm" :model="searchForm" :inline="true"  size="small"
             @submit.native.prevent>
      <el-form-item prop="spaceName" >
        <el-input v-model.trim="searchForm.spaceName" clearable placeholder="空间名称"></el-input>
      </el-form-item>
      <el-form-item prop="idVenue">
        <el-select placeholder="场馆名称" v-model="searchForm.idVenue">
          <el-option :label="item.label" :value="item.value" :key="item.key" v-for="item in venueOption"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item prop="appointWay">
        <el-select placeholder="预约方式" v-model="searchForm.appointWay">
          <el-option :label="item.label" :value="item.value" :key="item.key" v-for="item in bookWayOption"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item prop="isOpen">
        <el-select placeholder="是否可以预约" v-model="searchForm.isOpen">
          <el-option :label="item.label" :value="item.value" :key="item.key" v-for="item in spaceOpenOption"></el-option>
        </el-select>
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
              prop="spaceName"
              label="空间名称">
            </el-table-column>
            <el-table-column
              prop="venueName"
              label="场馆名称">
            </el-table-column>
            <el-table-column
              prop="appointWayName"
              label="预约方式">
            </el-table-column>

            <el-table-column
              prop="isOpenName"
              label="是否可预约">
            </el-table-column>

            <el-table-column
              label="发布状态">
              <template slot-scope="scope">
                <el-link :underline="false" type="success" v-if="scope.row.publishStatus == 1">已发布</el-link>
                <el-link :underline="false" type="danger" v-else>未发布</el-link>
              </template>
            </el-table-column>

            <el-table-column label="操作" width="500">
              <template slot-scope="scope">
                <el-button size="mini" type="primary"  @click.stop="handleSetUpWay(scope.row)">设置预约方式
                </el-button>

                <el-button size="mini" type="primary" v-if="scope.row.appointWay != null" @click.stop="handleOpen(scope.row)">
                  {{scope.row.isOpen == 0?'关闭预约':'开启预约'}}
                </el-button>
                <!--场次预约-->
                <el-button size="mini" type="primary" v-if="scope.row.appointWay != null && scope.row.isOpen == 1" >
                  场次设置
                </el-button>
                <!--场次预约-->
                <el-button size="mini" type="primary" v-if="scope.row.appointWay != null && scope.row.appointWay == 0 && scope.row.isOpen == 1" @click="hanldeTime(scope.row)">推荐时段
                </el-button>

                <el-button size="mini" type="primary" v-if="scope.row.appointWay != null && scope.row.appointWay == 0 && scope.row.isOpen == 1" @click.stop="handleCycle(scope.row)">开放周期
                </el-button>

                <el-button size="mini" type="primary" v-if="scope.row.appointWay != null && scope.row.appointWay == 0 && scope.row.isOpen == 1">开放时间
                </el-button>

                <el-button size="mini" type="primary" v-if="scope.row.appointWay != null && scope.row.appointWay == 0 && scope.row.isOpen == 1" @click.stop="handleFree(scope.row)">设置费用
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
    <!--设置预约方式-->
    <el-dialog title="设置预约方式" :visible.sync="setUpWarpDialogVisible" width="400px">
      <el-form ref="bookWayForm"  :model="bookWayForm"  :rules="bookWayRules"  @submit.native.prevent>
        <el-form-item label="空间预约方式"  prop="appointWay">
          <el-select v-model="bookWayForm.appointWay" >
            <el-option  v-for="item in bookWayOption" :key="item.value"  :label="item.label"  :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="预约需要审核" prop="isNeedAudit">
          <el-radio-group v-model="bookWayForm.isNeedAudit">
            <el-radio :label="item.value" v-for="item in ScaleList" :key="item.key">{{item.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setUpWarpDialogVisible = false">取 消</el-button>
        <el-button type="primary"  @click="submitSetUpWarp()">保存</el-button>
      </span>
    </el-dialog>

    <!--开放周期-->
    <el-dialog title="开放周期" :visible.sync="cycleDialogVisible" width="400px">
       <div>
          <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
          <div style="margin: 15px 0;"></div>
          <el-checkbox-group v-model="checkedCycle" @change="handleCheckedCitiesChange">
            <el-checkbox v-for="item in cycleList" :label="item.value" :key="item.value+item.label">{{item.label}}</el-checkbox>
          </el-checkbox-group>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="cycleDialogVisible = false">取 消</el-button>
        <el-button type="primary"  @click="submitcycle">保存</el-button>
      </span>
    </el-dialog>

    <!-- 设置费用-->
    <el-dialog title="设置费用" :visible.sync="freeDialogVisible" width="400px">
      <el-form ref="freeForm" inline  :model="freeForm"  :rules="freeRules"  @submit.native.prevent>
        <el-form-item label="费用类型"  prop="feeType">
          <el-select v-model="freeForm.feeType" >
            <el-option  v-for="item in feeTypeOption" :key="item.value"  :label="item.label"  :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="每小时单价" prop="amount">
          <el-input v-model="freeForm.amount"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="freeDialogVisible = false">取 消</el-button>
        <el-button type="primary"  @click="submitfree">保存</el-button>
      </span>
    </el-dialog>
  </section>
</template>

<script>
  import PageTemp from '@/components/PageTemp'
  import { getVenueData } from '@/api/mcc/venue'
  import { applicationDictionaryDataByTypeCode } from '@/api/config'
  import {checkMoney} from '@/utils/validate'
  import {
    getSpaceOpenList,getDataSpacePage,
    getSpaceScaleList,editAppointWay,
    closeSpaceConfig,openSpaceConfig,
    setOpenCycleSpaceConfig,getDataSeatDetail,setFeeSpaceConfig
  } from '@/api/clib/space'

  export default {
    components:{PageTemp},
    data() {
      return {
        searchForm:{
          pageNum:1,	//当前页	是	[int]
          pageSize:10,	//页数据量	是	[int]
          spaceName:'',//	空间名称		[string]
          idVenue:'',//	场馆主键		[long]
          appointWay:'',//	预约方式		[int]
          isOpen:'',//	是否可预约
        },
        tableData:[],
        total:0,

       venueOption:[],//场馆list
        bookWayOption:[],//预约方式
        spaceOpenOption:[],//是否可预约
        ScaleList:[],//空间是否要审核
        feeTypeOption:[],//费用列表

        //设置预约方式
        setUpWarpDialogVisible:false,
        bookWayForm:{
          idSpace : '',//空间主键
          appointWay : '',//预约方式
          isNeedAudit : ''//预约是否需要审核
        },

        bookWayRules:{
          appointWay :  {required: true, message: '请选择预约方式'},//预约方式
          isNeedAudit : {required: true, message: '请选择是否需要审核'}//预约是否需要审核
        },
        //开放周期
        cycleDialogVisible:false,
        isIndeterminate:false,
        checkAll: false,
        cycleQuery:{
          id:'',//空间设置主键，新增时为null,修改时必填
          idSpace:'',//空间主键
          openCycle:""//开放周期
        },
        checkedCycle:[],
        cycleList:[{label:'周一',value:"1"},{label:'周二',value:"2"},{label:'周三',value:"3"},{label:'周四',value:"4"},{label:'周五',value:"5"},{label:'周六',value:"6"},{label:'周日',value:"7"}],

        //费用类型
        freeDialogVisible:false,
        freeForm: {
          id:'',//空间设置主键，新增时为null,修改时必填
          idSpace:'',//空间主键
          feeType:"",//费用类型
          amount:''//费用单
        },
        freeRules:{
          feeType : [{required: true, message: '请选择费用类型'}] ,//预约方式
          amount : [{required: true, message: '请选输入费用'},{validator:checkMoney}]//预约是否需要审核
        }

      }

    },
    created() {
      this.getDataSpacePage();
      this.getVenueData();
      this.applicationDictionaryDataByTypeCode(this.$dicts.bookWay,this.bookWayOption);
      this.applicationDictionaryDataByTypeCode(this.$dicts.feeType,this.feeTypeOption);
      this.getSpaceOpenList();
      this.getSpaceScaleList();
    },

    methods:{
      //查询
      querySearchForm(){
        this.searchForm.pageNum = 1;
        this.getDataSpacePage();
      },
      //重置
      resetSearchForm(){
        this.searchForm.pageNum = 1
        this.$refs.searchForm && this.$refs.searchForm.resetFields()
        this.getDataSpacePage();
      },
      //分页
      goSpecifiedPage(val){
        this.searchForm.pageNum = val;
        this.getDataSpacePage();
      },
      //统一设置
      handleAllSetting(){
        this.$router.push({name:"space_unified_setup"})
      },
      //设置预约方式
      handleSetUpWay(row) {
        this.bookWayForm.idSpace = row.idSpace;
        this.setUpWarpDialogVisible = !this.setUpWarpDialogVisible;
      },
      //设置预约方式 提交
      submitSetUpWarp(){
        this.$refs.bookWayForm.validate(valid => {
          if(valid){
            this.editAppointWay();
          }
        })
      },
      // 关闭预约/开启预约
      handleOpen(row){
        if (row.isOpen == 0) {
          this.closeSpaceConfig(row.idSpace);
        } else {
          this.openSpaceConfig(row.idSpace);
        }
      },
      //设置费用
      handleFree(row){
        getDataSeatDetail(row.idSpace).then(res=> {
          this.freeForm.feeType = res.data.feeType;
          this.freeForm.amount = res.data.amount;
          this.freeForm.idSpace = row.idSpace
          this.freeForm.id = row.id
          this.freeDialogVisible = true;
        })

      },
      //费用
      submitfree(){
        let that = this;
        this.$refs.freeForm.validate(valid => {
          if(valid){
            setFeeSpaceConfig(this.freeForm).then(res => {
              if(res.code == 200){
                that.$message.success("设置成功");
                that.freeDialogVisible = false;
                that.getDataSpacePage();
              }

            })
          }
        })
      },
      //推荐时段
      hanldeTime(row){
        this.$router.push({name:'space_setup_rec-time',params:{id:row.idSpace}});
      },

      /*--开放周期--*/
      handleCycle(row){
        getDataSeatDetail(row.idSpace).then(res=> {
          this.checkedCycle = res.data.openCycle?res.data.openCycle.split(","):[];
          this.cycleQuery.idSpace = row.idSpace
          this.cycleQuery.id = row.id
          this.cycleDialogVisible = true;
        })
      },

        //周期提交
      submitcycle(){
        this.cycleQuery.openCycle = this.checkedCycle.join(',');
        let that = this;
        setOpenCycleSpaceConfig(this.cycleQuery).then(res => {
          if(res.code == 200) {
            that.$message.success("设置成功");
            that.cycleDialogVisible = false;
            that.getDataSpacePage();
          }
        })
      },

      handleCheckAllChange(val) {
        this.checkedCycle = val ? this.cycleList.map(e=>{
          return e.value
        }) : [];
        this.isIndeterminate = false;
      },

      handleCheckedCitiesChange(value) {
        let checkedCount = value.length;
        this.checkAll = checkedCount === this.cycleList.length;
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.cycleList.length;
      },
      /*------*/

      /*--接口---*/
      //list
      getDataSpacePage() {
        getDataSpacePage(this.searchForm).then(res => {
          if(res.code == 200) {
            this.tableData = res.data.result;
            this.total = res.data.totalPages;
          }
        })
      },
      //空间关闭预约
      closeSpaceConfig(idSpace){
        let that = this;
        closeSpaceConfig({idSpace:idSpace}).then(res => {
          that.$message.success("设置成功");
          that.getDataSpacePage();
        })
      },
      //空间开放预约
      openSpaceConfig(idSpace) {
        let that = this;
        openSpaceConfig({idSpace:idSpace}).then(res => {
          that.$message.success("设置成功");
          that.getDataSpacePage();
        })
      },

      //更新空间预约方式
      editAppointWay(){
        let that = this;
        editAppointWay(this.bookWayForm).then(res => {
            if(res.code == 200){
              that.$message.success("设置成功");
              that.getDataSpacePage();
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
      //是否可预约
      getSpaceOpenList(){
        getSpaceOpenList().then(res => {
          if(res.code == 200) {
           this.spaceOpenOption = res.data.map(e => {
              e.label = e.message
              e.value = e.code
              e.key = e.code + e.message
              return e;
            })
          }
        })
      },
      //空间是否要审核
      getSpaceScaleList() {
        getSpaceScaleList().then(res => {
          if (res.code == 200) {
            this.ScaleList = res.data.map(e => {
              e.label = e.message
              e.value = e.code
              e.key = e.code + e.message
              return e;
            })
          }
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
    }
  }
</script>

<style scoped>

</style>
