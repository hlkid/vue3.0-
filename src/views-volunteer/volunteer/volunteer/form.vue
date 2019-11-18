<template>
    <section class="view-container ">
      <!-- <h3 class="title">志愿者信息{{dialogTitleType=="detail"?"详情":"修改"}}</h3> -->
      <el-form class="volun-form" :inline="true" :model="volunteerAdd" ref="volunteerAdd" :rules="rules" label-position="right"
               label-width="120px"  size="small">
<!--        <el-form-item label="统一编号" prop="unifiedNum">-->
<!--          <el-input v-model="volunteerAdd.unifiedNum" auto-complete="off"-->
<!--                    placeholder="&#45;&#45;"  readonly></el-input>-->
<!--        </el-form-item>-->
        <el-form-item label="证件类型"  prop="certificateTypeName">
          <el-select :disabled="dialogTitleType=='detail'" v-model="volunteerAdd.certificateType" placeholder="证件类型">
            <el-option v-for="item in certificateTypeList" :key="item.key" :value="item.value" :label="item.label"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="证件号码" v-if="volunteerAdd.certificateType"  prop="certificateNum">
          <el-input :disabled="dialogTitleType=='detail'" v-model="volunteerAdd.certificateNum" auto-complete="off" placeholder="证件号码" ></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input :disabled="dialogTitleType=='detail'" v-model="volunteerAdd.name" auto-complete="off" placeholder="姓名" ></el-input>
        </el-form-item>
        <el-form-item label="出生日期" prop="birthDate">
          <el-date-picker :disabled="dialogTitleType=='detail'"
            v-model="volunteerAdd.birthDate"
            type="date"  value-format="yyyy-MM-dd"
            placeholder="出生日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-select :disabled="dialogTitleType=='detail'" v-model="volunteerAdd.sex" placeholder="性别">
            <el-option v-for="item in sexList" :key="item.key" :value="item.value" :label="item.label"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所在地" prop="nationality">
          <el-select :disabled="dialogTitleType=='detail'" v-model="volunteerAdd.nationality" placeholder="所在地">
            <el-option v-for="item in nationalityList" :key="item.key" :value="item.value" :label="item.label"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="民族" prop="nation">
          <el-select :disabled="dialogTitleType=='detail'" v-model="volunteerAdd.nation" placeholder="民族">
            <el-option v-for="item in nationList" :key="item.key" :value="item.value" :label="item.label"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="政治面貌" prop="political">
          <el-select :disabled="dialogTitleType=='detail'" v-model="volunteerAdd.political" placeholder="政治面貌">
            <el-option v-for="item in politicalList" :key="item.key" :value="item.value" :label="item.label"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="学历" prop="education">
          <el-select :disabled="dialogTitleType=='detail'" v-model="volunteerAdd.education" placeholder="学历">
            <el-option v-for="item in educationList" :key="item.key" :value="item.value" :label="item.label"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="籍贯" prop="nativePlace">
          <el-input :disabled="dialogTitleType=='detail'" type="hidden" class="district-wraper" v-model="volunteerAdd.nativePlace">
            <el-select :disabled="dialogTitleType=='detail'" slot="append" v-model="nativeProvince" filterable placeholder="省" @change="changeProvince($event,1)" class="district">
              <el-option
                v-for="item in provinceList"
                :key="item.id"
                :label="item.districtName"
                :value="item.id">
              </el-option>
            </el-select>
            <el-select :disabled="dialogTitleType=='detail'" slot="append"  v-model="nativeCity" filterable placeholder="市" @change="changeCity($event,1)" class="district">
              <el-option
                v-for="item in cityList"
                :key="item.id"
                :label="item.districtName"
                :value="item.id">
              </el-option>
            </el-select>
            <el-select :disabled="dialogTitleType=='detail'" slot="append"  v-model="nativeArea" filterable placeholder="区/县" @change="changeArea($event,1)" class="district">
              <el-option
                v-for="item in areaList"
                :key="item.id"
                :label="item.districtName"
                :value="item.id">
              </el-option>
            </el-select>
          </el-input>
        </el-form-item>
        <el-form-item label="居住区域" prop="residentialArea">
          <el-input :disabled="dialogTitleType=='detail'" type="hidden" class="district-wraper" v-model="volunteerAdd.residentialArea">
            <el-select :disabled="dialogTitleType=='detail'" slot="append" v-model="residentialProvince" filterable placeholder="省" @change="changeProvince($event,2)" class="district">
              <el-option
                v-for="item in residentialprovinceList"
                :key="item.id"
                :label="item.districtName"
                :value="item.id">
              </el-option>
            </el-select>
            <el-select :disabled="dialogTitleType=='detail'" slot="append"  v-model="residentialCity" filterable placeholder="市" @change="changeCity($event,2)" class="district">
              <el-option
                v-for="item in residentialcityList"
                :key="item.id"
                :label="item.districtName"
                :value="item.id">
              </el-option>
            </el-select>
            <el-select :disabled="dialogTitleType=='detail'" slot="append"  v-model="residentialArea" filterable placeholder="区/县" @change="changeArea($event,2)" class="district">
              <el-option
                v-for="item in residentialareaList"
                :key="item.id"
                :label="item.districtName"
                :value="item.id">
              </el-option>
            </el-select>
          </el-input>
        </el-form-item>
        <el-form-item label="固定电话" prop="fixedTelephone">
          <el-input :disabled="dialogTitleType=='detail'" v-model="volunteerAdd.fixedTelephone" auto-complete="off" placeholder="固定电话" ></el-input>
        </el-form-item>
        <el-form-item label="移动电话" prop="mobilePhone">
          <el-input :disabled="true" v-model="volunteerAdd.mobilePhone" readonly auto-complete="off" placeholder="--" ></el-input>
        </el-form-item>
        <el-form-item label="电子邮箱" prop="email">
          <el-input :disabled="dialogTitleType=='detail'" v-model="volunteerAdd.email" auto-complete="off" placeholder="电子邮箱" ></el-input>
        </el-form-item>
        <el-form-item label="从业状况" prop="employmentStatus">
          <el-select :disabled="dialogTitleType=='detail'" v-model="volunteerAdd.employmentStatus" placeholder="从业状况">
            <el-option v-for="item in employmentStatusList" :key="item.key" :value="item.value" :label="item.label"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="服务区域" prop="serverArea">

          <el-input type="hidden" class="district-wraper" v-model="volunteerAdd.serverArea">
            <el-select :disabled="dialogTitleType=='detail'" slot="append" v-model="serverProvince" filterable placeholder="省" @change="changeProvince($event,3)" class="district">
              <el-option
                v-for="item in serverprovinceList"
                :key="item.id"
                :label="item.districtName"
                :value="item.id">
              </el-option>
            </el-select>
            <el-select :disabled="dialogTitleType=='detail'" slot="append"  v-model="serverCity" filterable placeholder="市" @change="changeCity($event,3)" class="district">
              <el-option
                v-for="item in servercityList"
                :key="item.id"
                :label="item.districtName"
                :value="item.id">
              </el-option>
            </el-select>
            <el-select :disabled="dialogTitleType=='detail'" slot="append"  v-model="serverArea" filterable placeholder="区/县" @change="changeArea($event,3)" class="district">
              <el-option
                v-for="item in serverareaList"
                :key="item.id"
                :label="item.districtName"
                :value="item.id">
              </el-option>
            </el-select>
          </el-input>
        </el-form-item>
        <el-form-item label="特长" prop="speciality">
          <el-select :disabled="dialogTitleType=='detail'" v-model="volunteerAdd.speciality" placeholder="特长"  multiple
                     collapse-tags>
            <el-option v-for="item in specialityList" :key="item.key" :value="item.value" :label="item.label"></el-option>
          </el-select>
        </el-form-item>

        <div class="form-btn-wraper">
          <el-button class="btn" @click="$router.back()">取消</el-button>
          <el-button class="btn" type="primary" @click="save">提交</el-button>
        </div>
      </el-form>
    </section>
