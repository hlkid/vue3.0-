<template>
    <section class="view-container">
      <el-form class="hbsx-form" ref="dataForm"
               :model="dataForm"
               :rules="rules"
               inline
               label-width="120px"
               size="small" @submit.native.prevent>
        <el-form-item label="活动名称" prop="name" class="block">
          <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 5 }" v-model.trim="dataForm.name"></el-input>
        </el-form-item>
        <el-form-item label="活动关键字" prop="tag">
<!--          <el-input v-model="dataForm.tag" clearable placeholder=""></el-input>-->
          <el-select
            v-model="dataForm.tag"
            multiple
            :multiple-limit="3"
            @input="keyInput"
            filterable
            allow-create
            default-first-option
            placeholder="关键字">
          </el-select>
        </el-form-item>

        <el-form-item label="活动类型" prop="type">
          <el-select v-model="dataForm.type" clearable placeholder="">
            <el-option :label="item.label" :value="item.value" v-for="item in typeActivityList"
                       :key="item.key"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="报名类型" prop="purchaseType">
          <el-select v-model="dataForm.purchaseType" clearable placeholder="">
            <el-option :label="item.label" :value="item.value" v-for="item in purchaseTypeList"
                       :key="item.key"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="票价(元)" prop="amount" v-if="dataForm.purchaseType == 2">
          <el-input v-model="dataForm.amount" placeholder="" maxlength="5"></el-input>
        </el-form-item>

        <el-form-item label="可预约人数" prop="appointmentNum" v-if="dataForm.purchaseType == 2 || dataForm.purchaseType == 1" >
          <el-input v-model.number="dataForm.appointmentNum" placeholder="" maxlength="5"></el-input>
        </el-form-item>

<!--        <el-form-item label="排序" prop="sequence">-->
<!--          <el-input v-model="dataForm.sequence" clearable placeholder=""></el-input>-->
<!--        </el-form-item>-->
        <el-form-item label="联系方式" prop="contactInfo">
          <el-input v-model="dataForm.contactInfo" clearable placeholder=""></el-input>
        </el-form-item>
<!--        <el-form-item label="联系人" prop="contactPerson">-->
<!--          <el-input v-model="dataForm.contactPerson" clearable placeholder=""></el-input>-->
<!--        </el-form-item>-->

        <el-form-item label="区域编码" prop="districtCode" class="block">
          <el-input type="hidden" class="district-wraper" v-model="dataForm.districtCode">

            <ProvinceCityArea slot="append" :districtCode="dataForm.districtCode" @receiveEvent="receiveEvent"></ProvinceCityArea>

            <!--<el-select slot="append"  v-model="province" filterable placeholder="省" @change="changeProvince" class="district">
              <el-option
                v-for="item in provinceList"
                :key="item.id"
                :label="item.districtName"
                :value="item.id">
              </el-option>
            </el-select>
            <el-select slot="append"  v-model="city" filterable placeholder="市" @change="changeCity" class="district">
              <el-option
                v-for="item in cityList"
                :key="item.id"
                :label="item.districtName"
                :value="item.id">
              </el-option>
            </el-select>
            <el-select slot="append"  v-model="area" filterable placeholder="区/县" @change="changeArea" class="district">
              <el-option
                v-for="item in areaList"
                :key="item.id"
                :label="item.districtName"
                :value="item.id">
              </el-option>
            </el-select>-->
          </el-input>
        </el-form-item>

        <el-form-item label="地点" prop="address">
          <el-input v-model="dataForm.address" clearable placeholder=""></el-input>
        </el-form-item>

        <el-form-item label="开始结束时间" prop="startTime">
          <el-date-picker
            @change="onTimeChange"
            v-model="times"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetimerange"
            range-separator="~"
            start-placeholder="开始时间"
            end-placeholder="结束时间">
          </el-date-picker>
        </el-form-item>

        <!--<el-form-item label="开始时间" prop="startTime">
          <el-date-picker
            value-format="yyyy-MM-dd HH:mm:ss"
            :picker-options="pickerStartOptions"
            v-model="dataForm.startTime"
            type="datetime"
            placeholder="">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间" prop="endTime">
          <el-date-picker
            value-format="yyyy-MM-dd HH:mm:ss"
            :picker-options="pickerEndOptions"
            v-model="dataForm.endTime"
            type="datetime"
            placeholder="">
          </el-date-picker>
        </el-form-item>-->

        <el-form-item label="温馨提示" prop="copyright" class="block edit-form">
          <el-input v-model="dataForm.copyright" type="textarea" clearable placeholder="" :autosize="{ minRows: 4, maxRows: 10}"></el-input>
        </el-form-item>
        <el-form-item label="活动对象" prop="requirement" class="block edit-form">
