<template>
  <section class="view-container ">
    <!-- <div class="formTitle">团队管理信息{{dialogTitleType==''?'新增':dialogTitleType=='edit'?'修改':'查看'}}</div> -->
    <h3>团队管理员详情</h3>
    <el-form class="dialog-form add-user_form" inline :rules="rules" :model="userForm" ref="userForm"
      label-position="right" label-width="180px" size="small">
      <el-form-item label="联系人姓名" prop="userName">
        <el-input v-model="userForm.userName" auto-complete="off" placeholder="" :disabled="dialogTitleType=='detail'">
        </el-input>
      </el-form-item>
      <el-form-item label="联系人移动电话" prop="mobilePhone">
        <el-input v-model="userForm.mobilePhone" auto-complete="off" placeholder=""
          :disabled="dialogTitleType=='detail'||dialogTitleType=='edit'"></el-input>
      </el-form-item>
      <el-form-item label="联系人固定电话" prop="fixedTelephone">
        <el-input v-model="userForm.fixedTelephone" auto-complete="off" placeholder=""
          :disabled="dialogTitleType=='detail'"></el-input>
      </el-form-item>
      <el-form-item label="联系人电子邮箱" prop="email">
        <el-input v-model="userForm.email" auto-complete="off" placeholder="" :disabled="dialogTitleType=='detail'">
        </el-input>
      </el-form-item>

    </el-form>
    <div class="form-btn-wraper" v-if="dialogTitleType=='edit'">
      <el-button class="btn" type="primary" @click="groupUserSumbit()">更新团队管理员信息</el-button>
    </div>
    <h3>团队详情</h3>
    <el-form class="groups-form" :model="orgAdd" ref="orgAdd" :rules="rules" label-position="right" label-width="120px"
      size="small">
      <el-form-item style="width:500px" label="团队名称" prop="groupName">
        <el-input v-model="orgAdd.groupName" auto-complete="off" placeholder="" :disabled="dialogTitleType=='detail'">
        </el-input>
      </el-form-item>
      <el-form-item label="登记备案情况" prop="registerSituation" style="width:500px">
        <el-select v-model="orgAdd.registerSituation" filterable clearable placeholder="请选择登记备案情况" :disabled="dialogTitleType=='detail'">
          <el-option :label="item.typeName" :value="item.value" :key="index"
            v-for="(item,index) in registrationList">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="所在单位性质" prop="companyNature" style="width:500px">
        <el-select v-model="orgAdd.companyNature" filterable clearable placeholder="请选择所在单位性质" :disabled="dialogTitleType=='detail'">
          <el-option :label="item.typeName" :value="item.value" :key="index" v-for="(item,index) in unitTypeList">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="所在区域" prop="areaCodeName" style="width:500px">
        <el-input type="hidden" class="district-wraper" v-model="orgAdd.areaCodeName">
          <el-select :disabled="dialogTitleType=='detail'" slot="append" v-model="residentialProvince" filterable placeholder="省"
            @change="changeProvince($event,2)" class="district">
            <el-option v-for="item in provinceList" :key="item.id" :label="item.districtName" :value="item.id">
            </el-option>
          </el-select>
          <el-select :disabled="dialogTitleType=='detail'" slot="append" v-model="residentialCity" filterable placeholder="市" @change="changeCity($event,2)"
            class="district">
            <el-option v-for="item in cityList" :key="item.id" :label="item.districtName" :value="item.id">
            </el-option>
          </el-select>
          <el-select :disabled="dialogTitleType=='detail'" slot="append" v-model="residentialArea" filterable placeholder="区/县" @change="changeArea($event,2)"
            class="district">
            <el-option v-for="item in areaList" :key="item.id" :label="item.districtName" :value="item.id">
            </el-option>
          </el-select>
        </el-input>
      </el-form-item>

      <el-form-item label="详细地址" prop="address" style="width:500px">
        <el-input v-model="orgAdd.address" auto-complete="off" placeholder="" :disabled="dialogTitleType=='detail'">
        </el-input>
      </el-form-item>

      <el-form-item label="成立日期" prop="establishDate" style="width:500px">
        <el-date-picker value-format="yyyy-MM-dd" v-model="orgAdd.establishDate" type="date" :disabled="dialogTitleType=='detail'"
          placeholder="成立日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="团队人数" prop="peopleNum" style="width:500px">
        <el-input v-model.number="orgAdd.peopleNum" auto-complete="off" placeholder=""
          :disabled="dialogTitleType=='detail'"></el-input>
      </el-form-item>
      <el-form-item label="团队简要描述" prop="groupDescribe" style="width:500px">
        <el-input type="textarea" v-model="orgAdd.groupDescribe" auto-complete="off" placeholder=""
          :disabled="dialogTitleType=='detail'"></el-input>
      </el-form-item>
      <el-form-item label="主管单位" prop="venueId" @change="venueChange" style="width:500px">
        <el-select v-model="orgAdd.venueId" placeholder="场馆名称" :disabled="dialogTitleType=='detail'">
          <el-option v-for="item in venueOption" :key="item.key" :value="item.value" :label="item.label"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="团队LOGO图片">
        <img style="width:200px;" v-if="dialogTitleType=='detail'" :src="coverList.length>0?coverList[0].url:''">
        <Uploader v-else :fileList="coverList" @getList="getCoverList" :limit="1" :type="0" :square="false"></Uploader>
      </el-form-item>

    </el-form>
    <div class="form-btn-wraper">
      <el-button class="btn" @click="$router.back()">返回</el-button>
      <el-button v-if="dialogTitleType==''" class="btn" type="primary" @click="sumbit()">提交</el-button>
      <el-button v-if="dialogTitleType=='edit'" class="btn" type="primary" @click="groupSumbit()">更新团队信息</el-button>
    </div>
  </section>
