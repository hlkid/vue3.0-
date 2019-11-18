<template>
  <section class="view-container ">
    <!-- <div class="formTitle">团队招募管理信息{{dialogTitleType==''?'新增':dialogTitleType=='edit'?'修改':'查看'}}</div> -->
    <el-form class="dialog-form add-user_form" :inline="false" :rules="dialogTitleType=='detail'?{}:rules" :model="formData" ref="formData"
      label-position="right" label-width="180px" size="small">
      <el-form-item label="活动名称" prop="actName">
        <el-input v-model="formData.actName" auto-complete="off" placeholder="" :disabled="dialogTitleType=='detail'">
        </el-input>
      </el-form-item>
      <el-form-item label="招募类型" prop="recruitType">
        <el-select v-model="formData.recruitType" filterable clearable placeholder="" :disabled="dialogTitleType=='detail'">
          <el-option :label="item.message" :value="item.code" :key="index" v-for="(item,index) in recruitTypeOptions">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="formData.recruitType==1" label="招募范围" prop="recruitGroupIds">
        <el-select multiple v-model="formData.recruitGroupIds" filterable clearable placeholder="" :disabled="dialogTitleType=='detail'">
          <el-option :label="item.groupName" :value="item.id" :key="index" v-for="(item,index) in recruitGroupOptions">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="活动主题" prop="actTheme">
        <el-select v-model="formData.actTheme" filterable clearable placeholder="" :disabled="dialogTitleType=='detail'">
          <el-option :label="item.typeName" :value="item.value" :key="index" v-for="(item,index) in actvThemeOptions">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="活动类型" prop="actType">
        <el-select v-model="formData.actType" filterable clearable placeholder="" :disabled="dialogTitleType=='detail'">
          <el-option :label="item.typeName" :value="item.value" :key="index" v-for="(item,index) in actvTypeOptions">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item style="width:400px" label="招募时间" prop="entryDate">
        <el-date-picker style="width:400px" value-format="yyyy-MM-dd HH:mm:00" :disabled="dialogTitleType=='detail'"
            v-model="formData.entryDate"
            type="datetimerange"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="报名类型" prop="entryType">
        <el-select v-model="formData.entryType" filterable clearable placeholder="" :disabled="dialogTitleType=='detail'">
          <el-option :label="item.message" :value="item.code" :key="index" v-for="(item,index) in entryTypeOptions">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="名额类型" prop="isQuota">
        <el-select v-model="formData.isQuota" filterable clearable placeholder="" :disabled="dialogTitleType=='detail'">
          <el-option :label="item.message" :value="item.code" :key="index" v-for="(item,index) in isQuotaOptions">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="formData.isQuota=='1'" label="招募人数（个）" prop="postNum" style="width:400px;">
        <el-input-number :step-strictly="true" style="width:400px" v-model="formData.postNum" :min="1" :max="1000" label="招募人数（个）" :disabled="dialogTitleType=='detail'"></el-input-number>
      </el-form-item>
      <el-form-item label="联系人" prop="contactsName">
        <el-input v-model="formData.contactsName" auto-complete="off" placeholder="" :disabled="dialogTitleType=='detail'">
        </el-input>
      </el-form-item>
      <el-form-item label="咨询电话" prop="mobilePhone">
        <el-input v-model="formData.mobilePhone" auto-complete="off" placeholder="" :disabled="dialogTitleType=='detail'">
        </el-input>
      </el-form-item>
      <el-form-item style="width:400px" label="活动举办时间" prop="actDate">
        <el-date-picker style="width:400px" value-format="yyyy-MM-dd HH:mm:00" :disabled="dialogTitleType=='detail'"
            v-model="formData.actDate"
            type="datetimerange"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="地点" prop="address">
        <el-input v-model="formData.address" auto-complete="off" placeholder="" :disabled="dialogTitleType=='detail'">
        </el-input>
      </el-form-item>
      <el-form-item label="志愿服务时长（小时）" prop="allServiceTime" style="width:400px;">
        <el-input-number style="width:400px" v-model="formData.allServiceTime" :min="1" :max="1000" label="志愿服务时长（小时）" :disabled="dialogTitleType=='detail'"></el-input-number>
        </el-input>
      </el-form-item>
      <el-form-item label="招募要求" prop="recruitDemand">
        <el-input type="textarea" v-model="formData.recruitDemand" auto-complete="off" placeholder="" :disabled="dialogTitleType=='detail'">
        </el-input>
      </el-form-item>
      <el-form-item label="活动介绍" prop="content">
        <el-input type="textarea" v-model="formData.content" auto-complete="off" placeholder="" :disabled="dialogTitleType=='detail'">
        </el-input>
      </el-form-item>
      <el-form-item label="封面" prop="coverImgId">
        <img style="width:200px;" v-if="dialogTitleType=='detail'" :src="coverList.length>0?coverList[0].url:''">
        <Uploader v-else :fileList="coverList" @getList="getCoverList" :limit="1" :type="0" :square="false"></Uploader>
      </el-form-item>
    </el-form>
    
    <div class="form-btn-wraper" v-if="dialogTitleType!='detail'">
      <el-button class="btn" @click="$router.back()">返回</el-button>
      <el-button v-if="dialogTitleType==''" class="btn" type="primary" @click="sumbit()">创建</el-button>
      <el-button v-if="dialogTitleType=='edit'" class="btn" type="primary" @click="groupSumbit()">更新</el-button>
    </div>
  </section>
