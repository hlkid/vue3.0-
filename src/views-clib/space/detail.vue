<template>
  <section class="view-container">
    <el-form class="hbsx-form" inline ref="dialogForm"   label-width="120px"
             size="small">
      <el-form-item label="空间编码" prop="code">
        {{dialogForm.code}}
      </el-form-item>
      <el-form-item label="所属场馆" prop="venueName">
        {{dialogForm.venueName}}
      </el-form-item>

      <el-form-item label="空间名称" prop="name">
        {{dialogForm.name}}
      </el-form-item>

      <el-form-item label="空间面积" prop="area">
        {{dialogForm.area}} m²
      </el-form-item>

      <el-form-item label="容纳人数" prop="capacity">
        {{dialogForm.capacity}}
      </el-form-item>

      <el-form-item label="所在楼栋" prop="constructName">
        {{dialogForm.constructName}}
      </el-form-item>
      <el-form-item label="所在楼层" prop="constructFloor">
        {{dialogForm.constructFloor}}
      </el-form-item>

      <el-form-item label="详细位置" prop="address">
        {{dialogForm.address}}
      </el-form-item>


      <el-form-item label="咨询电话" prop="serviceTelephone">
        {{dialogForm.serviceTelephone}}
      </el-form-item>

      <el-form-item label="空间用途" prop="useForMame">
        {{dialogForm.useForName}}
      </el-form-item>

      <el-form-item label="空间类型" prop="spaceType">
        {{dialogForm.spaceTypeName}}
      </el-form-item>

      <el-form-item label="预约方式" prop="applyWayName">
        {{dialogForm.applyWayName}}
      </el-form-item>

      <el-form-item label="费用类型" v-if="dialogForm.applyWay==1"  prop="feeTypeName">
        {{dialogForm.feeTypeName}}
      </el-form-item>
      <el-form-item label="开放时间" prop="opentime">
        {{dialogForm.startTime}}-{{dialogForm.endTime}}
      </el-form-item>

      <el-form-item label="空间标签" prop="labelNames">
        {{dialogForm.labels}}
      </el-form-item>

      <el-form-item label="是否有门禁" prop="isAccessControlName">
        {{dialogForm.isAccessControlName}}
      </el-form-item>


      <el-form-item label="空间设备" prop="facilityName">
        {{dialogForm.facilityName}}
      </el-form-item>

     <!-- <el-form-item label="发布状态" prop="publishStatusName">
        {{dialogForm.publishStatusName}}
      </el-form-item>-->
      <div>
        <el-form-item label="空间简述" prop="resume">
          {{dialogForm.resume}}
        </el-form-item>
      </div>

      <div>
        <el-form-item label="空间描述" prop="detail" class="block edit-form">
          <div v-html="dialogForm.detail"></div>
        </el-form-item>
      </div>

      <el-form-item label="空间封面" prop="coverId">
        <img v-if="dialogForm.coverId" class="single-uploader-activity"
             :src=" baseImgUrl +  dialogForm.coverFile.path">
      </el-form-item>

      <el-form-item label="座位布局图" prop="layoutId">
        <img v-if="dialogForm.layoutId" class="single-uploader-activity"
             :src=" baseImgUrl + dialogForm.layoutFile.path">
      </el-form-item>

      <div class="btns-waper">
        <el-button @click="$router.go(-1)">返回</el-button>
      </div>

    </el-form>
  </section>
</template>

<script>
  import {createSpace, getSpaceDetail, editSpace} from '@/api/clib/space'
  import {getDicListByTypeCode, districtParentData, districtChildData, getUserData} from '@/api/config.js'
  import {fileDetail, uploadFileUrl, getfiles} from '@/api/file.js'
  import WangEditor from '@/components/WangEditor'

  export default {
    components: {WangEditor},
    data() {
      return {
        isIndeterminate: true,
        uploadFileUrl: uploadFileUrl,//上传地址
        dialogForm: {},
      }
    },
    methods: {
      //文件地址
      fileDetail(id, attr) {
        fileDetail(id).then(res => {
          if (res.code == 200 && res.data) {
            // console.log(this.baseImgUrl + res.data.imgSmallCompress)
            this[attr] = this.baseImgUrl + res.data.path
          }
          ;
        })
      },
      //获取空间详情
      getSpaceDetail(id) {
        let that = this;
        getSpaceDetail(id).then(res => {
          if (res.code == 200) {
            that.dialogForm = res.data;
          }
        })
      },

      //数据词典
      getDicListByTypeCode(code, arr) {
        getDicListByTypeCode(code).then(res => {
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
    },


    created() {
      if (this.$route.params.id) { //编辑
        this.getSpaceDetail(this.$route.params.id);
      }

    }
  }
</script>
<style>
  .el-tag + .el-tag {
    margin-right: 10px;
    margin-bottom: 10px;
  }
</style>
<style lang="scss" scoped>

  .select-accout {
    .selected {
      &::after {
        font-size: 0 !important;
      }
    }
  }
</style>
