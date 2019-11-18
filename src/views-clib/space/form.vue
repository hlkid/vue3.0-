<template>
  <section class="view-container">
    <el-form class="hbsx-form" inline ref="dialogForm" :model="dialogForm" label-width="120px" :rules="rules"
             size="small">
      <el-form-item label="空间编码" prop="code" v-if="dialogType=='edit'">
        <el-input v-model.trim="code" clearable placeholder="请输入空间编码" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="所属场馆" prop="idVenue">
        <el-select v-model="dialogForm.idVenue" placeholder="请选择场馆名称" @change="veuneChange">
          <el-option
            v-for="item in instNameList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="空间名称" prop="name">
        <el-input v-model.trim="dialogForm.name" clearable placeholder="请输入空间名称"></el-input>
      </el-form-item>
      <el-form-item label="空间面积" prop="area">
        <el-input v-model="dialogForm.area" clearable placeholder="请输入空间面积"><template slot="append">㎡</template></el-input>
      </el-form-item>
      <el-form-item label="容纳人数" prop="capacity">
        <el-input v-model.number="dialogForm.capacity" clearable placeholder="请输入容纳人数"></el-input>
      </el-form-item>
      <el-form-item label="楼或馆名" prop="constructName">
        <el-input v-model.trim="dialogForm.constructName" clearable placeholder="请输入楼或馆名"></el-input>
      </el-form-item>
      <el-form-item label="所在楼层" prop="constructFloor">
        <el-input v-model.number="dialogForm.constructFloor" clearable placeholder="请输入所在楼层"></el-input>
      </el-form-item>
      <el-form-item label="详细位置" prop="address">
        <el-input v-model.trim="dialogForm.address" clearable placeholder="请输入详细位置"></el-input>
      </el-form-item>
      <el-form-item label="咨询电话" prop="serviceTelephone">
        <el-input v-model.trim="dialogForm.serviceTelephone" clearable placeholder="请输入联系电话"></el-input>
      </el-form-item>
      <el-form-item label="空间用途" prop="useFor">
        <el-select v-model="dialogForm.useFor" placeholder="请选择空间用途">
          <el-option
            v-for="item in useforList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="空间标签" prop="labelIds">
          <el-select
            v-model="dialogForm.labels"
            multiple
            :multiple-limit="3"
            @input="keyInput"
            filterable
            allow-create
            default-first-option
            placeholder="请输入空间标签">
          </el-select>

      </el-form-item>

      <el-form-item label="是否有门禁" prop="isAccessControl">
          <el-radio-group v-model="dialogForm.isAccessControl">
            <el-radio v-for="item in doorLockList" :label="item.value" :key="item.key">{{item.label}}</el-radio>
          </el-radio-group>
      </el-form-item>
      <div>
        <el-form-item label="开放时间" prop="startTime">
          <el-time-picker
            is-range
            @change="timeChange"
            value-format="HH:mm:ss"
            v-model="times"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            placeholder="选择时间范围">
          </el-time-picker>
        </el-form-item>
      </div>


      <el-form-item label="空间类型" prop="spaceType">
        <el-select v-model="dialogForm.spaceType">
          <el-option v-for=" item in spaceTypeOption" :label="item.label" :value="item.value" :key="item.key"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="空间规模" prop="dimensions">
        <el-select v-model="dialogForm.dimensions">
          <el-option v-for=" item in spaceScaleOption" :label="item.label" :value="item.value" :key="item.key"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="空间设备" prop="facilityIds"  class="block">
        <el-checkbox-group v-model="checkedEquipment" @change="handleCheckedChange">
          <el-checkbox v-for="item in spaceEquipment" :label="item.value" :key="item.id">{{item.label}}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>

      <el-form-item label="空间简述" prop="resume" class="block">
        <el-input
          type="textarea"
          placeholder="请输入空间简述"
          v-model="dialogForm.resume"
          :autosize="{ minRows: 4, maxRows: 10 }"
          maxlength="100"
          show-word-limit>
        </el-input>
      </el-form-item>

      <el-form-item label="空间描述" prop="detail" class="block edit-form">
        <WangEditor v-model="dialogForm.detail"></WangEditor>
      </el-form-item>
      <div>
        <el-form-item label="空间封面" prop="coverId">
          <!--:before-upload="beforeAvatarUpload"-->
          <Uploader :fileList="coverList" @getList="getCoverList" :limit="1" :type="0"></Uploader>
        </el-form-item>
        <el-form-item label="座位分布图" prop="layoutId">
          <Uploader :fileList="layoutIdList" @getList="getLayoutIdList" :limit="1" :type="0"></Uploader>
        </el-form-item>
      </div>

      <div class="btns-waper">
        <el-button @click="$router.go(-1)">取 消</el-button>
        <el-button type="primary" :disabled="vloading" @click="sure">确 定</el-button>
      </div>

    </el-form>
  </section>