</template>

<script>
import {
  groupRegister,
entryTypeEnum,
quotaTypeEnum,
recruitTypeEnum,
groupData,
insertActivity,
activityGetDetail,
updateActivity,
  getDicListByTypeCode,
} from "@/api/volunteer/volunteer";
import { checkMobile, checkEmail, checkTel } from "@/utils/validate";
import { districtParentData, districtChildData } from "@/api/config.js";
import Uploader from "@/components/Uploader";

export default {
  data() {
    return {
        actvTypeOptions:[],
        actvThemeOptions:[],
      recruitTypeOptions:[],
      recruitGroupOptions:[],
      entryTypeOptions:[],
      isQuotaOptions:[],
      formData: {
        id:"",
        entryDate:"",
        actDate:"",
        actName:"",
        recruitType:"",
        recruitGroupIds:"",
        actTheme:"",
        actType:"",
        entryStartDate:"",
        entryEndDate:"",
        actStartDate:"",
        actEndDate:"",
        entryType:"",
        isQuota:"",
        postNum:"",
        contactsName:"",
        mobilePhone:"",
        address:"",
        allServiceTime:"",
        recruitDemand:"",
        content:"",
        coverImgId:"",
      },
      coverList: [],
      certificateImgUrl: "",
      groupSealImgUrl: "",
      dialogTitleType: "",
      id: "",
      rules: {
        recruitType:[{ required: true, message: "请选择招募类型" }],
        entryDate: [{ required: true, message: "请选择报名时间" }],
        actDate: [{ required: true, message: "请选择活动时间" }],
        actName: [{ required: true, message: "活动名称" }],
        recruitGroupIds: [{ required: true, message: "请选择招募范围" }],
        actTheme: [{ required: true, message: "请选择活动主题" }],
        actType: [{ required: true, message: "请选择活动类型" }],
        entryType: [{ required: true, message: "请选择报名类型" }],
        isQuota: [{ required: true, message: "请选择是否限制人数" }],
        postNum: [{ required: true, message: "请输入招募人数" }],
        contactsName: [{ required: true, message: "请输入联系人" }],
        address: [{ required: true, message: "请输入活动地址" }],
        allServiceTime: [{ required: true, message: "请输入互动时间" }],
        recruitDemand: [{ required: true, message: "请输入招募要求" }],
        content: [{ required: true, message: "请输入活动介绍" }],
        mobilePhone: [
          { required: true, message: "请输入移动电话" },
          { validator: checkMobile, message: "请输入正确的移动电话" }
        ],
        coverImgId: [{ required: true, message: "请上传封面" }],
      }
    };
  },
  components: { Uploader },
  created() {
    let _this=this;
    this.EnumFun();
    this.getDicListByTypeCode("actvType", this.actvTypeOptions);
    this.getDicListByTypeCode("actvTheme", this.actvThemeOptions);
    this.id = this.$route.params.id;
    if (this.$route.params.id && this.$route.params.id != "") {
      this.dialogTitleType = this.$route.params.type;
        setTimeout(() => {
        activityGetDetail(this.id).then(res => {
            console.info("详情接口字段",res)
            if(res.code==200){
            let detail=res.data;
                _this.formData=detail;
                _this.formData.actDate=[];
                _this.formData.entryDate=[];
                _this.formData.actDate[0]=detail.actStartDate;
                _this.formData.actDate[1]=detail.actEndDate;
                _this.formData.entryDate[0]=detail.entryStartDate;
                _this.formData.entryDate[1]=detail.entryEndDate;
                _this.formData.recruitGroupIds=detail.recruitGroupIds.split(",");
            //封面
            detail.coverImgId && (this.coverList = [{
            id: detail.coverImgId,
            path: this.baseImgUrl + detail.coverImgIdPath,
            url: this.baseImgUrl + detail.coverImgIdPath
            }]);
            }
        });
        }, 500);
    }
  },

  methods: {
      //枚举值
      EnumFun:function(){
          let _this=this;
          //招募类型
          recruitTypeEnum().then(res => {
            if (res.code == 200) {
                _this.recruitTypeOptions=res.data
            }
        });
        //报名类型
          entryTypeEnum().then(res => {
            if (res.code == 200) {
                _this.entryTypeOptions=res.data
            }
        });
        //活动是否限制人数枚举类
          quotaTypeEnum().then(res => {
            if (res.code == 200) {
                _this.isQuotaOptions=res.data
            }
        });
        //招募范围
          groupData().then(res => {
            if (res.code == 200) {
                _this.recruitGroupOptions=res.data
            }
        });
      },
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
    //logo上传
    getCoverList(list) {
      this.coverList = list;
      this.formData.coverImgId = list
        .map(i => {
          return i.id;
        })
        .toString();
    },
    //提交
    sumbit: function() {
      let _this = this;
      this.$refs["formData"].validate(validator => {
        if (validator) {
            let param=_this.formData;
            let recruitGroupIds="";
            param.actStartDate=param.actDate[0];
            param.actEndDate=param.actDate[1];
            param.entryStartDate=param.entryDate[0];
            param.entryEndDate=param.entryDate[1];
            for(let i=0;i<param.recruitGroupIds.length;i++){
                recruitGroupIds=recruitGroupIds+param.recruitGroupIds[i]+","
            }
            param.recruitGroupIds=recruitGroupIds.slice(0,recruitGroupIds.length-1);
            delete param.actDate;
            delete param.entryDate;
            delete param.id;
            // console.info(param);
            insertActivity(param).then(res => {
                if (res.code == 200) {
                  _this.$message.success("活动创建成功");
                  _this.$router.back();
                }
              });
        }
      });
    },
    //修改团队信息
    groupSumbit:function(){
      let _this = this;
      _this.$refs["formData"].validate(validator => {
            if (validator) {
              let param=_this.formData;
            let recruitGroupIds="";
            param.actStartDate=param.actDate[0];
            param.actEndDate=param.actDate[1];
            param.entryStartDate=param.entryDate[0];
            param.entryEndDate=param.entryDate[1];
            for(let i=0;i<param.recruitGroupIds.length;i++){
                recruitGroupIds=recruitGroupIds+param.recruitGroupIds[i]+","
            }
            param.recruitGroupIds=recruitGroupIds.slice(0,recruitGroupIds.length-1);
            param.id=_this.$route.params.id;
            delete param.actDate;
            delete param.entryDate;
              updateActivity(param).then(res => {
                if (res.code == 200) {
                  _this.$message.success("团队信息修改成功");
                  _this.$router.back();
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
  .el-input,
  .el-textarea__inner {
    width: 400px;
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
  padding-left: 180px;
  .btn {
    padding: 9px 15px !important;
  }
}
</style>
