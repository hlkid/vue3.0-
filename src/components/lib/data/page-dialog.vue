<!-- 弹框组件 -->
<template>
  <el-dialog
    v-loading="dialogLoading"
    class="page-dialog"
    :title="title"
    :visible.sync="visible"
    :fullscreen="fullscreen"
    :width="width"
    :top="top"
    :modal="modal"
    :modal-append-to-body="modalAppendToBody"
    :append-to-body="appendToBody"
    :lock-scroll="lockScroll"
    :custom-class="customClass"
    :close-on-click-modal="closeOnClickModal"
    :show-close="showClose"
    :destroy-on-close="destroyOnClose"
    :center="center"
    :close-on-press-escape="closeOnPressEscape"
    :before-close="HandleBeforeClose"
    @close="handleClose"
    @open="handleOpen"
  >
    <div slot="title" class="dialog-hd" v-if="this.$slots.title">
      <slot name="title">
        <p class="name">{{ title }}</p>
      </slot>
    </div>

    <div class="page-dialog-main" :style="{ 'background-color': mainColor }">
      <slot></slot>
    </div>

    <span v-if="showFoot" slot="footer" class="dialog-footer">
      <slot name="footer">
        <el-button size="small" @click="handleCancel">取消</el-button>
        <el-button size="small" type="primary" @click="handleSubmit">确定</el-button>
      </slot>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: "pageDialog",
  props: {
    // 显示、隐藏弹框
    visible: Boolean,
    //  Dialog 的标题，也可通过具名 slot （见下表）传入
    title: {
      type: String,
      default: "dialog"
    },
    // 是否为全屏 Dialog
    fullscreen: {
      type: Boolean,
      default: false
    },
    // Dialog 的宽度
    width: {
      type: String,
      default: "50%"
    },
    // Dialog CSS 中的 margin-top 值
    top: {
      type: String,
      default: "15vh"
    },
    // 是否需要遮罩层
    modal: {
      type: Boolean,
      default: true
    },
    // 遮罩层是否插入至 body 元素上
    modalAppendToBody: {
      type: Boolean,
      default: true
    },
    // Dialog 自身是否插入至 body 元素上
    appendToBody: {
      type: Boolean,
      default: false
    },
    // 是否在 Dialog 出现时将 body 滚动锁定
    lockScroll: {
      type: Boolean,
      default: true
    },
    // Dialog 的自定义类名
    customClass: String,
    // 是否可以通过按下 ESC 关闭 Dialog
    closeOnPressEscape: {
      type: Boolean,
      default: true
    },
    // 是否可以通过点击 modal 关闭 Dialog
    closeOnClickModal: {
      type: Boolean,
      default: false
    },
    // 是否对头部和底部采用居中布局
    center: Boolean,
    // 是否显示关闭按钮
    showClose: {
      type: Boolean,
      default: true
    },
    // 是否关闭时销毁 Dialog 中的元素
    destroyOnClose: {
      type: Boolean,
      default: false
    },
    // 关闭前的回调，会暂停 Dialog 的关闭
    beforeClose: Function,
    // 提交是否关闭
    whenSubmitClose: Boolean,
    mainColor: {
      type: String,
      default: "#fff"
    },
    showFoot: {
      type: Boolean,
      default: true
    },
    beforeCancel: {
      type: Function
    }
  },
  data() {
    return {
      dialogLoading: false
    };
  },
  methods: {
    toggle(flag) {
      flag = flag !== false;
      this.$emit("update:visible", flag);
    },
    // 关闭前拦截器
    HandleBeforeClose(done) {
      if (this.beforeClose) {
        this.beforeClose(cancel => {
          if (cancel !== false) {
            this.toggle(false);
          }
        });
      } else {
        this.toggle(false);
      }
    },
    // 关闭回调
    handleClose() {
      this.$emit("close");
    },
    // 打开回调
    handleOpen() {
      this.$emit("open");
    },
    // 取消
    handleCancel() {
      if (this.beforeCancel) {
        this.beforeClose(cancel => {
          if (cancel !== false) {
            this.toggle(false);
            this.$emit("cancel");
          }
        });
      } else {
        this.toggle(false);
        this.$emit("cancel");
      }
    },
    // 提交
    handleSubmit() {
      this.whenSubmitClose && this.toggle(false);
      this.$emit("sure");
    }
  }
};
</script>
<style lang="scss">
.page-dialog {
  height: 100%;
  .el-dialog {
    border-radius: 3px;
    overflow: hidden;
    .el-dialog__header {
      padding: 15px 20px !important;
      box-shadow: 0 4px 10px hsla(0, 0%, 91%, 0.35);
      .el-dialog__title {
        font-size: 15px;
        color: #333;
      }
    }
    .el-dialog__body {
      padding: 10px 12px 0 !important;
    }
    .el-dialog__footer {
      padding: 10px 15px 15px !important;
    }
    &.is-fullscreen {
      display: -webkit-box;
      display: -webkit-flex;
      display: -ms-flexbox;
      display: flex;
      -webkit-box-orient: vertical;
      -webkit-flex-direction: column;
      -ms-flex-direction: column;
      flex-direction: column;
      .el-dialog__body {
        -webkit-box-flex: 1;
        -webkit-flex: 1;
        -ms-flex: 1;
        flex: 1;
        overflow: hidden;
        .page-dialog-main {
          height: 100%;
          width: 100%;
          overflow: auto;
        }
      }
    }

    &:not(.is-fullscreen) {
      .el-dialog__body {
        overflow: hidden;
        height: 550px;
      }
      .page-dialog-main {
        min-height: 200px;
        height: 550px;
        overflow-y: scroll;
      }
    }
  }
}
</style>