</template>

<script>
  import {getVolunteerByUcid,volunteerApply,statusList, editVolunteer,getDicListByTypeCode } from '@/api/volunteer/volunteer'
  import { checkMobile ,checkEmail,checkTel} from "@/utils/validate";
  import {getOrgData,districtParentData,districtChildData,exitUser} from '@/api/config.js'
  export default {
      data(){
        return{
          id:'',
          dialogTitleType:"",
          volunteerAdd: {
            id:"",
            ucId:'',
            userIconId:"",
            certificateType: '',
            certificateNum:'',
            name:'',
            birthDate:'',
            sex:'',
            nationality:'',
            nation:'',
            political:'',
            education:'',
            nativePlace:'',
            residentialArea:'',
            fixedTelephone:'',
            mobilePhone:'',
            email:'',
            employmentStatus:'',
            serverArea:'',
            speciality:[],
            nativePlaceName:'',//籍贯
            residentialAreaName:'',//居住区域
            serverAreaName:'',//服务区域
          },
          rules:{
            name:[{required:true,message:'请输入姓名'}],
            // certificateType: [{required:true,message:'请选择证件类型'}],
            certificateNum:[{required:true,message:'请输入证件号码'}],

            birthDate:[{required:true,message:'请选择出生日期'}],
            sex:[{required:true,message:'请选择性别'}],
            nationality:[{required:true,message:'请选择所在地'}],
            nation:[{required:true,message:'请选择民族'}],
            political:[{required:true,message:'请选择政治面貌'}],
            education:[{required:true,message:'请选择学历'}],
            nativePlace:[{required:true,message:'请选择籍贯'}],
            residentialArea:[{required:true,message:'请选择居住区域'}],
            fixedTelephone:[{required:false,message:''},{validator:checkTel,message:'请输入正确的固定电话'}],
            mobilePhone:[{required:true,message:'请输入移动电话'},{validator:checkMobile,message:'请输入正确的移动电话'}],
            email:[{required:true,message:'请输入电子邮箱'},{validator:checkEmail,message:'请输入正确的电子邮箱'}],
            employmentStatus:[{required:true,message:'请输入从业状况'}],
            serverArea:[{required:true,message:'请输入服务区域'}],
            speciality:[{required:true,message:'请选择特长'}],
          },

          certificateTypeList:[],//证件类型
          sexList:[],//性别
          nationalityList:[],//所在地
          nationList:[],//民族
          politicalList:[],//政治面貌
          educationList:[],//学历
          employmentStatusList:[],//从业状态
          specialityList:[],//特长

          /*区域*/
          nativeProvince:'',
          nativeCity:'',
          nativeArea:'',
          districtNames:[],
          provinceList:[],
          cityList:[],
          areaList:[],


          residentialProvince:'',
          residentialCity:'',
          residentialArea:'',
          residentialNames:[],
          residentialprovinceList:[],
          residentialcityList:[],
          residentialareaList:[],

          serverProvince:'',
          serverCity:'',
          serverArea:'',
          serverNames:[],
          serverprovinceList:[],
          servercityList:[],
          serverareaList:[],

        }
      },
      created(){
        this.id = this.$route.params.id;
        this.dialogTitleType = this.$route.params.type;
        getVolunteerByUcid(this.id).then(res=>{
          for ( let key in this.volunteerAdd) {
            this.volunteerAdd[key] = res.data[key]
          }
          res.data.speciality && (this.volunteerAdd.speciality =  res.data.speciality.split(','));
          this.nativeProvince = res.data.nativePlace.split(',')[0];
          this.nativeCity = res.data.nativePlace.split(',')[1];
          this.nativeArea = res.data.nativePlace.split(',')[2];
          this.districtChildData(this.nativeProvince,this.cityList);
          this.districtChildData(this.nativeCity,this.areaList);

          this.residentialProvince = res.data.residentialArea.split(',')[0];
            this.residentialCity= res.data.residentialArea.split(',')[1];
            this.residentialArea= res.data.residentialArea.split(',')[2];
          this.districtChildData(this.residentialProvince,this.residentialcityList);
          this.districtChildData(this.residentialCity,this.residentialareaList);

          this.serverProvince = res.data.serverArea.split(',')[0];
            this.serverCity = res.data.serverArea.split(',')[1];
            this.serverArea = res.data.serverArea.split(',')[2];
          this.districtChildData(this.serverProvince,this.servercityList);
          this.districtChildData(this.serverCity,this.serverareaList);

          // console.log(this.volunteerAdd)

        });
        this.districtParentData();

        this.getDicListByTypeCode('cardType',this.certificateTypeList);

        this.getDicListByTypeCode('sexType',this.sexList);

        this.getDicListByTypeCode('nationality',this.nationalityList);

        this.getDicListByTypeCode('famousRace',this.nationList);

        this.getDicListByTypeCode('politicalStatus',this.politicalList);

        this.getDicListByTypeCode('eduDegree',this.educationList);

        this.getDicListByTypeCode('employmentStatus',this.employmentStatusList);

        this.getDicListByTypeCode('speciality',this.specialityList);

      },
      methods:{

        //字典
        getDicListByTypeCode(code,arr){
          getDicListByTypeCode(code).then(res=>{
            if (res.code == 200){
              res.data.forEach(e=>{
                e.label = e.valueName;
                e.key = e.valueName+e.value;
                arr.push(e);
              })
            }
          })
        },

        /*区域*/
        changeProvince(val,type){
          if(type == 1) {
            this.nativeCity='';
            this.nativeArea='';
            this.cityList = [];
            this.areaList = [];
            this.districtChildData(val,this.cityList);
            this.provinceList.forEach(item=>{
              if (val === item.id){
                this.districtNames[0] = item.districtName;
              }
            })
          }else if(type==2){
            this.residentialCity='';
            this.residentialArea='';
            this.residentialcityList = [];
            this.residentialareaList = [];
            this.districtChildData(val,this.residentialcityList);
            this.residentialprovinceList.forEach(item=>{
              if (val === item.id){
                this.residentialNames[0] = item.districtName;
              }
            })
          }else{
            this.serverCity='';
            this.serverArea='';
            this.servercityList = [];
            this.serverareaList = [];
            this.districtChildData(val,this.servercityList);
            this.serverprovinceList.forEach(item=>{
              if (val === item.id){
                this.serverNames[0] = item.districtName;
              }
            })
          }
        },
        changeCity(val,type){
          if(type == 1) {
            this.nativeArea=''
            this.areaList = [];
            this.districtChildData(val,this.areaList);
            this.cityList.forEach(item=>{
              if (val === item.id){
                this.districtNames[1] = item.districtName;
              }
            })
          }else if(type==2){
            this.residentialArea='';
            this.residentialareaList = [];
            this.districtChildData(val,this.residentialareaList);
            this.residentialcityList.forEach(item=>{
              if (val === item.id){
                this.residentialNames[1] = item.districtName;
              }
            })
          }else{
            this.serverArea='';
            this.serverareaList = [];
            this.districtChildData(val,this.serverareaList);
            this.servercityList.forEach(item=>{
              if (val === item.id){
                this.serverNames[1] = item.districtName;
              }
            })
          }
        },
        changeArea(val,type){
          if(type == 1) {
            this.areaList.forEach(item=>{
              if (val === item.id){
                this.districtNames[2] = item.districtName;
              }
            })
            this.volunteerAdd.nativePlace = [this.nativeProvince,this.nativeCity,this.nativeArea].toString();
            this.volunteerAdd.nativePlaceName = this.districtNames.toString();
          } else if(type == 2 ){
            this.residentialareaList.forEach(item=>{
              if (val === item.id){
                this.residentialNames[2] = item.districtName;
              }
            })
            this.volunteerAdd.residentialArea = [this.residentialProvince,this.residentialCity,this.residentialArea].toString();
            this.volunteerAdd.residentialAreaName = this.residentialNames.toString();
          }else{
            this.serverareaList.forEach(item=>{
              if (val === item.id){
                this.serverNames[2] = item.districtName;
              }
            })
            this.volunteerAdd.serverArea = [this.serverProvince,this.serverCity,this.serverArea].toString();
            this.volunteerAdd.serverAreaName = this.serverNames.toString();
          }
          // console.log(this.volunteerAdd)

        },
        //省级区域
        districtParentData() {
          districtParentData().then(res => {
            if (res.code == 200) {
              this.provinceList = res.data;
              this.residentialprovinceList = res.data;
              this.serverprovinceList = res.data;
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

        save(){
          let that = this;
          let data = JSON.parse(JSON.stringify(this.volunteerAdd));
          data.speciality = data.speciality.join(',');
          this.$refs['volunteerAdd'].validate(validator=>{
            if(validator){
              editVolunteer(data).then(res=>{
                if(res.code == 200){
                  that.$message.success("修改成功");
                  that.$router.back()
                }
              })
            }
          })
        },
      }
    }
</script>

<style scoped>
  .view-container {
    margin: 5px 5px 0 5px;
    padding: 20px;
    min-height: 665px;
    border: 1px solid #eee;
    background: #fff;
  }
  .title{
    padding: 0;
    margin: 0 0 20px 0;
  }

</style>
<style lang="scss">
  .volun-form{
    .el-select,.el-input{
      width: 300px;
    }
  }
  .district-wraper{
    .el-input-group__append{
      padding: 0;
      border: 1px solid #DCDFE6;
      border-radius: 4px;
      background-color:#fff;
      .district{
        .el-input{
          width: 100px;
        }
        width: 35%;
        margin: 0;
        &:nth-child(1){
          width: 30%;
        }
      }
    }
  }

  
.form-btn-wraper {
  margin-top: 30px;
  padding-left: 120px;
  .btn {
    padding: 9px 15px !important;
  }
}
</style>
