<template>
  <section class="view-container">
    <el-form class="hbsx-form" inline ref="dataForm" :model="dataForm" label-width="120px" :rules="rules"
             size="small">
      <el-form-item label="场馆名称" prop="name">
        <el-input v-model.trim="dataForm.name" clearable placeholder="场馆名称"></el-input>
      </el-form-item>
      <el-form-item label="关键字" prop="keyword">
<!--        <el-input v-model.trim="dataForm.keyword" clearable placeholder="关键字"></el-input>-->

        <el-select
          v-model="dataForm.keyword"
          multiple
          :multiple-limit="3"
          @input="keyInput"
          filterable
          allow-create
          default-first-option
          placeholder="关键字">
        </el-select>
      </el-form-item>
      <el-form-item label="开馆时间" prop="startTime">
          <el-input v-model.trim="dataForm.startTime" clearable placeholder="开馆时间"></el-input>
<!--        <el-date-picker-->
<!--          value-format="yyyy-MM-dd HH:mm:ss"-->
<!--          v-model="dataForm.startTime"-->
<!--          type="date">-->
<!--        </el-date-picker>-->
      </el-form-item>

      <el-form-item label="父级场馆" prop="parentId">
        <!--        <el-input v-model.trim="dataForm.startTime" clearable></el-input>-->
        <el-select v-model="dataForm.parentId" filterable placeholder="父级场馆">
          <el-option
            v-for="item in venueLists"
            :key="item.parentId"
            :label="item.name"
            :value="item.venueNum">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="场馆地址" prop="districtCode" class="block">
        <el-input type="hidden" v-model="dataForm.districtCode" class="district-wraper">
          <ProvinceCityArea slot="append" :districtCode="dataForm.districtCode" @receiveEvent="receiveEvent"></ProvinceCityArea>
        </el-input>
      </el-form-item>
      <el-form-item label="详细地址" prop="address">
        <el-input v-model.trim="dataForm.address" clearable placeholder="详细地址"></el-input>
      </el-form-item>
<!--      <el-form-item label="场馆面积" prop="area">-->
<!--        <el-input v-model.number="dataForm.area" clearable placeholder="场馆面积"></el-input>-->
<!--      </el-form-item>-->
      <el-form-item label="联系人" prop="contactPerson">
        <el-input v-model.trim="dataForm.contactPerson" clearable  placeholder="联系人"></el-input>
      </el-form-item>
      <el-form-item label="咨询电话" prop="contactTel">
        <el-input v-model.trim="dataForm.contactTel" clearable placeholder="联系电话000-0000000"></el-input>
      </el-form-item>