<!--          <WangEditor v-model="dataForm.requirement"></WangEditor>-->
          <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 10 }" v-model="dataForm.requirement" clearable placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="内容" prop="content" class="block edit-form">
          <WangEditor v-model="dataForm.content"></WangEditor>
          <!--<el-input type="textarea" :autosize="{ minRows: 3, maxRows: 1000 }" v-model="dataForm.content" clearable placeholder=""></el-input>-->
        </el-form-item>
        <div>
          <el-form-item label="活动封面" prop="pcCover">
            <el-upload
              class="single-uploader"
              :action="uploadFileParamsUrl"
              :on-success="handleSuccessPcCover"
              :before-upload="beforeAvatarUpload"
              :show-file-list="false">
              <img v-if="dataForm.pcCover" class="single-uploader-activity" :src="pcCover">
              <i v-else class="el-icon-plus single-uploader-icon"></i>

              <div slot="tip" class="single-uploader-handle" v-if="dataForm.pcCover">
                <i class="single-uploader-delete el-icon-delete" @click.self.stop="handleDeleteSingleUploader('pcCover')"></i>
              </div>
              <div style="position: absolute;bottom:-50px;"> 请上传宽高比750*350的图片</div>

            </el-upload>
          </el-form-item>
         <!-- <el-form-item label="移动端封面" prop="mobileCover">
            <el-upload
              class="single-uploader"
              :action="uploadFileParamsUrl"
              :on-success="handleSuccessMobileCover"
              :show-file-list="false">
              <img v-if="dataForm.mobileCover" class="single-uploader-img" :src="mobileCover">
              <i v-else class="el-icon-plus single-uploader-icon"></i>
              <div slot="tip" class="single-uploader-handle" v-if="dataForm.mobileCover">
                <i class="single-uploader-delete el-icon-delete" @click.self.stop="handleDeleteSingleUploader('mobileCover')"></i>
              </div>
            </el-upload>
          </el-form-item>-->
        </div>


        <div class="btns-waper">
            <el-button size="small" @click="back">返回</el-button>
            <el-button size="small" type="primary" :disabled="vloading" @click="sure">提 交</el-button>
        </div>
      </el-form>


    </section>
</template>