</template>

<script>
import {
  groupRegister,
  getDetailById,
  getGroupDataPage,
  groupApply,
  groupData,
  getDicListByTypeCode,
  updateGroup,
  updateGroupUser
} from "@/api/volunteer/volunteer";
import { checkMobile, checkEmail, checkTel } from "@/utils/validate";
import { districtParentData, districtChildData } from "@/api/config.js";
import { getVenueData } from "@/api/mcc/venue";
import Uploader from "@/components/Uploader";

export default {
  data() {
    return {
      userForm: {
        id:"",
        groupUserId:"",
        userName: "",
        mobilePhone: "",
        fixedTelephone: "",
        email: ""
      },
      coverList: [],
      registrationList: [],
      unitTypeList: [],
      venueOption: [],
      residentialProvince: "",
      residentialCity: "",
      residentialArea: "",
      residentialProvinceName: "",
      residentialCityName: "",
      residentialAreaName: "",
      orgAdd: {
        groupName: "",
        registerSituation: "",
        areaCode: "",
        areaCodeName: "",
        companyNature: "",
        residentialAreaName: "", //居住区域
        address: "",
        establishDate: "",
        peopleNum: "",
        groupDescribe: "",
        groupLogoId: "",
        venueId: "",
        venueNum: ""
      },
      provinceList: [], //省
      cityList: [], //市
      areaList: [], //地区

      certificateImgUrl: "",
      groupSealImgUrl: "",
      dialogTitleType: "",

      id: "",

      rules: {
        userName: [{ required: true, message: "请输入用户名" }],
        mobilePhone: [
          { required: true, message: "请输入移动电话" },
          { validator: checkMobile, message: "请输入正确的移动电话" }
        ],
        email: [
          { required: true, message: "请输入电子邮箱" },
          { validator: checkEmail, message: "请输入正确的电子邮箱" }
        ],
        groupName: [{ required: true, message: "请输入志愿者团队名称" }],
        venueId: [{ required: true, message: "请选择馆场" }],
        areaCodeName: [{ required: true, message: "请选择居住区域" }]
      }
    };
  },
  components: { Uploader },
  created() {
    let _this=this;
    this.id = this.$route.params.id;
    if (this.$route.params.id && this.$route.params.id != "") {
      this.dialogTitleType = this.$route.params.type;

      getDetailById(this.id).then(res => {
        console.info("详情接口字段",res)
        if(res.code==200){
          let detail=res.data;
        for (let key in this.userForm) {
          this.userForm[key] = detail[key];
        }
        this.userForm.userName=detail.contactsName
        for (let key in this.orgAdd) {
          this.orgAdd[key] = detail[key];
        }
        //封面
        detail.groupLogoId && (this.coverList = [{
          id: detail.groupLogoId,
          path: this.baseImgUrl + detail.groupLogoPath,
          url: this.baseImgUrl + detail.groupLogoPath
        }]);

        this.residentialProvince = detail.areaCode.split(",")[0];
        this.residentialCity = detail.areaCode.split(",")[1];
        this.residentialArea = detail.areaCode.split(",")[2];
        this.districtChildData(this.residentialProvince, this.cityList);
        this.districtChildData(this.residentialCity, this.areaList);
        }
      });
    }

    this.districtParentDataFun();

    this.getVenueData();

    this.getDicListByTypeCode("registration", this.registrationList);
    this.getDicListByTypeCode("unitType", this.unitTypeList);
  },

  methods: {
    //字典
    getDicListByTypeCode(code, arr) {
      getDicListByTypeCode(code).then(res => {
        if (res.code == 200) {
          res.data.forEach(e => {
            e.label = e.valueName;
            e.key = e.valueName + e.value;
            arr.push(e);
          });
        }
      });
    },
    //所属馆场切换事件
    venueChange: function(e) {
      console.info(e);
    },
    //场馆list
    getVenueData() {
      let _this = this;
      getVenueData().then(res => {
        _this.venueOption = res.data.map(e => {
          e.label = e.name;
          e.value = e.id;
          e.key = e.name + e.id;
          return e;
        });
        _this.orgAdd.venueId = _this.venueOption[0].id;
        _this.orgAdd.venueNum = _this.venueOption[0].venueNum;
      });
    },
    //省级区域
    districtParentDataFun: function() {
      districtParentData().then(res => {
        if (res.code == 200) {
          this.provinceList = res.data;
        }
      });
    },
    //省级子级区域
    districtChildData: function(parentId, arr = []) {
      districtChildData(parentId).then(res => {
        if (res.code == 200) {
          res.data.forEach(item => {
            arr.push(item);
          });
        }
      });
    },
    /*区域*/
    changeProvince(val, type) {
      this.nativeCity = "";
      this.nativeArea = "";
      this.cityList = [];
      this.areaList = [];
      this.districtChildData(val, this.cityList);
      this.provinceList.forEach(item => {
        if (val === item.id) {
          this.residentialProvinceName = item.districtName;
        }
      });
    },
    changeCity(val, type) {
      this.nativeArea = "";
      this.areaList = [];
      this.districtChildData(val, this.areaList);
      this.cityList.forEach(item => {
        if (val === item.id) {
          this.residentialCityName = item.districtName;
        }
      });
    },
    changeArea(val, type) {
      this.areaList.forEach(item => {
        if (val === item.id) {
          this.residentialAreaName = item.districtName;
        }
      });
      this.orgAdd.areaCode = [
        this.residentialProvince,
        this.residentialCity,
        this.residentialArea
      ].toString();
      this.orgAdd.areaCodeName = [
        this.residentialProvinceName,
        this.residentialCityName,
        this.residentialAreaName
      ].toString();
    },
    //logo上传
    getCoverList(list) {
      this.coverList = list;
      this.orgAdd.groupLogoId = list
        .map(i => {
          return i.id;
        })
        .toString();
    },
    //提交
    sumbit: function() {
      let _this = this;
      this.$refs["userForm"].validate(validator => {
        if (validator) {
          _this.$refs["orgAdd"].validate(validator => {
            if (validator) {
              delete _this.userForm.id;
              delete _this.userForm.groupId;
              let param = {
                groupUserDTO: _this.userForm,
                groupDTO: _this.orgAdd
              };
              groupRegister(param).then(res => {
                if (res.code == 200) {
                  _this.$message.success("新增成功");
                  _this.$router.back();
                }
              });
            }
          });
        }
      });
    },
    //提交修改团队管理员信息
    groupUserSumbit:function(){
      let _this = this;
      this.$refs["userForm"].validate(validator => {
        if (validator) {
          _this.$refs["orgAdd"].validate(validator => {
            if (validator) {
              let param = _this.userForm;
              param.id=param.groupUserId;
              delete param.groupUserId;
              delete param.mobilePhone;
              updateGroupUser(param).then(res => {
                if (res.code == 200) {
                  _this.$message.success("团队管理员信息修改成功");
                  // _this.$router.back();
                }
              });
            }
          });
        }
      });
    },
    //提交修改团队信息
    groupSumbit:function(){
      let _this = this;
      this.$refs["userForm"].validate(validator => {
        if (validator) {
          _this.$refs["orgAdd"].validate(validator => {
            if (validator) {
              let param = _this.orgAdd;
              param.id=_this.$route.params.id;
              updateGroup(param).then(res => {
                if (res.code == 200) {
                  _this.$message.success("团队信息修改成功");
                  // _this.$router.back();
                }
              });
            }
          });
        }
      });
    },
  }
};
</script>

<style scoped lang="scss">
.view-container {
  margin: 5px 5px 0 5px;
  padding: 20px;
  min-height: 665px;
  border: 1px solid #eee;
  background: #fff;
  .formTitle {
    line-height: 60px;
    font-weight: bold;
    font-size: 24px;
    text-align: center;
    color: #303133;
  }
}
</style>

<style lang="scss">
.add-user_form {
  .el-select,
  .el-input {
    width: 300px;
  }
}
.district-wraper {
  .el-input-group__append {
    padding: 0;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    background-color: #fff;
    .district {
      .el-input {
        width: 100px;
      }
      width: 35%;
      margin: 0;
      &:nth-child(1) {
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
