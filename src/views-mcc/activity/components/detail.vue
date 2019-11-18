<template>
  <div class="activity-detail">
    <div class="content">
      <div class="img-div">
        <el-image :src="form.imgUrl" class="img"></el-image>
        <div class="area">
          <div class="one-area">
            <div class="one-area-top">
              <span class="one-area-top-label">{{form.classfiy}}</span>
              <span class="one-area-top-label" v-if="form.tag">{{form.tag}}</span>
            </div>
            <div class="one-area-bot">
              <p class="title">{{form.activityName}}</p>
              <div class="write-one">
                <div class="write-one-left">
                  <div class="write-one-left-item">
                    <i class="fa fa-eye" aria-hidden="true"></i>
                    <span style="margin-left:10px">{{form.attention}}</span>
                  </div>
                  <div class="write-one-left-item">
                    <i class="fa fa-heart-o" aria-hidden="true"></i>
                    <span style="margin-left:10px">{{form.like}}</span>
                  </div>
                </div>
                <div class="write-one-right">免费</div>
              </div>
              <div class="write-two">
                <i class="fa fa-user-o" aria-hidden="true"></i>&nbsp;&nbsp;可预约人数
                <span>&nbsp;{{form.appointmentNum}}</span>
              </div>
              <div class="write-three">
                <i class="fa fa-clock-o" aria-hidden="true"></i>&nbsp;&nbsp;
                <span>{{form.startTime}}</span>&nbsp;至&nbsp;
                <span>{{form.endTime}}</span>
              </div>
              <div class="write-four">
                <i class="fa fa-phone" aria-hidden="true"></i>&nbsp;&nbsp;
                <span>{{form.tel}}</span>
              </div>
              <div class="write-five">
                <i class="fa fa-map-marker" aria-hidden="true"></i>&nbsp;&nbsp;
                <span>{{form.address}}</span>
              </div>
            </div>
          </div>
          <div class="two-area">
            <div class="two-area-left">
              <el-image :src="form.avatar" class="two-area-left-img"></el-image>
            </div>
            <div class="two-area-cen">
              <div class="two-area-cen-top">{{form.userTitle}}</div>
              <div class="two-area-cen-bot">
                粉丝数:&nbsp;&nbsp;
                <span>{{form.fansNum}}</span>
                活动数:&nbsp;&nbsp;
                <span>{{form.activityNum}}</span>
              </div>
            </div>
            <div
              class="two-area-right"
              :class="form.isFollow==1?'two-area-right-active':''"
            >{{form.isFollow==1?"已关注":"未关注"}}</div>
          </div>
          <div class="three-area">
            <h2 v-if="form.activityObject">活动对象</h2>
            <p class="activity-object">{{form.activityObject}}</p>
            <h2>活动内容</h2>
            <p class="activity-content" v-html="form.activityContent"></p>
            <h2 v-if="form.tips">温馨提示</h2>
            <p class="tips">{{form.tips}}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {
  getActivityDetail,
  auditActivity,
  getVenueData
} from "@/api/mcc/activity.js";
export default {
  name: "activityDetail",
  data() {
    return {
      form: {
        imgUrl: "",
        classfiy: "", //  分类
        tag: "", // 标签
        activityName: "",
        attention: "0",
        like: "0",
        hasApply: "0",
        limit: "0",
        appointmentNum: "0",
        startTime: "",
        endTime: "",
        tel: "",
        address: "",
        avatar: "",
        userTitle: "",
        fansNum: "0",
        activityNum: "0",
        activityObject: "",
        activityContent: "",
        tips: "",
        isFollow: 0
      },
      fid: "",
      idVenue: "" // 场馆id
    };
  },
  mounted() {
    // this.setData()
  },
  methods: {
    setData(fid) {
      if (fid) {
        getActivityDetail(fid).then(res => {
          if (res.code == 200 && res.data) {
            let resData = res.data;
            this.form.imgUrl = resData.mobileCoverInfo
              ? this.baseImgUrl + resData.mobileCoverInfo.imgSourceCompress
              : "";
            this.form.activityName = resData.name;
            this.form.classfiy = resData.typeName;
            this.form.tag = resData.tag;
            this.form.appointmentNum = resData.appointmentNum;
            this.form.startTime = resData.startTime;
            this.form.endTime = resData.endTime;
            this.form.tel = resData.contactInfo;
            this.form.address = resData.address;
            this.form.activityObject = resData.requirement;
            this.form.activityContent = resData.content;
            this.form.tips = resData.copyright;
            this.getVenueData(resData.idVenue);
          }
        });
      }
    },
    // 获取场馆详情
    getVenueData(id) {
      getVenueData(id).then(res => {
        this.form.userTitle = res.data.name;
        this.form.fansNum = res.data.followNum;
        this.form.activityNum = res.data.activityNun;
        this.form.avatar =
          res.data.coverInfo && res.data.coverInfo.imgSourceCompress
            ? this.baseImgUrl + res.data.coverInfo.imgSourceCompress
            : "";
        this.form.isFollow = res.data.isFollow;
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.activity-detail {
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  .content {
    width: 100%;
    .img-div {
      width: 750px;
      height: 381.3px;
      box-sizing: border-box;
      border: 1px solid #ddd;
      position: relative;
      .img {
        width: 100%;
        height: 100%;
      }
      .area {
        width: 678.5px;
        z-index: 9;
        position: absolute;
        left: 23px;
        top: 250px;
        .one-area {
          width: 100%;
          &-top {
            width: 100%;
            margin-bottom: 15px;
            &-label {
              padding: 5px 10px;
              background: rgba(0, 0, 0, 0.5);
              border-radius: 7px;
              color: white;
              margin-right: 8px;
            }
          }
          &-bot {
            width: 100%;
            padding: 24.5px 23.6px;
            background: rgba(255, 255, 255, 1);
            box-shadow: 0px 0px 13px 1px rgba(0, 0, 0, 0.1);
            border-radius: 7px;
            .title {
              font-size: 33px;
              font-family: Source Han Sans CN;
              font-weight: 500;
              color: rgba(51, 51, 51, 1);
              margin-bottom: 8px;
            }
            .write-one {
              display: flex;
              justify-content: space-between;
              align-items: center;
              font-size: 22px;
              font-weight: 400;
              padding-bottom: 10px;
              margin-bottom: 15px;
              border-bottom: 1px solid rgba(235, 235, 235, 1);
              &-left {
                display: flex;
                &-item {
                  margin-right: 15px;
                  font-size: 22px;
                }
              }
              &-right {
                font-size: 35px;
                color: rgba(73, 138, 251, 1);
              }
            }
            .write-two,
            .write-three {
              font-size: 22px;
              font-weight: 400;
              color: rgba(119, 119, 119, 1);
              margin-bottom: 15px;
            }
            .write-four {
              font-size: 22px;
              font-weight: 400;
              color: rgba(73, 138, 251, 1);
              margin-bottom: 15px;
            }
            .write-five {
              display: flex;
              align-items: center;
              .fa-map-marker {
                display: inline-block;
                vertical-align: middle;
                margin-right: 10px;
                font-size: 22px;
              }
              span {
                font-size: 22px;
                font-weight: 400;
                display: inline-block;
                vertical-align: middle;
                max-width: 390px;
                white-space: pre-wrap;
                word-break: break-all;
              }
            }
          }
        }
        .two-area {
          width: 100%;
          padding: 24.5px 23.6px;
          background: rgba(255, 255, 255, 1);
          box-shadow: 0px 0px 13px 1px rgba(0, 0, 0, 0.1);
          border-radius: 7px;
          display: flex;
          align-items: center;
          margin-top: 30px;
          &-left {
            width: 74px;
            height: 73px;
            box-sizing: border-box;
            &-img {
              width: 100%;
              height: 100%;
              border-radius: 50%;
            }
          }
          &-cen {
            margin-left: 23.8px;
            width: 338px;
            &-top {
              font-size: 29px;
              font-family: Source Han Sans CN;
              font-weight: 400;
              color: rgba(51, 51, 51, 1);
              margin-bottom: 10px;
            }
            &-bot {
              font-size: 22px;
              font-family: Source Han Sans CN;
              font-weight: 400;
              color: rgba(119, 119, 119, 1);
            }
          }
          &-right {
            width: 120px;
            height: 41px;
            font-size: 22px;
            margin-left: 77.5px;
            color: white;
            text-align: center;
            line-height: 41px;
            background: #ccc;
            border-radius: 20px;
            &-active {
              background: rgba(234, 83, 80, 1);
            }
          }
        }
        .three-area {
          .activity-object,
          .activity-content,
          .tips {
            font-size: 18px;
            font-family: Source Han Sans CN;
            color: rgba(51, 51, 51, 1);
            line-height: 22px;
          }
        }
      }
    }
  }
}
</style>