<script>
  import { getSubjectDataPage } from '@/api/mcc/theme.js'
  import { addActivity,editActivity,getActivityDetail } from '@/api/mcc/activity.js'
  import { applicationDictionaryDataByTypeCode,districtParentData,districtChildData } from '@/api/config.js'
  import { fileDetail ,uploadFileUrl, getfiles} from '@/api/file.js'
  import WangEditor from '@/components/WangEditor'
  import ProvinceCityArea from '@/components/ProvinceCityArea'
  import { isDataType ,uploadSize} from '@/utils/common.js'
  import { checkMoney,mobile,checkNumber } from "@/utils/validate";
  export default {
    data(){
      let pickerStartTime = (time)=>{
        if (this.dataForm.endTime) {
          return time.getTime() >= new Date(this.dataForm.endTime).getTime();
        }
      };
      let pickerEndTime = (time)=>{
        if (this.dataForm.startTime){
          return time.getTime() <= new Date(this.dataForm.startTime).getTime();
        }
      };
      return{
        uploadFileUrl:uploadFileUrl,
        type:'',//add新增edit编辑
        pcCover:'',
        mobileCover:'',
        //行政区
        province:'',
        city:'',
        area:'',
        provinceList:[],
        cityList:[],
        areaList:[],

        queryTheme:{
          pageNum:1,
          pageSize:1000,
          name:'',
          type:'',
          examineStatus: 1,
          publishStatus: 1,
          selectFlag: 0,
          displayType: 0
        },
        subjectList:[],

        times: [],// 重新登录
        dataForm:{
          id:'',purchaseType:"",amount:'',tag:'',copyright:'活动现场需要进行扫码签到。具体参与方式请以主办方公布为准，您可以拨打电话进行咨询。',
          name:'',pcCover:'',mobileCover:'',type:'',startTime:'',endTime:'',
          requirement:'',contactInfo:'',appointmentNum:'',sequence:'',
          districtCode:'',address:'',contactPerson:'',content:'',prompt:'',idSubject:'',photo:'',video:''
        },
        rules:{
          name:[{ required: true, message: '请输入活动名称'}],
          purchaseType:[{ required: true, message: '请选择报名类型'}],
          amount:[{required: true, message: '请输入金额'},{  validator:checkMoney }],
          appointmentNum:[{required: true, message: '请输入预约人数'},{validator:checkNumber}],
          contactInfo:[{required: true, message: '请输入联系方式'},{validator:mobile}],
          districtCode:[{ required: true, message: '请选择省市区'}],
          address:[{ required: true, message: '请输入活动地点'}],
          type:[{ required: true, message: '请选择活动类型'}],
          attribute:[{ required: true, message: '请选择征集类型'}],
          startTime:[{ required: true, message: '请选择开始时间'}],
          endTime:[{ required: true, message: '请选择结束时间'}],
          pcCover:[{ required: true, message: '请上传PC端封面'}],
          copyright:[{ required: true, message: '请输入温馨提示'}],
          requirement:[{ required: false, message: '请输入活动对象'}],
          content:[{ required: true, message: '请输入内容'}],
        },
        //数据字典
        levelList:[],
        typeActivityList:[],
        purchaseTypeList:[],

        //开始时间结束时间
        pickerStartOptions:{
          disabledDate(time) {
            return pickerStartTime(time)
          },
        },
        pickerEndOptions:{
          disabledDate(time) {
            return pickerEndTime(time)
          },
        },
      }
    },
    components:{WangEditor, ProvinceCityArea},
    created(){
      let id = this.$route.params.id; //活动ID
      if(id){
        this.type = 'edit';
        this.getActivityDetail(id);
      }else{
        this.type = 'add';
      }
      //行政区
      // this.districtParentData();
      //this.applicationDictionaryDataByTypeCode('venueLevel',this.levelList);
      //获取活动类型列表
      this.applicationDictionaryDataByTypeCode('typeActivity',this.typeActivityList);
      this.applicationDictionaryDataByTypeCode('purchaseType',this.purchaseTypeList);

    },
    methods:{
      // 省市区
      receiveEvent(data){
        this.dataForm.districtCode = data.mergerCode;
        // this.dataForm.address = data.mergerName.replace(/\,/g,'');
        // console.log(data)
      },
      //时间区间
      onTimeChange(val) {
        if (val.length) {
          this.dataForm.startTime = val[0]
          this.dataForm.endTime = val[1]
        }
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
        this.dataForm.tag = keywordList;
      },

      //选择主题
      changeSubject(val){
        this.subjectList.forEach(item=>{
          if(val === item.id){
            this.dataForm.idSubject = item.id;
          }
        })
      },
      remoteSubjectMethod(name){
        this.queryTheme.name = name;
        getSubjectDataPage(this.queryTheme).then(res=>{
          if (res.code == 200 && res.data){
            this.subjectList = res.data.result;
          };
        })
      },
      sure(){
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.type == 'add' && this.addActivity();
            this.type == 'edit' && this.editActivity();
          }
        })
      },
      //qrCode文件上传 ----上传成功--
      handleSuccessPcCover(response, file, fileList){
        this.dataForm.pcCover = response.data.id;
        this.dataForm.mobileCover = response.data.id;
        this.fileDetail(response.data.id,'pcCover')
      },

      async beforeAvatarUpload(file){
        let width = 750;
        let height = 350;
        const isSize = await uploadSize(width,height,file);
        return isSize;
      },

      handleSuccessMobileCover(response, file, fileList){
        this.dataForm.mobileCover = response.data.id;
        this.fileDetail(response.data.id,'mobileCover')
      },
      //移除图片
      handleDeleteSingleUploader(attr){
        this[attr] = '';
        this.dataForm[attr] = '';
      },
      //文件地址
      fileDetail(id,attr){
        fileDetail(id).then(res=>{
          if (res.code == 200 && res.data){
            this[attr] = this.baseImgUrl + res.data.imgSmallCompress
          };
        })
      },
      getfiles(ids){
          this.materialFileList = [];
          getfiles({ids:ids}).then(res=>{
            if(res.code == 200){
              res.data.forEach(e=>{
                this.materialFileList.push({name:e.name,url:this.baseImgUrl + e.path,id:e.id})
              })
            }
          })
      },
      //添加
      addActivity(){
        let params =  this.dataForm;
        if(isDataType(params.tag,'array')){
          params.tag = params.tag && params.tag.join(',');
        }
        addActivity(params).then(res=>{
          if (res.code == 200){
            this.$message.success('添加成功');
            this.$router.back()
          }
        })
      },
      //编辑
      editActivity(){
        let params =  this.dataForm;
        if(isDataType(params.tag,'array')){
          params.tag = params.tag && params.tag.join(',');
        }
        editActivity(params).then(res=>{
          if (res.code == 200){
            this.$message.success('编辑成功')
            this.$router.back()
          }
        })
      },
      //详情
      getActivityDetail(id) {
        getActivityDetail(id).then(res => {
          if (res.code == 200) {
            for (let key in this.dataForm){
              this.dataForm[key] = res.data[key]
            }
            this.dataForm.tag = res.data.tag?res.data.tag.split(','):[];
            /*let districtCode = this.dataForm.districtCode.split(',') || ['','',''];
            this.province = districtCode[0];
            this.city = districtCode[1];
            this.area = districtCode[2];
            this.districtChildData(this.province,this.cityList);
            this.districtChildData(this.city,this.areaList);*/
            this.dataForm.pcCover && this.fileDetail(this.dataForm.pcCover,'pcCover')
            this.dataForm.mobileCover && this.fileDetail(this.dataForm.mobileCover,'mobileCover')

            this.times = [this.dataForm.startTime,this.dataForm.endTime];
          }
        })
      },
      //数据词典
      applicationDictionaryDataByTypeCode(code,arr=[]){
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
      }
    }
  };
</script>

<style lang="scss" scoped>

</style>
