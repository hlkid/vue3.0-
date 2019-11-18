<template>
	<section class="pagination">
      <el-pagination background @current-change="pageChange" :page-size="pageSize"   :current-page.sync="_currentPage" :layout="layoutPag" :total="total">
        <!--<span slot="total" class="code">共 <font color="#328fca">{{total}}</font> 条记录</span>-->
      </el-pagination>
	</section>
</template>
<script>
export default {
  data() {
    return {
      prevText:'上一页',
      nextText:'下一页',
    };
  },
  props: {
    total: {
      type: Number,
      default: 0
    },
    pageSize:{
      type: Number,
      default: 12
    },
    currentPage:{
      type: Number,
      default: 1
    },
    layoutPag:{
      type:String,
      default:'total, prev, pager, next, jumper'
    }
  },
  components: {},
  filters: {},
  computed: {
    _currentPage:{
      get:function () {
        return this.currentPage
      },
      set:function (val) {
        //console.log("pt==="+val)
        //this.$emit('update:currentPage',val)
      }
    }
  },
  methods: {
    pageChange(val) {
      this.$emit("goSpecifiedPage", val);//子組件的“current-change”事件发生后，触发父组件的“goSpecifiedPage”事件
    }
  },
  mounted() {}
};
</script>
<style lang="scss" scoped>
  .pagination {
    text-align: right;
    margin-top: 20px;
  }
</style>