</template>

<script>
  import { applicationDictionaryDataByTypeCode } from '@/api/config'
  import {createSpace, getSpaceDetail, editSpace} from '@/api/clib/space'
  import { getVenueData } from '@/api/mcc/venue'
  import Uploader from "@/components/Uploader";
  import WangEditor from '@/components/WangEditor'
  import { isDataType ,uploadSize} from '@/utils/common.js'
  import {checkNumFloat, checkNumber,checkMobile, mobile, checkTel} from "@/utils/validate";
  const spaceEquipmentOptions = [{label:'空调', value: '1'},{label:'电脑',value: '2'}, {label:'椅子',value: '3'}];
  export default {
    components: {WangEditor,Uploader},
    data() {
      return {
        spaceEquipment: spaceEquipmentOptions,//空间设备
        checkedEquipment: [],//默认选中的设备
        instNameList:[], //场馆名称
        doorLockList:[],//门禁
        useforList:[],//空间用途
        spacetagsList:[],//空间标签
        spaceTypeOption:[],//空间类型
        spaceScaleOption:[],//空间规模
        coverList:[],
        layoutIdList:[],
        dialogType: "add",
        id:'',
        code:'',
        dialogForm: {
          idVenue:'',
          venueNum:'',
          name:'',
          constructName:'',
          constructFloor:'',
          address:'',
          serviceTelephone:'',
          useFor:'',
          isAccessControl:'',
          capacity:'',
          area:'',
          resume:'',
          labels:'',
          facilityIds:'',
          coverId:'',
          detail:'',
          layoutId:'',
          spaceType:'',
          dimensions:'',
          startTime:'',
          endTime:'',
        },
        cover: "",
        layout: "",
        times:["",""],
        rules: {
          name: [{required: true, message: '请输入空间名称'}],
          idVenue: [{required: true, message: '请选择所属场馆'}],
          area: [{required: false, message: '请输入空间面积'},{ validator:checkNumFloat}],
          capacity: [{required: true, message: '请选择容纳人数'},{validator:checkNumber}],
          constructName: [{required: false, message: '请输入楼栋'}],
          constructFloor: [{required: true, message: '请输入所在楼层'},{validator:checkNumber}],
          address: [{required: false, message: '请输入详细位置'}],
          serviceTelephone: [{required: true, message: '请输入咨询电话'},{validator:mobile}],
          useFor: [{required: true, message: '请选择空间用途'}],
          labels: [{required: false, message: '请输入标签'}],
          isAccessControl:{required: true, message: '请选择门禁'},
          facilityIds: [{required: false, message: '请选择空间设备'}],
          resume: [{required: true, message: '请选择空间简述'}],
          detail: [{required: true, message: '请选择空间描述'}],
          coverId: [{required: true, message: '请上传封面'}],
          spaceType: [{required: true, message: '请选择空间类型'}],
          dimensions: [{required: true, message: '请选择空间规模'}],
          startTime: [{required: true, message: '请选择开放时间'}],
        },
      }
    },

    methods: {

      //选择空间设备
      handleCheckedChange(value) {
        let checkedCount = value.length;
        if(checkedCount){
          this.dialogForm.facilityIds = value.join(',')
        } else {
          this.dialogForm.facilityIds = ""
        }
      },
      //封面上传
      getCoverList(list) {
        this.coverList = list;
        this.dialogForm.coverId =  list
          .map(i => {
            return i.id;
          }).toString();
      },
      //座位分布图
      getLayoutIdList(list) {
        this.layoutIdList = list;
        this.dialogForm.layoutId =  list
          .map(i => {
            return i.id;
          }).toString();
      },
      timeChange(e){
        console.log(e)
        if(e.length) {
          this.dialogForm.startTime = e[0];
          this.dialogForm.endTime = e[1];
        }
      },

      //对话框
      sure() {
        this.$refs['dialogForm'].validate((valid) => {
          if (valid) {
            this.dialogType == 'add' && this.add();
            this.dialogType == 'edit' && this.editSpace();
          }
        })
      },

      keyInput(list){
        let keywordList = [];
        list.forEach(e=>{
          if(e.length <= 5){
            keywordList.push(e);
          }else{
            this.$message.error("关键字最多5个字")
          }
        });
        this.dialogForm.labels = keywordList;
      },

      //添加
      add() {
        let params =  JSON.parse(JSON.stringify(this.dialogForm));
        // delete  params.id;
        if(isDataType(params.labels,'array')){
          params.labels = params.labels && params.labels.join(',');
        }
        createSpace(params).then(res => {
          if (res.code == 200) {
            this.$message.success('添加成功');
            this.$router.go(-1)
          }
        })
      },
      //编辑
      editSpace() {
        let params =  this.dialogForm;
        if(isDataType(params.labels,'array')){
          params.labels = params.labels && params.labels.join(',');
        }
        params.id = this.id;
        editSpace(params).then(res => {
          if (res.code == 200) {
            this.$message.success('编辑成功');
            this.$router.go(-1);
          }
        })
      },

      veuneChange(id){
        let data = this.instNameList.find(e => e.id == id);
        if(data){
           this.dialogForm.venueNum = data.venueNum;
        }
      },

      //获取空间详情
      getSpaceDetail(id) {
        getSpaceDetail(id).then(res => {
          if (res.code == 200) {
            for (let key in this.dialogForm) {
              this.dialogForm[key] = res.data[key];
            }
            this.code = res.data.code;
            // 空间设备
            this.dialogForm.labels = res.data.labels.split(',');
            this.checkedEquipment = this.dialogForm.facilityIds.split(',');
            let dataStrArr = this.dialogForm.facilityIds.split(',');
            //数组中字符串转int类型
            dataStrArr.forEach(item => {
              this.checkedEquipment.push(+item);
            });
            //封面
            let coverFile = res.data.coverFile
            coverFile && (this.coverList = [{
              id: coverFile.id,
              type: coverFile.type,
              name: coverFile.name,
              path: this.baseImgUrl + coverFile.path,
              url: this.baseImgUrl + ( coverFile.type == 0 ? coverFile.path : coverFile.imgSourceCompress)
            }]);
            let layoutFile = res.data.layoutFile
            layoutFile &&  (this.layoutIdList = [{
                id: layoutFile.id,
                type: layoutFile.type,
                name: layoutFile.name,
                path: this.baseImgUrl + layoutFile.path,
                url: this.baseImgUrl + ( layoutFile.type == 0 ? layoutFile.path : layoutFile.imgSourceCompress)
            }]);

          }
        })
      },

      //数据词典
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

      //场馆list
      getVenueData () {
        let that = this
        getVenueData().then(res => {
          that.instNameList = res.data.map(e => {
            e.label = e.name
            e.value = e.id
            e.key = e.name + e.id
            return e
          })
        })
      },

    },

    created() {
      if (this.$route.params.id) { //编辑
        this.getSpaceDetail(this.$route.params.id);
        this.id = this.$route.params.id;
        this.dialogType = "edit";
      } else {  //新增
        this.dialogType = "add";
      }
      this.getVenueData();
      this.applicationDictionaryDataByTypeCode(this.$dicts.spaceUse,this.useforList); //空间用途
      this.applicationDictionaryDataByTypeCode(this.$dicts.doorLock,this.doorLockList); //空间门禁
      this.applicationDictionaryDataByTypeCode(this.$dicts.spaceType,this.spaceTypeOption); //空间类型
      this.applicationDictionaryDataByTypeCode(this.$dicts.spaceScale,this.spaceScaleOption); //空间规模
    }
  }
</script>
<style>
  .el-tag + .el-tag,.el-tag  {
    margin-right: 10px;
    margin-bottom: 10px;
  } {
    margin-right: 10px;
    margin-bottom: 10px;
  }
</style>
<style lang="scss" scoped>

  .select-accout{
   .selected{
     &::after{
       font-size: 0 !important;
     }
   }
  }
</style>
