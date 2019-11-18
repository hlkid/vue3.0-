<template>
    <section class="view-container">
      <div class="box">
        <p class="title">{{detail.title}}</p>
        <p class="text-center">
          <span class="create">作者：{{detail.createBy}}</span>
          <span class="type">{{detail.typeName}}/{{detail.childTypeName}}</span>
        </p>
        <div v-html="detail.content"></div>
      </div>

    </section>
</template>

<script>
  import { getNewNoticeDetail } from '@/api/mcc/information.js'
    export default {
      data () {
        return {
          detail:{},
          reviseId:''
        }
      },

      methods:{
        // 详情
        getNewNoticeDetail() {
          getNewNoticeDetail(this.reviseId).then(res => {
            if (res.code == 200) {
              this.detail = res.data
            }
          })
        },

      },
      created() {
        this.reviseId = this.$route.params.id
        this.getNewNoticeDetail()
      }

    }
</script>

<style lang="scss" scoped>
  .box{
    margin-top: 15px;
    padding: 20px 20px;
    border: 1px solid #eee;
    background: #fff;
    .title{
      text-align: center;
      font-size: 20px;
      margin-bottom: 20px;
    }
    .create{
      color: #999;
      font-size: 14px;
    }
    .type{
      color: #999;
      font-size: 14px;
      margin-left: 10px;
    }
  }
  .text-center{
    text-align: center;
  }

</style>