<!--      <el-form-item label="固定电话" prop="contactTel">-->
<!--        <el-input v-model.trim="dataForm.contactTel" clearable placeholder="固定电话"></el-input>-->
<!--      </el-form-item>-->
      <el-form-item label="级别" prop="level">
        <el-select v-model="dataForm.level" clearable placeholder="级别">
          <el-option :label="item.label" :value="item.value" v-for="item in levelList"
                     :key="'form'+item.key"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="评论是否审核">
        <el-switch v-model="dataForm.isExamine"></el-switch>
      </el-form-item>

      <el-form-item label="简介" prop="description" class="block edit-form">
        <WangEditor v-model="dataForm.description"></WangEditor>
        <!--<el-input type="textarea" :autosize="{ minRows: 3, maxRows: 1000 }" v-model.trim="dataForm.description"  clearable></el-input>-->
      </el-form-item>
      <div>
        <el-form-item label="封面" prop="cover">
          <el-upload
            class="single-uploader"
            :action="uploadFileParamsUrl"
            :on-success="handleSuccessCover"
            :before-upload="beforeAvatarCover"
            :show-file-list="false">
            <img v-if="dataForm.cover" class="single-uploader-venue" :src="cover">
            <i v-else class="el-icon-plus single-uploader-icon"></i>
            <div style="position: absolute;bottom:-50px;"> 请上传宽高比750*350的图片</div>
          </el-upload>
          <el-input type="hidden" v-model="dataForm.cover"></el-input>
        </el-form-item>
        <el-form-item label="logo" prop="logo">
          <el-upload
            class="single-uploader"
            :action="uploadFileParamsUrl"
            :on-success="handleSuccessLogo"
            :before-upload="beforeAvatarLogo"
            :show-file-list="false">
            <img v-if="dataForm.logo" class="single-uploader-img" :src="logo">
            <i v-else class="el-icon-plus single-uploader-icon"></i>
          </el-upload>
          <el-input type="hidden" v-model="dataForm.logo"></el-input>
        </el-form-item>
        <el-form-item label="二维码" prop="qrCode">
          <el-upload
            class="single-uploader"
            :action="uploadFileParamsUrl"
            :on-success="handleSuccessQrCode"
            :before-upload="beforeAvatarQrCode"
            :show-file-list="false">
            <img v-if="dataForm.qrCode" class="single-uploader-img" :src="qrCode">
            <i v-else class="el-icon-plus single-uploader-icon"></i>
          </el-upload>
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
  import {addVenue, getVenueDetail, editVenue, getVenueData,getWechatAccountData} from '@/api/mcc/venue.js'
  import {applicationDictionaryDataByTypeCode, districtParentData, districtChildData, getUserData} from '@/api/config.js'
  import {fileDetail, uploadFileUrl, getfiles} from '@/api/file.js'
  import WangEditor from '@/components/WangEditor'
  import ProvinceCityArea from '@/components/ProvinceCityArea'
  import { isDataType ,uploadSize} from '@/utils/common.js'
  import {checkNumber, checkMobile, mobile, checkTel} from "@/utils/validate";

  export default {
    components: {WangEditor,ProvinceCityArea},
    data() {

      return {
        dialogType: "add",
        uploadFileUrl: uploadFileUrl,
        dataForm: {
          id: '',
          name: '',
          keyword: '',
          cover: '',
          logo: '',
          qrCode: '',
          startTime: '',
          districtCode: '',
          districtName: '',
          address: '',
          mapPoint: '',
          // area: '',
          contactPerson: '',
          contactPhone: '',
          description: '',
          contactTel:"",
          level: '',
          parentId:"",
          isExamine:0,
          districtName: ''
        },


        levelList: [],
        allOperatorList: [],
        venueLists:[],
        WechatlList:[],
        WechatlLists:[],

        cover: "",
        logo: "",
        qrCode:"",

        rules: {
          cover: [{required: true, message: '请上传封面'}],
          logo: [{required: true, message: '请上传logo'}],
          name: [{required: true, message: '请输入场馆名称'}],
          startTime: [{required: true, message: '请输入开馆时间'}],
          level: [{required: true, message: '请选择场馆行级别'}],
          districtCode: [{required: true, message: '请选择场馆行政区'}],
          address: [{required: true, message: '请输入场馆行详细地址'}],
          description: [{required: true, message: '请输入场馆行简介'}],
          // area: [{required: true, message: '请输入区域面积'}],
          // contactPerson: [{required: true, message: '请输入联系人'}],
          contactPhone: [{required: false, message: '联系电话'}, {validator: mobile}],
          contactTel: [{required: false, message: '咨询电话'}, {validator: checkTel}],
        },
      }
    },

    methods: {
      // 省市区
      receiveEvent(data){
        this.dataForm.districtCode = data.mergerCode;
        // this.dataForm.address = data.mergerName.replace(/\,/g,'');
        this.dataForm.districtName = data.mergerName ? data.mergerName.split(',')[0] : '';
        // console.log(data)
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
        this.dataForm.keyword = keywordList;
      },
      //文件地址
      fileDetail(id, attr) {
        fileDetail(id).then(res => {
          if (res.code == 200 && res.data) {
            this[attr] = this.baseImgUrl + res.data.imgSmallCompress
          }
          ;
        })
      },

      // 封面文件上传 ----上传成功--
      handleSuccessCover(response, file, fileList) {
        this.dataForm.cover = response.data.id;
        this.fileDetail(response.data.id, 'cover')
      },
      //封面文件 上传限制
      async beforeAvatarCover(file){
        console.log('beforeAvatarCover')
        let width = 750;
        let height = 350;
        const isSize = await uploadSize(width,height,file);
        return isSize;
      },

      // qrCode文件上传  logo文件上传 ----上传成功--
      handleSuccessLogo(response, file, fileList) {
        this.dataForm.logo = response.data.id;
        this.fileDetail(response.data.id, 'logo')
      },
     //logo 上传限制
      async beforeAvatarLogo(file){
        let width = 200;
        let height = 200;
        const isSize = await uploadSize(width,height,file);
        return isSize;
      },


      //qrCode文件上传 ----上传成功--
      handleSuccessQrCode(response, file, fileList) {
        this.dataForm.qrCode = response.data.id;
        this.fileDetail(response.data.id, 'qrCode')
      },
      //qrCode文件 上传限制
      async beforeAvatarQrCode(file){
        let width = 200;
        let height = 200;
        const isSize = await uploadSize(width,height,file);
        return isSize;
      },
      /*--------*/
      //对话框
      sure() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.dialogType == 'add' && this.addVenue();
            this.dialogType == 'edit' && this.editVenue();
          }
        })
      },

      //列表
      //添加
      addVenue() {
        let params =  this.dataForm;
        delete  params.id;

        if(isDataType(params.keyword,'array')){
          params.keyword = params.keyword && params.keyword.join(',');
        }
        params.isExamine = params.isExamine?1:0;
        // console.log(params)
        addVenue(params).then(res => {
          if (res.code == 200) {
            this.$message.success('添加成功');
            this.$router.go(-1)
          }
        })
      },
      //编辑
      editVenue() {
        let params =  this.dataForm;

        if(isDataType(params.keyword,'array')){
          params.keyword = params.keyword && params.keyword.join(',');
        }
        params.isExamine = params.isExamine?1:0;
        editVenue(params).then(res => {
          if (res.code == 200) {
            this.$message.success('编辑成功');
            this.$router.go(-1);
          }
        })
      },

      //获取场馆详情
      getVenueDetail(id) {
        getVenueDetail(id).then(res => {
          if (res.code == 200) {
            for (let key in this.dataForm) {
              this.dataForm[key] = res.data[key];
            }
            this.dataForm.parentId = this.dataForm.parentId ? parseInt(this.dataForm.parentId) : '';// 数字类型场馆NUM回显
            this.dataForm.isExamine = res.data.isExamine == 0?false:true;
            this.dataForm.keyword = res.data.keyword?res.data.keyword.split(','):[];


            res.data.cover && this.fileDetail(res.data.cover, 'cover');
            res.data.logo && this.fileDetail(res.data.logo, 'logo');
            res.data.qrCode && this.fileDetail(res.data.qrCode, 'qrCode');
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
              })
            })
          }
        })
      },
      //所有运营人员列表
      getUserData() {
        getUserData({roleType: 2}).then(res => {
          if (res.code == 200 && res.data) {
            this.allOperatorList = res.data;
          };
        })
      },

      // 关联场馆的list
      getVenueData(id){
        getVenueData({id:id,examineStatus:1,publishStatus:1}).then(res => {
          if(res.code == 200){
            this.venueLists = res.data.map(e=>{
              e.parentId = e.id;
              e.key = e.id;
              return e;
            })
          }
        })
      }
    },
    created() {
      //所有运营人员列表
      this.getUserData();
      //行政区
      this.applicationDictionaryDataByTypeCode('venueLevel', this.levelList);

      if (this.$route.params.id) {
        this.getVenueDetail(this.$route.params.id);
        this.dialogType = "edit";
        this.getVenueData(this.$route.params.id);
      } else {
        this.dialogType = "add";
        this.getVenueData("")
      }

    }
  }
</script>

<style lang="scss" scoped>
  .select-accout{
   .selected{
     &::after{
       font-size: 0 !important;
     }
   }
  }
</style>
